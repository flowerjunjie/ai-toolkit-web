from fastapi import APIRouter, HTTPException
from typing import List
from app.models.module import Module, Command

router = APIRouter()

# 模块数据（来自前端data/modules.ts）
MODULES = [
    {
        "id": "api",
        "name": "API管理",
        "description": "LLM API密钥管理和连接测试",
        "category": "ai",
        "commands": [
            {
                "id": "test-openai",
                "name": "测试OpenAI",
                "description": "测试OpenAI API连接",
                "category": "api",
                "params": [
                    {
                        "name": "key",
                        "type": "string",
                        "description": "OpenAI API密钥",
                        "required": False,
                    },
                    {
                        "name": "prompt",
                        "type": "string",
                        "description": "测试提示词",
                        "required": False,
                        "default": "你好",
                    },
                ],
            },
            {
                "id": "test-anthropic",
                "name": "测试Anthropic",
                "description": "测试Anthropic Claude API",
                "category": "api",
                "params": [
                    {
                        "name": "key",
                        "type": "string",
                        "description": "Anthropic API密钥",
                        "required": False,
                    },
                    {
                        "name": "prompt",
                        "type": "string",
                        "description": "Test prompt",
                        "required": False,
                        "default": "Hello",
                    },
                ],
            },
            {
                "id": "chat",
                "name": "对话模式",
                "description": "与LLM对话",
                "category": "api",
                "params": [
                    {
                        "name": "provider",
                        "type": "select",
                        "description": "提供商",
                        "required": False,
                        "default": "openai",
                        "options": ["openai", "anthropic"],
                    },
                    {
                        "name": "message",
                        "type": "textarea",
                        "description": "消息内容",
                        "required": True,
                    },
                ],
            },
            {
                "id": "models",
                "name": "列出模型",
                "description": "列出可用的AI模型",
                "category": "api",
                "params": [],
            },
            {
                "id": "config",
                "name": "显示配置",
                "description": "显示当前API配置",
                "category": "api",
                "params": [],
            },
        ],
    },
    {
        "id": "models",
        "name": "模型管理",
        "description": "Ollama本地模型管理",
        "category": "ai",
        "commands": [
            {
                "id": "list",
                "name": "列出本地模型",
                "description": "显示已安装的模型",
                "category": "models",
                "params": [],
            },
            {
                "id": "pull",
                "name": "下载模型",
                "description": "从Ollama Hub下载模型",
                "category": "models",
                "params": [
                    {
                        "name": "model",
                        "type": "string",
                        "description": "模型名称（如llama2）",
                        "required": False,
                    },
                    {
                        "name": "name",
                        "type": "string",
                        "description": "模型名称（简化版）",
                        "required": False,
                        "default": "llama2",
                    },
                ],
            },
            {
                "id": "run",
                "name": "运行模型",
                "description": "执行模型推理",
                "category": "models",
                "params": [
                    {
                        "name": "model",
                        "type": "string",
                        "description": "模型名称",
                        "required": False,
                        "default": "llama2",
                    },
                    {
                        "name": "prompt",
                        "type": "textarea",
                        "description": "提示词",
                        "required": False,
                        "default": "你好，请自我介绍一下",
                    },
                ],
            },
            {
                "id": "delete",
                "name": "删除模型",
                "description": "删除已安装的模型",
                "category": "models",
                "params": [
                    {
                        "name": "model",
                        "type": "string",
                        "description": "模型名称",
                        "required": True,
                    },
                ],
            },
            {
                "id": "info",
                "name": "模型信息",
                "description": "查看模型详情",
                "category": "models",
                "params": [
                    {
                        "name": "model",
                        "type": "string",
                        "description": "模型名称",
                        "required": False,
                        "default": "llama2",
                    },
                ],
            },
        ],
    },
    {
        "id": "rag",
        "name": "RAG向量检索",
        "description": "ChromaDB向量检索系统",
        "category": "ai",
        "commands": [
            {
                "id": "create",
                "name": "创建知识库",
                "description": "创建RAG知识库",
                "category": "rag",
                "params": [
                    {
                        "name": "name",
                        "type": "string",
                        "description": "知识库名称",
                        "required": False,
                        "default": "my-knowledge",
                    },
                    {
                        "name": "path",
                        "type": "string",
                        "description": "文档目录",
                        "required": False,
                        "default": "./docs",
                    },
                ],
            },
            {
                "id": "search",
                "name": "语义搜索",
                "description": "在知识库中搜索",
                "category": "rag",
                "params": [
                    {
                        "name": "name",
                        "type": "string",
                        "description": "知识库名称",
                        "required": False,
                        "default": "my-knowledge",
                    },
                    {
                        "name": "query",
                        "type": "textarea",
                        "description": "搜索查询",
                        "required": True,
                    },
                    {
                        "name": "top",
                        "type": "number",
                        "description": "返回结果数",
                        "required": False,
                        "default": 5,
                    },
                ],
            },
            {
                "id": "list",
                "name": "列出知识库",
                "description": "查看所有知识库",
                "category": "rag",
                "params": [],
            },
            {
                "id": "delete",
                "name": "删除知识库",
                "description": "删除指定知识库",
                "category": "rag",
                "params": [
                    {
                        "name": "name",
                        "type": "string",
                        "description": "知识库名称",
                        "required": True,
                    },
                ],
            },
            {
                "id": "import",
                "name": "导入文档",
                "description": "导入单个文档到知识库",
                "category": "rag",
                "params": [
                    {
                        "name": "file",
                        "type": "file",
                        "description": "文件路径",
                        "required": True,
                    },
                    {
                        "name": "name",
                        "type": "string",
                        "description": "知识库名称",
                        "required": False,
                        "default": "my-knowledge",
                    },
                ],
            },
        ],
    },
    {
        "id": "coding",
        "name": "AI编码",
        "description": "AI辅助编程工具",
        "category": "dev",
        "commands": [
            {
                "id": "generate",
                "name": "生成代码",
                "description": "根据需求生成代码",
                "category": "coding",
                "params": [
                    {
                        "name": "prompt",
                        "type": "textarea",
                        "description": "代码需求描述",
                        "required": False,
                        "default": "创建一个Flask API，包含一个GET端点返回Hello World",
                    },
                    {
                        "name": "language",
                        "type": "select",
                        "description": "编程语言",
                        "required": False,
                        "default": "python",
                        "options": ["python", "javascript", "typescript", "go", "java"],
                    },
                ],
            },
            {
                "id": "review",
                "name": "代码审查",
                "description": "审查代码质量",
                "category": "coding",
                "params": [
                    {
                        "name": "file",
                        "type": "file",
                        "description": "代码文件路径",
                        "required": True,
                    },
                ],
            },
            {
                "id": "optimize",
                "name": "代码优化",
                "description": "优化代码性能",
                "category": "coding",
                "params": [
                    {
                        "name": "file",
                        "type": "file",
                        "description": "代码文件路径",
                        "required": True,
                    },
                ],
            },
            {
                "id": "explain",
                "name": "代码解释",
                "description": "解释代码功能",
                "category": "coding",
                "params": [
                    {
                        "name": "code",
                        "type": "textarea",
                        "description": "代码片段",
                        "required": False,
                        "default": "print('Hello World')",
                    },
                ],
            },
            {
                "id": "test",
                "name": "运行测试",
                "description": "运行代码测试",
                "category": "coding",
                "params": [
                    {
                        "name": "file",
                        "type": "file",
                        "description": "测试文件路径",
                        "required": True,
                    },
                ],
            },
        ],
    },
    {
        "id": "analytics",
        "name": "数据分析",
        "description": "Pandas数据统计和可视化",
        "category": "data",
        "commands": [
            {
                "id": "describe",
                "name": "描述性分析",
                "description": "计算数据统计指标",
                "category": "analytics",
                "params": [
                    {
                        "name": "file",
                        "type": "file",
                        "description": "数据文件（CSV/Excel）",
                        "required": True,
                    },
                ],
            },
            {
                "id": "visualize",
                "name": "数据可视化",
                "description": "生成数据图表",
                "category": "analytics",
                "params": [
                    {
                        "name": "file",
                        "type": "file",
                        "description": "数据文件",
                        "required": True,
                    },
                    {
                        "name": "x",
                        "type": "string",
                        "description": "X轴列名",
                        "required": True,
                    },
                    {
                        "name": "y",
                        "type": "string",
                        "description": "Y轴列名",
                        "required": True,
                    },
                    {
                        "name": "type",
                        "type": "select",
                        "description": "图表类型",
                        "required": False,
                        "default": "line",
                        "options": ["line", "bar", "scatter", "pie"],
                    },
                ],
            },
            {
                "id": "correlation",
                "name": "相关性分析",
                "description": "分析变量相关性",
                "category": "analytics",
                "params": [
                    {
                        "name": "file",
                        "type": "file",
                        "description": "数据文件",
                        "required": True,
                    },
                ],
            },
            {
                "id": "report",
                "name": "生成报告",
                "description": "生成完整分析报告",
                "category": "analytics",
                "params": [
                    {
                        "name": "file",
                        "type": "file",
                        "description": "数据文件",
                        "required": True,
                    },
                    {
                        "name": "output",
                        "type": "string",
                        "description": "输出报告路径",
                        "required": False,
                    },
                ],
            },
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
