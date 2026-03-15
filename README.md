# 🤖 Gemini AI Full-Stack Chatbot

A **modern full-stack AI chatbot application** powered by **Google Gemini 1.5 Flash**, featuring persistent conversation history, multi-session chat management, and real-time responses.

This project demonstrates how to build a **production-style AI chatbot** using a modern JavaScript stack with an intelligent backend and a responsive frontend interface.

---

# 🚀 Features

### 💬 Persistent Chat History

All conversations are stored in **MongoDB**, allowing users to revisit previous chats anytime.

### 📂 Multi-Session Chat

Users can:

- Create new chat sessions
- Switch between existing chats
- Delete conversations from the sidebar

### 🧠 Context-Aware AI

The assistant remembers previous messages in the current session, enabling **context-aware responses and intelligent follow-ups**.

### 📱 Responsive UI

A clean and modern interface built using **React and Tailwind CSS**, optimized for both desktop and mobile devices.

### ⚡ Real-Time Feedback

Typing indicators provide visual feedback while the AI is generating a response.

---

# 🛠️ Tech Stack

## Frontend

- React (Vite)
- Tailwind CSS
- Lucide React (Icons)
- Framer Motion (Animations)

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Google Generative AI SDK (Gemini API)

---

# 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js **v18 or higher**
- MongoDB (Local instance or MongoDB Atlas)
- Google AI Studio API Key

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

# 🖥 Backend Setup

Navigate to the backend folder:

```bash
cd backend
npm install
```

Create a **.env file** inside the backend directory.

Example:

```
PORT=5002
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
```

---

# 🎨 Frontend Setup

Navigate to the frontend folder:

```bash
cd ../frontend/Chatbot
npm install
```

---

# 🏃 Running the Application

You need **two terminal windows** running simultaneously.

### Terminal 1 — Start Backend

```bash
cd backend
npm start
```

### Terminal 2 — Start Frontend

```bash
cd frontend/Chatbot
npm run dev
```

---

# 🌐 Access the Application

Once both servers are running, open your browser and go to:

```
http://localhost:5173
```

---

# 📂 Project Structure

```
Chatbot/
│
├── backend/
│   ├── controllers/      # Handles AI logic and database operations
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   └── server.js         # Backend entry point
│
├── frontend/
│   └── Chatbot/
│       ├── src/
│       │   ├── components/   # Sidebar, Message UI, etc.
│       │   └── App.jsx       # Main application logic
│
└── README.md
```

---

# 🛡️ Security Note

⚠️ **Never commit your `.env` file to GitHub.**

Your `.env` file contains sensitive information such as:

- API keys
- Database credentials

This project already includes `.env` in `.gitignore` to prevent accidental uploads.

---

# 📌 Future Improvements

Possible enhancements for this project:

- Streaming AI responses
- User authentication
- Markdown support in chat messages
- File upload support
- Chat export feature
- Deployment (Docker / Cloud)

---

# 📄 License

This project is intended for **educational and development purposes**.

---

# 👨‍💻 Author

Developed as a full-stack AI chatbot project using the **Google Gemini API**.
