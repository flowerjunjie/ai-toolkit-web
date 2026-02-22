from pydantic import BaseModel
from typing import List, Optional, Any


class Param(BaseModel):
    """参数模型"""

    name: str
    type: str
    description: str
    required: bool
    default: Optional[Any] = None
    options: Optional[List[str]] = None


class Command(BaseModel):
    """命令模型"""

    id: str
    name: str
    description: str
    category: str
    params: List[Param]


class Module(BaseModel):
    """模块模型"""

    id: str
    name: str
    description: str
    category: str
    commands: List[Command]
