# Library Book Management System

A React and Express application for managing library books, members, and borrowing records.

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on the Vite development server, usually at `http://localhost:5173`.

## Backend setup

```bash
cd backend
npm install
npm start
```

The backend starts on port `5000` by default.

## MongoDB setup

Install MongoDB locally or create a MongoDB Atlas database. Copy `.env.example` to `.env` and set the MongoDB connection string.

## Environment variables

- `MONGO_URI`: MongoDB Atlas connection string.
- `PORT`: Port for the Express backend.

The `.env` file is local-only and must not be committed.

## MongoDB API examples

Create a book with `POST http://localhost:5000/api/v1/mongo/books`:

```json
{
  "title": "Database Systems",
  "author": "Abraham Silberschatz",
  "category": "Technology",
  "isbn": "9780073523323"
}
```

Create a member with `POST http://localhost:5000/api/v1/mongo/members`:

```json
{
  "name": "Aarav Patel",
  "email": "aarav@example.com",
  "phone": "9876543210",
  "department": "Computer Engineering"
}
```

The schemas return a structured `400` JSON response for missing required fields or an invalid borrowing status.
