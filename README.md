# Is This Job Real

A full-stack application to verify job listings.

## Project Structure

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```
PORT=3000
NODE_ENV=development
```

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd IsThisRealJob
   ```

2. **Install dependencies:**

   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Build the backend:**

   ```bash
   cd backend
   npm run build
   ```

4. **Start the application:**

   ```bash
   # Start both frontend and backend concurrently
   npm run dev
   ```

   - Frontend: [http://localhost:5173/](http://localhost:5173/)
   - Backend: [http://localhost:3000/](http://localhost:3000/)

## .gitignore

Ensure the following files and directories are ignored by Git:

```
# Dependencies
node_modules/

# Environment variables
.env

# Build output
dist/

# Logs
*.log

# OS files
.DS_Store
```

## License

MIT
