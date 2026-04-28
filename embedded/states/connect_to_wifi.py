from states.abstract_state import AbstractState
from states.accept_cards import AcceptCards
from states.error import Error
from states.error_enum import ErrorEnum
import time
import ntptime
import sys
import json

class ConnectToWifi(AbstractState):
    def __init__(self, device):
        super().__init__(device)
        
    def exec(self):
        super().exec()
        config = self.device.config['wifi']
        self.do_connect(config['ssid'], config['key'])
        if not isinstance(self.device.state, Error):
            current_time = time.localtime()         
            print("Current UTC time:", current_time)
            
            print("Connection complete. end")
            self.device.change_state(AcceptCards)
                       
    def do_connect(self, ssid, key):
        import network
        sta_if = network.WLAN(network.STA_IF)
        if not sta_if.isconnected():
            print(f'connecting to network...{ssid}')
            sta_if.active(True)
            time.sleep(2)
            sta_if.connect(ssid, key)
#             while not sta_if.isconnected():
#                 sta_if.connect(ssid, key)
#                 time.sleep(2)
#                 sta_if.connect(ssid, key)
#                 time.sleep(2)
#                 sta_if.connect(ssid, key)
#                 time.sleep(2)
#                 sta_if.connect(ssid, key)
#                 break
            max_wait = 6 
            wait_time = 0
            while not sta_if.isconnected() and wait_time < max_wait:
                sta_if.connect(ssid, key)
                print(f'Waiting for connection... ({wait_time}s)')
                time.sleep(2)
                wait_time += 2
            if not sta_if.isconnected():
                print('Wifi connecting error')
                self.device.set_error(ErrorEnum.WIFI_CONNECTION_ERROR)
                self.device.change_state(Error)
                return
        print('network config:', sta_if.ifconfig())
        
        try:
            ntptime.settime()
            print("Time synchronized successfully.")
        except Exception as e:
            print("Time synchronization failed:", e)
            self.device.set_error(ErrorEnum.TIME_SYNC_ERROR)
            self.device.change_state(Error)
            return