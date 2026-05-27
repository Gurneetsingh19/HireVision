#HireVision AI
AI-Powered Technical Interview Platform

#Overview

HireVision AI is an AI-powered technical interview platform designed to help candidates prepare and experience realistic interviews.

In this platform, candidates first create an account and upload their resume. The system extracts important information such as skills, education, projects, and experience using AI.

After resume processing, the candidate starts an AI interview where questions are generated based on the uploaded resume. The interview includes voice interaction to simulate a real technical interview experience.

The platform currently focuses on the candidate experience and interview automation.

#Features
    Authentication
    Candidate Login / Signup
    Secure password storage
    Role-based user handling

#Resume Upload & Processing
    Upload resume before interview
    ##AI extracts:
        Skills
        Education
        Projects
        Experience
    Stores only the latest uploaded resume
    Resume data saved in MongoDB

#AI Interview System
    AI introduction before interview
    Resume-based questions
    Dynamic follow-up questions
    One question at a time
    Technical interview simulation

#Voice Interaction
    AI speaks interview questions
    Candidate responds using microphone
    Continuous voice interview experience

#Database Management
    User information stored securely
    Resume information stored separately
    New uploaded resume replaces previous one
    ##Database Structure:
        hirevision
        ├── users
        └── resumes

#Tech Stack
-Frontend
-Next.js
-React
-Tailwind CSS
-Backend
-FastAPI
-Python
-Database
-MongoDB Atlas
-AI Services
-Groq API
-Resume Extraction AI
-ElevenLabs
-Computer Vision (Future Scope)
-OpenCV
-MediaPipe

Candidate Login
↓
Upload Resume
↓
AI Resume Extraction
↓
Save Resume
↓
Start Interview
↓
AI Voice Questions
↓
Candidate Answers
↓
Interview Continues


#Installation

    Clone:

    ```bash
    git clone YOUR_REPOSITORY_URL
    ```
    Install frontend:

    ```bash
    npm install
    ```
    Install backend:

    ```bash
    pip install -r requirements.txt
    ```
    Environment variables:

    ```bash
    MONGO_URI=
    ```

    ```bash
    GROQ_API_KEY=
    ```

    ```bash
    ELEVENLABS_API_KEY=
    ```
    Run frontend:

    ```bash
    npm run dev
    ```

    Run backend:

    ```bash
    uvicorn main:app --reload
    ```
#Future Scope
    Company Dashboard
    Interview Reports
    Eye Tracking
    Candidate Analytics
    Behavioral Monitoring

#Goal

HireVision AI aims to provide candidates with a smarter, more interactive, and realistic technical interview experience using Artificial Intelligence.