import os
import requests
from dotenv import load_dotenv

load_dotenv()
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
def search_youtube(q, max_results=10):
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": q,
        "type": "video",
        "maxResults": max_results,
        "key": YOUTUBE_API_KEY
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        videos = []
        for item in data.get("items", []):
            video_info = {
                "title": item["snippet"]["title"],
                "videoId": item["id"]["videoId"],
                "thumbnail": item["snippet"]["thumbnails"]["high"]["url"]
            }
            videos.append(video_info)
        return videos
    else:
        print(f"Error fetching YouTube data: {response.status_code}")
        return []
    