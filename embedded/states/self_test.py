from states.abstract_state import AbstractState
from states.error import Error
from states.error_enum import ErrorEnum
from states.init import Init
import time

class SelfTest(AbstractState):
    def __init__(self, device):
        super().__init__(device)
        
    def exec(self):
        super().exec()
        
        print(">> LED check...")
        self.device.turn_light_on()
        time.sleep(1)  
        self.device.turn_light_off()
        print(">> LED test passed.")
        
        #print(">> Test nacitavania karty...")
        #self.device.rc522.init()
        #status_request, tag_type = self.device.rc522.request(self.device.rc522.REQIDL)
        #if status_request == self.device.rc522.OK:
        #    status, uid = self.device.rc522.SelectTagSN()
        #    if status == self.device.rc522.OK:
        #        print(">> Card was scanned. UID:", uid)
        #        print(">> SelfTest completed successfully.")
        self.device.change_state(Init)
        #else:
        #    print(">> Error: Card could not be read.")
        #    self.device.set_error(ErrorEnum.CARD_READ_ERROR)
        #    self.device.change_state(Error)
        #    return
    
        