# Angular Admin Dashboard

A modern admin dashboard built with Angular, featuring user authentication, protected routes, and a clean UI powered by Tailwind CSS.

## Features

- User Authentication (Login/Signup)
- Protected Routes with Guards
- JWT-based Authentication
- MongoDB Integration
- Responsive Design with Tailwind CSS
- Modern Angular Architecture (Standalone Components)

## Tech Stack

- **Frontend**: Angular 17
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Styling**: Tailwind CSS
- **Authentication**: JWT

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- Angular CLI (`npm install -g @angular/cli`)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/blingyplus/angular-admin-dashboard.git
cd angular-admin-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=4000
```

## Development

1. Start the backend server:
```bash
npm run build:server
npm run server
```

2. In a separate terminal, start the Angular development server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:4200`

## API Endpoints

- `POST /api/signup` - Register a new user
- `POST /api/login` - Authenticate a user
- `GET /api/profile` - Get user profile (requires authentication)

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/
│   │   ├── signup/
│   │   └── dashboard/
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── no-auth.guard.ts
│   ├── services/
│   │   └── auth.service.ts
│   └── app.routes.ts
├── styles.css
└── main.ts
```

## Authentication Flow

1. User signs up or logs in
2. JWT token is stored in localStorage
3. Protected routes check for valid token
4. Token is included in API requests
5. Server validates token for protected endpoints

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
