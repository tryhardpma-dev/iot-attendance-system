from states.abstract_state import AbstractState
import sys
import time
import machine

class Error(AbstractState):
    def __init__(self, device):
        super().__init__(device)
    
    def exec(self):
        super().exec()
        error_code = self.device.get_error()
        print(f"Error dead end. Code: {error_code}")
        for _ in range(error_code):
            self.device.turn_light_on()
            time.sleep(0.5)  
            self.device.turn_light_off()
            time.sleep(0.5)   
        
#         machine.reset()
        sys.exit(0)