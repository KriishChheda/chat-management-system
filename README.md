Gemini AI Full-Stack Chatbot
A modern, full-stack AI chatbot application featuring persistent conversation history, multi-session management, and real-time responses powered by Google's Gemini 1.5 Flash model.

🚀 Features
Persistent Chat History: Conversations are stored in MongoDB, allowing you to return to them later.

Multi-Session Support: Create new chats, switch between previous sessions via the sidebar, and delete specific conversations.

AI Context Awareness: The assistant remembers the context of the current conversation for intelligent follow-ups.

Responsive UI: A sleek, mobile-friendly interface built with React and Tailwind CSS.

Real-time Typing Indicators: Visual feedback while the AI generates a response.

🛠️ Tech Stack
Frontend:

React (Vite)

Tailwind CSS

Lucide React (Icons)

Framer Motion (Animations)

Backend:

Node.js & Express

MongoDB & Mongoose

Google Generative AI SDK (Gemini API)

📋 Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v18 or higher)

MongoDB (Local or Atlas)

A Google AI Studio API Key

⚙️ Installation & Setup

1. Clone the Repository

Bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name 2. Backend Setup

Bash
cd backend
npm install
Create a .env file in the backend folder:

Code snippet
PORT=5002
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_actual_api_key_here 3. Frontend Setup

Bash
cd ../frontend/Chatbot
npm install
🏃‍♂️ Running the Application
You will need two terminal windows open:

Terminal 1 (Backend):

Bash
cd backend
npm start
Terminal 2 (Frontend):

Bash
cd frontend/Chatbot
npm run dev
The app should now be running at http://localhost:5173.

📂 Project Structure
Plaintext
Chatbot/
├── backend/
│ ├── controllers/ # Request logic (Gemini & DB)
│ ├── models/ # MongoDB schemas
│ ├── routes/ # API Endpoints
│ └── server.js # Entry point
├── frontend/
│ └── Chatbot/
│ ├── src/
│ │ ├── components/ # UI Components (Sidebar, Message, etc.)
│ │ └── App.jsx # Main logic
└── README.md # You are here!
🛡️ Security Note
Important: Never commit your .env file to GitHub. It is already included in the .gitignore to protect your API keys.
