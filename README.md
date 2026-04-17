# JobTrackr

A full-stack job application tracker built with Django REST Framework and React.

## Live Demo
- Frontend: https://jobtrackr.vercel.app
- Backend API: https://jobtrackr.onrender.com/api

## Features
- JWT authentication (register, login, logout)
- Track job applications with status management
- Auto-ghost applications after 30 days of inactivity
- Email reminders via Celery + Upstash Redis
- Stats dashboard with pie and bar charts
- REST API with filtering and search

## Tech Stack
**Backend:** Django, Django REST Framework, PostgreSQL (Neon), Celery, Redis (Upstash)
**Frontend:** React, Vite, Axios, Recharts, Tailwind CSS
**Deployment:** Render (backend), Vercel (frontend)

## Local Setup

### Backend
```bash
git clone https://github.com/yourname/jobtrackr.git
cd jobtrackr
pip install -r requirements.txt
cp .env.example .env  # fill in your values
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd jobtrackr-frontend
npm install
cp .env.example .env.local  # fill in your values
npm run dev
```

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register/ | Register new user |
| POST | /api/auth/login/ | Login, returns JWT |
| POST | /api/auth/logout/ | Blacklist refresh token |
| GET | /api/applications/ | List all applications |
| POST | /api/applications/ | Create application |
| PATCH | /api/applications/:id/ | Update application |
| DELETE | /api/applications/:id/ | Delete application |
| GET | /api/applications/stats/ | Get status counts |