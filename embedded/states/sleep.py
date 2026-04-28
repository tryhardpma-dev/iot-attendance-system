from states.abstract_state import AbstractState
from states.error import Error
from states.error_enum import ErrorEnum
import time
import sys
from boot import *
import network
import machine
from umqtt.simple import MQTTClient 
from mqtt_manager import MQTTManager
from machine import Pin

class Sleep(AbstractState):
    def __init__(self, device, sleep_duration = None):
        if sleep_duration is None:
            sleep_duration = device.config.get("SLEEP_DURATION", 1800)
        super().__init__(device)
        self.btn = Pin(SLEEP_BUTTON, Pin.IN, Pin.PULL_UP)
        self.set_topic = MQTT_SET
        self.mqtt_manager = None
        self.sleep_duration = sleep_duration
        self.button_pressed = False
        
    def exec(self):
        super().exec()
        print("The device enters Sleep mode.")
        self.mqtt_manager = MQTTManager(self.device.config, self.device)
        self.disconnect_network()
        
        while not self.button_pressed:
            print("sleep")
            time.sleep(10)
#             self.btn.irq(trigger=Pin.IRQ_FALLING, handler=self.button_irq)
#             machine.lightsleep(self.sleep_duration * 1000)
            print("awake")
            self.active_phase()
        machine.reset()
        
    def button_irq(pin):
        Pin("LED").toggle()
        self.button_pressed = True
    
    def disconnect_network(self):
        print(">> Disconnecting from wifi")
        sta_if = network.WLAN(network.STA_IF)
        if sta_if.isconnected():
            sta_if.disconnect()
            while sta_if.isconnected():
                time.sleep(0.1)
        sta_if.active(False)
        print(">> Wi-Fi is off.")
    
    def connect_wifi(self):
        print(">> Connecting to  Wi-Fi:")
        config = self.device.config['wifi']
        sta_if = network.WLAN(network.STA_IF)
        sta_if.active(True)
        sta_if.connect(config['ssid'], config['key'])
        
        timeout = 2  
        while not sta_if.isconnected() and timeout > 0:
            sta_if.connect(config['ssid'], config['key'])
            time.sleep(1)
            timeout -= 1
        
        if sta_if.isconnected():
            print(">> Connected to Wi-Fi:", sta_if.ifconfig())
        else:
            print(">> Could not connect to Wi-Fi.")
            sta_if.active(False)                 
            
    def active_phase(self):
        self.connect_wifi()
        
        if not self.mqtt_manager.prepare_connection(subscribe_mode=True):
            print(">> Error connecting to MQTT broker")
        else:
            try:
                self.mqtt_manager.client.subscribe(self.set_topic)
#                 print(f">> Subscribed to topic {self.set_topic}")
#                 start = time.time()
#                 while time.time() - start < 20:
#                 self.mqtt_manager.client.check_msg()
#                     time.sleep(1)
            except Exception as e:
                print(f">> Error during MQTT check: {e}")
            self.mqtt_manager.disconnect()
        self.disconnect_network()
        

