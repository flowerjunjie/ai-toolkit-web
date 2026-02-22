from fastapi import APIRouter, UploadFile, File, HTTPException
from app.core.config import settings
import shutil
from pathlib import Path
import uuid

router = APIRouter()

# 确保上传目录存在
Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)


@router.post("")
async def upload_file(file: UploadFile = File(...)):
    """上传文件"""

    try:
        # 生成唯一文件名
        file_extension = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = Path(settings.UPLOAD_DIR) / unique_filename

        # 保存文件
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return {
            "success": True,
            "message": "文件上传成功",
            "data": {
                "filename": unique_filename,
                "original_filename": file.filename,
                "path": str(file_path),
                "size": file_path.stat().st_size,
            },
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
