"""Exceptions."""


class CustomError(Exception):
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


class TokenExpiredError(AuthError):
    """Handle expired token."""

    errcode = 401


class UnauthorizedError(AuthError):
    """Handle unauthorized request."""

    errcode = 403


class DomainNotAllowedError(AuthError):
    """Handle invalid loging domain."""

    errcode = 403


class DBError(CustomError):
    """Handle database exceptions."""


class NoAfternoonTeaFound(DBError):
    """No afternoon tea found."""

    errcode = 404
