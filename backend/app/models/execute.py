from pydantic import BaseModel
from typing import Dict, Any


class ExecuteRequest(BaseModel):
    """执行请求"""

    module: str
    command: str
    params: Dict[str, Any] = {}


class ExecuteResponse(BaseModel):
    """执行响应"""

    success: bool
    message: str
    output: str
