# Event Planning Assistant

A comprehensive multi-language event planning application supporting weddings, birthdays, and company events with budget management, checklists, timelines, and document exports.

## Features

- **Multi-language Support**: English (EN), French (FR), and German (DE)
- **Event Types**: Weddings, Birthdays, Company Events
- **Budget Planner**: Track estimated vs actual costs with automatic calculations
- **Checklist Manager**: Pre-built templates with progress tracking
- **Timeline Creator**: Event schedules with responsible persons
- **Logistics Management**: Venue and supplier directories
- **Document Export**: PDF, Excel, and JSON formats
- **AI-Assisted Planning**: Optional AI suggestions for budgets and checklists
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

### Backend
- Node.js + TypeScript + Express
- PostgreSQL + Sequelize ORM
- JWT Authentication
- i18next for internationalization
- PDFKit for PDF generation
- ExcelJS for Excel export

### Frontend
- React + TypeScript
- Vite build tool
- React Router for navigation
- i18next for translations
- Axios for API communication
- Tailwind CSS for styling (or your preferred CSS framework)

### Infrastructure
- Docker + Docker Compose
- PostgreSQL database
- Nginx for frontend serving

## Project Structure

```
event-planner/
├── backend/
│   ├── src/
│   │   ├── config/         # Database and i18n configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth and error middleware
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   ├── locales/        # Backend translations (en, fr, de)
│   │   └── index.ts        # Entry point
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # Auth and Language contexts
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Helper functions
│   │   ├── locales/        # Frontend translations
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── shared/
│   └── types/              # Shared TypeScript types
├── docker-compose.yml
├── .env.example
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL 14+ (if running without Docker)

### Quick Start with Docker

1. Clone the repository:
```bash
cd c:\\Users\\mauri\\Desktop\\eventplaner\\event-planner
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration (especially JWT secrets in production)

4. Start all services:
```bash
docker-compose up --build
```

5. Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Health check: http://localhost:3000/health

### Development Setup (Without Docker)

#### Backend

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend directory with database credentials

4. Start development server:
```bash
npm run dev
```

Backend will run on http://localhost:3000

#### Frontend

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:3000/api
```

4. Start development server:
```bash
npm run dev
```

Frontend will run on http://localhost:5173

#### Database

1. Start PostgreSQL:
```bash
# Using Docker
docker run --name event-planner-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=event_planner -p 5432:5432 -d postgres:16-alpine
```

2. Database tables will be created automatically on first run

## API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "language": "en"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "language": "en"
  },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

### Events

#### Get All Events
```http
GET /api/events
Authorization: Bearer {token}
```

#### Create Event
```http
POST /api/events
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "My Wedding",
  "type": "wedding",
  "date": "2024-06-15T14:00:00Z",
  "guestCount": 100,
  "description": "Beautiful garden wedding"
}
```

### Budget

#### Get Budget Summary
```http
GET /api/events/:eventId/budget
Authorization: Bearer {token}
```

#### Create Budget Category
```http
POST /api/events/:eventId/budget/categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Venue",
  "order": 1
}
```

#### Create Budget Item
```http
POST /api/budget/categories/:categoryId/items
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Reception Hall",
  "estimatedCost": 5000,
  "actualCost": 4800,
  "notes": "Includes setup and cleanup"
}
```

### Checklist

#### Get Checklist
```http
GET /api/events/:eventId/checklist
Authorization: Bearer {token}
```

#### Generate Template
```http
POST /api/events/:eventId/checklist/template
Authorization: Bearer {token}
Accept-Language: en
```

### Exports

#### Export to PDF
```http
GET /api/events/:eventId/export/pdf?type=full
Authorization: Bearer {token}
Accept-Language: en
```

#### Export to Excel
```http
GET /api/events/:eventId/export/excel
Authorization: Bearer {token}
Accept-Language: en
```

## Multi-Language Support

The application supports three languages with full translations:

- **English (EN)**: Default language
- **French (FR)**: Complete French translations
- **German (DE)**: German translations using "ss" instead of "ß"

Users can switch languages at any time, and all UI elements, generated documents, and templates will be translated accordingly.

### Adding a New Language

1. Add language enum to `shared/types/index.ts`
2. Create locale file in `backend/src/locales/{lang}.json`
3. Create locale file in `frontend/src/locales/{lang}.json`
4. Update language selector in frontend

## Environment Variables

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=event_planner
DB_USER=postgres
DB_PASSWORD=postgres

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Optional: AI Service
OPENAI_API_KEY=your-api-key
AI_MODEL=gpt-4
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

### Production Build

1. Update environment variables for production
2. Build and deploy with Docker Compose:

```bash
docker-compose -f docker-compose.yml up --build -d
```

### Manual Deployment

#### Backend
```bash
cd backend
npm run build
npm start
```

#### Frontend
```bash
cd frontend
npm run build
# Serve dist/ directory with nginx or any static file server
```

## Security Considerations

1. **JWT Secrets**: Change default JWT secrets in production
2. **Database**: Use strong passwords and restrict access
3. **CORS**: Configure allowed origins properly
4. **HTTPS**: Always use HTTPS in production
5. **Environment Variables**: Never commit `.env` files
6. **SQL Injection**: Sequelize ORM provides protection
7. **XSS**: React provides built-in XSS protection

## Performance Optimization

1. Database indexes on frequently queried fields
2. Connection pooling configured in Sequelize
3. Frontend code splitting with React.lazy
4. PDF generation is async to prevent blocking
5. Pagination implemented for large datasets

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# View database logs
docker logs event-planner-db
```

### Backend Not Starting
```bash
# Check backend logs
docker logs event-planner-backend

# Verify environment variables
cat .env
```

### Frontend API Errors
- Verify `VITE_API_URL` is correct
- Check CORS configuration in backend
- Inspect browser console for errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Contact: support@eventplanner.com

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time collaboration
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Advanced AI features
- [ ] Guest RSVP portal
- [ ] Payment tracking
- [ ] Vendor reviews and ratings

---

Built with care for event planners worldwide.
#   E v e n t P l a n n e r  
 