from src.models import Alert
from src.repositories.alert_repository import AlertRepository


class AlertService:
    def __init__(self, alerts: AlertRepository):
        self._alerts = alerts

    async def list(self, limit: int | None = None, offset: int = 0) -> list[Alert]:
        return await self._alerts.list(limit, offset)
