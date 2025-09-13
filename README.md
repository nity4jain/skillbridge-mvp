# SkillBridge: AI-Powered Career Guidance Platform

An intelligent, full-stack career development platform that analyzes user resumes, identifies skill gaps, and generates personalized learning roadmaps using the Google Gemini API.

**[Live Demo]([https://www.google.com/search?q=https://skillbridge-mvp.vercel.app](https://skillbridge-mvp.vercel.app/)**
-----

## Key Features

  * **Semantic Resume Analysis:** Accepts resumes via text paste or file upload (`.pdf`, `.docx`) and uses **Spacy** for NLP entity extraction.
  * **AI-Powered Job Matching:** Leverages **Sentence-Transformers** to convert resumes and job descriptions into vector embeddings, providing nuanced, context-aware matching scores.
  * **Personalized Learning Paths:** Identifies user skill gaps and uses the **Google Gemini API** to generate specific, high-quality learning recommendations (courses, books, certifications).
  * **Secure Authentication:** Full Google OAuth login and session management handled by **NextAuth.js** with a PostgreSQL database backend.
  * **Multi-Service Architecture:** Built with a scalable microservice architecture, separating the frontend, backend, and AI service for independent operation and deployment.

-----

## Tech Stack & Architecture

The application is deployed across a modern, scalable cloud stack, communicating via REST APIs.

```
[ User on Vercel ] --> [ NestJS API on Render ] --> [ PostgreSQL on Supabase ]
                         |
                         '--> [ FastAPI AI on Render ] --> [ Google Gemini API ]
```

| Frontend (Client) | API Server (Backend) | AI Service (Backend) |
| :---------------- | :------------------- | :--------------------- |
| Next.js           | NestJS               | Python 3               |
| React             | TypeScript           | FastAPI                |
| TypeScript        | TypeORM              | Uvicorn                |
| Tailwind CSS      | PostgreSQL           | Sentence-Transformers  |
| Shadcn UI         | Passport.js (JWT)    | Spacy (NLP)            |
| NextAuth.js       | Swagger (OpenAPI)    | PyTorch                |
| Prisma (Adapter)  |                      | Google Gemini API      |

-----

## Local Development Setup

### Prerequisites

  * Node.js (v18+)
  * Python (v3.9+)
  * PostgreSQL
  * Git

### 1\. Clone the Repository

```bash
git clone https://github.com/nity4jain/skillbridge-mvp.git
cd skillbridge-mvp
```

### 2\. Environment Variables

You need to create three separate `.env` files.

  * **Frontend (`client/.env`):**

    ```env
    # The full URL to your NestJS backend
    NEXT_PUBLIC_API_BASE_URL="http://localhost:5000/api"
    # Your Google OAuth credentials
    GOOGLE_CLIENT_ID="your_google_client_id_here"
    GOOGLE_CLIENT_SECRET="your_google_client_secret_here"
    # A secret key for signing NextAuth.js tokens (generate with `openssl rand -base64 32`)
    NEXTAUTH_SECRET="your_strong_random_secret_key_here"
    # The base URL of your Next.js app
    NEXTAUTH_URL="http://localhost:3000"
    # Your PostgreSQL connection string for Prisma Adapter
    DATABASE_URL="postgresql://postgres:your_db_password@localhost:5432/skillbridge"
    ```

  * **API Server (`server/.env`):**

    ```env
    # Your PostgreSQL connection string for TypeORM
    DATABASE_URL="postgresql://postgres:your_db_password@localhost:5432/skillbridge"
    # This MUST be the exact same secret as in the client's .env file
    NEXTAUTH_SECRET="your_strong_random_secret_key_here"
    ```

  * **AI Service (`ai-service/.env`):**

    ```env
    # Your Google Gemini API key
    GOOGLE_API_KEY="your_google_gemini_api_key_here"
    ```

### 3\. Install Dependencies

Run `npm install` in both the `client` and `server` directories. Set up and install Python packages for the `ai-service`.

```bash
# Install client dependencies
cd client && npm install && cd ..
# Install server dependencies
cd server && npm install && cd ..
# Install AI service dependencies
cd ai-service
python -m venv venv
source venv/Scripts/activate  # On macOS/Linux, use `source venv/bin/activate`
pip install -r requirements.txt
cd ..
```

### 4\. Set Up the Database

1.  Make sure your local PostgreSQL server is running.
2.  Create a new database named `skillbridge`.
3.  Run the Prisma migrations to create the necessary tables for authentication:
    ```bash
    cd client
    npx prisma migrate dev --name init
    ```

### 5\. Run the Application

You will need three separate terminals.

  * **Terminal 1 (AI Service):**
    ```bash
    cd ai-service
    source venv/Scripts/activate
    uvicorn app.main:app --reload --port 8001
    ```
  * **Terminal 2 (API Server):**
    ```bash
    cd server
    npm run start:dev
    ```
  * **Terminal 3 (Frontend):**
    ```bash
    cd client
    npm run dev
    ```

The application will be available at `http://localhost:3000`.

-----

## Deployment

This project is configured for a full CI/CD pipeline. Pushing to the `main` branch automatically triggers deployments on all connected services.

  * **Frontend:** Deployed on **Vercel**.
  * **Backend Services:** Deployed on **Render**.
  * **Database:** Hosted on **Supabase**.
