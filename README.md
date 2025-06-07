# LocalTasker SaaS Platform

A cloud-based SaaS platform connecting local service providers (electricians, plumbers, painters, etc.) with customers who need their services.

## Features

- User authentication with role selection (Customer/Service Provider)
- OTP verification via email
- Multi-step provider profile creation
- Job request system
- Geospatial job matching
- Booking workflow
- Rating & review system

## Tech Stack

- **Frontend**: React, React Router, Axios, Formik, Yup, PrimeReact
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT, Bcrypt
- **File Storage**: AWS S3 (configured but commented out)
- **Email**: Nodemailer

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory: