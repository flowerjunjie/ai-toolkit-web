from fastapi import APIRouter
from app.api import modules, execute, upload

api_router = APIRouter()

# 包含各个API路由
api_router.include_router(modules.router, prefix="/modules", tags=["modules"])
api_router.include_router(execute.router, prefix="/execute", tags=["execute"])
api_router.include_router(upload.router, prefix="/upload", tags=["upload"])
