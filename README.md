# AI-Quizgenrate 🎓

**Turn learning materials into quizzes with AI.**

AI-Quizgenrate is an AI-powered quiz generation web application designed to help learners create practice quizzes from topics and study materials.

🌐 **Live Website:** [https://ai-quizgenrate-production.up.railway.app/](https://ai-quizgenrate-production.up.railway.app/)

📦 **GitHub Repository:** [https://github.com/HN411/AI-Quizgenrate](https://github.com/HN411/AI-Quizgenrate)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Live Demo](#-live-demo)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Run Locally](#-run-locally)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Security](#-security)
- [Limitations](#-limitations)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Overview

AI-Quizgenrate helps students and self-learners practice what they study by generating quizzes with the help of Google's Gemini AI.

Instead of manually writing every question, users can provide a topic or study material and use the application to generate a quiz for practice.

The project combines a React-based frontend with a Node.js backend to provide an interactive learning experience.

## ✨ Features

- **AI-powered quiz generation:** Generate quizzes using Google's Gemini AI.
- **Topic-based quizzes:** Create quizzes from a subject or topic.
- **Study-material support:** Generate quizzes from notes or supplied text, where supported by the application.
- **Interactive learning:** Answer generated questions through the web interface.
- **Quiz history:** Keep track of quizzes in the browser's local storage.
- **Responsive interface:** Use the application on supported desktop and mobile browsers.
- **Online access:** Use the deployed website without installing the project locally.

> Features depend on the current application implementation and successful access to the configured AI service.

## 🌐 Live Demo

Try the application here:

**[Open AI-Quizgenrate](https://ai-quizgenrate-production.up.railway.app/)**

The website is hosted on Railway.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Frontend development and production builds |
| Node.js | JavaScript runtime |
| Express | Backend API and web server |
| Google Gemini API | AI-powered quiz generation |
| Google Gen AI SDK | Communication with Gemini |
| Browser local storage | Local quiz-history persistence |
| Railway | Application hosting and deployment |
| Git and GitHub | Source control and project hosting |

## ⚙️ Getting Started

### Prerequisites

To run this project locally, install:

- [Node.js](https://nodejs.org/) — use a version compatible with the project's dependencies.
- npm — included with Node.js.
- [Git](https://git-scm.com/) — optional, for cloning the repository.
- A Google Gemini API key from [Google AI Studio](https://aistudio.google.com/).

### 1. Clone the repository

Open a terminal and run:

```bash
git clone https://github.com/HN411/AI-Quizgenrate.git
cd AI-Quizgenrate
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root, using `.env.example` as a reference if it is available.

Add your Gemini API configuration:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.8-flash
```

Replace `your_gemini_api_key_here` with your own API key.

The model shown above is the project's configured default. If it is unavailable to your Google AI project, select a supported model ID and configure it accordingly.

**Never commit your real `.env` file or API key to GitHub.**

### 4. Start the application

To start the frontend and backend together in development mode, run:

```bash
npm run dev:full
```

If this command is unavailable in your version of the project, inspect the scripts in `package.json` and follow the available development commands.

For production, build the frontend and start the server:

```bash
npm run build
npm start
```

The production server must be able to access the generated `dist` directory and the required environment variables.

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | API key used to access Google Gemini |
| `GEMINI_MODEL` | Gemini model ID used for quiz generation |
| `PORT` | Port supplied by the hosting platform, such as Railway |

Keep all secret values private. The production API key should be configured in Railway's service variables rather than hardcoded into frontend code.

## 🚢 Deployment

The live application is deployed on Railway.

### Deploy your own instance

1. Fork or clone the GitHub repository.
2. Create a project in [Railway](https://railway.com/).
3. Connect your GitHub repository.
4. Configure the required environment variables in the Railway service.
5. Build the application using:

   ```bash
   npm install && npm run build
   ```

6. Start the production server using:

   ```bash
   npm start
   ```

7. Generate a public domain in Railway's networking settings.
8. Open the domain and test quiz generation.

Check the Railway deployment logs if the build, server startup, or AI requests fail.

## 📁 Project Structure

The main project files are organized as follows:

```text
AI-Quizgenrate/
├── src/
│   ├── components/
│   ├── lib/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── server/
│   └── index.js
├── index.html
├── package.json
├── railway.json
├── vite.config.js
├── .env.example
├── .gitignore
└── README.md
```

The exact contents may vary as the project develops.

## 🔒 Security

- Store API keys in environment variables.
- Never publish `.env` files containing credentials.
- Keep `.env.example` limited to placeholder values.
- Do not expose private API keys in React components or browser-delivered JavaScript.
- Restrict and rotate API keys if they are accidentally exposed.
- Review API usage limits and billing before making the application available to many users.

## ⚠️ Limitations

- AI-generated questions may occasionally contain mistakes. Review answers and explanations before relying on them for important assessments.
- Quiz generation requires a valid Gemini API configuration and available API quota.
- Quiz history is stored locally in the browser in the current implementation; it is not automatically synchronized across devices.
- Cloud-based user accounts and synchronized history should not be assumed to be available unless implemented separately.
- Hosting and AI API usage may be subject to service limits and charges.

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your changes locally.
5. Submit a pull request with a clear description of the improvements.

For substantial changes, describe the problem being solved and include steps to reproduce any bug fixes.

## 📄 License

No license has been specified in this repository by this README.

Before distributing or accepting reuse of the code, choose an appropriate license and add a `LICENSE` file. Until a license is added, do not assume that the project is released under an open-source license.

---

**Built to make learning more interactive with AI.**

🌐 [Live Website](https://ai-quizgenrate-production.up.railway.app/) · 💻 [GitHub Repository](https://github.com/HN411/AI-Quizgenrate)
