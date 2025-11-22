from pydantic import BaseModel
from typing import Optional

class OperationIn(BaseModel):
    reference: Optional[str]
    product_id: int
    qty: float
    location_src_id: Optional[int]
    location_dest_id: Optional[int]
