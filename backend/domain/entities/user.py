class User:
    def __init__(self, id: int | None, name: str, email: str):
        if not name:
            raise ValueError("Name cannot be empty")

        if "@" not in email:
            raise ValueError("Invalid email address")

        self.id = id
        self.name = name
        self.email = email
