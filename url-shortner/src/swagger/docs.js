/**
 * @swagger
 * /api/v1/auth/google:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Initiates Google login authentication
 *     description: Redirects the user to Google OAuth for authentication.
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth.
 *     security:
 *       - BearerAuth: []
 */

/**
 * @swagger
 * /api/v1/auth/google/callback:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Callback after Google authentication
 *     description: Handles the Google OAuth callback and creates a session for the user.
 *     responses:
 *       200:
 *         description: Authentication successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Authentication successful.
 *                 token:
 *                   type: string
 *                   example: "JWT_TOKEN"
 *                 session:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 123
 *                     user_id:
 *                       type: integer
 *                       example: 123
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: Authentication failed.
 *       500:
 *         description: Internal server error.
 *     security:
 *       - BearerAuth: []
 */

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logs the user out by invalidating the session
 *     description: Logs the user out by invalidating their session and clearing the auth token.
 *     responses:
 *       200:
 *         description: Successfully logged out.
 *       400:
 *         description: No token provided.
 *       500:
 *         description: Internal server error.
 *     security:
 *       - BearerAuth: []
 */

/**
 * @swagger
 * /api/v1/url/shorten:
 *   post:
 *     tags:
 *       - URL
 *     summary: Shortens a URL and optionally allows custom alias
 *     description: Accepts a long URL and a custom alias (optional) to generate a shortened URL.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 example: "https://www.example.com/long-url"
 *               customAlias:
 *                 type: string
 *                 example: "example-alias"
 *               topic:
 *                 type: string
 *                 example: "technology"
 *     responses:
 *       201:
 *         description: Successfully created short URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Short URL created successfully."
 *                 shortUrl:
 *                   type: string
 *                   example: "http://example.com/example-alias"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-28T12:00:00Z"
 *       400:
 *         description: Invalid request
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Internal server error
 *     security:
 *       - BearerAuth: []
 */

/**
 * @swagger
 * /redirect/{alias}:
 *   get:
 *     tags:
 *       - URL
 *     summary: Redirects to the long URL associated with the short URL alias
 *     description: Redirects the user to the original long URL corresponding to the custom alias of the shortened URL.
 *     parameters:
 *       - name: alias
 *         in: path
 *         required: true
 *         description: The custom alias for the shortened URL.
 *         schema:
 *           type: string
 *           example: "example-alias"
 *     responses:
 *       302:
 *         description: Redirect to the long URL
 *       404:
 *         description: Short URL not found or expired
 *       500:
 *         description: Internal server error
 *     security:
 *       - BearerAuth: []
 */

/**
 * @swagger
 * /api/v1/analytic/{alias}:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get analytics for a specific shortened URL
 *     description: Fetches total clicks, unique clicks, clicks by date, and user agent data for a specific shortened URL.
 *     parameters:
 *       - name: alias
 *         in: path
 *         required: true
 *         description: The custom alias for the shortened URL.
 *         schema:
 *           type: string
 *           example: "example-alias"
 *     responses:
 *       200:
 *         description: Successfully fetched URL analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: integer
 *                   example: 150
 *                 uniqueClicks:
 *                   type: integer
 *                   example: 120
 *                 clicksByDate:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                 osType:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                 deviceType:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *       404:
 *         description: Short URL not found or expired
 *       500:
 *         description: Internal server error
 *     security:
 *       - BearerAuth: []
 */

/**
 * @swagger
 * /api/v1/analytic/topic/{topic}:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get analytics for all URLs under a specific topic
 *     description: Fetches total clicks, unique clicks, clicks by date, and individual URL analytics for a specific topic.
 *     parameters:
 *       - name: topic
 *         in: path
 *         required: true
 *         description: The topic for which to fetch analytics.
 *         schema:
 *           type: string
 *           example: "technology"
 *     responses:
 *       200:
 *         description: Successfully fetched topic analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: integer
 *                   example: 500
 *                 uniqueClicks:
 *                   type: integer
 *                   example: 450
 *                 clicksByDate:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                 urls:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       shortUrl:
 *                         type: string
 *                         example: "http://example.com/example-alias"
 *                       totalClicks:
 *                         type: integer
 *                         example: 150
 *                       uniqueClicks:
 *                         type: integer
 *                         example: 120
 *       404:
 *         description: No URLs found for the specified topic
 *       500:
 *         description: Internal server error
 *     security:
 *       - BearerAuth: []
 */

/**
 * @swagger
 * /api/v1/analytic/overall:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get overall analytics for the authenticated user
 *     description: Fetches total URLs, total clicks, unique clicks, clicks by date, and device/OS type analytics for the authenticated user's URLs.
 *     responses:
 *       200:
 *         description: Successfully fetched overall analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUrls:
 *                   type: integer
 *                   example: 5
 *                 totalClicks:
 *                   type: integer
 *                   example: 500
 *                 uniqueClicks:
 *                   type: integer
 *                   example: 450
 *                 clicksByDate:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                 osType:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                 deviceType:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *       404:
 *         description: No URLs found for the user
 *       500:
 *         description: Internal server error
 *     security:
 *       - BearerAuth: []
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
