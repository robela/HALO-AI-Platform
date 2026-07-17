from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_async_session
from .models import ContactDB
from .schemas import ContactResponse, ContactSubmit

TAG_METADATA = {"name": "Contact", "description": "Public contact / lead-capture form."}

router = APIRouter(prefix="/contact", tags=["Contact"])


@router.post("/submit", response_model=ContactResponse, status_code=201)
async def submit_contact(
    payload: ContactSubmit,
    asession: AsyncSession = Depends(get_async_session),
):
    contact = ContactDB(
        name=payload.name,
        email=payload.email,
        company=payload.company,
        message=payload.message,
    )
    asession.add(contact)
    await asession.commit()
    return ContactResponse(success=True, message="Thank you! We'll be in touch within 24 hours.")
