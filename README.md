# URL Shortener App

A scalable URL shortener built with **Node.js**, **PostgreSQL**, **Redis**, and **Docker**. This app allows secure **Google OAuth 2.0 authentication**, **URL shortening**, **redirection**, and **detailed analytics tracking**. It uses **Redis** for caching to optimize performance and provides a simple, monolithic architecture for easy deployment and maintenance.

## Features

- **Google OAuth 2.0 authentication** for secure login.
- **URL shortening** with optional custom aliases.
- **URL redirection** from short URLs to original long URLs.
- **Analytics** for tracking total clicks, unique clicks, and clicks by date.
- **Redis caching** for improved performance.
- **PostgreSQL database** to store URL data and user sessions.

## Technologies

- **Node.js** for the server-side logic.
- **PostgreSQL** for database management.
- **Redis** for caching.
- **Google OAuth 2.0** for user authentication.
- **Docker** for easy deployment and containerization.

## Requirements

- **Node.js** (version 14 or above)
- **PostgreSQL** database instance
- **Redis** server
- **Docker** (optional, for containerized setup)

## Installation

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/yourusername/url-shortener-app.git
cd url-shortener-app
```

````

### 2. Install Dependencies

Run the following command to install the required npm packages:

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory of the project and set up the following environment variables:

```bash
DATABASE_URL=postgres://username:password@localhost:5432/yourdatabase
REDIS_URL=redis://localhost:6379
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=your-jwt-secret
```

Make sure to replace the placeholders with your actual credentials.

### 4. Run Migrations (PostgreSQL)

Run the database migrations to set up the necessary tables in PostgreSQL:

```bash
npm run migrate
```

### 5. Docker Setup (Optional)

If you want to run the app with Docker, you can use the following commands:

Build and run the containers:

```bash
docker-compose up --build
```

This will start the Node.js server, PostgreSQL, and Redis inside Docker containers.

## Running the Application

To start the application locally, run the following command:

```bash
npm start
```

This will start the server on the default port (usually `http://localhost:3000`). You can change the port by setting the `PORT` environment variable in the `.env` file.

## Running Tests

The app uses a testing framework for unit and integration tests. To run the tests, use the following command:

```bash
npm test
```

This will run all the tests defined in the `tests` folder.

## API Endpoints

### Authentication

- **GET** `/api/v1/auth/google`: Initiates Google OAuth authentication.
- **GET** `/api/v1/auth/google/callback`: Callback for Google OAuth authentication.
- **POST** `/api/v1/auth/logout`: Logs the user out by invalidating the session.

### URL Shortening

- **POST** `/api/v1/url/shorten`: Shortens a URL and optionally allows custom alias.
- **GET** `/redirect/{alias}`: Redirects to the long URL associated with the custom alias.

### Analytics

- **GET** `/api/v1/analytic/{alias}`: Get analytics for a specific shortened URL.
- **GET** `/api/v1/analytic/topic/{topic}`: Get analytics for all URLs under a specific topic.
- **GET** `/api/v1/analytic/overall`: Get overall analytics for the authenticated user.

## Docker Commands

If you are using Docker, you can use these commands to manage your containers:

- **Build the app with Docker**:
  ```bash
  docker-compose build
  ```
- **Run the app with Docker**:
  ```bash
  docker-compose up
  ```
- **Stop the Docker containers**:
  ```bash
  docker-compose down
  ```

## Troubleshooting

### Issues with Redis or PostgreSQL

Ensure that both Redis and PostgreSQL are running correctly. You can check the logs for any errors and ensure the connection strings are properly configured.

### Google OAuth Authentication Issues

Verify that the **Google Client ID** and **Client Secret** are correctly set up in the `.env` file and that they match the credentials in your Google Developer Console project.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.
````
