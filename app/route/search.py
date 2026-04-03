from fastapi import APIRouter

router = APIRouter()

@router.get("/search")
def search(topic : str):
    return {"topic" : topic,
            "videos" : [],
            "articles" : []
            }
