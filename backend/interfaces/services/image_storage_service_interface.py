from abc import ABC, abstractmethod

class IImageStorageService(ABC):
    @abstractmethod
    def upload(
        self,
        *,
        user_id: int,
        image_bytes: bytes,
        filename: str,
        content_type: str,
    ) -> str:
        """
        Stores image and returns its storage path/key.
        """
        raise NotImplementedError
