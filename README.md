# JobTrackr — Frontend

A React frontend for JobTrackr, a full-stack job application tracker. Built with Vite, Tailwind CSS, and Recharts.

## Live Demo

🔗 [https://jobtraker.netlify.app/](https://jobtraker.netlify.app/)

> Backend API: [https://job-tracker-75n4.onrender.com/api/](https://job-tracker-75n4.onrender.com/api/)

---

## Features

- JWT-based authentication (register, login, logout with token blacklisting)
- Dashboard to add, view, filter, and delete job applications
- Filter applications by status — Applied, Interview, Offer, Rejected, Ghosted
- Search applications by company name in real time
- Stats page with Pie and Bar charts showing application breakdown
- Protected routes — redirects to login if not authenticated
- Auto-logout on token expiry (401 interceptor)

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| React Router DOM | Client-side routing |
| Axios | API requests |
| Tailwind CSS | Styling |
| Recharts | Charts on stats page |

---

## Project Structure

```
jobtrackr-frontend/
├── public/
├── src/
│   ├── api/
│   │   └── api.js           # Axios instance with JWT interceptors
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx    # Applications list, filter, search
│   │   └── Stats.jsx        # Pie + bar charts
│   └── App.jsx              # Routes + PrivateRoute guard
├── .env.local
├── .env.example
├── index.html
├── vite.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- The [JobTrackr backend](https://github.com/Mehedi-Hasan-18/job_tracker) running locally or deployed

### Installation

```bash
# Clone the repo
git clone https://github.com/Mehedi-Hasan-18/job_tracker_frontend
cd jobtrackr-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

Edit `.env.local`:
```env
VITE_API_URL=http://127.0.0.1:8000/api
```

```bash
# Start the dev server
npm run dev
```

App runs at `http://localhost:5173`

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the Django backend API | `http://127.0.0.1:8000/api` |

For production, set this to your deployed Render backend URL in the Vercel dashboard.

---

## Pages

### `/register`
Create a new account. On success, stores JWT tokens and redirects to dashboard.

### `/login`
Authenticate with username and password. Returns access + refresh tokens stored in `localStorage`.

### `/dashboard`
- View all your job applications in a table
- Add a new application with company, role, status, and date
- Filter by status using pill buttons
- Search by company name
- Delete any application

### `/stats`
- Pie chart showing breakdown of application statuses
- Bar chart with count per status
- Total application count

---

## API Integration

All requests go through `src/api/api.js`:

```js
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Attaches Bearer token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Auto-logout on 401
api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
```

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Add environment variable in Vercel dashboard:
```
VITE_API_URL = https://your-backend.onrender.com/api
```

Create `vercel.json` in project root for client-side routing:
```json
{
    "rewrites": [
        { "source": "/(.*)", "destination": "/" }
    ]
}
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

---

## Related

- [JobTrackr Backend](https://github.com/Mehedi-Hasan-18/job_tracker) — Django REST Framework API

---

## License

MIT
