from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from match_engine import match_jobs

app = Flask(__name__)
CORS(app)

# Get absolute path to jobs.json
base_dir = os.path.dirname(os.path.dirname(__file__))  # Goes up to skillbridge-mvp/
jobs_path = os.path.join(base_dir, "server", "data", "jobs.json")

with open(jobs_path, "r") as f:
    job_data = json.load(f)

@app.route("/match", methods=["POST"])
def match():
    data = request.json
    user_text = data["profile"]
    top_jobs = match_jobs(user_text, job_data)
    return jsonify([job for _, job in top_jobs])

if __name__ == "__main__":
    app.run(port=5000)