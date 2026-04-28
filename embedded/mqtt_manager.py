from boot import MQTT_STATUS, MQTT_DEFAULT, MQTT_SET
from umqtt.simple import MQTTClient, MQTTException
import time, json

class MQTTManager:
    def __init__(self, conf: dict, device=None, subscribe_mode=False):
        self.conf = conf
        self.config = None
        self.client = None
        self.device = device
        self._subscribe_mode = subscribe_mode
        
        self.status_topic = MQTT_STATUS
        self.data_topic = MQTT_DEFAULT
        self.set_topic = MQTT_SET
        
        self.last_set_message = None
        self._subscribers_cb = {}

    def init_client(self):
        self.config = self.conf['mqtt']
        self.client = MQTTClient(
            client_id=self.config['client_id'],
            server=self.config['server'],
            port=self.config['port'],
            user=self.config['user'],
            password=self.config['password']
        )
        self.client.set_last_will(self.status_topic, b'"status": "offline"', retain=True)
        self.client.set_callback(self._on_message)

    def connect(self):
        try:
            self.client.connect()
        except (MQTTException, OSError):
            return False
        self.publish(self.status_topic, b'"status": "online"', retain=True)
        if self._subscribe_mode:
            self.subscribe(self.set_topic, self._handle_set_message)
            print(f"Subscribed to {self.set_topic} with callback _handle_set_message")
            self.client.subscribe(self.set_topic)
        return True

    def publish(self, topic, message, retain=False):
        try:
            self.client.publish(topic, message, retain)
            return True
        except:
            return False
    
    def subscribe(self, topic: str, callback):
        if not callable(callback):
            raise ValueError("Callback")

        self._subscribers_cb[topic.encode()] = callback

    def check_messages(self):
        try:
            self.client.check_msg()
            return True
        except (MQTTException, OSError):
            return False

    def disconnect(self):
        self.publish(self.status_topic, b'"status": "offline"', retain=True)
        time.sleep(1)
        self.client.disconnect()

    def _on_message(self, topic: bytes, message: bytes):
        callback = self._subscribers_cb.get(topic)
        if callback:
            callback(message.decode())
    
    def prepare_connection(self, subscribe_mode=False):
        self._subscribe_mode = subscribe_mode
        self.init_client()
        return self.connect()
    
    def _handle_set_message(self, message):
        if self.last_set_message == message:
            print("Duplicate /set message received, ignoring.")
            return
        self.last_set_message = message
        print("Received /set message:", message)
        try:
            config_updates = json.loads(message)
            print("Parsed JSON:", config_updates)
        except Exception as e:
            print("Error parsing JSON:", e)
            return
        self.update_config(config_updates)

    def update_config(self, updates):
        print("Configuration before update:", self.conf)
        updated = False
        for key, value in updates.items():
            if key in self.conf and self.conf[key] == value:
                continue
            if key in self.conf and isinstance(self.conf[key], dict) and isinstance(value, dict):
                for subkey, subvalue in value.items():
                    if self.conf[key].get(subkey) != subvalue:
                        self.conf[key][subkey] = subvalue
                        updated = True
            else:
                if self.conf.get(key) != value:
                    self.conf[key] = value
                    updated = True
        print("Configuration after update:", self.conf)
        if updated:
            try:
                with open('config.json', 'w') as f:
                    json.dump(self.conf, f)
                print(">> Settings updated and saved.")
                if self.device:
                    self.device.config = self.conf
            except Exception as e:
                print(">> Error saving config:", e)
        else:
            print(">> No changes in configuration.")
        
    @staticmethod
    
    def isoformat_from_timestamp(ts):
        t = time.gmtime(ts)
        return "{}-{:02d}-{:02d}T{:02d}:{:02d}:{:02d}Z".format(t[0], t[1], t[2], t[3], t[4], t[5])
    
    def publish_status(self, status):
        payload = json.dumps({'status': status})
        success = self.publish(self.status_topic, payload.encode('utf-8'), retain=True)
        if success:
            print(f">> Published {status} status.")
        else:
            print(f">> Error publishing {status} status.")
        return success
    
    def publish_card_data(self, student_number, lecture_id, meno, priezvisko, timestamp):
        iso_timestamp = self.isoformat_from_timestamp(timestamp)
        date = self.isoformat_from_timestamp(time.time() + 3600)
        message = {
            "dt": date,
            "attendances": [
                {
                    "dt": iso_timestamp,
                    "student_id": student_number,
                    "cviky_id": lecture_id,
                    "meno": meno,
                    "priezvisko": priezvisko
                }
            ]
        }
        if not self.publish(self.data_topic, json.dumps(message).encode('utf-8')):
            print(">> Error sending data to MQTT.")
            return False
        return True
    