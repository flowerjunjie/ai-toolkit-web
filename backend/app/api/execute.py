from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.models.execute import ExecuteRequest, ExecuteResponse
import subprocess
import asyncio
import os
import sys
from pathlib import Path

router = APIRouter()

# 找到AI Toolkit项目的路径
def get_ai_toolkit_path():
    """获取AI Toolkit项目路径"""
    # 从backend目录向上找到ai-toolkit
    backend_dir = Path(__file__).parent.parent.parent
    projects_dir = backend_dir.parent
    ai_toolkit_dir = projects_dir / "ai-toolkit"
    
    if ai_toolkit_dir.exists():
        return ai_toolkit_dir
    return None


@router.post("", response_model=ExecuteResponse)
async def execute_command(request: ExecuteRequest):
    """执行AI Toolkit命令"""

    try:
        ai_toolkit_path = get_ai_toolkit_path()
        
        if not ai_toolkit_path:
            raise HTTPException(status_code=500, detail="未找到AI Toolkit项目")

        # 构建Python路径，确保能找到ai_toolkit模块
        python_path = os.environ.get("PYTHONPATH", "")
        new_python_path = f"{ai_toolkit_path}/src:{python_path}"
        
        # 构建命令
        cmd = [
            sys.executable,
            "-m",
            "ai_toolkit",
            request.module,
            request.command
        ]

        # 添加参数
        for key, value in request.params.items():
            cmd.extend([f"--{key}", str(value)])

        print(f"执行命令: {' '.join(cmd)}")
        print(f"AI Toolkit路径: {ai_toolkit_path}")
        print(f"PYTHONPATH: {new_python_path}")

        # 设置环境变量
        env = os.environ.copy()
        env["PYTHONPATH"] = new_python_path

        # 执行命令
        process = await asyncio.create_subprocess_exec(
            *cmd,
            cwd=str(ai_toolkit_path),
            env=env,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )

        stdout, stderr = await process.communicate()

        output = stdout.decode() if stdout else ""
        error = stderr.decode() if stderr else ""

        print(f"返回码: {process.returncode}")
        print(f"输出: {output}")
        print(f"错误: {error}")

        if process.returncode != 0:
            return ExecuteResponse(
                success=False,
                message="命令执行失败",
                output=error or output,
            )

        return ExecuteResponse(
            success=True,
            message="命令执行成功",
            output=output,
        )

    except Exception as e:
        print(f"异常: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
