**URL Shortener App**

A scalable URL shortener built with **Node.js**, **PostgreSQL**, **Redis**, and **Docker**. This app allows secure **Google OAuth 2.0 authentication**, **URL shortening**, **redirection**, and **detailed analytics tracking**. It uses **Redis** for caching to optimize performance and provides a simple, monolithic architecture for easy deployment and maintenance.

**Key Features:**

- **Secure Authentication:** Google OAuth 2.0 for user login.
- **URL Shortening:** Create short URLs with optional custom aliases.
- **URL Redirection:** Seamlessly redirect from short URLs to original long URLs.
- **Robust Analytics:** Track total clicks, unique clicks, and clicks by date.
- **Performance Optimization:** Redis caching for improved speed and responsiveness.
- **Data Persistence:** PostgreSQL database for storing URL data, user sessions, and analytics.
- **Containerization:** Docker for easy deployment and portability across environments.

**Technologies Used:**

- **Node.js:** Server-side runtime environment.
- **PostgreSQL:** Relational database for data storage.
- **Redis:** In-memory data store for caching.
- **Google OAuth 2.0:** Authentication and authorization framework.
- **Docker:** Containerization platform for efficient deployment.

**Installation & Setup:**

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/url-shortener-app.git
   cd url-shortener-app
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**
   Create a `.env` file with the following:

   ```
   DATABASE_URL=postgres://username:password@localhost:5432/yourdatabase
   REDIS_URL=redis://localhost:6379
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   JWT_SECRET=your-jwt-secret
   ```

   Replace placeholders with your actual credentials.

4. **Run Database Migrations:**

   ```bash
   npm run migrate
   ```

5. **(Optional) Docker Setup:**
   - **Build and Run:**
     ```bash
     docker-compose up --build
     ```

**Running the Application:**

1. **Start the Server:**
   ```bash
   npm start
   ```
   (Access it at `http://localhost:3000` or your configured port)

**Running Tests:**

```bash
npm test
```

**Docker Commands:**

- **Build:** `docker-compose build`
- **Run:** `docker-compose up`
- **Stop:** `docker-compose down`

**API Endpoints:**

- **Authentication:**
  - `/api/v1/auth/google`: Initiate Google OAuth flow.
  - `/api/v1/auth/google/callback`: OAuth callback.
  - `/api/v1/auth/logout`: Log the user out.
- **URL Shortening:**
  - `/api/v1/url/shorten`: Create a short URL.
  - `/redirect/{alias}`: Redirect from short URL.
- **Analytics:**
  - `/api/v1/analytic/{alias}`: Get analytics for a specific URL.
  - `/api/v1/analytic/topic/{topic}`: Get analytics for URLs under a topic.
  - `/api/v1/analytic/overall`: Get overall user analytics.

**Contributing:**

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make changes and commit (`git commit -am 'Add new feature'`).
4. Push to your branch (`git push origin feature-branch`).
5. Create a pull request.
