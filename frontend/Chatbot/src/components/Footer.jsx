import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, Github, Twitter, Linkedin } from 'lucide-react';
// Import your Symbol2 if it's in assets
// import Symbol2 from '../assets/Symbol2.png'; 

const Footer = () => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/'); // Redirect to home if on another page
    }
  };

  return (
    <footer className="relative z-10 bg-gray-900 border-t border-green-500/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div 
              className="flex items-center space-x-3 mb-6 cursor-pointer group" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden bg-green-500/10 group-hover:bg-green-500/20 transition-all">
                {/* Use Symbol2 image here if available, otherwise icon as fallback */}
                <Zap className="text-green-400 w-8 h-8" />
              </div>
              <span className="text-2xl font-extrabold text-green-400 tracking-tighter">
                CogniScript
              </span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              Empowering users to unlock insights from any file format using cutting-edge 
              RAG technology and Generative AI. Transform your data into intelligence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-gray-400">
              <li>
                <button onClick={() => scrollToSection('featuresSection')} className="hover:text-green-400 transition-colors">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('howSection')} className="hover:text-green-400 transition-colors">
                  How it Works
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('formatsSection')} className="hover:text-green-400 transition-colors">
                  Supported Formats
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Social */}
          <div>
            <h4 className="text-white font-bold mb-6">Connect</h4>
            <ul className="space-y-4 text-gray-400 mb-6">
              <li>
                <button onClick={() => scrollToSection('about')} className="hover:text-green-400 transition-colors">
                  About Mission
                </button>
              </li>
            </ul>
            <div className="flex space-x-4">
              <Github className="w-5 h-5 cursor-pointer hover:text-green-400 transition-colors" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-green-400 transition-colors" />
              <Linkedin className="w-5 h-5 cursor-pointer hover:text-green-400 transition-colors" />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:row justify-between items-center gap-4 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 CogniScript AI. Built for the future of document intelligence.
          </p>
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <Shield className="w-4 h-4 text-green-500/50" />
            <span>Secure Enterprise-Grade Encryption</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;