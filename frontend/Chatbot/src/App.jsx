import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Chatbot from './components/Chatbot';
import LandingPage from './components/LandingPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        {/* Landing Page Route */}
        <Route 
          path="/" 
          element={!token ? <LandingPage onLogin={handleLogin} /> : <Navigate to="/chat" />} 
        />

        {/* Protected Chatbot Route */}
        <Route 
          path="/chat" 
          element={
            token ? (
              <div className="relative">
                <button onClick={handleLogout} className="fixed top-4 right-4 z-[60] bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-3 py-1 rounded-md transition-all text-sm border border-red-600/50">
                  Logout
                </button>
                <Chatbot token={token} />
              </div>
            ) : (
              <Navigate to="/" />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;