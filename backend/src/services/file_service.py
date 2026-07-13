import mimetypes
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status

from src.models import StoredFile
from src.repositories.file_repository import FileRepository
from src.service import STORAGE_DIR
from src.tasks import process_uploaded_file


class FileService:
    def __init__(self, files: FileRepository):
        self._files = files

    async def list(self, limit: int | None = None, offset: int = 0) -> list[StoredFile]:
        return await self._files.list(limit, offset)

    async def get_or_404(self, file_id: str) -> StoredFile:
        file_item = await self._files.get(file_id)
        if file_item is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
        return file_item

    async def get_download_target(self, file_id: str) -> tuple[StoredFile, Path]:
        file_item = await self.get_or_404(file_id)
        stored_path = STORAGE_DIR / file_item.stored_name
        if not stored_path.exists():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Stored file not found"
            )
        return file_item, stored_path

    async def create(self, title: str, upload_file: UploadFile) -> StoredFile:
        chunk_size = 1024 * 1024
        first_chunk = await upload_file.read(chunk_size)
        if not first_chunk:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File is empty")

        file_id = str(uuid4())
        suffix = Path(upload_file.filename or "").suffix
        stored_name = f"{file_id}{suffix}"
        stored_path = STORAGE_DIR / stored_name

        size = 0
        with stored_path.open("wb") as stored_file:
            chunk = first_chunk
            while chunk:
                stored_file.write(chunk)
                size += len(chunk)
                chunk = await upload_file.read(chunk_size)

        file_item = StoredFile(
            id=file_id,
            title=title,
            original_name=upload_file.filename or stored_name,
            stored_name=stored_name,
            mime_type=upload_file.content_type
            or mimetypes.guess_type(stored_name)[0]
            or "application/octet-stream",
            size=size,
            processing_status="uploaded",
        )
        await self._files.add(file_item)
        await self._files.commit()
        await self._files.refresh(file_item)

        process_uploaded_file.delay(file_item.id)
        return file_item

    async def update(self, file_id: str, title: str) -> StoredFile:
        file_item = await self.get_or_404(file_id)
        file_item.title = title
        await self._files.commit()
        await self._files.refresh(file_item)
        return file_item

    async def delete(self, file_id: str) -> None:
        file_item = await self.get_or_404(file_id)
        stored_path = STORAGE_DIR / file_item.stored_name
        if stored_path.exists():
            stored_path.unlink()
        await self._files.delete(file_item)
        await self._files.commit()
