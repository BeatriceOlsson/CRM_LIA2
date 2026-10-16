# README CRM LIA2

A full-stack Customer Relationship Management (CRM) web application developed during my LIA 2 internship.
</br>
The primary feature of the application is allowing authenticated users to manage and share sales proposals with other users on the platform. Users can add companies to their client registry, manage user accounts, and track sales deals, with all records stored securely in a local Microsoft SQL Server (MSSQL) database.
</br>
All data is presented in structured views with dynamic filtering, enabling users to easily query, sort, and inspect records. The project was intentionally developed without relying on pre-built third-party service APIs for core features, placing strong emphasis on designing, normalizing, and managing a robust relational database from the ground up.
</br>

## Tech Stack

### Frontend

- React (v18+) – Component-based UI library
- Vite – Next-generation frontend tooling and rapid development server
- React Router DOM – Client-side routing and multi-page navigation
- Tailwind CSS – Utility-first CSS framework for modern, responsive UI design

### Backend

- Node.js – Server-side JavaScript runtime environment
- Express – Minimalist, robust web framework for building the REST API
- MSSQL (mssql) – Microsoft SQL Server driver and connection pool manager for Node.js
- Winston – Configurable logging framework for structured request and error tracking
- dotenv – Loads sensitive configuration from environment variables
- cors – Middleware for Cross-Origin Resource Sharing handling
- cookie-parser – Middleware to safely parse HTTP cookies

### Security & Authentication

- jsonwebtoken (JWT) – Stateless authentication and authorization via signed tokens
- bcrypt – Industry-standard cryptographic salt hashing for user passwords

## To instal the Project:

```
Clone the project.
  Git clone https://github.com/BeatriceOlsson/CRM_LIA2.git
  Cd GetAcceptLIA2026
Configurate to local DB.
  1.Create a local db in MSSQL.
  2.Create a .env file in backend-rot and configurate your db with db information:

  DB_USER= your_user_name
  DB_PASSWORD= your_password
  DB_SERVER=localhost
  DB_DATABASE= name-of-your_loclal_db

  Extern API-config
  API_URL= your_external_API_key

Start backend
  1.Open Terminal and go to the Backend file.

  Npm install
  Node server

Start frontend
  1.Open Terminal and go to Fronend file.

  Npm install
  Npm run dev

The application will now run on the localhhost with will be written in terminal.
```
