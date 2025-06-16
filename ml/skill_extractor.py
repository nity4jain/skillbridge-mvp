import spacy
import re
import os
from openai import OpenAI

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("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"))

# Sample job description
desc = "Looking for someone skilled in Node.js, PostgreSQL, Docker, and REST APIs."

# Regex-based extraction
def extract_skills(text):
    keywords = ["React", "Node.js", "Docker", "PostgreSQL", "REST", "Tailwind", "AWS", "MongoDB", "TypeScript"]
    found = []
    for kw in keywords:
        if re.search(rf'\b{kw}\b', text, re.IGNORECASE):
            found.append(kw)
    return list(set(found))

# GPT-based extraction
def gpt_extract_skills(text):
    prompt = f"Extract a list of required technologies from this job description:\n{text}"
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )
    return response.choices[0].message.content.strip()

# Main Execution
if __name__ == "__main__":
    print("Regex-based skills:", extract_skills(desc))
    
    try:
        print("GPT-based skills:", gpt_extract_skills(desc))
    except Exception as e:
        print("GPT extract failed:", e)
