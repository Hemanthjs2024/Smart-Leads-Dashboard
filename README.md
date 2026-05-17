# Smart Leads Enterprise CRM

A production-ready CRM dashboard built with the MERN stack (MongoDB, Express, React, Node.js) and Vite. Features a robust backend API and a beautifully designed, responsive React frontend.

## Features

- **Authentication** — JWT-based secure login, registration, and role management.
- **Dashboard Overview** — Real-time sales intelligence and performance metrics with charts.
- **Lead Management** — Full CRUD, filtering, searching, sorting, and pagination.
- **RBAC** — Admin and Sales User roles with middleware-enforced API protection.
- **CSV Export** — Export filtered leads as a downloadable `.csv` file.
- **Dark Mode** — Persisted dark/light theme toggle.
- **Responsive Design** — Mobile-first architecture with sidebar navigation.
- **Dockerized** — Fully containerized for easy deployment and scaling.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, TailwindCSS v4, Zustand, React Hook Form, Zod, React Router v7 |
| **Backend** | Node.js 20, Express 5, TypeScript, MongoDB, Mongoose, JWT, bcryptjs, express-validator |
| **Infrastructure** | Docker, Docker Compose, NGINX |

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/)

### Running with Docker

```bash
# 1. Clone the repo
git clone <repository-url>
cd smart-leads

# 2. Build and run all services
docker-compose up --build
```

Services will be available at:

| Service | URL |
|---|---|
| Frontend | http://localhost |
| Backend API | http://localhost:5000 |
| MongoDB | localhost:27017 |

```bash
# Stop all services
docker-compose down
```

### Local Development (Without Docker)

**Backend:**
```bash
cd backend
npm install
cp .env.example .env   # Fill in your MONGO_URI and JWT_SECRET
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env`:

| Variable | Description | Default |
|---|---|---|
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/smart_leads` |
| `JWT_SECRET` | Secret key for JWT signing | *(required)* |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |
| `FRONTEND_URL` | Frontend URL for reset links | `http://localhost:5173` |

---

## API Documentation

All API responses follow a standard envelope:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "pagination": {}
}
```

Base URL: `http://localhost:5000/api/v1`

### Authentication

#### `POST /auth/register`

Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "Sales User"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Sales User",
    "token": "<jwt-token>"
  }
}
```

---

#### `POST /auth/login`

Log in an existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Sales User",
    "token": "<jwt-token>"
  }
}
```

---

#### `POST /auth/forgot-password`

Request a password reset link.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Password reset link sent to email",
  "data": null
}
```

---

#### `POST /auth/reset-password/:token`

Reset password using a token received via email.

**Request Body:**
```json
{
  "password": "newsecurepassword123"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Password reset successful. You can now log in.",
  "data": null
}
```

---

#### `POST /auth/change-password`

Change password for a logged-in user. *(Requires authentication)*

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newsecurepassword123"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": null
}
```

---

### Leads

> All lead endpoints require a valid JWT token in the `Authorization: Bearer <token>` header.

#### `GET /leads`

Fetch a paginated, filterable list of leads.

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `page` | number | Page number (default: `1`) |
| `limit` | number | Results per page (default: `10`) |
| `search` | string | Search by name or email |
| `status` | string | Filter by status: `New`, `Contacted`, `Qualified`, `Lost` |
| `source` | string | Filter by source: `Website`, `Instagram`, `Referral` |
| `sort` | string | Sort field with optional `-` prefix for descending (e.g. `-createdAt`, `name`) |

**Response `200`:**
```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": [ { "id": "...", "name": "...", "email": "...", "status": "New", "source": "Website", "createdAt": "..." } ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

#### `POST /leads`

Create a new lead. *(Requires authentication)*

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "status": "New",
  "source": "Referral"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": { "id": "...", "name": "Jane Smith", ... }
}
```

---

#### `GET /leads/:id`

Fetch a single lead by ID.

**Response `200`:** Returns the lead object. `404` if not found.

---

#### `PATCH /leads/:id`

Update a lead by ID. *(Requires authentication)*

**Request Body:** Any subset of `{ name, email, status, source }`.

**Response `200`:** Returns the updated lead object.

---

#### `DELETE /leads/:id`

Delete a lead by ID. *(Requires Admin role)*

**Response `200`:**
```json
{ "success": true, "message": "Lead deleted successfully", "data": null }
```

---

#### `POST /leads/bulk-delete`

Delete multiple leads at once. *(Requires Admin role)*

**Request Body:**
```json
{ "ids": ["<id1>", "<id2>"] }
```

**Response `200`:**
```json
{ "success": true, "message": "Successfully deleted 2 leads", "data": null }
```

---

#### `GET /leads/export`

Export filtered leads as a CSV file. Accepts the same query params as `GET /leads` (except `page` and `limit`).

**Response:** `text/csv` file download (`leads.csv`).

---

### Dashboard

#### `GET /dashboard/stats`

Get aggregate statistics for the dashboard. *(Requires authentication)*

**Response `200`:**
```json
{
  "success": true,
  "message": "Dashboard stats fetched",
  "data": {
    "totalLeads": 125,
    "statusBreakdown": {
      "New": 40,
      "Contacted": 35,
      "Qualified": 30,
      "Lost": 20
    },
    "recentLeads": [ { "id": "...", "name": "...", "status": "New", "createdAt": "..." } ]
  }
}
```

---

### Health Check

#### `GET /health`

Check if the API server is running.

**Response `200`:**
```json
{ "success": true, "message": "Server is healthy", "data": { "status": "ok", "timestamp": "..." } }
```

---

## RBAC — Role Permissions

| Action | Admin | Sales User |
|---|---|---|
| View leads | ✅ | ✅ |
| Create leads | ✅ | ✅ |
| Edit leads | ✅ | ✅ |
| Delete leads | ✅ | ❌ |
| Bulk delete | ✅ | ❌ |
| Export CSV | ✅ | ✅ |

---

## Production Deployment

The Docker setup is production-ready:

- The **frontend** uses a multi-stage build, serving static assets via lightweight NGINX.
- The **backend** compiles TypeScript to `dist/` and runs as a Node.js process.
- Ensure you set strong, secure environment variables (`JWT_SECRET`, `MONGO_URI`) before going live.
