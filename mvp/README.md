StockFlow – Inventory Management System

StockFlow is a web-based inventory management application that helps users manage products, monitor stock levels, and view inventory statistics. The application uses a React frontend and a Node.js backend with a MySQL database.

Features
User registration and login
JWT-based authentication
Product creation, editing, viewing, and deletion
Inventory quantity tracking
Low-stock monitoring
Dashboard with inventory statistics
Organization-based product management
Settings management
Technologies Used

Frontend

React
React Router
JavaScript
HTML and CSS
Vite

Backend

Node.js
Express.js
Sequelize ORM
MySQL
JSON Web Tokens (JWT)
bcrypt
Project Structure
text
mvp/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── AuthContext.jsx
│   │   └── api.js
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── app.js
│   └── package.json
└── README.md

Prerequisites

Install the following before running the application:

Node.js and npm
MySQL Server
A code editor such as Visual Studio Code
Postman (optional, for API testing)
Installation and Setup
1. Clone or download the project

Open a terminal in the project directory.

2. Install backend dependencies
bash
cd backend
npm install

3. Configure environment variables

Create a .env file in the backend directory and configure the values required by your application.

Example:

env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_database_name
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_secure_random_secret


Use the actual environment variable names expected by your backend code. Never commit real passwords or JWT secrets to GitHub.

4. Set up the database

Create your MySQL database and configure Sequelize to connect to it. Run the migrations or database setup scripts provided by the project.

5. Start the backend

From the backend directory, run the appropriate script from package.json, for example:

bash
npm run dev

6. Install and start the frontend

Open a second terminal:

bash
cd frontend
npm install
npm run dev


Open the local URL displayed by Vite in your browser.

API Overview

Example endpoints, depending on the routes configured in the backend:

Method	Endpoint	Purpose
POST	/api/auth/signup	Register a user
POST	/api/auth/login	Log in
GET	/api/dashboard	Retrieve dashboard statistics
GET	/api/products	List products
POST	/api/products	Create a product
PUT	/api/products/:id	Update a product
DELETE	/api/products/:id	Delete a product

Protected endpoints require a valid authentication token, typically sent using the Authorization: Bearer <token> header.

Verify the exact endpoint paths and methods against your Express route definitions.

Usage
Register an account or log in.
View inventory statistics on the dashboard.
Add products and enter their stock information.
Edit product details or delete products when needed.
Monitor low-stock items.
Update organization settings where available.
Security
Store secrets and database credentials in environment variables.
Do not commit .env files containing real credentials.
Protect private API routes with authentication middleware.
Validate user input on the backend.
Ensure users can access only the products and data belonging to their organization.
Future Improvements
Inventory transaction history
Stock movement reports
Product search and filtering
Export reports to CSV or PDF
Role-based access control
Automated testing
License

Specify the license for this project if you intend to distribute or publish it.