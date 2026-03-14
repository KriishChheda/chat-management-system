// import React, { useState, useRef, useEffect } from 'react';
// import { Send, Bot, Menu, Paperclip, FileText, X, Wand2 } from 'lucide-react'; // Added icons
// import Message from './Message';
// import TypingIndicator from './TypingIndicator';
// import Sidebar from './Sidebar';

// const Chatbot = ({token}) => {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Hello! I'm your AI assistant. How can I help you today?",
//       isUser: false,
//       timestamp: new Date(),
//     },
//   ]);
//   const [inputValue, setInputValue] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);
//   const [currentChatId, setCurrentChatId] = useState(Date.now().toString());
//   const [allChats, setAllChats] = useState([]);

//   // New states for File Upload
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const fileInputRef = useRef(null);

//   // Auto-scroll to bottom
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, isTyping]);

//   useEffect(() => {
//   const fetchChatList = async () => {
//     if (!token) return; 
//     try {
//       const response = await fetch('http://localhost:5002/api/chat-list', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const data = await response.json();
//       setAllChats(data);
//     } catch (error) {
//       console.error("Error fetching chat list:", error);
//     }
//   };
//   fetchChatList();
// }, [messages,token]); // Refetch chat list whenever messages change or token changes

// useEffect(() => {
//   const loadChatHistory = async () => {
//     if (!token) return;
//     try {
//       // Fetch only messages belonging to the current selected chatId
//       const response = await fetch(`http://localhost:5002/api/messages/${currentChatId}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const data = await response.json();
      
//       if (data.length > 0) {
//         setMessages(data);
//       } else {
//         // If it's a brand new chat (no data in DB), show the welcome message
//         setMessages([{
//           id: 'welcome',
//           text: "This is a new empty chat. How can I help you?",
//           isUser: false,
//           timestamp: new Date(),
//         }]);
//       }
//     } catch (error) {
//       console.error("Error loading chat history:", error);
//     }
//   };

//   loadChatHistory();
// }, [currentChatId,token]); // This triggers every time the chatId changes

// const handleSendMessage = async (e) => {
//   if (e) e.preventDefault();
//   if (!inputValue.trim() && selectedFiles.length === 0) return;

//   const tempUserMsg = {
//     id: Date.now(),
//     text: inputValue || (selectedFiles.length > 0 ? `Sent ${selectedFiles.length} files` : ""),
//     isUser: true,
//     timestamp: new Date(),
//   };

//   setMessages((prev) => [...prev, tempUserMsg]);
//   const messageToSend = inputValue; // Capture value before clearing
  
//   // Clear inputs
//   setInputValue('');
//   setSelectedFiles([]); 
//   setIsTyping(true);

//   try {
//     const response = await fetch('http://localhost:5002/api/chat', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json',
//                   'Authorization': `Bearer ${token}`
//        },
//       body: JSON.stringify({ 
//         message: messageToSend, 
//         chatId: currentChatId  
//       }),
//     });

//     const data = await response.json();

//     const botMessage = {
//       id: Date.now() + 1,
//       text: data.reply,
//       isUser: false,
//       timestamp: new Date(),
//     };
    
//     setMessages((prev) => [...prev, botMessage]);
//   } catch (error) {
//     console.error('Error:', error);
//   } finally {
//     setIsTyping(false);
//   }
// };

//   // Handle new chat
// const handleNewChat = () => {
//   const newId = Date.now().toString();
//   setCurrentChatId(newId); 
//   setSidebarOpen(false);
//   // Note: We don't need to manually clear messages here 
//   // because the useEffect [currentChatId] will handle it.
// };

//   // Handle clear history
// const handleClearHistory = async () => {
//   if (!window.confirm('Are you sure you want to delete THIS chat conversation?')) return;

//   try {
//     const response = await fetch(`http://localhost:5002/api/messages/${currentChatId}`, {
//       method: 'DELETE',
//       headers: { 'Authorization': `Bearer ${token}` }
//     });

//     if (response.ok) {
//       // After deleting from DB, reset to a new fresh chat
//       handleNewChat(); 
//     }
//   } catch (error) {
//     console.error("Error deleting chat:", error);
//   }
// };

//   // File Upload Handlers
//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     setSelectedFiles((prev) => [...prev, ...files]);
//   };

//   const removeFile = (index) => {
//     setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   // Handle Summarize
//   const handleSummarize = () => {
//     if (selectedFiles.length === 0) {
//       alert("Please upload some files first to summarize.");
//       return;
//     }
//     setInputValue("Please summarize the uploaded files.");
//     // In a real RAG scenario, you'd trigger a specific /summarize endpoint here
//   };

//   return (
//     <div className="flex h-screen bg-gray-50 overflow-hidden">
//       {/* Sidebar */}
//       <Sidebar
//         isOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//         onNewChat={handleNewChat}
//         onClearHistory={handleClearHistory}
//         onSelectChat={(id) => {
//         setCurrentChatId(id);
//         setSidebarOpen(false); // Close sidebar on mobile after selection
//       }}
//         chatList={allChats}
//         currentChatId={currentChatId}
//       />

//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col relative">
//         {/* Header */}
//         <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm">
//           <button
//             onClick={() => setSidebarOpen(true)}
//             className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <Menu className="w-5 h-5 text-gray-600" />
//           </button>
//           <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
//             <Bot className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h1 className="font-semibold text-gray-800">AI Assistant</h1>
//             <p className="text-xs text-gray-500">Always here to help</p>
//           </div>
//         </div>

//         {/* Messages Area */}
//         <div className="flex-1 overflow-y-auto px-4 py-6">
//           <div className="max-w-4xl mx-auto">
//             {messages.map((message) => (
//               <Message key={message.id} message={message} isUser={message.isUser} />
//             ))}
//             {isTyping && <TypingIndicator />}
//             <div ref={messagesEndRef} />
//           </div>
//         </div>

//         {/* Input Area */}
//         <div className="bg-white border-t border-gray-200 px-4 py-4">
//           <div className="max-w-4xl mx-auto">
//             {/* File Preview Gallery */}
//             {selectedFiles.length > 0 && (
//               <div className="flex flex-wrap gap-2 mb-3">
//                 {selectedFiles.map((file, index) => (
//                   <div key={index} className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl">
//                     <FileText className="w-4 h-4 text-blue-500" />
//                     <span className="text-xs font-medium text-blue-700 truncate max-w-[120px]">{file.name}</span>
//                     <button onClick={() => removeFile(index)} className="text-blue-400 hover:text-red-500 transition-colors">
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}

//             <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
//               {/* File Upload Button */}
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current.click()}
//                 className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-all"
//                 title="Upload Files"
//               >
//                 <Paperclip className="w-5 h-5" />
//               </button>
//               <input 
//                 type="file" 
//                 ref={fileInputRef} 
//                 onChange={handleFileChange} 
//                 multiple 
//                 className="hidden" 
//               />

//               {/* Text Input */}
//               <div className="flex-1 relative">
//                 <textarea
//                   ref={inputRef}
//                   value={inputValue}
//                   onChange={(e) => setInputValue(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter' && !e.shiftKey) {
//                       e.preventDefault();
//                       handleSendMessage(e);
//                     }
//                   }}
//                   placeholder="Ask something about your files..."
//                   className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white shadow-sm transition-all duration-200"
//                   rows="1"
//                   style={{ maxHeight: '120px' }}
//                 />
//               </div>

//               {/* Send Button */}
//               <button
//                 type="submit"
//                 disabled={(!inputValue.trim() && selectedFiles.length === 0) || isTyping}
//                 className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-200"
//                 title="Send Message"
//               >
//                 <Send className="w-5 h-5" />
//               </button>

//               {/* Summarize Button */}
//               <button
//                 type="button"
//                 onClick={handleSummarize}
//                 disabled={selectedFiles.length === 0 || isTyping}
//                 className="flex-shrink-0 h-12 px-4 bg-emerald-500 text-white rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-600 shadow-md disabled:opacity-50 disabled:grayscale transition-all transform hover:scale-105 active:scale-95"
//                 title="Summarize Files"
//               >
//                 <Wand2 className="w-5 h-5" />
//                 <span className="hidden sm:inline font-semibold text-sm">Summarize</span>
//               </button>
//             </form>
            
//             <p className="text-xs text-gray-500 mt-2 text-center">
//               Press Enter to send, Shift + Enter for new line
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Custom Animations */}
//       <style>{`
//         @keyframes slideUp {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Chatbot;

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Menu, Paperclip, FileText, X, Wand2 } from 'lucide-react'; 
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import Sidebar from './Sidebar';

const Chatbot = ({token}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [currentChatId, setCurrentChatId] = useState(Date.now().toString());
  const [allChats, setAllChats] = useState([]);

  // New states for File Upload
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
  const fetchChatList = async () => {
    if (!token) return; 
    try {
      const response = await fetch('http://localhost:5002/api/chat-list', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAllChats(data);
    } catch (error) {
      console.error("Error fetching chat list:", error);
    }
  };
  fetchChatList();
}, [messages,token]); 

useEffect(() => {
  const loadChatHistory = async () => {
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:5002/api/messages/${currentChatId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.length > 0) {
        setMessages(data);
      } else {
        setMessages([{
          id: 'welcome',
          text: "This is a new empty chat. How can I help you?",
          isUser: false,
          timestamp: new Date(),
        }]);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  loadChatHistory();
}, [currentChatId,token]); 

const handleSendMessage = async (e) => {
  if (e) e.preventDefault();
  if (!inputValue.trim() && selectedFiles.length === 0) return;

  const tempUserMsg = {
    id: Date.now(),
    text: inputValue || (selectedFiles.length > 0 ? `Sent ${selectedFiles.length} files` : ""),
    isUser: true,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, tempUserMsg]);
  const messageToSend = inputValue; 
  
  setInputValue('');
  setSelectedFiles([]); 
  setIsTyping(true);

  try {
    const response = await fetch('http://localhost:5002/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
       },
      body: JSON.stringify({ 
        message: messageToSend, 
        chatId: currentChatId  
      }),
    });

    const data = await response.json();

    const botMessage = {
      id: Date.now() + 1,
      text: data.reply,
      isUser: false,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setIsTyping(false);
  }
};

const handleNewChat = () => {
  const newId = Date.now().toString();
  setCurrentChatId(newId); 
  setSidebarOpen(false);
};

const handleClearHistory = async () => {
  if (!window.confirm('Are you sure you want to delete THIS chat conversation?')) return;

  try {
    const response = await fetch(`http://localhost:5002/api/messages/${currentChatId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      handleNewChat(); 
    }
  } catch (error) {
    console.error("Error deleting chat:", error);
  }
};

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSummarize = () => {
    if (selectedFiles.length === 0) {
      alert("Please upload some files first to summarize.");
      return;
    }
    setInputValue("Please summarize the uploaded files.");
  };

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden text-green-300">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        onClearHistory={handleClearHistory}
        onSelectChat={(id) => {
          setCurrentChatId(id);
          setSidebarOpen(false);
        }}
        chatList={allChats}
        currentChatId={currentChatId}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative border-l border-green-500/20">
        {/* Header */}
        <div className="bg-gray-800 border-b border-green-500/20 px-4 py-3 flex items-center gap-3 shadow-lg">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-green-500/10 rounded-lg transition-colors text-green-400"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
            <Bot className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="font-semibold text-green-400">AI Assistant</h1>
            <p className="text-xs text-green-600">Always here to help</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 bg-gray-900">
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <Message key={message.id} message={message} isUser={message.isUser} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-gray-800 border-t border-green-500/20 px-4 py-4 shadow-2xl">
          <div className="max-w-4xl mx-auto">
            {/* File Preview Gallery */}
            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-xl">
                    <FileText className="w-4 h-4 text-green-400" />
                    <span className="text-xs font-medium text-green-300 truncate max-w-[120px]">{file.name}</span>
                    <button onClick={() => removeFile(index)} className="text-green-600 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gray-700 text-green-400 rounded-2xl border border-green-500/20 hover:bg-gray-600 transition-all"
                title="Upload Files"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                multiple 
                accept="*/*"
                className="hidden" 
              />

              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Ask something about your files..."
                  className="w-full px-4 py-3 border border-green-500/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none bg-gray-700 text-green-300 placeholder-green-700 shadow-sm transition-all duration-200"
                  rows="1"
                  style={{ maxHeight: '120px' }}
                />
              </div>

              <button
                type="submit"
                disabled={(!inputValue.trim() && selectedFiles.length === 0) || isTyping}
                className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 text-black rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 hover:from-green-400 hover:to-green-500 disabled:opacity-30 disabled:grayscale transform hover:scale-105 active:scale-95 transition-all duration-200"
                title="Send Message"
              >
                <Send className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleSummarize}
                disabled={selectedFiles.length === 0 || isTyping}
                className="flex-shrink-0 h-12 px-4 bg-gray-700 text-green-400 border border-green-500/30 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-500 hover:text-black shadow-md disabled:opacity-30 transition-all transform hover:scale-105 active:scale-95"
                title="Summarize Files"
              >
                <Wand2 className="w-5 h-5" />
                <span className="hidden sm:inline font-bold text-sm">Summarize</span>
              </button>
            </form>
            
            <p className="text-xs text-green-700 mt-2 text-center">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;