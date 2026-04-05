import os
import requests
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("YOUTUBE_API_KEY")


def search_youtube(topic, max_results=25):
    # 🔹 STEP 1: Search videos
    search_url = "https://www.googleapis.com/youtube/v3/search"

    search_params = {
        "part": "snippet",
        "q": topic,
        "type": "video",
        "maxResults": max_results,
        "key": API_KEY
    }

    search_response = requests.get(search_url, params=search_params)
    search_data = search_response.json()

    video_ids = []

    for item in search_data.get("items", []):
        vid = item.get("id", {}).get("videoId")
        if vid:
            video_ids.append(vid)

    if not video_ids:
        return []


    stats_url = "https://www.googleapis.com/youtube/v3/videos"

    stats_params = {
        "part": "statistics",
        "id": ",".join(video_ids),
        "key": API_KEY
    }

    stats_response = requests.get(stats_url, params=stats_params)
    stats_data = stats_response.json()

    stats_map = {}

    for item in stats_data.get("items", []):
        vid = item["id"]
        stats = item.get("statistics", {})

        views = int(stats.get("viewCount", 0))
        likes = int(stats.get("likeCount", 0))

        stats_map[vid] = {
            "views": views,
            "likes": likes
        }
    videos = []

    for item in search_data.get("items", []):
        vid = item.get("id", {}).get("videoId")
        snippet = item.get("snippet", {})

        stats = stats_map.get(vid, {})
        views = stats.get("views", 0)
        likes = stats.get("likes", 0)


        ratio = (likes / views) if views > 0 else 0
        score = views + likes  + ratio * 100

        videos.append({
            "title": snippet.get("title"),
            "videoId": vid,
            "url": f"https://youtube.com/watch?v={vid}",
            "thumbnail": snippet.get("thumbnails", {}).get("high", {}).get("url"),
            "views": views,
            "likes": likes,
            "score": score
        })

    # 🔹 STEP 5: Sort by score
    videos.sort(key=lambda x: x["score"], reverse=True)

    # 🔹 STEP 6: Return TOP 5 best videos
    return videos[:5]