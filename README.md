# URL Shortener App
 
## Overview
This URL shortener allows you to create shortened versions of long URLs, making them easier to share and track. The application consists of:
- A client-side frontend built with Vite
- A server-side backend using Node.js
- SQLite database for data storage 

## Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation
### 1. Clone the Repository
 ssh: `git@github.com:safenest-dev/Ascribe-test.git`
 
 https: `https://github.com/safenest-dev/Ascribe-test.git`

### Client Setup
1. Navigate to the client directory: 
   ```bash
   cd client
   ```
2. Install dependencies: 
   ```bash
   npm install
   ```
3. Create environment file:
   - Create a .env file in the client directory
   - Add the following variable: 
     ```
     VITE_API_URL=http://localhost:5000
     ```
     *Note: Replace 5000 with your server port number if different*
4. Start the client application: 
   ```bash
   npm run dev
   ```

### Server Setup
1. Navigate to the server directory: 
   ```bash
   cd server
   ```
2. Install dependencies: 
   ```bash
   npm install
   ```
3. Start the server: 
   ```bash
   node index.js
   ```

*Important: Make sure the port specified in your server matches the port in the client's .env file.*

## Usage
1. Open your browser and navigate to the client application (port specified by Vite)
2. Enter a long URL in the input field
3. Click "Shorten URL"
4. Copy and share your shortened URL

## Technologies
- **Frontend**: 
  - Vite (React build tool)
  - React.js
  - Axios for HTTP requests
  - Vitest, React Testing Library (testing)
- **Backend**:
  - Node.js
  - Express.js
  - SQLite for database storage

## Why SQLite?
This project uses SQLite for data storage due to its simplicity and ease of setup. SQLite is a self-contained, serverless database that requires minimal configuration, making it perfect for demonstrations and small to medium-sized applications.
