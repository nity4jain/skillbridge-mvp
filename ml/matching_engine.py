from sentence_transformers import SentenceTransformer
import numpy as np

# Initialize model (downloads it once)
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embedding(text):
    """Converts a string to a dense vector using a local transformer model."""
    return model.encode(text)

def cosine_similarity(a, b):
    """Computes cosine similarity between two vectors."""
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Example user profile and job descriptions
user_profile = "Experienced in Python, machine learning, Flask, and data analysis."
job_descriptions = [
    "We need someone skilled in Flask, pandas, and Python for data engineering.",
    "Looking for a frontend React developer with CSS and design experience.",
    "A backend developer needed with experience in Django and REST APIs."
]

# Embed the user profile once
user_vec = get_embedding(user_profile)

# Compare with each job
for i, job in enumerate(job_descriptions):
    job_vec = get_embedding(job)
    similarity = cosine_similarity(user_vec, job_vec)
    print(f"Job {i+1} Similarity: {similarity:.2f}")