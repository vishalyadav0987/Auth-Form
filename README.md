# Auth-Form

In the MERN stack authentication system, users can verify their email addresses and reset passwords through email-based processes. Upon registration, users receive a verification code to confirm their email address. If users forget their passwords, they can request a password reset link sent to their email, allowing them to securely create a new password.

## Features

- **Email Verification**: Users receive a verification code via email to confirm their email address upon registration.
- **Password Reset**: Users can request a password reset link sent to their email to securely create a new password if they forget their current one.
- **Secure Authentication**: Utilizes JWT for secure authentication and authorization.
- **Token Management**: Manages authentication tokens using cookies for persistent user sessions.
- **Error Handling**: Provides informative error messages for invalid verification codes, expired links, and other authentication issues.
- **User Management**: Allows users to update their email and password, and handles account recovery.

## Tech Stack

- **Frontend**: Vite React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Deployment**: Render

## Getting Started

### Prerequisites

- Node.js
- MongoDB

---

### Installation

1. **Clone the repository**

    ``` bash
    git clone https://github.com/vishalyadav0987/Auth-Form.git
    cd Auth-Form
    ```

2. **Install backend dependencies**:
    ``` bash
    cd ..
    npm install
    ```
3. **Install frontend dependencies**:
    ```bash
    cd frontend
    npm install
    ```
4. **Start the development servers**:
    - Backend server:
      ```bash
      cd ../backend
      npm start
      ```
    - Frontend server:
      ```bash
      cd ../frontend
      npm run dev
      ```
---

## Set up environment variables

- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret
- MAILTRAP_ENDPOINT=https://send.api.mailtrap.io/
- MAILTRAP_TOKEN=MAILTRAP_TOKEN
- JWT_COOKIE_EXPIRE=JWT_COOKIE_EXPIRE
- FRONTEND_URL=https://auth-form-aonu.onrender.com


## Aplication online

- **Auth-Form**: <a href="https://auth-form-aonu.onrender.com" _blank >Click here Live Application.</a>



## Deployment
This application is deployed on Render. To deploy your own version:

1. Create a new web service on Render and connect your GitHub repository.
2. Add the necessary environment variables in the Render dashboard.
3. Deploy the application.

## Acknowledgements
- MongoDB
- Express.js
- React
- Node.js
- Render

## Contact
If you have any questions or suggestions, feel free to open an issue or contact me at viahalyadav0987@gmail.com.
