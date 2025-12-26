from abc import ABC, abstractmethod

class IHealthRepository(ABC):

    @abstractmethod
    def ping(self) -> None:
        pass
