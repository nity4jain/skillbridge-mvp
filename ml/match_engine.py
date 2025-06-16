# ml/match_engine.py

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()  # <- THIS is what Uvicorn looks for

class ProfileRequest(BaseModel):
    profile: str

jobs = [
    {
        "id": "job_001",
        "title": "Backend Developer",
        "description": "Experience with Node.js, PostgreSQL, Docker, and REST APIs."
    },
    {
        "id": "job_002",
        "title": "Frontend Developer",
        "description": "Looking for React, CSS, HTML, and JavaScript skills."
    },
    {
        "id": "job_003",
        "title": "DevOps Engineer",
        "description": "Familiar with AWS, Docker, Kubernetes, and CI/CD pipelines."
    },
]

def match_jobs(user_profile_text: str, job_list: List[Dict]):
    documents = [user_profile_text] + [job["description"] for job in job_list]
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(documents)
    
    user_vec = tfidf_matrix[0]
    job_vecs = tfidf_matrix[1:]
    similarities = cosine_similarity(user_vec, job_vecs).flatten()

    results = sorted(zip(similarities, job_list), key=lambda x: x[0], reverse=True)
    return results[:5]

@app.post("/match")
def get_top_matches(req: ProfileRequest):
    matches = match_jobs(req.profile, jobs)
    return {
        "top_matches": [
            {"score": round(score, 2), "job": job} for score, job in matches
        ]
    }