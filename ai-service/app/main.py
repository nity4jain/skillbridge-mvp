from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from dotenv import load_dotenv
import os
import io
import docx
import PyPDF2
import google.generativeai as genai
from sentence_transformers import SentenceTransformer
import numpy as np
import spacy
import re
import json

# --- Load Environment Variables ---
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

# --- Initialize FastAPI App ---
app = FastAPI()

# --- CORS Configuration ---
origins = [
    "http://localhost:3000", # Your Next.js frontend dev server
    "http://localhost:5000", # Your NestJS backend dev server
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
    sentence_model = None

# --- Data Models ---
class AnalyzeRequest(BaseModel):
    content: str

# --- Mock Job Data ---
MOCK_JOB_LISTINGS = [
    {"id": "job1", "title": "Software Engineer", "description": "Develop backend services with Python, Flask, SQL, and AWS. Experience with REST APIs and Docker is a plus."},
    {"id": "job2", "title": "Data Scientist", "description": "Analyze large datasets using Python, R, machine learning, and statistics. Familiarity with cloud platforms like Azure or GCP."},
    {"id": "job3", "title": "Frontend Developer", "description": "Build user interfaces with React, JavaScript, HTML, and CSS. Knowledge of responsive design and UI/UX principles."},
    {"id": "job4", "title": "Cloud Architect", "description": "Design and implement scalable cloud solutions on AWS, Azure, or Google Cloud. Expertise in Kubernetes, Docker, and CI/CD."},
    {"id": "job5", "title": "Project Manager", "description": "Lead agile development teams, manage sprints, and ensure successful project delivery. Strong communication and leadership skills."},
]

# --- Skill Extraction Logic ---
COMMON_SKILLS = [
    "Python", "Java", "JavaScript", "TypeScript", "SQL", "HTML", "CSS", "Next.js", "Shadcn UI",
    "React", "Node.js", "Docker", "Git", "PostgreSQL", "MongoDB", "AWS", "NestJS", "FastAPI",
    "REST", "GraphQL", "Machine Learning", "Data Analysis", "Statistics", "PyTorch", "TypeORM",
    "Azure", "GCP", "Kubernetes", "CI/CD", "Agile", "Scrum", "Communication", "Leadership", "Prisma"
]
skill_pattern = re.compile(r'\b(?:' + '|'.join(re.escape(skill) for skill in COMMON_SKILLS) + r')\b', re.IGNORECASE)

def extract_skills_from_text(text):
    found_skills = set()
    for match in skill_pattern.findall(text):
        for skill in COMMON_SKILLS:
            if skill.lower() == match.strip().lower():
                found_skills.add(skill)
                break
    return sorted(list(found_skills), key=lambda x: x.lower())

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

# --- Semantic Job Matching Logic ---
def get_embedding(text):
    if not sentence_model:
        raise RuntimeError("SentenceTransformer model is not loaded.")
    return sentence_model.encode(text)

def calculate_cosine_similarity(vec_a, vec_b):
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
        matches.append({"job": job, "similarity_score": round(float(similarity), 4)})

    matches.sort(key=lambda x: x["similarity_score"], reverse=True)
    return matches[:5]

# --- Gemini-based Learning Path Generation ---
async def generate_learning_path_with_gemini(extracted_skills: list, matched_jobs: list):
    if not GOOGLE_API_KEY:
        print("WARNING: GOOGLE_API_KEY is not set.")
        return [{"skill_gap": "API Key Missing", "recommendations": ["Please set your GOOGLE_API_KEY in .env."]}]

    model = genai.GenerativeModel('gemini-1.5-flash-latest')
    
    prompt = f"""
    Act as an expert AI career coach. A user has these skills: {', '.join(extracted_skills)}.
    They have matched with these job roles: {', '.join([job['title'] for job in matched_jobs])}.
    
    1. Identify 2-3 critical skill gaps based on the user's skills and their matched jobs.
    2. For each skill gap, suggest 2 specific, real-world learning resources.
    3. For online courses, provide the real name and platform (e.g., "Google Project Management Certificate on Coursera").
    4. Do not use generic advice. Be specific.

    Format the entire response as a single JSON object with one key "learning_paths".
    The value of "learning_paths" should be a list of objects, where each object has "skill_gap" and "recommendations" keys.

    Example format:
    {{
      "learning_paths": [
        {{
          "skill_gap": "Advanced Agile Methodologies",
          "recommendations": [
            "Course: Agile Crash Course: Agile Project Management on Udemy",
            "Book: 'Scrum: The Art of Doing Twice the Work in Half the Time' by Jeff Sutherland"
          ]
        }}
      ]
    }}
    """

    try:
        response = await model.generate_content_async(prompt)
        json_string = response.text.replace('```json', '').replace('```', '').strip()
        parsed_response = json.loads(json_string)
        return parsed_response.get("learning_paths", [])
    except Exception as e:
        print(f"Error calling Google Gemini API: {e}")
        return [{"skill_gap": "API Error", "recommendations": ["Could not generate a recommendation at this time."]}]

# --- FastAPI Endpoints ---
@app.get("/")
async def read_root():
    return {"message": "SkillBridge AI Service is running!"}

@app.post("/analyze-profile/")
async def analyze_profile(request: AnalyzeRequest):
    user_content = request.content
    extracted_skills = extract_skills_from_text(user_content)
    matched_jobs = find_best_job_matches(user_content, MOCK_JOB_LISTINGS)
    job_dicts_for_gpt = [match["job"] for match in matched_jobs]
    # --- Switched to Gemini for Learning Paths ---
    learning_paths = await generate_learning_path_with_gemini(extracted_skills, job_dicts_for_gpt)

    return {
        "extracted_skills": extracted_skills,
        "matched_jobs": [{"title": job_match['job']['title'], "score": job_match['similarity_score']} for job_match in matched_jobs],
        "learning_paths": learning_paths
    }

@app.post("/upload-resume-file/")
async def upload_resume_file(file: UploadFile = File(...)):
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
        # --- Switched to Gemini for Learning Paths ---
        learning_paths = await generate_learning_path_with_gemini(extracted_skills, job_dicts_for_gpt)

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