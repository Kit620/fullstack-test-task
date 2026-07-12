from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.db import get_session
from src.repositories.alert_repository import AlertRepository
from src.schemas import AlertItem
from src.services.alert_service import AlertService

router = APIRouter()


def get_alert_service(session: AsyncSession = Depends(get_session)) -> AlertService:
    return AlertService(AlertRepository(session))


@router.get("/alerts", response_model=list[AlertItem])
async def list_alerts_view(service: AlertService = Depends(get_alert_service)):
    return await service.list()
