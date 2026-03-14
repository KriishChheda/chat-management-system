import React, { useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Symbol2 from '../assets/Symbol2.png';

const Navbar = ({ onOpenAuth, token, onLogout }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-green-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center">
              <img src={Symbol2} className="w-full"/>
              <Zap className="text-green-400 w-8 h-8" /> 
            </div>
            <span className="text-xl font-bold text-green-400 tracking-tighter">CogniScript</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-gray-300 hover:text-green-400 transition-colors">Home</button>
            <button onClick={() => scrollToSection('featuresSection')} className="text-gray-300 hover:text-green-400 transition-colors">Features</button>
            <button onClick={() => scrollToSection('howSection')} className="text-gray-300 hover:text-green-400 transition-colors">How it Works</button>
            
            {!token ? (
              <>
                <button onClick={onOpenAuth} className="text-gray-300 hover:text-green-400 transition-colors">Login</button>
                <button 
                  className="bg-gradient-to-r from-green-500 to-green-600 text-black px-6 py-2 rounded-lg font-semibold hover:from-green-400 hover:to-green-500 transition-all shadow-lg shadow-green-500/20" 
                  onClick={onOpenAuth}
                >
                  Get Started
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button onClick={() => navigate('/chat')} className="text-green-400 font-semibold hover:underline">Go to Chat</button>
                <button onClick={onLogout} className="text-red-400 hover:text-red-300 text-sm">Logout</button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-green-400 hover:text-green-300 focus:outline-none">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col space-y-4 pb-6 animate-in fade-in slide-in-from-top-4">
            <button onClick={() => scrollToSection('featuresSection')} className="text-left text-gray-300 hover:text-green-400 transition-colors">Features</button>
            <button onClick={() => scrollToSection('howSection')} className="text-left text-gray-300 hover:text-green-400 transition-colors">How it Works</button>
            {!token ? (
              <button onClick={onOpenAuth} className="bg-gradient-to-r from-green-500 to-green-600 text-black px-6 py-2 rounded-lg font-semibold">
                Get Started
              </button>
            ) : (
              <button onClick={onLogout} className="text-left text-red-400">Logout</button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;