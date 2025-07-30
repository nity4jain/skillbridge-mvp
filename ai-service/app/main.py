# ai-service/app/main.py
from openai import OpenAI
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from dotenv import load_dotenv
import os
import io
import docx
import PyPDF2
from openai import OpenAI
from sentence_transformers import SentenceTransformer
import numpy as np
import spacy
import re
import json

# --- Load Environment Variables ---
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# --- Initialize FastAPI App ---
app = FastAPI()

# --- CORS Configuration ---
# IMPORTANT: Adjust origins for your frontend (Next.js) and backend (NestJS)
origins = [
    "http://localhost:3000", # Your Next.js frontend dev server
    "http://localhost:5000", # Your NestJS backend dev server
    # Add your deployed Next.js URL here (e.g., "https://your-skillbridge-frontend.vercel.app")
    # Add your deployed NestJS URL here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Initialize AI Models (Load once at startup) ---
try:
    nlp = spacy.load("en_core_web_sm")
    print("SpaCy model 'en_core_web_sm' loaded successfully.")
except OSError:
    print("SpaCy model 'en_core_web_sm' not found. Downloading...")
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

try:
    sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
    print("SentenceTransformer model 'all-MiniLM-L6-v2' loaded successfully.")
except Exception as e:
    print(f"Error loading SentenceTransformer model: {e}")
    print("Attempting to re-download...")
    from sentence_transformers import util
    util.load_and_save_json(model_name_or_path='all-MiniLM-L6-v2', model_url='https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2/resolve/main/') # This might not be the direct download command, user might need to debug
    sentence_model = SentenceTransformer('all-MiniLM-L6-v2')


openai_client = OpenAI(api_key=OPENAI_API_KEY)

# --- Data Models ---
class AnalyzeRequest(BaseModel):
    content: str # Can be resume text or skills description

# --- Mock Job Data (for MVP) ---
# In a real app, this would come from your NestJS backend/database or a live job board API
MOCK_JOB_LISTINGS = [
    {"id": "job1", "title": "Software Engineer", "description": "Develop backend services with Python, Flask, SQL, and AWS. Experience with REST APIs and Docker is a plus."},
    {"id": "job2", "title": "Data Scientist", "description": "Analyze large datasets using Python, R, machine learning, and statistics. Familiarity with cloud platforms like Azure or GCP."},
    {"id": "job3", "title": "Frontend Developer", "description": "Build user interfaces with React, JavaScript, HTML, and CSS. Knowledge of responsive design and UI/UX principles."},
    {"id": "job4", "title": "Cloud Architect", "description": "Design and implement scalable cloud solutions on AWS, Azure, or Google Cloud. Expertise in Kubernetes, Docker, and CI/CD."},
    {"id": "job5", "title": "Project Manager", "description": "Lead agile development teams, manage sprints, and ensure successful project delivery. Strong communication and leadership skills."},
]

# --- Skill Extraction Logic (from skill_extractor.py) ---
COMMON_SKILLS = [
    "Python", "Java", "JavaScript", "SQL", "HTML", "CSS", "Django", "Flask",
    "React", "Node.js", "Docker", "Git", "PostgreSQL", "MongoDB", "AWS",
    "REST", "GraphQL", "Machine Learning", "Data Analysis", "Statistics",
    "Azure", "GCP", "Kubernetes", "CI/CD", "Agile", "Scrum", "Communication", "Leadership"
]
skill_pattern = re.compile(r'\b(?:' + '|'.join(re.escape(skill) for skill in COMMON_SKILLS) + r')\b', re.IGNORECASE)

def extract_skills_from_text(text):
    found_skills = set()
    for match in skill_pattern.findall(text):
        found_skills.add(match.strip())
    doc = nlp(text)
    for chunk in doc.noun_chunks:
        chunk_text = chunk.text.strip()
        # Add more sophisticated rules here if needed, e.g., checking if chunk is a known tech term
        if chunk_text.lower() in [s.lower() for s in COMMON_SKILLS]:
            found_skills.add(chunk_text)
    return sorted(list(found_skills), key=lambda x: x.lower()) # Sort for consistency

# --- Resume/Document Parsing Utilities ---
def extract_text_from_pdf(file_stream):
    try:
        reader = PyPDF2.PdfReader(file_stream)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        raise ValueError(f"Error reading PDF: {e}")

def extract_text_from_docx(file_stream):
    try:
        doc = docx.Document(file_stream)
        text = [p.text for p in doc.paragraphs]
        return "\n".join(text)
    except Exception as e:
        raise ValueError(f"Error reading DOCX: {e}")

# --- Semantic Job Matching Logic (from matching_engine.py) ---
def get_embedding(text):
    """Converts a string to a dense vector using a local transformer model."""
    return sentence_model.encode(text)

def calculate_cosine_similarity(vec_a, vec_b):
    """Computes cosine similarity between two vectors."""
    # Ensure non-zero norms to avoid division by zero
    norm_a = np.linalg.norm(vec_a)
    norm_b = np.linalg.norm(vec_b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return np.dot(vec_a, vec_b) / (norm_a * norm_b)

def find_best_job_matches(user_profile_text: str, job_listings: List[Dict]):
    user_vec = get_embedding(user_profile_text)
    matches = []
    for job in job_listings:
        job_vec = get_embedding(job["description"])
        similarity = calculate_cosine_similarity(user_vec, job_vec)
        matches.append({"job": job, "similarity_score": round(float(similarity), 4)}) # Convert numpy float to native float

    # Sort by similarity score in descending order
    matches.sort(key=lambda x: x["similarity_score"], reverse=True)
    return matches[:5] # Return top 5 matches


# --- GPT-based Learning Path Generation ---
# ai-service/app/main.py (relevant part for generate_learning_path_with_gpt function)

async def generate_learning_path_with_gpt(extracted_skills: list, matched_jobs: list):
    if not OPENAI_API_KEY:
        print("WARNING: OPENAI_API_KEY is not set. Cannot generate real learning paths with GPT.")
        return [{"skill_gap": "API Key Missing", "recommendations": ["Please set your OPENAI_API_KEY in .env."]}]

    prompt = (
        f"The user has extracted skills ({', '.join(extracted_skills) if extracted_skills else 'none'}) "
        f"and matched with job roles ({', '.join([job['title'] for job in matched_jobs]) if matched_jobs else 'none'}). "
        "Identify potential skill gaps and suggest 2-3 specific, actionable learning resources for each gap. "
        "Format as a JSON list, e.g., [{\"skill_gap\": \"Skill Name\", \"recommendations\": [\"Resource 1\", \"Resource 2\"]}]"
    )

    try:
        chat_completion = await openai_client.chat.completions.create(
            model="gpt-3.5-turbo", # Or "gpt-4o" if you have access and budget
            messages=[
                {"role": "system", "content": "You are a helpful AI career guidance assistant."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        raw_response_content = chat_completion.choices[0].message.content

        # Parse GPT's response into a list of dictionaries
        parsed_response = json.loads(raw_response_content) # json is now imported
        return parsed_response.get("learning_paths", []) 

    except Exception as e: # This will catch RateLimitError and other OpenAI errors
        print(f"Error calling OpenAI API for learning paths (likely RateLimitError/Quota): {e}")
        # --- TEMPORARY MOCK DATA FOR TESTING WHEN API FAILS ---
        print("WARNING: Returning mock learning paths due to API error.")
        mock_paths = []
        if extracted_skills:
            mock_paths.append({
                "skill_gap": f"Advanced {extracted_skills[0]}",
                "recommendations": [
                    f"Deep Dive into {extracted_skills[0]} (Udemy)",
                    f"Online {extracted_skills[0]} Certification (Coursera)"
                ]
            })
        if matched_jobs:
             mock_paths.append({
                "skill_gap": "General Job Market Trends",
                "recommendations": ["LinkedIn Learning: Career Essentials", "Read Industry Blogs"]
            })
        if not mock_paths: # Fallback if no skills/jobs provided
            mock_paths.append({
                "skill_gap": "General Skill Improvement",
                "recommendations": ["Explore Coursera", "Browse freeCodeCamp tutorials"]
            })
        return mock_paths
        # --- END TEMPORARY MOCK DATA ---


# --- FastAPI Endpoints ---

@app.get("/")
async def read_root():
    return {"message": "SkillBridge AI Service is running!"}

@app.post("/analyze-profile/")
async def analyze_profile(request: AnalyzeRequest):
    """Analyzes text content (e.g., manually entered profile description)."""
    user_content = request.content

    extracted_skills = extract_skills_from_text(user_content)
    matched_jobs = find_best_job_matches(user_content, MOCK_JOB_LISTINGS)

    # Extract just the job dicts from the matched_jobs list for GPT context
    job_dicts_for_gpt = [match["job"] for match in matched_jobs]

    learning_paths = await generate_learning_path_with_gpt(extracted_skills, job_dicts_for_gpt)

    return {
        "extracted_skills": extracted_skills,
        "matched_jobs": [{"title": job_match['job']['title'], "score": job_match['similarity_score']} for job_match in matched_jobs],
        "learning_paths": learning_paths
    }

@app.post("/upload-resume-file/")
async def upload_resume_file(file: UploadFile = File(...)):
    """Analyzes an uploaded resume file (PDF or DOCX)."""
    file_extension = file.filename.split(".")[-1].lower()
    resume_content = ""

    try:
        file_stream = io.BytesIO(await file.read())

        if file_extension == "pdf":
            resume_content = extract_text_from_pdf(file_stream)
        elif file_extension == "docx":
            resume_content = extract_text_from_docx(file_stream)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Please upload PDF or DOCX.")

        extracted_skills = extract_skills_from_text(resume_content)
        matched_jobs = find_best_job_matches(resume_content, MOCK_JOB_LISTINGS)

        job_dicts_for_gpt = [match["job"] for match in matched_jobs]
        learning_paths = await generate_learning_path_with_gpt(extracted_skills, job_dicts_for_gpt)

        return {
            "filename": file.filename,
            "content_preview": resume_content[:500] + "...",
            "extracted_skills": extracted_skills,
            "matched_jobs": [{"title": job_match['job']['title'], "score": job_match['similarity_score']} for job_match in matched_jobs],
            "learning_paths": learning_paths
        }
    except ValueError as ve:
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process resume: {e}")

# Add your OpenAI API key to ai-service/.env:
# OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_OPENAI_API_KEY_HERE