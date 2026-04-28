from machine import freq, WDT

freq(80 * 1000000)

SPI_ID = 0
SCK_PIN = 18   
MOSI_PIN = 19   
MISO_PIN = 16   
RST_PIN = 22   
CS_PIN = 17
BUTTON_PIN = 20
LIGHT_PIN = 15
SLEEP_BUTTON = 21

FACTORY_RESET_INTERVAL = 3

#MQTT_STATUS = 'kpi/romulus/rfid/vl457mk/status'
#MQTT_DEFAULT = 'kpi/romulus/rfid/vl457mk'
MQTT_STATUS = 'gw/rfid/vl457mk/status'
MQTT_DEFAULT = 'gw/rfid/vl457mk'
MQTT_SET = 'gw/rfid/vl457mk/set'
MQTT_CMD = 'gw/rfid/vl457mk/cmd'

CONFIG_FILE = 'config.json'

DEFAULT_CONFIG = {
    "mqtt": {
        "client_id": "ne_pridumali", 
        "password": "this.is.mqtt", 
        "server": "10.0.0.1", 
        "port": 1883, 
        "user": "maker"
    }, 
    "wifi": {
        "ssid": "romulus_things", 
        "key": "welcome.to.the.romulus"
    }, 
    "ntpHost": "pool.ntp.org",
    "ACCEPT_TIME": 90,
    "SLEEP_DURATION": 60
}
