# IsThisRealJob - Job Posting Verification Tool

A modern web application that helps job seekers verify the authenticity of job postings using AI and real-time web intelligence.

## 🚀 Features

### Core Functionality
- **Real-Time Trust Scoring**: Instant analysis of job postings with a comprehensive trust score
- **Cross-Platform Verification**: Check job consistency across company career pages and job boards
- **Community Sentiment Analysis**: Aggregate insights from Reddit, Blind, and other platforms
- **Reposting Pattern Detection**: Track how often and where jobs are reposted
- **Red Flag Detection**: Automatic identification of common scam patterns

### Technical Features
- **Modern React Frontend**: Built with React and TypeScript
- **Responsive Design**: Glass-card UI that works beautifully on all devices
- **Real-time Analysis**: Powered by Perplexity Sonar API
- **Structured Data Validation**: Comprehensive validation and fallback systems

## 🛠️ Tech Stack

### Frontend
- React 18+
- TypeScript
- Tailwind CSS
- Lucide Icons
- React Router

### Backend Services
- Perplexity Sonar API for web intelligence
- Custom risk analysis engine
- Data enrichment services

## 🏗️ Project Structure

```
IsThisRealJob/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/     # Page components
│   │   ├── services/  # API and business logic
│   │   ├── types/     # TypeScript interfaces
│   │   └── utils/     # Helper functions
│   └── package.json
│
├── backend/           # Node.js backend application
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── middleware/
│   └── package.json
│
└── package.json      # Root package.json for running both services
```

## 🚦 Getting Started

### 1. Clone the repository:
```bash
git clone https://github.com/yourusername/IsThisRealJob.git
cd IsThisRealJob
```

### 2. Install Dependencies:

First, install backend dependencies:
```bash
cd backend
npm install
```

Then, install frontend dependencies:
```bash
cd ../frontend
npm install
```

Return to root directory:
```bash
cd ..
```

### 3. Set up environment variables:

In the backend directory:
```bash
cd backend
cp .env.example .env
# Add your API keys and configuration
```

In the frontend directory:
```bash
cd ../frontend
cp .env.example .env
# Add your frontend configuration
```

### 4. Start the development servers:

From the root directory:
```bash
npm run dev
```

This will start both the frontend and backend servers concurrently:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 🔄 Current Development Status

### Recently Completed
- ✅ Homepage redesign with trust score focus
- ✅ Mobile-responsive navigation
- ✅ About page with tech stack details
- ✅ Red flags detection system
- ✅ Basic job posting analysis

### In Progress
- 🏗️ Save job scans & history
- 🏗️ Company pattern detection
- 🏗️ Weekly ghost job alerts
- 🏗️ Browser extension

## 🔜 Roadmap

### Near Term
1. User accounts and saved searches
2. Enhanced company verification
3. Browser extension for instant analysis
4. Weekly job market reports

### Long Term
1. API access for developers
2. Integration with major job boards
3. Mobile app development

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
---

Built with ❤️ to make job searching more transparent
