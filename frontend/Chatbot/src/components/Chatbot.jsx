import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Menu } from 'lucide-react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import Sidebar from './Sidebar';

const Chatbot = () => {
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

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
  const fetchChatList = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/chat-list');
      const data = await response.json();
      setAllChats(data);
    } catch (error) {
      console.error("Error fetching chat list:", error);
    }
  };
  fetchChatList();
}, [messages]);

useEffect(() => {
  const loadChatHistory = async () => {
    try {
      // Fetch only messages belonging to the current selected chatId
      const response = await fetch(`http://localhost:5002/api/messages/${currentChatId}`);
      const data = await response.json();
      
      if (data.length > 0) {
        setMessages(data);
      } else {
        // If it's a brand new chat (no data in DB), show the welcome message
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
}, [currentChatId]); // This triggers every time the chatId changes

const handleSendMessage = async (e) => {
  e.preventDefault();
  if (!inputValue.trim()) return;

  const tempUserMsg = {
    id: Date.now(),
    text: inputValue,
    isUser: true,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, tempUserMsg]);
  const messageToSend = inputValue; // Capture value before clearing
  setInputValue('');
  setIsTyping(true);

  try {
    const response = await fetch('http://localhost:5002/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: messageToSend, 
        chatId: currentChatId  // CRITICAL: Tells backend which thread this belongs to
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

  // Handle new chat
const handleNewChat = () => {
  const newId = Date.now().toString();
  setCurrentChatId(newId); 
  setSidebarOpen(false);
  // Note: We don't need to manually clear messages here 
  // because the useEffect [currentChatId] will handle it.
};

  // Handle clear history
const handleClearHistory = async () => {
  if (!window.confirm('Are you sure you want to delete THIS chat conversation?')) return;

  try {
    const response = await fetch(`http://localhost:5002/api/messages/${currentChatId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // After deleting from DB, reset to a new fresh chat
      handleNewChat(); 
    }
  } catch (error) {
    console.error("Error deleting chat:", error);
  }
};

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        onClearHistory={handleClearHistory}
        onSelectChat={(id) => {
        setCurrentChatId(id);
        setSidebarOpen(false); // Close sidebar on mobile after selection
      }}
        chatList={allChats}
        currentChatId={currentChatId}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-800">AI Assistant</h1>
            <p className="text-xs text-gray-500">Always here to help</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <Message key={message.id} message={message} isUser={message.isUser} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-4 py-4">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            <div className="flex gap-2 items-end">
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
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white shadow-sm transition-all duration-200"
                  rows="1"
                  style={{ maxHeight: '120px' }}
                />
              </div>
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send, Shift + Enter for new line
            </p>
          </form>
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