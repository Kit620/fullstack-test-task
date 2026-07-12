from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import StoredFile


class FileRepository:
    def __init__(self, session: AsyncSession):
        self._session = session

    async def get(self, file_id: str) -> StoredFile | None:
        return await self._session.get(StoredFile, file_id)

    async def list(self, limit: int | None = None, offset: int = 0) -> list[StoredFile]:
        query = select(StoredFile).order_by(StoredFile.created_at.desc()).offset(offset)
        if limit is not None:
            query = query.limit(limit)
        result = await self._session.execute(query)
        return list(result.scalars().all())

    async def add(self, file_item: StoredFile) -> StoredFile:
        self._session.add(file_item)
        await self._session.flush()
        return file_item

    async def delete(self, file_item: StoredFile) -> None:
        await self._session.delete(file_item)

    async def refresh(self, file_item: StoredFile) -> None:
        await self._session.refresh(file_item)

    async def commit(self) -> None:
        await self._session.commit()
