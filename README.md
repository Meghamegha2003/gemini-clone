 <p align="center">
  <img src="https://img.icons8.com/fluency/96/artificial-intelligence.png" width="72" alt="AI logo" />
</p>

<h1 align="center">Gemini AI Clone</h1>

<p align="center">
  <strong>A smarter way to explore ideas.</strong>
</p>

<p align="center">
  An AI-powered chat application built with React, Vite, and Google's Generative AI SDK, featuring conversational responses, image uploads, and a clean, modern interface.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Google_GenAI-8E75FF?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Google GenAI" />
</p>


---

## ✨ Features

- **AI Conversations** — Ask questions and receive AI-generated responses.
- **Image Uploads** — Select and preview images before sending them.
- **Image Understanding** — Ask questions about images when multimodal API requests are configured.
- **Streaming Responses** — Display generated responses progressively when supported by the configured API.
- **Markdown Rendering** — Format AI responses using the Marked library.
- **Chat History** — Maintain conversation history in browser storage if enabled.
- **Responsive Interface** — A clean chat layout with modern styling for different screen sizes.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Building reusable UI components |
| Vite | Development server and build tooling |
| JavaScript | Application logic |
| HTML5 | Page structure |
| CSS3 | Styling and responsive layouts |
| Google GenAI SDK | Connecting to Google's AI services |
| Marked | Rendering Markdown responses |
| Browser File API | Selecting and previewing images |
| Local Storage | Browser-side conversation persistence, if implemented |

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm
- A Google AI Studio API key

### 1. Clone the repository

```bash
git clone https://github.com/Meghamegha2003/gemini-clone.git
cd gemini-clone
```

### 2. Install dependencies

```bash
npm install
```

If the Google GenAI SDK is not already installed:

```bash
npm install @google/genai
```

Install the Markdown renderer if your project uses it:

```bash
npm install marked
```

### 3. Configure the API key

Get your API key from [Google AI Studio](https://aistudio.google.com/apikey).

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_google_ai_api_key
```

Replace the placeholder with your own API key.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL shown in your terminal.

### 5. Build the application

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 🧠 AI Integration

The application uses Google's GenAI SDK to communicate with a configured AI model.

### Initialize the SDK

```javascript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});
```

The model name and request method should match the Google GenAI API capabilities available to your project.

Depending on the implementation and model, the integration may support:

- Text generation and question answering
- Streaming responses
- Continuing conversations
- Multimodal requests for image analysis

For image analysis, the image must be included in the API request in the format supported by the selected model and API method. Displaying a local image preview alone does not send the image to the AI.

### API Documentation

- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API documentation](https://ai.google.dev/gemini-api/docs)
- [Google GenAI SDK on npm](https://www.npmjs.com/package/@google/genai)

## 🔐 Security

**Important:** Vite environment variables prefixed with `VITE_` are exposed to client-side code. This configuration is convenient for local development but does not protect the API key in a deployed frontend.

For production applications:

- Keep API keys in server-side environment variables.
- Route AI requests through a backend API.
- Never commit `.env` files or API keys to GitHub.
- Validate uploaded files and enforce appropriate size limits.
- Handle API errors and usage limits gracefully.

Add the following to your `.gitignore` if it is not already present:

```gitignore
.env
.env.*
!.env.example
```

## 📁 Project Structure

```text
gemini-clone/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   └── Main/
│   │       ├── Main.jsx
│   │       └── main.css
│   ├── context/
│   │   └── ContextApi.jsx
│   ├── config/
│   │   └── gemini.js
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .gitignore
├── index.html
├── package.json
└── README.md
```


## 📚 Documentation

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Google GenAI SDK](https://www.npmjs.com/package/@google/genai)
- [Marked](https://marked.js.org/)
- [Google Fonts](https://fonts.google.com/)

