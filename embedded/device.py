from states import *
import time
import json
from machine import Pin, SPI
from boot import SPI_ID, SCK_PIN, MOSI_PIN, MISO_PIN, RST_PIN, CS_PIN, CONFIG_FILE, BUTTON_PIN, LIGHT_PIN
from mfrc522 import MFRC522

class Device:
    def __init__(self):
        self.rc522 = MFRC522(
            spi_id=SPI_ID,
            sck=SCK_PIN,
            mosi=MOSI_PIN,
            miso=MISO_PIN,
            rst=RST_PIN,
            cs=CS_PIN
        )
        self.config = None
        self.error = ErrorEnum.NONE
        self.state = SelfTest(self)
        self.button = Pin(BUTTON_PIN, Pin.IN)
        self.light = Pin(LIGHT_PIN, Pin.OUT)

    def run(self):
        while True:
            self.state.exec()
    
    def change_state(self, stateClass):
        self.state = stateClass(self)
        
    def set_config(self, config):
        self.config = config

    def set_error(self, error):
        self.error = error

    def get_error(self):
        return self.error
    
    def turn_light_on(self):
        self.light.value(1)

    def turn_light_off(self):
        self.light.value(0)