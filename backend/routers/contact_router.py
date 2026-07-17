from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db, ContactModel
from schemas import ContactSubmit, ContactResponse

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("/submit", response_model=ContactResponse)
def submit_contact(payload: ContactSubmit, db: Session = Depends(get_db)):
    contact = ContactModel(
        name=payload.name,
        email=payload.email,
        company=payload.company,
        message=payload.message,
    )
    db.add(contact)
    db.commit()
    return ContactResponse(success=True, message="Thank you! We'll be in touch within 24 hours.")
