// import React, { useState } from 'react';

// const LandingPage = ({ onLogin }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({ username: '', password: '' });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const endpoint = isLogin ? '/api/login' : '/api/signup';
//     const response = await fetch(`http://localhost:5002${endpoint}`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(formData),
//     });
//     const data = await response.json();
//     if (response.ok) {
//       if (isLogin) onLogin(data.token);
//       else setIsLogin(true);
//     } else {
//       alert(data.message);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white flex flex-col">
//       {/* Header */}
//       <nav className="p-6 flex justify-between items-center border-b border-gray-800">
//         <h1 className="text-2xl font-bold text-blue-500">GeminiBot</h1>
//         <div className="space-x-6">
//           <a href="#about" className="hover:text-blue-400">About</a>
//           <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700">
//             Login / Signup
//           </button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <main className="flex-grow flex flex-col items-center justify-center text-center p-10">
//         <h2 className="text-5xl font-extrabold mb-4">Your Intelligence, Enhanced.</h2>
//         <p className="text-gray-400 max-w-lg mb-8">Experience the next generation of AI chatting. Secure, private, and powered by Gemini.</p>
//         <button onClick={() => setIsModalOpen(true)} className="bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-200">
//           Get Started for Free
//         </button>
//       </main>

//       {/* Footer */}
//       <footer className="p-6 border-t border-gray-800 text-center text-gray-500 text-sm">
//         © 2026 GeminiBot AI. All rights reserved.
//       </footer>

//       {/* Auth Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-gray-800 p-8 rounded-2xl w-96 relative border border-gray-700">
//             <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
//             <h3 className="text-2xl font-bold mb-6">{isLogin ? 'Login' : 'Sign Up'}</h3>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input 
//                 type="text" placeholder="Username" required
//                 className="w-full bg-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 onChange={(e) => setFormData({...formData, username: e.target.value})}
//               />
//               <input 
//                 type="password" placeholder="Password" required
//                 className="w-full bg-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 onChange={(e) => setFormData({...formData, password: e.target.value})}
//               />
//               <button className="w-full bg-blue-600 py-3 rounded-lg font-bold">{isLogin ? 'Login' : 'Create Account'}</button>
//             </form>
//             <p className="mt-4 text-sm text-gray-400">
//               {isLogin ? "New here?" : "Already have an account?"}
//               <span onClick={() => setIsLogin(!isLogin)} className="text-blue-400 cursor-pointer ml-1 hover:underline">
//                 {isLogin ? 'Create one' : 'Login instead'}
//               </span>
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LandingPage;

import React, { useState, useEffect } from 'react';
import { 
  Upload, FileText, Image, Video, File, MessageSquare, 
  Zap, Shield, ArrowRight, Play, Check, X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import image2 from '../assets/image2.png';
import Footer from './Footer';
import Navbar from './Navbar';

const LandingPage = ({ onLogin,token }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });

  // --- Authentication Logic ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/login' : '/api/signup';
    try {
      const response = await fetch(`http://localhost:5002${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        if (isLogin) onLogin(data.token);
        else { setIsLogin(true); alert("Account created! Please log in."); }
      } else { alert(data.message || "Auth failed"); }
    } catch (err) { alert("Server connection failed."); }
  };

  // --- Animation Logic (Intersection Observer) ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: <Upload className="w-6 h-6" />, title: "Multi-File Upload", description: "Drag and drop multiple files at once. Supports images, videos, PDFs, and documents.", color: "from-green-400 to-green-600" },
    { icon: <FileText className="w-6 h-6" />, title: "Instant Analysis", description: "Get comprehensive summaries and insights from your uploaded files in seconds.", color: "from-blue-400 to-green-400" },
    { icon: <MessageSquare className="w-6 h-6" />, title: "Interactive Chat", description: "Ask questions about your files and get detailed, contextual responses.", color: "from-green-500 to-emerald-500" },
    { icon: <Shield className="w-6 h-6" />, title: "Secure Processing", description: "Your files are processed securely with enterprise-grade encryption.", color: "from-emerald-400 to-green-600" }
  ];

  const supportedFormats = [
    { icon: <Image className="w-5 h-5" />, name: "Images", formats: "JPG, PNG, GIF, SVG" },
    { icon: <Video className="w-5 h-5" />, name: "Videos", formats: "MP4, AVI, MOV, MKV" },
    { icon: <FileText className="w-5 h-5" />, name: "Documents", formats: "PDF, DOC, TXT" },
    { icon: <File className="w-5 h-5" />, name: "Archives", formats: "ZIP" }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden pt-14 selection:bg-green-500/30">
      <Navbar 
        onOpenAuth={() => setIsModalOpen(true)} 
        token={token} 
        onLogout={() => { localStorage.clear(); window.location.reload(); }} 
      />

      {/* 1. Animated Background Starfield */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-green-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div 
              className={`transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              id="hero"
              data-animate
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                  Analyze Files
                </span>
                <br />
                <span className="text-white">with AI Power</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Upload any file format and get instant, intelligent summaries. Chat with your documents, 
                images, and videos like never before.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="group bg-gradient-to-r from-green-500 to-green-600 text-black px-8 py-4 rounded-lg font-bold text-lg hover:from-green-400 hover:to-green-500 transition-all shadow-lg shadow-green-500/20 flex items-center space-x-2"
                >
                  <span>Start Analyzing</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="group border border-green-400 text-green-400 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-400/10 transition-all flex items-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="featuresSection" className="relative z-10 py-20 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${isVisible.featuresTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            id="featuresTitle"
            data-animate
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-green-400">Powerful</span> Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to transform your files into actionable insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                id={`feature-${index}`}
                data-animate
                className={`group bg-gray-800 border border-green-500/20 rounded-xl p-6 hover:border-green-400/40 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10 ${isVisible[`feature-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center text-black mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. About Us / Mission Section */}
      <section id="about" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div 
              className={`transition-all duration-1000 ${isVisible.aboutContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
              id="aboutContent"
              data-animate
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                About <span className="text-green-400">Our Mission</span>
              </h2>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                We believe that every file contains valuable insights waiting to be discovered. 
                Our AI-powered platform breaks down the barriers between you and your data, 
                making complex analysis accessible to everyone.
              </p>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Founded by a team of AI researchers, we're helping individuals unlock the hidden potential in their documents, images, and multimedia files.
              </p>
              
              <div className="space-y-4">
                {[
                  { title: "Innovation First", desc: "Cutting-edge AI technology that evolves with your needs" },
                  { title: "Privacy Focused", desc: "Your data security and privacy are our top priorities" },
                  { title: "User-Centric", desc: "Designed for simplicity without sacrificing powerful features" }
                ].map((value, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1 text-base">{value.title}</h4>
                      <p className="text-gray-400 text-sm">{value.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div 
              className={`transition-all duration-1000 delay-300 ${isVisible.aboutVisual ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
              id="aboutVisual"
              data-animate
            >
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-green-500/20 shadow-2xl min-h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <Zap className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
                    <h3 className="text-2xl font-bold text-white mb-2">AI-Powered Insights</h3>
                    <img src={image2} alt="AI Visualization" className="rounded-lg shadow-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Universal File Support */}
      <section id="formatsSection" className="relative z-10 py-20 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${isVisible.formatsTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            id="formatsTitle"
            data-animate
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-green-400">Universal</span> File Support
            </h2>
            <p className="text-xl text-gray-300">Works with all your favorite file formats</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportedFormats.map((format, index) => (
              <div
                key={index}
                id={`format-${index}`}
                data-animate
                className={`bg-gray-800 border border-green-500/20 rounded-xl p-6 text-center hover:border-green-400/40 transition-all duration-300 hover:transform hover:scale-105 ${isVisible[`format-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 mx-auto mb-4">
                  {format.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{format.name}</h3>
                <p className="text-sm text-gray-400">{format.formats}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. How It Works Section */}
      <section id="howSection" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${isVisible.howTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            id="howTitle"
            data-animate
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How It <span className="text-green-400">Works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Upload Files", desc: "Drag and drop or select multiple files of any format" },
              { step: "2", title: "AI Analysis", desc: "Our advanced AI processes and understands your content" },
              { step: "3", title: "Get Insights", desc: "Receive summaries, answers, and interactive discussions" }
            ].map((item, index) => (
              <div
                key={index}
                id={`step-${index}`}
                data-animate
                className={`text-center transition-all duration-1000 ${isVisible[`step-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA Section */}
      <section id="ctaSection" className="relative z-10 py-20 bg-gray-800/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div 
            className={`transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            id="cta"
            data-animate
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="text-green-400">Transform</span> Your Files?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users who are already getting insights from their files with AI
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group bg-gradient-to-r from-green-500 to-green-600 text-black px-10 py-4 rounded-lg font-bold text-xl hover:from-green-400 hover:to-green-500 transition-all shadow-lg shadow-green-500/20 flex items-center space-x-2 mx-auto"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
      <Footer />
{/* 8. Enhanced Auth Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div 
            className="bg-gray-900/80 p-8 rounded-3xl w-full max-w-md border border-green-500/30 shadow-[0_0_50px_-12px_rgba(34,197,94,0.3)] relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
          >
            {/* Background Decorative Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-green-500/10 rounded-full blur-3xl"></div>

            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-6 right-6 text-gray-400 hover:text-white hover:rotate-90 transition-all duration-300 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10 mb-4 border border-green-500/20">
                <Zap className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-400 mt-2 text-sm">
                {isLogin ? 'Enter your credentials to access your chats' : 'Join CogniScript to start analyzing files'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-green-400 uppercase tracking-wider ml-1">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-gray-500 group-focus-within:text-green-400 transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter your username" 
                    required 
                    className="w-full bg-gray-800/50 border border-gray-700 p-3 pl-12 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none text-white placeholder:text-gray-600 transition-all"
                    onChange={(e) => setFormData({...formData, username: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-green-400 uppercase tracking-wider ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-500 group-focus-within:text-green-400 transition-colors" />
                  </div>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    className="w-full bg-gray-800/50 border border-gray-700 p-3 pl-12 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none text-white placeholder:text-gray-600 transition-all"
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  />
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 py-4 rounded-xl font-bold text-black hover:from-green-400 hover:to-emerald-500 transition-all transform active:scale-[0.98] shadow-[0_4px_20px_-5px_rgba(34,197,94,0.4)] flex items-center justify-center space-x-2">
                <span>{isLogin ? 'Sign In' : 'Get Started'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Switch State */}
            <div className="mt-8 text-center border-t border-gray-800 pt-6">
              <p className="text-gray-400 text-sm">
                {isLogin ? "Don't have an account?" : "Already a member?"}
                <button 
                  onClick={() => setIsLogin(!isLogin)} 
                  className="text-green-400 ml-2 font-bold hover:text-green-300 transition-colors underline decoration-green-500/30 underline-offset-4"
                >
                  {isLogin ? 'Create Account' : 'Sign In Now'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer
      <footer className="relative z-10 py-10 border-t border-gray-800 text-center text-gray-500 text-sm">
        © 2026 GeminiBot AI. Your personal RAG-powered intelligence.
      </footer> */}
    </div>
  );
};

export default LandingPage;