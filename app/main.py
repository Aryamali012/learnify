from fastapi import FastAPI
from app.route import search

app = FastAPI()
app.include_router(search.router)

@app.get("/")
def home():
    return {"message": "server is running"}