from fastapi import APIRouter
from app.services.youtube import search_youtube
router = APIRouter()

@router.get("/search")
def search(topic : str):
    return {"topic" : topic,
            "videos" : search_youtube(topic),
            "articles" : []
            }
