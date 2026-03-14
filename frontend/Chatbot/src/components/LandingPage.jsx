import React, { useState } from 'react';

const LandingPage = ({ onLogin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/login' : '/api/signup';
    const response = await fetch(`http://localhost:5002${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (response.ok) {
      if (isLogin) onLogin(data.token);
      else setIsLogin(true);
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <nav className="p-6 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-2xl font-bold text-blue-500">GeminiBot</h1>
        <div className="space-x-6">
          <a href="#about" className="hover:text-blue-400">About</a>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700">
            Login / Signup
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center p-10">
        <h2 className="text-5xl font-extrabold mb-4">Your Intelligence, Enhanced.</h2>
        <p className="text-gray-400 max-w-lg mb-8">Experience the next generation of AI chatting. Secure, private, and powered by Gemini.</p>
        <button onClick={() => setIsModalOpen(true)} className="bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-200">
          Get Started for Free
        </button>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        © 2026 GeminiBot AI. All rights reserved.
      </footer>

      {/* Auth Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-2xl w-96 relative border border-gray-700">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
            <h3 className="text-2xl font-bold mb-6">{isLogin ? 'Login' : 'Sign Up'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" placeholder="Username" required
                className="w-full bg-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
              <input 
                type="password" placeholder="Password" required
                className="w-full bg-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button className="w-full bg-blue-600 py-3 rounded-lg font-bold">{isLogin ? 'Login' : 'Create Account'}</button>
            </form>
            <p className="mt-4 text-sm text-gray-400">
              {isLogin ? "New here?" : "Already have an account?"}
              <span onClick={() => setIsLogin(!isLogin)} className="text-blue-400 cursor-pointer ml-1 hover:underline">
                {isLogin ? 'Create one' : 'Login instead'}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;