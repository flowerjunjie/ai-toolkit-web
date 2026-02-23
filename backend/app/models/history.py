
"""
历史记录模型
"""

from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from datetime import datetime


class HistoryItem(BaseModel):
    """历史记录项"""
    id: int
    timestamp: str
    module: str
    command: str
    params: Dict[str, Any] = {}
    success: bool
    output: str
    created_at: str


class HistoryListResponse(BaseModel):
    """历史记录列表响应"""
    items: List[HistoryItem]
    total: int
    limit: int
    offset: int


class AddFavoriteRequest(BaseModel):
    """添加收藏请求"""
    module: str
    command: str
    name: Optional[str] = None
    description: Optional[str] = None
    params: Optional[Dict[str, Any]] = {}


class FavoriteItem(BaseModel):
    """收藏项"""
    id: int
    module: str
    command: str
    name: Optional[str] = None
    description: Optional[str] = None
    params: Dict[str, Any] = {}
    created_at: str


class FavoriteListResponse(BaseModel):
    """收藏列表响应"""
    items: List[FavoriteItem]
    total: int
    limit: int
    offset: int
