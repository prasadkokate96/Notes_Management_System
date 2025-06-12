# Notes Management System Backend

A RESTful API for managing notes with user authentication.

## Setup

1. Clone the repository
2. Navigate to the backend directory: `cd Backend`
3. Install dependencies: `npm install`
4. Configure your database in `.env` file
5. Run the server: `npm run dev`

## Environment Variables

Create a `.env` file with the following variables:

```
PORT=8080
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=notes_management_db
JWT_SECRET=your_jwt_secret_key
```

## API Endpoints

### Authentication

- **Register**: `POST /api/auth/register`
  - Body: `{ "username": "user", "email": "user@example.com", "password": "password" }`

- **Login**: `POST /api/auth/login`
  - Body: `{ "email": "user@example.com", "password": "password" }`

- **Get Profile**: `GET /api/auth/profile`
  - Headers: `Authorization: Bearer {token}`

### Notes

- **Get All Notes**: `GET /api/notes`
  - Headers: `Authorization: Bearer {token}`

- **Get Note by ID**: `GET /api/notes/:id`
  - Headers: `Authorization: Bearer {token}`

- **Create Note**: `POST /api/notes`
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ "title": "Note Title", "content": "Note Content", "category": "Work" }`

- **Update Note**: `PUT /api/notes/:id`
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ "title": "Updated Title", "content": "Updated Content", "category": "Personal" }`

- **Delete Note**: `DELETE /api/notes/:id`
  - Headers: `Authorization: Bearer {token}`

## Database Models

### User
- username: string (unique)
- email: string (unique)
- password: string (hashed)

### Note
- title: string
- content: text
- category: string
- userId: integer (foreign key)