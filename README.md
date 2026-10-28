# QuizCraft AI

QuizCraft AI is an AI-powered quiz generation platform that helps users create quizzes on different subjects and topics. It uses Google's Gemini API to generate questions, multiple-choice answers, correct answers, and explanations.

Users can enter a topic or provide their own notes to generate quizzes tailored to their learning needs.

## Features

- Generate quizzes from any topic.
- Create quizzes from custom notes and text.
- Choose the number of questions and difficulty level.
- Generate multiple-choice questions with answer explanations.
- Research topics using Google Search grounding when available.
- Review previous quizzes stored in the browser.
- Track quiz results and review answers.
- Responsive interface for desktop and mobile devices.

## Tech Stack

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express
- **AI Integration:** Google Gemini API
- **Deployment:** Railway

## Requirements

Before running the project, make sure you have:

- Node.js 20 or later
- npm
- A Google Gemini API key
- A Railway account for deployment

## Installation

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
cd quizcraft-ai
```

Install the dependencies:

```bash
npm install
```


## Run Locally

Start the development environment:

```bash
npm run dev:full
```

Open the local URL displayed in your terminal.

## Production Build

Build the frontend:

```bash
npm run build
```

Start the application:

```bash
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Checks server status and API configuration |
| POST | `/api/generate-quiz` | Generates a quiz using the Gemini API |

### Generate a Quiz

Send a POST request to `/api/generate-quiz` with a JSON body containing the topic, question count, difficulty, and any optional notes.

Example:

```json
{
  "topic": "Photosynthesis",
  "count": 5,
  "difficulty": "medium",
  "notes": ""
}
```

The API returns the generated quiz in JSON format. The exact response structure is defined by the backend.

## Deployment on Railway

1. Push the project to a GitHub repository.
2. Sign in to [Railway](https://railway.com/).
3. Create a new project and deploy from your GitHub repository.
4. Add `GEMINI_API_KEY` and `GEMINI_MODEL` in the service's environment variables.
5. Deploy the application and check the deployment logs.
6. Generate a public domain under the service's networking settings.

After deployment, open your public domain and test quiz generation.

Check the health endpoint:

```text
https://YOUR-RAILWAY-DOMAIN/api/health
```

Replace `YOUR-RAILWAY-DOMAIN` with your actual Railway domain.

## Project Structure

```text
quizcraft-ai/
├── server/
│   └── index.js
├── src/
│   ├── components/
│   ├── lib/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
├── vite.config.js
├── railway.json
├── .env.example
└── README.md
```

## Data and Privacy

Quiz history and related local preferences are stored in the user's browser. Clearing browser data may remove this information. History is not automatically synchronized across devices.

The Gemini API key must remain on the server and should be configured through environment variables. Avoid submitting private or confidential information in quiz notes.

## License

Add a license to this repository if you intend to distribute the project publicly.
