# Real Estate Web Application

A full-stack real estate web application developed using React, NestJS, MongoDB, and Prisma.

## Table of Contents

1. [Introduction](#introduction)<br>
2. [Features](#Features)<br>
3. [Technologies Used](#TechnologiesUsed)<br>
4. [Getting Started](#GettingStarted)<br>
5. [Installation](#Installation)<br>
6. [Contributing](#Contributing)<br>
7. [Contact](#Contact)<br>

## <a name="introduction"> Introduction</a>

This project is a full-stack web application designed for real estate management. It provides a platform for users to browse properties, create listings, and manage their real estate needs. The application is built using React for the frontend, NestJS for the backend, MongoDB as the database, and Prisma as the ORM.

## <a name="Features"> Features<a/>

- Property Listings: Browse and search for properties with detailed descriptions and images.
- User Authentication: Secure login and registration functionality.
- Responsive Design: Optimized for both desktop and mobile devices.
- Real-time Updates: Live updates for property listings and user interactions.

## <a name="TechnologiesUsed">Technologies Used<a/>

## Frontend:

- React
- Redux (for state management)
- React Router (for navigation)
- Axios (for API calls)

## Backend:

- NestJS
- MongoDB
- Prisma (for database management)
- Passport.js (for authentication)

## <a name="GettingStarted"> Getting Started<a/>

### Prerequisites
Before you begin, ensure you have met the following requirements:

- Node.js (version 14.x or later)
- npm or yarn
- MongoDB (local or cloud instance)

## <a name="Installation"> Installation<a/>
### Clone the repository:

```bash
git clone https://github.com/AmilaWijesinghe/full-stack-estate.git
cd real-estate-web-app
```

### Install the dependencies:
```bash
# For backend
cd backend
npm install
```
```bash
# For frontend
cd frontend
npm install
```
### Set up environment variables:

Create a .env file in the backend directory and configure the following variables:

```bash
DATABASE_URL=mongodb://localhost:27017/realestate
JWT_SECRET=your_jwt_secret
```

### Run the application:

```bash
# Start the backend server
cd backend
npm run start
```
```bash
# Start the frontend server
cd frontend
npm start
```
### Access the application:

The application will be running at
- Frontend: http://localhost:5173
- Backend: http://localhost:8800


## <a name="Contributing"> Contributing<a/>
Contributions are welcome! Please follow these steps:

1. Fork the repository.<br>
2. Create a new branch (git checkout -b feature/your-feature-name).<br>
3. Make your changes.<br>
4. Commit your changes (git commit -m 'Add some feature').<br>
5. Push to the branch (git push origin feature/your-feature-name).<br>
6. Open a Pull Request.<br>

## <a name="Contact"> Contact<a/>
- GitHub: https://github.com/AmilaWijesinghe
