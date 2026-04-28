from states.abstract_state import AbstractState
from states.connect_to_wifi import ConnectToWifi
from states.factory_reset import FactoryReset
from states.error_enum import ErrorEnum
from boot import *
import json
import ntptime
import sys
import time

class Init(AbstractState):
    def __init__(self, device):
        super().__init__(device)
        
    def exec(self):
        super().exec()
        
        if self._check_button_hold():
            self.device.change_state(FactoryReset)
            return
        
        config = self._get_config()
        if config is None:
            self.device.set_error(ErrorEnum.CONFIG_FILE_MISSING)
            print("Config file missing!!!")
            self.device.change_state(FactoryReset)
            return
        self.device.set_config(config)
        
        if "npttime" in config and "host" in config["npttime"]:
            self.device.npttime.host = config["npttime"]["host"]
            
        self.device.change_state(ConnectToWifi)
    
    def _get_config(self):
        try:
            with open(CONFIG_FILE, 'r') as file:
                return json.load(file)
        except OSError:
            return None
    
    def _check_button_hold(self):
        button = self.device.button
        if button.value() == 0:
            press_time = time.ticks_ms()
            while button.value() == 0:
                print("BUTTON pressed")
                time.sleep_ms(1000)
                if time.ticks_diff(time.ticks_ms(), press_time) >= FACTORY_RESET_INTERVAL * 1000:
                    return True
        return False