# Project Title: Booking system

## Overview

This **Booking System** is a web application designed for clinic appointment scheduling. It allows users to **book appointments**, **sign up** for accounts, and _track booking details_ or _dashboard based on roles_. The project uses a **React frontend, Node.js backend, PostgreSQL database**, and is deployed on **AWS**.

## Technologies Used

### **Frontend**

- React
- TypeScript
- Axios (for API calls)

### **Backend**

- Node.js (without a framework)
- PostgreSQL

### **CI/CD**

- GitHub Actions

### **Infrastructure**

- AWS (EC2, S3, CloudFront, CloudWatch)
- Terraform (Infrastructure as Code)

### **Environment Variables**

- .env files are used for local configurations.
- GitHub Secrets store sensitive data for CI/CD pipelines.

### **Testing**

- Jest _(planned for unit testing with 95%+ coverage)_

## Project Setup

### Prerequisites

Before running the project, ensure you have the following installed:

- Node.js (LTS version recommended)
- npm or Yarn (for managing dependencies)

## Running the Backend

1. Clone the repository:

```
git clone https://github.com/teresa2625/booking-system-backend.git
cd booking-system-backend
```

2. Install the dependencies:

```
yarn install
```

3. Start the backend server:

```
yarn start
```

This will start the backend server, and it will be running on http://localhost:5000 by default.

## Running the Frontend

Open a new terminal window and navigate to the frontend directory (if it's in a separate folder):

1. Clone the repository:

```
git clone https://github.com/teresa2625/booking-system-frontend.git
cd booking-system-frontend
```

2. Install the frontend dependencies:

```
yarn install
```

3. Start the frontend development server:

```
yarn start
```

This will run the frontend server, and it will be available at http://localhost:3000 by default.

Now, you can access the application by navigating to http://localhost:3000 in your browser. The frontend will interact with the backend to allow booking appointment and display dashboard.

## Features

### Implemented Features

- Home Page

  - Displays a summary of clinic sections.
  - Responsive design with user-friendly navigation.

- Appointment Booking

  - Users can book appointments by entering details such as name, contact info, date, and time.

- Sign Up & Login

  - Secure user registration with encrypted passwords.
  - Login generates a token stored in local storage, which includes role-based access.

- Frontend and Backend Integration

  - Seamless data flow between frontend and backend using Axios.

- Error Handling

  - Basic error handling for backend operations.

- CI/CD Pipelines

  - GitHub Actions pipelines for both development and production environments.

- Infrastructure as Code
  - Terraform manages AWS infrastructure:
    - S3 + CDN: Static website hosting
    - EC2: Backend deployment
    - CloudWatch: Logging
    - DynamoDB: Terraform state lock
    - S3: Terraform state storage

## User Guide

- Booking New Appointments

  1. Open the app: http://localhost:3000
  2. Navigate to the Book Appointment page.
  3. Fill in:
     - Name
     - Contact details
     - Preferred date and time
     - Submit the form.

- Sign Up / Login
  1. Open the app and go to the Login page.
  2. To Sign Up:
     - Click "Sign Up"
     - Enter your details
     - Submit the form
  3. To Log In:
     - Enter your registered email and password
     - Submit the form
     - Upon login, your access token will be saved to local storage.

## API Endpoints

| Method | Endpoint     | Description                      |
| ------ | ------------ | -------------------------------- |
| POST   | /auth/signup | Register a new user              |
| POST   | /auth/login  | Log in and retrieve access token |
| GET    | /bookings    | Retrieve all booking details     |
| POST   | /bookings    | Add a new booking                |

### Example Request to Add Bookings:

```
{
  "name": "First DoeLast",
  "phone": "123456789",
  "email": "FirstLast@example.com",
  "date": "2024 12 17",
  "time": "12:30"
}
```

### Example Request to Add Users:

```
{
  "userFirstName": "First",
  "userLastName": "Last",
  "password": "securepassword",
  "emailAdd": "FirstLast@example.com",
  "phoneNum": "123456789",
  "roles": "patient"
}

```

## Deployment

- Frontend: Hosted on AWS S3 + CloudFront.
- Backend: Deployed on AWS EC2.

## CI/CD Pipelines

- Development: Pipeline for testing and preview builds.
- Production: Pipeline for deployment to AWS.

## TODO: Upcoming Features

- Frontend Improvements:
  - Improve Sign up/Login workflow and pages
  - Build feature pages.
  - Role-based dashboards.
  - Add input validation and improved error handling.
  - Replace inline styles with reusable components and constants.
- Backend Enhancements:
  - Prevent double bookings.
  - Integrate booking details with the frontend dashboard.
  - Implement email notifications for booking confirmations.
- Testing:
  - Unit and integration tests for both frontend and backend (95%+ coverage).
- Infrastructure:
  - Clean up and optimize AWS policies.
  - Add a logging system for backend monitoring.

## TODO: Testing

### Running Tests

To run the tests for the backend/frontend, run the following command:

```
yarn test
```

### Coverage

Tests include:
