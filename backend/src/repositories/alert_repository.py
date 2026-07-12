from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import Alert


class AlertRepository:
    def __init__(self, session: AsyncSession):
        self._session = session

    async def list(self, limit: int | None = None, offset: int = 0) -> list[Alert]:
        query = select(Alert).order_by(Alert.created_at.desc()).offset(offset)
        if limit is not None:
            query = query.limit(limit)
        result = await self._session.execute(query)
        return list(result.scalars().all())

    async def add(self, alert: Alert) -> Alert:
        self._session.add(alert)
        await self._session.flush()
        return alert

    async def commit(self) -> None:
        await self._session.commit()
