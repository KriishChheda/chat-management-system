import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, Menu, Paperclip, FileText, X, Wand2, Loader2 } from 'lucide-react';
import Message from './Message';
import TypingIndicator from './Typingindicator';
import Sidebar from './Sidebar';

const NODE_SERVER = 'http://localhost:5002';

const Chatbot = ({ token }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [allChats, setAllChats] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const fileInputRef = useRef(null);

  // ─── Helpers ─────────────────────────────────────────────────────────────
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const authHeaders = () => ({ Authorization: `Bearer ${token}` });

  const showWelcome = () => {
    setMessages([{
      id: 'welcome',
      text: "Hello! I'm your RAG-powered AI assistant. Upload a document and ask me anything about it!",
      isUser: false,
      timestamp: new Date(),
    }]);
  };

  // ─── Fetch chat list ──────────────────────────────────────────────────────
  const fetchChatList = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${NODE_SERVER}/api/chat-list`, { headers: authHeaders() });
      const data = await res.json();
      if (Array.isArray(data)) setAllChats(data);
    } catch (err) {
      console.error('Error fetching chat list:', err);
    }
  }, [token]);

  // ─── Load history when chatId changes ───────────────────────────────────
  useEffect(() => {
    if (!currentChatId) {
      showWelcome();
      return;
    }

    const loadHistory = async () => {
      try {
        const res = await fetch(`${NODE_SERVER}/api/messages/${currentChatId}`, {
          headers: authHeaders(),
        });
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setMessages(data);
        } else {
          showWelcome();
        }
      } catch (err) {
        console.error('Error loading chat history:', err);
        showWelcome();
      }
    };

    loadHistory();
  }, [currentChatId, token]);

  // ─── Keep sidebar up-to-date when messages change ────────────────────────
  useEffect(() => { fetchChatList(); }, [messages, fetchChatList]);

  // ─── Auto-scroll ──────────────────────────────────────────────────────────
  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  // ─── On mount: create an initial chat automatically ───────────────────────
  useEffect(() => {
    if (token) createNewChat();
  }, [token]);

  // ─── Create a new chat (on RAG server + get chatId) ──────────────────────
  const createNewChat = async () => {
    try {
      const res = await fetch(`${NODE_SERVER}/api/new-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ title: `Chat ${new Date().toLocaleString()}` }),
      });
      const data = await res.json();

      if (data.chatId) {
        setCurrentChatId(data.chatId);
        setSidebarOpen(false);
      } else if (res.status === 400 && data.error?.includes('RAG user ID not found')) {
        // Stale token from before the RAG-user-sync feature was added.
        // Clear it and force the user to log in again for a fresh token.
        alert('Your session is outdated. Please log in again to continue.');
        localStorage.removeItem('token');
        window.location.href = '/';
      } else {
        console.error('createNewChat: unexpected response', data);
        setMessages([{
          id: 'error',
          text: `⚠️ Could not start chat session: ${data.error || 'Unknown error'}. Please try refreshing.`,
          isUser: false,
          timestamp: new Date(),
        }]);
      }
    } catch (err) {
      console.error('Error creating new chat:', err);
      setMessages([{
        id: 'error',
        text: '⚠️ Could not connect to the server. Make sure the Node.js backend is running on port 5002.',
        isUser: false,
        timestamp: new Date(),
      }]);
    }
  };

  const handleNewChat = () => createNewChat();

  // ─── Delete / clear current chat ─────────────────────────────────────────
  const handleClearHistory = async () => {
    if (!currentChatId) return;
    if (!window.confirm('Are you sure you want to delete this chat?')) return;

    try {
      await fetch(`${NODE_SERVER}/api/chat/${currentChatId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      await createNewChat();       // Start a fresh chat after deletion
      await fetchChatList();
    } catch (err) {
      console.error('Error deleting chat:', err);
    }
  };

  // ─── File handling ────────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    // Capture files BEFORE clearing the input — React's functional updater
    // is evaluated lazily, so Array.from inside it would see an empty list
    // after e.target.value = '' runs.
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    // Reset so the same file can be re-selected next time
    e.target.value = '';
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSummarize = () => {
    if (selectedFiles.length === 0) {
      alert('Please select files first.');
      return;
    }
    setInputValue('Please summarize the uploaded documents.');
  };

  // ─── Send message (+ optional file upload) ────────────────────────────────
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() && selectedFiles.length === 0) return;
    if (!currentChatId) {
      alert('Please wait — creating a chat session...');
      return;
    }

    const messageText = inputValue;
    const filesToUpload = [...selectedFiles];

    // Optimistic UI: show user message immediately
    const tempUserMsg = {
      id: Date.now(),
      text: messageText || `📎 Uploaded ${filesToUpload.length} file(s)`,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setInputValue('');
    setSelectedFiles([]);
    setIsTyping(true);

    try {
      // 1. Upload files first (if any)
      if (filesToUpload.length > 0) {
        setUploadingFiles(true);
        for (const file of filesToUpload) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('chatId', currentChatId);   // ← required by the new backend

          const uploadRes = await fetch(`${NODE_SERVER}/api/upload-doc`, {
            method: 'POST',
            headers: authHeaders(),   // No Content-Type; fetch sets multipart automatically
            body: formData,
          });

          if (!uploadRes.ok) {
            const errData = await uploadRes.json().catch(() => ({}));
            console.error('File upload failed:', errData);
            // Show a non-fatal warning but continue
            setMessages((prev) => [...prev, {
              id: Date.now() + Math.random(),
              text: `⚠️ Could not upload "${file.name}": ${errData.error || 'unknown error'}`,
              isUser: false,
              timestamp: new Date(),
            }]);
          }
        }
        setUploadingFiles(false);
      }

      // 2. Only send a chat prompt if there's actual text
      if (!messageText.trim() && filesToUpload.length > 0) {
        // Files uploaded but no question — show confirmation
        setMessages((prev) => [...prev, {
          id: Date.now() + 1,
          text: '✅ File(s) uploaded and indexed. You can now ask questions about them!',
          isUser: false,
          timestamp: new Date(),
        }]);
        return;
      }

      // 3. Send the prompt to Node.js → RAG server
      const chatRes = await fetch(`${NODE_SERVER}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({
          message: messageText || 'Please analyze the uploaded documents.',
          chatId: currentChatId,
        }),
      });

      const chatData = await chatRes.json();

      if (!chatRes.ok) {
        throw new Error(chatData.error || 'Server error');
      }

      // 4. Display AI reply
      setMessages((prev) => [...prev, {
        id: Date.now() + 2,
        text: chatData.reply || '(No response received)',
        isUser: false,
        citations: chatData.citations || [],
        timestamp: new Date(),
      }]);

    } catch (err) {
      console.error('Error during send:', err);
      setMessages((prev) => [...prev, {
        id: Date.now() + 3,
        text: `⚠️ ${err.message || 'Something went wrong. Please try again.'}`,
        isUser: false,
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
      setUploadingFiles(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
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
            <h1 className="font-semibold text-green-400">CogniScript AI</h1>
            <p className="text-xs text-green-600">
              {currentChatId ? `Chat: ${currentChatId.slice(0, 8)}…` : 'Initializing…'}
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 bg-gray-900">
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <Message key={message.id} message={message} isUser={message.isUser} />
            ))}
            {(isTyping || uploadingFiles) && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-gray-800 border-t border-green-500/20 px-4 py-4 shadow-2xl">
          <div className="max-w-4xl mx-auto">
            {/* File Preview */}
            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-xl"
                  >
                    <FileText className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-xs font-medium text-green-300 truncate max-w-[120px]">
                      {file.name}
                    </span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-green-600 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
              {/* File Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gray-700 text-green-400 rounded-2xl border border-green-500/20 hover:bg-gray-600 transition-all"
                title="Upload File (PDF, TXT, DOC, DOCX)"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept=".pdf,.txt,.doc,.docx"
                className="hidden"
              />

              {/* Text Input */}
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
                  placeholder="Ask something about your documents…"
                  className="w-full px-4 py-3 border border-green-500/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none bg-gray-700 text-green-300 placeholder-green-700 shadow-sm transition-all duration-200"
                  rows="1"
                  style={{ maxHeight: '120px' }}
                />
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={(!inputValue.trim() && selectedFiles.length === 0) || isTyping || !currentChatId}
                className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 text-black rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 hover:from-green-400 hover:to-green-500 disabled:opacity-30 disabled:grayscale transform hover:scale-105 active:scale-95 transition-all duration-200"
                title="Send Message"
              >
                {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>

              {/* Summarize Button */}
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
              Press Enter to send · Shift+Enter for new line · Supported: PDF, TXT, DOC, DOCX
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;