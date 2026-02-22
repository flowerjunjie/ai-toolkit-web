from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.models.execute import ExecuteRequest, ExecuteResponse
import subprocess
import asyncio

router = APIRouter()


@router.post("", response_model=ExecuteResponse)
async def execute_command(request: ExecuteRequest):
    """执行AI Toolkit命令"""

    try:
        # 构建命令
        cmd = ["python", "-m", "ai_toolkit", request.module, request.command]

        # 添加参数
        for key, value in request.params.items():
            cmd.extend([f"--{key}", str(value)])

        # 执行命令
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )

        stdout, stderr = await process.communicate()

        output = stdout.decode() if stdout else ""
        error = stderr.decode() if stderr else ""

        if process.returncode != 0:
            return ExecuteResponse(
                success=False,
                message="命令执行失败",
                output=error,
            )

        return ExecuteResponse(
            success=True,
            message="命令执行成功",
            output=output,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
