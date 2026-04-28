from states.abstract_state import AbstractState
from states.error import Error
from states.error_enum import ErrorEnum
from boot import *
import machine
import json

class FactoryReset(AbstractState):
    def __init__(self, device):
        super().__init__(device)
        
    def exec(self):
        super().exec()
        try:
            self._create_config()
        except OSError:
            self.device.set_error(ErrorEnum.FACTORY_RESET_FAILED)
            self.device.change_state(Error)
            return

        print("Factory reset, TIME TO DIE")

        machine.reset()

    def _create_config(self):
        with open(CONFIG_FILE, 'w') as file:
           json.dump(DEFAULT_CONFIG, file)