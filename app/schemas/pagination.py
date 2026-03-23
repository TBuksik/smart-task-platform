from pydantic import BaseModel, Field
from typing import Generic, TypeVar, List

T = TypeVar("T")

class PaginationParams(BaseModel):
    page: int = Field(
        default=1,
        ge=1,
        description="Numer strony"
    )
    size: int = Field(
        default=10,
        ge=1,
        le=100,
        description="Liczba elementów na stronie"
    )

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.size

class PagedResponse(BaseModel, Generic[T]):
    items: List[T]

    total: int
    page: int
    size: int
    pages: int