from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.route import search

app = FastAPI()
app.include_router(search.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "server is running"}