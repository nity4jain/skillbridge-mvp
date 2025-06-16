import spacy
import re

# Load spaCy's English model
nlp = spacy.load("en_core_web_sm")

# Example skill list – expand this based on your use case
COMMON_SKILLS = [
    "Python", "Java", "JavaScript", "SQL", "HTML", "CSS",
    "Django", "Flask", "React", "Node.js", "Docker", "Git",
    "PostgreSQL", "MongoDB", "AWS", "REST", "GraphQL"
]

# Precompile regex patterns
skill_pattern = re.compile(r'\b(?:' + '|'.join(re.escape(skill) for skill in COMMON_SKILLS) + r')\b', re.IGNORECASE)

def extract_skills(text):
    """Extract skills based on regex and spaCy noun chunks."""
    found_skills = set()

    # Regex-based extraction
    for match in skill_pattern.findall(text):
        found_skills.add(match.strip())

    # spaCy-based noun phrase matching (optional enhancement)
    doc = nlp(text)
    for chunk in doc.noun_chunks:
        chunk_text = chunk.text.strip()
        if chunk_text in COMMON_SKILLS:
            found_skills.add(chunk_text)

    return sorted(found_skills)

# Sample job description
desc = "Looking for a Python developer with experience in Flask, Docker, and PostgreSQL. Knowledge of Git and REST APIs is a plus."

# Extract and print skills
print("Extracted skills:", extract_skills(desc))
