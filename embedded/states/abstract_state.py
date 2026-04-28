class AbstractState:
    def __init__(self, device):
        self.device = device
        self.name = self.__class__.__name__

    def exec(self):
        print('State -->', self.name)
