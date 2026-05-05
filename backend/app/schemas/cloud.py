from pydantic import BaseModel
from typing import Optional

# --- Schemas cho Cloud Box ---
class CloudBoxCreate(BaseModel):
    message: Optional[str] = None
    link: Optional[str] = None
    color: str = "#fff7d1"

class CloudBoxResponse(CloudBoxCreate):
    id: str
    created_at: str