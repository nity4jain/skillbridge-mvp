import requests
import json

API_KEY = "d763ac29cd6b3671a3444cf9d81663886cf32f3b0ab8be209379c14425236d80"

params = {
    "engine": "google_jobs",
    "q": "junior software engineer remote",
    "hl": "en",
    "api_key": API_KEY
}

res = requests.get("https://serpapi.com/search", params=params)
data = res.json()

# Extract job details
job_data = []
for job in data.get("jobs_results", []):
    job_data.append({
        "id": job["job_id"],
        "title": job["title"],
        "description": job.get("description", "")[:300],
        "company": job["company_name"],
        "location": job["location"]
    })

# Save to file
with open("server/data/jobs.json", "w") as f:
    json.dump(job_data, f, indent=2)

print(f"{len(job_data)} jobs saved to server/data/jobs.json.")
