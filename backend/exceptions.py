"""Exceptions."""


class CustomError(Exception):  # TODO: DRY
    """Custom error."""

    errcode = NotImplemented

    def __init__(self, message: str):
        """Construct error message."""
        self.message = message
        super().__init__(self.message, self.errcode)

    def __repr__(self):
        """__repr__ method."""
        return f"{self.__class__.__name__} ({self.errcode}): {self.message}"

    def __str__(self):
        """__str__ method."""
        return f"{self.__class__.__name__}: {self.message}"


class AuthError(CustomError):
    """Handle auth exceptions."""

    pass

class DomainNotAllowedError(AuthError):
    """Handle invalid loging domain."""


class DBError(Exception):
    """Handle database exceptions."""

    errcode = NotImplemented

    def __init__(self, message: str):
        """Construct error message."""
        self.message = message
        super().__init__(self.message, self.errcode)

    def __repr__(self):
        """__repr__ method."""
        return f"{self.__class__.__name__} ({self.errcode}): {self.message}"

    def __str__(self):
        """__str__ method."""
        return f"{self.__class__.__name__}: {self.message}"


class NoAfternoonTeaFound(DBError):
    """No afternoon tea found."""

    errcode = 404
