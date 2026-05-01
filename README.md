# DriveEase - Car Rental Platform

A full-stack MERN car rental application where users can list, browse, and book cars.

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Authentication**: JWT + bcryptjs

## Features

- User authentication (signup/login with JWT)
- Browse and filter cars by city and date range
- Date-based availability checking (prevents double-booking)
- Simulated payment system with transaction IDs
- Owner notifications for new bookings
- 5-star review and rating system
- Multiple image upload per car listing
- Owner garage management (post, toggle availability, delete)
- Renter booking history with cancel option

## Getting Started

### Prerequisites
- Node.js v14+
- MongoDB running locally

### Backend Setup
```bash
cd backend
npm install
# Create a .env file (see .env.example)
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create `backend/.env` based on `.env.example`:
```
PORT=5050
MONGODB_URI=mongodb://localhost:27017/car_rental_new
JWT_SECRET=your_secret_key
```

## Usage
- Frontend: http://localhost:5173
- Backend API: http://localhost:5050/api
