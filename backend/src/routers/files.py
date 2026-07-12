from fastapi import APIRouter, Depends, File, Form, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from src.db import get_session
from src.repositories.file_repository import FileRepository
from src.schemas import FileItem, FileUpdate
from src.services.file_service import FileService

router = APIRouter()


def get_file_service(session: AsyncSession = Depends(get_session)) -> FileService:
    return FileService(FileRepository(session))


@router.get("/files", response_model=list[FileItem])
async def list_files_view(service: FileService = Depends(get_file_service)):
    return await service.list()


@router.post("/files", response_model=FileItem, status_code=201)
async def create_file_view(
    title: str = Form(...),
    file: UploadFile = File(...),
    service: FileService = Depends(get_file_service),
):
    return await service.create(title=title, upload_file=file)


@router.get("/files/{file_id}", response_model=FileItem)
async def get_file_view(
    file_id: str,
    service: FileService = Depends(get_file_service),
):
    return await service.get_or_404(file_id)


@router.patch("/files/{file_id}", response_model=FileItem)
async def update_file_view(
    file_id: str,
    payload: FileUpdate,
    service: FileService = Depends(get_file_service),
):
    return await service.update(file_id=file_id, title=payload.title)


@router.get("/files/{file_id}/download")
async def download_file(
    file_id: str,
    service: FileService = Depends(get_file_service),
):
    file_item, stored_path = await service.get_download_target(file_id)
    return FileResponse(
        path=stored_path,
        media_type=file_item.mime_type,
        filename=file_item.original_name,
    )


@router.delete("/files/{file_id}", status_code=204)
async def delete_file_view(
    file_id: str,
    service: FileService = Depends(get_file_service),
) -> None:
    await service.delete(file_id)
