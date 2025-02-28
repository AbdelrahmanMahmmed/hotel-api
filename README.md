# Hotel API

## Overview

The Hotel API is a comprehensive backend service designed to manage hotel operations. It provides endpoints for user authentication, hotel management, room management, booking, and payment processing. The API is built using Node.js and Express, with MongoDB as the database. It also integrates with Cloudinary for image uploads and Stripe for payment processing.

## Features

- **User Authentication**: Register, login, and verify users.
- **Hotel Management**: Create, update, delete, and retrieve hotel information.
- **Room Management**: Manage rooms within hotels, including creating, updating, deleting, and retrieving room details.
- **Booking Management**: Handle room bookings, including creating, updating, and retrieving bookings.
- **Payment Processing**: Process payments for bookings and handle payment cancellations.
- **Analytics**: Retrieve payment analytics.

## Endpoints

| Endpoint | Method | Description | Roles |
|----------|--------|-------------|-------|
| `/api/v1/auth/register` | POST | Register a new user | Public |
| `/api/v1/auth/login` | POST | Login a user | Public |
| `/api/v1/auth/verify/user` | POST | Verify user | Public |
| `/api/v1/auth/verify/code` | POST | Verify code | Public |
| `/api/v1/auth/password/forgot-password` | POST | Forgot password | Public |
| `/api/v1/auth/password/verify-otp` | POST | Verify OTP | Public |
| `/api/v1/auth/password/reset` | POST | Reset password | Public |
| `/api/v1/user/profile` | GET | Get user profile | Customer |
| `/api/v1/user/profile` | DELETE | Delete user profile | Customer |
| `/api/v1/user/profile/upload-image` | POST | Upload profile image | Customer |
| `/api/v1/user/profile/update-name` | PUT | Update user name | Customer |
| `/api/v1/user/owner/all-users` | GET | Get all users (owner) | Owner |
| `/api/v1/user/manager/all-users` | GET | Get all users (manager) | Manager, Owner |
| `/api/v1/user/staff/profile` | GET | Get staff profile | Staff |
| `/api/v1/user/admin/create-user` | POST | Create a new user (admin) | Manager, Owner |
| `/api/v1/user/admin/update-role/:id` | PUT | Update user role (admin) | Manager, Owner |
| `/api/v1/user/admin/change-password` | PUT | Change user password (admin) | Manager, Owner |
| `/api/v1/user/admin/:id` | GET | Get user by ID (admin) | Manager, Owner |
| `/api/v1/user/admin/:id` | PUT | Update user by ID (admin) | Manager, Owner |
| `/api/v1/user/admin/:id` | DELETE | Delete user by ID (admin) | Manager, Owner |
| `/api/v1/user/staff/login` | POST | Staff login | Public |
| `/api/v1/hotel/owner/create` | POST | Create a new hotel (owner) | Owner |
| `/api/v1/hotel/owner/:id` | GET | Get hotel by ID (owner) | Owner |
| `/api/v1/hotel/owner/:id` | PUT | Update hotel by ID (owner) | Owner |
| `/api/v1/hotel/owner/:id` | DELETE | Delete hotel by ID (owner) | Owner |
| `/api/v1/hotel/owner` | GET | Get all hotels (owner) | Owner |
| `/api/v1/room/:id/checkout` | POST | Checkout room by ID | Customer |
| `/api/v1/room/owner/all` | GET | Get all rooms (owner) | Owner |
| `/api/v1/room/owner/:id` | GET | Get room by ID (owner) | Owner |
| `/api/v1/room/owner/:id` | PUT | Update room by ID (owner) | Owner |
| `/api/v1/room/owner/:id` | DELETE | Delete room by ID (owner) | Owner |
| `/api/v1/room/owner/create` | POST | Create a new room (owner) | Owner |
| `/api/v1/room/manager/create` | POST | Create a new room (manager) | Manager |
| `/api/v1/room/manager/all` | GET | Get all rooms (manager) | Manager |
| `/api/v1/room/manager/status` | GET | Get room status (manager) | Manager |
| `/api/v1/room/manager/:id` | GET | Get room by ID (manager) | Manager |
| `/api/v1/room/manager/:id` | PUT | Update room by ID (manager) | Manager |
| `/api/v1/room/manager/:id` | DELETE | Delete room by ID (manager) | Manager |
| `/api/v1/room/receptionist/:id` | PATCH | Update room by ID (receptionist) | Receptionist |
| `/api/v1/room/receptionist/:id/status` | PATCH | Update room status by ID (receptionist) | Receptionist |
| `/api/v1/room/receptionist/:id/description` | PATCH | Update room description by ID (receptionist) | Receptionist |
| `/api/v1/room/receptionist/:id/discount` | PATCH | Update room discount by ID (receptionist) | Receptionist |
| `/api/v1/room/receptionist/:id/amenities` | PATCH | Update room amenities by ID (receptionist) | Receptionist |
| `/api/v1/room/cleaner/:id/availability` | PATCH | Update room availability by ID (cleaner) | Cleaner |
| `/api/v1/room/cleaner/without-availability` | GET | Get rooms without availability (cleaner) | Cleaner |
| `/api/v1/booking` | POST | Create a new booking | Customer |
| `/api/v1/booking` | GET | Get all bookings | Manager, Receptionist |
| `/api/v1/booking/:id` | PUT | Update booking by ID | Customer |
| `/api/v1/booking/:id` | GET | Get booking by ID | Manager, Receptionist |
| `/api/v1/booking/owner/all` | GET | Get all bookings (owner) | Owner |
| `/api/v1/payment/checkout` | POST | Checkout payment | Customer |
| `/api/v1/payment/request-cancellation` | POST | Request payment cancellation | Customer |
| `/api/v1/payment/owner/payments` | GET | Get all payments (owner) | Owner |
| `/api/v1/payment/staff/payments` | GET | Get all payments (staff) | Manager, Receptionist |
| `/api/v1/analysis/totalAmount` | GET | Get total amount analysis | Owner |



## Usage

1. **Clone the repository**:
    ```sh
    git clone [https://github.com/your-repo/hotel-api.git](https://github.com/AbdelrahmanMahmmed/hotel-api)
    cd hotel-api
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Set up environment variables**:
    Create a `.env` file in the root directory and add the following:
    ```env
    MONGO_URI=your_mongo_uri
    JWT_SECRET_KEY=your_jwt_secret_key
    JWT_EXPIRES_TIME=your_jwt_expiry_time
    COOKIE_EXPIRES_TIME=your_cookie_expiry_time
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    STRIPE_SECRET_KEY=your_stripe_secret_key
    AUTH_HAST_SEND_EMAIL=your_email_host
    AUTH_PORT_SEND_EMAIL=your_email_port
    AUTH_USER_SEND_EMAIL=your_email_user
    AUTH_PASSWORD_SEND_EMAIL=your_email_password
    ```

4. **Run the application**:
    ```sh
    npm run dev
    ```

5. **Access the API**:
    The API will be available at `http://localhost:5000`.

## Conclusion

The Hotel API provides a robust backend service for managing hotel operations, including user authentication, hotel and room management, booking, and payment processing. The API is designed to be scalable and secure, making it suitable for production environments.
