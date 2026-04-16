# RefineAI

RefineAI is a platform which helps users to apply smarter for any job.
Optimize every job application with AI. Tailor your resume, manage your applications, and prepare smarter for interviews all in one place.

---

## ✨ Features

* 🔍 **AI Resume Suggestions**
  Generate targeted improvements based on job descriptions

* 🧠 **Interview Preparation**
  Get structured questions, answers, and key points

* 📄 **Resume Management**
  Upload, store, and view original PDFs alongside parsed text

* 🔁 **Regenerative AI Flow**
  Generate new suggestions/questions without repetition

---

## Tech Stack

**Frontend**

* React (TypeScript)
* Tailwind CSS

**Backend**

* Node.js (Express)
* Prisma ORM
* Prisma PostgreSQL

**AI Layer**

* Python (FastAPI)
* LLM: Llama 3.3 (Groq)

**Caching & Infra**

* Upstash Redis

---

## Core AI Concepts Used

### 1. JSON Prompting

* Structured prompts with:

  * `instruction`
  * `context`
  * `input`
  * `output_format`
  * `constraints`
* Ensures **consistent and machine-readable outputs**

---

### 2. Context Engineering

* Injected:

  * Job Description
  * Resume Text
  * Accepted Suggestions / Existing Questions
* Enables **relevance-aware AI generation**

---

### 3. Controlled Output Design

* Enforced:

  * Strict JSON responses
  * Schema validation (`jsonschema`)
* Prevents hallucinated or malformed outputs

---

## ⚡ Performance & Optimization

### 1. Redis Caching (Upstash)

* Cached:

  * AI suggestions
  * Interview questions
* Reduces:

  * API calls
  * Latency
  * Cost

---

### 2. Cache Invalidation Strategy

* Cache cleared when:

  * New suggestions are generated
* Ensures **data consistency**

---

### 3. Rate Limiting (Fixed Window)

* Implemented using Redis
* Limits requests per user per time window
* Protects:

  * API abuse
  * LLM cost overuse

---

## 🔐 Security

* 🔑 API Key protection between Node.js ↔ Python service
* 🚫 AI service not exposed publicly
* 📏 Input size validation to prevent token abuse

---

## 🧩 Architecture

```
Frontend (React)
        ↓
Node.js Backend (Auth, Logic, Rate Limit, Cache)
        ↓
Python AI Service (FastAPI, Prompting)
        ↓
LLM (Groq - Llama 3.3)
```

---

## 📌 Key Design Decisions

* Separated AI layer (Python) from backend for scalability
* Used structured prompting instead of free-form prompts
* Stored suggestions as rows for flexibility (accept/reject)
* Used Redis for both caching and rate limiting

---

## 📈 Future Improvements

* Vector DB for semantic memory (RAG)
* Streaming AI responses
* Fine-tuned prompt templates per job role
* User analytics & feedback loop

---
