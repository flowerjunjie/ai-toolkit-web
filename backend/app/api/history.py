
"""
历史记录API
"""

from fastapi import APIRouter, HTTPException, Query
from app.models.history import (
    HistoryItem, HistoryListResponse,
    AddFavoriteRequest, FavoriteItem, FavoriteListResponse
)
from app.core.database import db

router = APIRouter()


@router.get("", response_model=HistoryListResponse)
async def get_history(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    module: str = Query(None),
    command: str = Query(None),
):
    """获取历史记录列表"""
    try:
        items = db.get_history(limit=limit, offset=offset, module=module, command=command)
        
        # 为了简单，我们先不计算总数，直接返回当前数量
        total = len(items)
        
        return HistoryListResponse(
            items=items,
            total=total,
            limit=limit,
            offset=offset,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{history_id}")
async def delete_history(history_id: int):
    """删除历史记录"""
    try:
        success = db.delete_history(history_id)
        if not success:
            raise HTTPException(status_code=404, detail="历史记录不存在")
        return {"success": True, "message": "删除成功"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("")
async def clear_history():
    """清空历史记录"""
    try:
        success = db.clear_history()
        return {"success": True, "message": "清空成功"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/favorites", response_model=FavoriteItem)
async def add_favorite(request: AddFavoriteRequest):
    """添加收藏"""
    try:
        favorite_id = db.add_favorite(
            module=request.module,
            command=request.command,
            name=request.name,
            description=request.description,
            params=request.params,
        )
        
        # 获取刚添加的收藏
        favorites = db.get_favorites(limit=1, offset=0)
        if favorites:
            return favorites[0]
        
        raise HTTPException(status_code=500, detail="添加失败")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/favorites", response_model=FavoriteListResponse)
async def get_favorites(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """获取收藏列表"""
    try:
        items = db.get_favorites(limit=limit, offset=offset)
        total = len(items)
        
        return FavoriteListResponse(
            items=items,
            total=total,
            limit=limit,
            offset=offset,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/favorites/{favorite_id}")
async def delete_favorite(favorite_id: int):
    """删除收藏"""
    try:
        success = db.delete_favorite(favorite_id)
        if not success:
            raise HTTPException(status_code=404, detail="收藏不存在")
        return {"success": True, "message": "删除成功"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
