# 🤖 AI-Interview-Agent (InterviewIQ)

<p align="center">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
  <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white" alt="Redux" />
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</p>

An intelligent, interactive AI-powered mock interview platform that simulates real-world HR and Technical interviews. Upload your resume, and the AI will analyze it to tailor questions specifically for your background and the role you are applying for. The platform features real-time voice interactions, AI avatars, and comprehensive performance analytics to help you land your dream job!

## ✨ Key Features

- **📄 Smart Resume Parsing**: Upload your PDF resume, and the system uses AI (via OpenRouter & PDF.js) to extract your skills, experience, and projects to generate context-aware interview questions.
- **🎙️ Real-time Voice Interaction**: Experience a lifelike interview. The AI speaks questions aloud (Speech Synthesis), and you answer using your microphone (Speech Recognition).
- **🧑‍💼 Dynamic AI Avatars**: Visual male and female avatars that guide you through the interview process.
- **📊 Real-time Assessment & Feedback**: Your answers are immediately evaluated on metrics like **Correctness**, **Communication**, and **Confidence**.
- **📈 Comprehensive Interview Reports**: After the interview, view a detailed breakdown of your performance with actionable feedback and a final score.
- **🔐 User Authentication**: Secure JWT-based authentication system.
- **💳 Premium Credits System**: Integrated with **Razorpay** to allow users to purchase credits for extended interview sessions and advanced analytics.
- **💻 Modern Tech Stack**: Built with the robust MERN stack, Vite, Tailwind CSS, and Framer Motion for a stunning user experience.

---

## 🛠️ Tech Stack

### Client (Frontend)
- **Framework**: React 19 + Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS + Framer Motion
- **Voice Capabilities**: Web Speech API (Synthesis & Recognition)
- **Charts**: Recharts

### Server (Backend)
- **Environment**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **AI Integration**: OpenRouter API
- **File Handling**: Multer + PDF.js (for Resume parsing)
- **Payments**: Razorpay API
- **Security**: JWT & Cookie Parser

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### 1. Prerequisites
- [Node.js](https://nodejs.org/en/) installed
- A [MongoDB](https://www.mongodb.com/) cluster URI
- API Keys for [OpenRouter](https://openrouter.ai/) and [Razorpay](https://razorpay.com/)

### 2. Clone the Repository
```bash
git clone https://github.com/garvit369/AI-Interview-Agent.git
cd AI-Interview-Agent
```

### 3. Setup the Server (Backend)

Navigate to the `server` directory, install dependencies, and create a `.env` file.

```bash
cd server
npm install
```

Create a `.env` file in the `server` root with the following variables:
```env
PORT=6000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Start the backend development server:
```bash
npm run dev
```

### 4. Setup the Client (Frontend)

Open a new terminal, navigate to the `client` directory, and install dependencies.

```bash
cd client
npm install
```

Create a `.env` file in the `client` root with the following variable:
```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

> **Note:** The client currently connects to the production server by default. For local development, update `ServerUrl` in `client/src/App.jsx` to `http://localhost:6000`.

Start the frontend development server:
```bash
npm run dev
```

Your app should now be running locally at `http://localhost:5173`.

---

## 📂 Project Structure

```text
📦 AI-Interview-Agent
 ┣ 📂 client                 # Frontend React Application
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 assets             # Videos, Images, and CSS
 ┃ ┃ ┣ 📂 components         # Reusable UI components (Nav, Interview Steps, Timer)
 ┃ ┃ ┣ 📂 pages              # Main views (Home, Auth, Pricing, Reports)
 ┃ ┃ ┣ 📂 redux              # Redux slices (user state management)
 ┃ ┃ ┗ 📜 App.jsx            # Routing and core layout
 ┃ ┗ 📜 package.json
 ┣ 📂 server                 # Backend Express API
 ┃ ┣ 📂 config               # Database configuration
 ┃ ┣ 📂 controllers          # Logic for Auth, Interviews, Payments
 ┃ ┣ 📂 middlewares          # JWT validation and Multer (file upload)
 ┃ ┣ 📂 models               # Mongoose DB Schemas
 ┃ ┣ 📂 routes               # API endpoints
 ┃ ┣ 📂 services             # External APIs (OpenRouter, Razorpay)
 ┃ ┗ 📜 index.js             # Main server entry point
 ┗ 📜 README.md
```

## 📝 License

This project is open-source. Feel free to fork, modify, and submit pull requests!
