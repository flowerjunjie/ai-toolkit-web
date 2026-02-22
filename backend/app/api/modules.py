from fastapi import APIRouter, HTTPException
from typing import List
from app.models.module import Module, Command

router = APIRouter()

# 模拟数据（实际应从AI Toolkit读取）
MODULES = [
    {
        "id": "api",
        "name": "API管理",
        "description": "LLM API密钥管理和连接测试",
        "category": "ai",
        "commands": [
            {
                "id": "test",
                "name": "测试连接",
                "description": "测试LLM API连接是否正常",
                "category": "api",
                "params": [
                    {
                        "name": "provider",
                        "type": "select",
                        "description": "LLM提供商",
                        "required": True,
                        "default": "openai",
                        "options": ["openai", "anthropic", "ollama", "custom"],
                    }
                ],
            }
        ],
    },
    {
        "id": "analytics",
        "name": "数据分析",
        "description": "统计分析、相关性、回归分析",
        "category": "data",
        "commands": [
            {
                "id": "descriptive",
                "name": "描述性分析",
                "description": "计算数据的统计指标",
                "category": "analytics",
                "params": [
                    {
                        "name": "file",
                        "type": "file",
                        "description": "数据文件",
                        "required": True,
                    }
                ],
            }
        ],
    },
]


@router.get("", response_model=List[Module])
async def get_modules():
    """获取所有模块"""
    return MODULES


@router.get("/{module_id}", response_model=Module)
async def get_module(module_id: str):
    """获取模块详情"""
    for module in MODULES:
        if module["id"] == module_id:
            return module
    raise HTTPException(status_code=404, detail="模块不存在")


@router.get("/category/{category}", response_model=List[Module])
async def get_modules_by_category(category: str):
    """按分类获取模块"""
    if category == "all":
        return MODULES
    return [m for m in MODULES if m["category"] == category]
