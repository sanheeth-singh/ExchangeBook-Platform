![Status](https://img.shields.io/badge/status-active-success)


# 📕 ExchangeBook Platform

> A full-stack web application enabling users to seamlessly exchange books through a structured, real-time, and trust-driven system.

---

## 🚀 Overview

ExchangeBook Platform is designed to simplify peer-to-peer book sharing by providing a centralized system where users can list books, request exchanges, and communicate in real-time.  
The platform focuses on affordability, sustainability, and building a trusted community of readers.

---
## Problem Statement

Access to affordable books remains a challenge for many readers. Traditional purchasing models often lead to underutilized books, while existing platforms lack a structured and trustworthy system for peer-to-peer book exchange.

Additionally, there is limited support for:
- Direct user-to-user interaction
- Transparent exchange workflows
- Real-time communication during exchanges

This creates friction in building a reliable and scalable book-sharing ecosystem.

---

## Solution

ExchangeBook Platform addresses these challenges by providing a structured system for listing, discovering, and exchanging books between users.

The platform enables:
- Seamless book listing and discovery
- A defined exchange workflow with request and approval mechanisms
- Real-time communication using WebSockets
- A foundation for trust through user interaction and reporting features

By combining these components, the platform promotes affordability, reuse of resources, and a more connected reading community.

---

## Core Features

- User Authentication  
  Secure user registration and login using JWT-based authentication.

- Book Management  
  Users can list, browse, and manage books available for exchange.

- Exchange System  
  Structured workflow for requesting, accepting, and tracking book exchanges between users.

- Real-Time Chat  
  Integrated WebSocket-based messaging system enabling users to communicate during exchanges.

- Role-Based Access  
  Support for different user roles such as standard users and administrators.

- Report System  
  Users can report issues or inappropriate behavior, helping maintain platform integrity.

- Scalable Backend Design  
  Modular FastAPI architecture with clear separation of concerns for maintainability and scalability.

---

## System Architecture

The ExchangeBook Platform follows a modular full-stack architecture with clear separation between the frontend, backend, and database layers. It also integrates real-time communication using WebSockets.

### High-Level Architecture

Frontend (Next.js)  
        ↓  
Backend (FastAPI - REST APIs)  
        ↓  
Database (PostgreSQL)  
        ↑  
WebSocket Layer (Real-Time Chat)

---

### Architecture Overview

- Frontend  
  Built using Next.js and TypeScript, responsible for user interaction, UI rendering, and API communication.

- Backend  
  Developed with FastAPI, handling business logic, authentication, exchange workflows, and API endpoints.

- Database  
  PostgreSQL is used for persistent storage, managed via SQLAlchemy ORM and Alembic migrations.

- Real-Time Communication  
  WebSocket connections enable live chat functionality between users during an active exchange.

---

### Request Flow

1. User interacts with the frontend (e.g., requests a book exchange)  
2. Frontend sends an HTTP request to the FastAPI backend  
3. Backend processes the request and updates the database  
4. For chat functionality, a WebSocket connection is established  
5. Messages are transmitted in real-time between users  

---

### Design Principles

- Separation of Concerns  
  Clear division between API routes, business logic, database models, and schemas

- Scalability  
  Modular structure allows easy addition of new features and services

- Maintainability  
  Organized folder structure and consistent design patterns

- Real-Time Capability  
  WebSocket integration enhances user interaction during exchanges

---
## Tech Stack

| Layer            | Technology                     | Badge |
|------------------|-------------------------------|-------|
| Frontend         | Next.js, TypeScript           | ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) |
| Backend          | FastAPI, Python               | ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white) ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) |
| Database         | PostgreSQL                    | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white) |
| ORM              | SQLAlchemy                    | ![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=flat) |
| Migrations       | Alembic                       | ![Alembic](https://img.shields.io/badge/Alembic-4B8BBE?style=flat) |
| Authentication   | JWT (JSON Web Tokens)         | ![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=jsonwebtokens) |
| Real-Time Layer  | WebSockets                    | ![WebSockets](https://img.shields.io/badge/WebSockets-010101?style=flat) |
| API Architecture | REST                          | ![REST](https://img.shields.io/badge/API-RESTful-blue?style=flat) |

  

---

## Project Structure

The project is organized into a modular structure with clear separation of concerns across backend, frontend, and database migration layers.
```
.
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── book.py
│   │   │   ├── exchange.py
│   │   │   ├── chat.py
│   │   │   ├── review.py
│   │   │   ├── report.py
│   │   │   ├── user.py
│   │   │   └── admin.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   │
│   │   ├── db/
│   │   │   ├── base.py
│   │   │   ├── session.py
│   │   │   └── mixins.py
│   │   │
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── websocket/
│   │   │   └── manager.py
│   │   ├── enums/
│   │   └── main.py
│   │
│   ├── alembic/
│   └── alembic.ini
│
├── book-exchange-frontend/
│
└── README.md
```

### Structure Overview

- backend/app/api/  
  Contains all API route handlers, organized by feature modules such as authentication, books, exchanges, chat, reviews, and reporting.

- backend/app/core/  
  Core configuration and security logic including application settings and authentication utilities.

- backend/app/db/  
  Database configuration, session management, and shared mixins.

- backend/app/models/  
  SQLAlchemy models representing database tables.

- backend/app/schemas/  
  Pydantic schemas for request validation and response serialization.

- backend/app/websocket/  
  WebSocket connection manager for handling real-time communication.

- backend/app/enums/  
  Enumerations used across the application for consistent state management.

- backend/alembic/  
  Database migration scripts managed using Alembic.

- book-exchange-frontend/  
  Frontend application built using Next.js and TypeScript.

---

## Feature Breakdown

### Authentication

- JWT-based authentication for secure user sessions  
- User registration and login endpoints  
- Password handling with secure hashing mechanisms  
- Role-based access control for admin and standard users  

---

### Book Management

- Users can add, view, and delete book listings  
- Each book is associated with an owner  
- Book availability is tracked for exchange eligibility  
- Structured schema validation using Pydantic  

---

### Exchange System

- Users can request exchanges for available books  
- Book owners can accept or reject exchange requests  
- Exchange status tracking (e.g., pending, accepted, completed)  
- Backend logic ensures controlled state transitions  

---

### Real-Time Chat

- WebSocket-based communication system  
- Chat sessions are linked to specific exchanges  
- Enables real-time messaging between users during an active exchange  
- Managed using a centralized WebSocket connection manager  

---

### Report System

- Users can report issues or inappropriate behavior  
- Reports are stored and associated with users or exchanges  
- Provides a moderation layer for platform integrity  

---

### Review System (In Progress)

- Intended to allow users to rate and review each other  
- Aims to build trust and credibility within the platform  
- Schema and structure partially implemented  

---

### Backend Architecture

- Modular FastAPI design with separated API routes  
- Clear distinction between models, schemas, and business logic  
- Use of SQLAlchemy ORM for database interaction  
- Alembic for version-controlled database migrations  

---

## API Documentation

The backend exposes RESTful APIs for handling authentication, book management, exchanges, chat, reviews, and reporting.

---

### Authentication APIs

| Method | Endpoint        | Description              |
|--------|----------------|--------------------------|
| POST   | /auth/register | Register a new user      |
| POST   | /auth/login    | Authenticate user        |
| GET    | /auth/me       | Get current user details |

---

### Book APIs

| Method | Endpoint     | Description                |
|--------|-------------|----------------------------|
| POST   | /books      | Create a new book listing  |
| GET    | /books      | Get all available books    |
| GET    | /books/{id} | Get details of a book      |
| DELETE | /books/{id} | Delete a book              |

---

### Exchange APIs

| Method | Endpoint              | Description                     |
|--------|----------------------|---------------------------------|
| POST   | /exchanges           | Request a book exchange         |
| GET    | /exchanges           | Get user exchanges              |
| PATCH  | /exchanges/{id}      | Update exchange status          |
| GET    | /exchanges/{id}      | Get exchange details            |

---

### Chat APIs

| Method | Endpoint              | Description                     |
|--------|----------------------|---------------------------------|
| GET    | /chat/{exchange_id}  | Get chat history                |
| WS     | /ws/{exchange_id}    | WebSocket for real-time chat    |

---

### Review APIs

| Method | Endpoint        | Description                  |
|--------|----------------|------------------------------|
| POST   | /reviews       | Create a review              |
| GET    | /reviews/{id}  | Get reviews for a user       |

---

### Report APIs

| Method | Endpoint       | Description                   |
|--------|---------------|-------------------------------|
| POST   | /reports      | Submit a report               |
| GET    | /reports      | Get reports (admin use)       |

---

### Notes

- All protected routes require JWT authentication  
- WebSocket endpoints require an active exchange context  
- API responses follow a structured JSON format  

---

## Database Design

The application uses PostgreSQL as the primary database, with SQLAlchemy ORM for modeling and Alembic for schema migrations.

---

### Core Tables

- users  
  Stores user account information, authentication details, and roles.

- books  
  Represents books listed by users for exchange, including availability status.

- exchanges  
  Tracks exchange requests between users, including status and participants.

- exchange_books  
  Maps books involved in an exchange, enabling flexible exchange relationships.

- chat  
  Stores chat messages exchanged between users within an active exchange.

- reviews  
  Captures user feedback and ratings (partially implemented).

- reports  
  Stores user-submitted reports for moderation purposes.

---

### Relationships Overview

- A user can list multiple books  
- A book belongs to a single user (owner)  
- An exchange involves two users (requester and owner)  
- An exchange can involve one or more books  
- Messages are linked to a specific exchange  
- Reviews are associated with users  
- Reports can be linked to users or exchanges  

---

### Design Considerations

- Normalized schema to reduce redundancy  
- Clear foreign key relationships between entities  
- Use of enums for consistent state management (e.g., exchange status)  
- Timestamp mixins for tracking creation and updates  

---

### Migration Management

- Alembic is used for version-controlled database migrations  
- Migration scripts are stored in the `alembic/versions/` directory  
- Enables consistent schema evolution across environments  

---

## Exchange Flow

The exchange process is designed as a structured workflow to ensure clarity, control, and proper interaction between users.

---

### Step-by-Step Flow

1. Book Listing  
   A user lists a book for exchange, making it visible to other users on the platform.

2. Exchange Request  
   Another user browses available books and sends an exchange request for a selected book.

3. Request Evaluation  
   The book owner reviews the incoming request and decides to accept or reject it.

4. Exchange Status Update  
   - If accepted, the exchange status is updated accordingly  
   - If rejected, the request is closed  

5. Chat Activation  
   Once an exchange is accepted, a chat channel is enabled between the two users using WebSockets.

6. Real-Time Communication  
   Users communicate in real-time to coordinate the exchange (e.g., meeting details, conditions).

7. Exchange Completion  
   After the exchange is fulfilled, the status is marked as completed.

---

### Key Design Aspects

- Controlled State Transitions  
  Exchange status changes follow a defined lifecycle (e.g., pending → accepted → completed)

- User Interaction Layer  
  Real-time chat enhances coordination and usability

- Data Consistency  
  Backend logic ensures valid transitions and prevents inconsistent states

---

### Current Limitations

- No explicit offering-book selection during exchange requests  
- Limited validation for edge cases in exchange flow  
- No notification system for request updates  

---

## Current Limitations

While the platform implements core functionality, there are several areas that require further improvement to achieve production-level robustness.

- Exchange Offering Logic  
  The current exchange system does not support selecting or proposing a specific book in return during a request.

- Review System Incomplete  
  The review and rating system is partially implemented and not fully integrated into the user experience.

- No Notification System  
  Users are not notified in real-time for events such as exchange requests, status updates, or messages outside the chat session.

- Limited Validation in Exchange Flow  
  Certain edge cases and constraints in the exchange lifecycle are not fully enforced.

- Basic Authorization Controls  
  Role-based access exists but can be further refined for stricter permission handling.

- No Deployment Configuration  
  The application is not yet configured for production deployment (e.g., Docker, CI/CD, cloud hosting).

- UI/UX Enhancements Needed  
  Frontend usability and design can be further improved for a smoother user experience.

---

### Note

These limitations are actively being addressed as part of ongoing development and future enhancements.

---

## Future Improvements

The following enhancements are planned to evolve the platform into a more scalable and production-ready system:

- Advanced Exchange Mechanism  
  Introduce offering-book selection, enabling users to propose specific books during an exchange request.

- Review and Rating System  
  Complete integration of user reviews and ratings to build trust and credibility within the platform.

- Notification System  
  Implement real-time and asynchronous notifications for exchange updates, messages, and system events.

- Recommendation Engine  
  Introduce personalized book recommendations based on user activity and preferences.

- Cloud Deployment  
  Deploy the application using cloud infrastructure (e.g., AWS) with scalable services and managed databases.

- Containerization  
  Use Docker for consistent development and deployment environments.

- CI/CD Pipeline  
  Automate testing and deployment workflows using CI/CD tools.

- Performance Optimization  
  Improve query efficiency, caching strategies, and API response times.

- Enhanced Security  
  Strengthen authentication, authorization, and input validation mechanisms.

- UI/UX Improvements  
  Refine the frontend for a more intuitive and responsive user experience.

---

## Installation and Setup

Follow the steps below to run the application locally.

---

### Prerequisites

- Python 3.10+
- Node.js (v18 or later)
- PostgreSQL
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/sanheeth-singh/ExchangeBook-Platform.git
cd ExchangeBook-Platform
```
### 2. Backend Setup (FastAPI)
```bash
cd app
python -m venv .venv

Activate virtual environment:

Windows:
.venv\Scripts\activate


macOS/Linux:
source .venv/bin/activate


Install dependencies:
pip install -r requirements.txt
```

### 3. Environment Configuration
-Create a .env file in the backend directory:

```bash
DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/exchangebook
JWT_SECRET=your_secret_key

```

### 4. Database Setup

Run migrations:
```
alembic upgrade head
```

### 5. Run Backend Server
```
uvicorn app.main:app --reload
```

- Backend will run on: http://127.0.0.1:8000

### 6. Frontend Setup (Next.js)
```bash
cd ../book-exchange-frontend
npm install
npm run dev
```

- Frontend will run on: http://localhost:3000

### 7. Access the Application

Frontend: http://127.0.0.1:3000

Backend: http://127.0.0.1:8000

---

## Environment Variables

The application requires the following environment variables to be configured in a `.env` file.

| Variable        | Description                                      | Example                                                                 |
|----------------|--------------------------------------------------|-------------------------------------------------------------------------|
| DATABASE_URL   | PostgreSQL connection string                     | postgresql+asyncpg://user:password@localhost:5432/exchangebook          |
| JWT_SECRET     | Secret key used for JWT token generation         | your_secret_key                                                         |

---

### Notes

- Do not commit the `.env` file to version control  
- Use strong and unique values for sensitive variables  
- Ensure environment variables are properly configured before running the application  

---

## Deployment

The application is currently designed for local development. Production deployment is planned with a focus on scalability, reliability, and cloud-native practices.

---

### Planned Deployment Architecture

- Frontend  
  Deployed as a static or server-rendered application using modern hosting platforms.

- Backend  
  Containerized FastAPI application deployed on cloud infrastructure.

- Database  
  Managed PostgreSQL instance for reliability and scalability.

---

### Cloud Strategy

The platform is intended to be deployed using cloud services such as AWS, leveraging:

- Compute services for backend hosting  
- Managed database services for PostgreSQL  
- Object storage for future media handling  
- Networking and security configurations for controlled access  

---

### Future Enhancements

- Docker-based containerization for consistent environments  
- CI/CD pipeline for automated testing and deployment  
- Environment-based configurations for development, staging, and production  
- Monitoring and logging for performance and reliability  

---

### Status

Deployment is currently in progress and will be integrated in future updates.

---

## Author

Sanheeth Singh  
Computer Science Engineering Student  
Focused on Backend Development, Cloud Computing, and Scalable Systems  

- Linkedin: https://www.linkedin.com/in/sanheeth-singh

---


## Acknowledgements

This project was built as part of continuous learning in full-stack development, system design, and cloud-based application architecture.

---

