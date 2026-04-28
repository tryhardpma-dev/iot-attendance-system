from states.abstract_state import AbstractState
from states.sleep import Sleep
from states.error import Error
from states.error_enum import ErrorEnum
import time
import json
from umqtt.simple import MQTTClient
import sys 
from boot import MQTT_STATUS, MQTT_DEFAULT
from mqtt_manager import MQTTManager

class AcceptCards(AbstractState):
    def __init__(self, device, duration=None):
        if duration is None:
            duration = device.config.get("ACCEPT_TIME", 30)
        super().__init__(device)
        self.duration = duration
        self.default_keyA = [0xFF] * 6
        self.sector = 1
        self.block_num = 0
        self.max_read_attempts = 3
        self.mqtt_manager = None
        
    def exec(self):
        super().exec()
        start_time = time.time()
        print(">>Card acceptance begins in a few seconds...")
        
        self.mqtt_manager = MQTTManager(self.device.config)
        
        time.sleep(3)
        self.device.turn_light_on()
    
        while time.time() - start_time < self.duration:
            self.process_card()
            time.sleep(1)
        
        print("Card acceptance time has ended.")
                
        time.sleep(1)

        self.device.turn_light_off()
        
        self.device.change_state(Sleep) 
    
    def process_card(self):
        self.device.rc522.init()
        status_request, tag_type = self.device.rc522.request(self.device.rc522.REQIDL)
            
        if status_request == self.device.rc522.OK:
            print("Card detected.")
            status, uid = self.device.rc522.SelectTagSN()
            if status == self.device.rc522.OK:
                print(">> Card UID:", uid)
                read_status, read_data = self.device.rc522.readSectorBlock(
                    uid=uid,
                    sector=self.sector,
                    block=self.block_num,
                    keyA=self.default_keyA
                )
                if read_status == self.device.rc522.OK and read_data is not None:
                    read_string = bytes(read_data).decode('utf-8', 'ignore')
                    data = read_string.strip()
                    if data:
                        student_number, lecture_id = data.split('|', 1)
                        read_status1, read_data1 = self.device.rc522.readSectorBlock(
                            uid=uid,
                            sector=self.sector,
                            block=1,
                            keyA=self.default_keyA
                        )
                        if read_status1 == self.device.rc522.OK and read_data1 is not None:
                            meno = bytes(read_data1).decode('utf-8', 'ignore').strip()
                        else:
                            meno = ""
                        read_status2, read_data2 = self.device.rc522.readSectorBlock(
                            uid=uid,
                            sector=self.sector,
                            block=2,
                            keyA=self.default_keyA
                        )
                        if read_status2 == self.device.rc522.OK and read_data2 is not None:
                            priezvisko = bytes(read_data2).decode('utf-8', 'ignore').strip()
                        else:
                            priezvisko = ""
                        self.device.turn_light_off()
                        print(f">> Student number read: {student_number}, Lecture ID: {lecture_id}")
                        print(f">> First name: {meno}, Last name: {priezvisko}")
                        timestamp = time.time() + 3600
                        if not self.mqtt_manager.prepare_connection(subscribe_mode=False):
                            print(">> Error connecting to MQTT broker")
                            self.device.set_error(ErrorEnum.MQTT_CONNECT_ERROR)
                            self.device.change_state(Error)
                            return
                        if not self.mqtt_manager.publish_card_data(student_number, lecture_id, meno, priezvisko, timestamp):
                            self.device.set_error(ErrorEnum.MQTT_PUBLISH_ERROR)
                            self.device.change_state(Error)
                            return
                        self.mqtt_manager.disconnect()
                        time.sleep(2)
                        self.device.turn_light_on()
                else:
                    print(">> Error reading data from the card.")
                    self.handle_read_error()
    
    def handle_read_error(self):
        if not hasattr(self, 'read_attempts'):
            self.read_attempts = 0
        self.read_attempts += 1

        if self.read_attempts >= self.max_read_attempts:
            print(f">> There have been more than {self.max_read_attempts} failed card read attempts.")
            self.device.set_error(ErrorEnum.CARD_READ_ERROR)
            self.device.change_state(Error)
            return
        else:
            print(f">> {self.read_attempts}/{self.max_read_attempts} read attempt failed.")
