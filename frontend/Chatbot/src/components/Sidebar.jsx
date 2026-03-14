import React from 'react';
import { Sparkles, X, Trash2, Settings, MessageSquare } from 'lucide-react';

const Sidebar = ({ 
  isOpen, 
  onClose, 
  onNewChat, 
  onClearHistory, 
  chatList = [], 
  onSelectChat, 
  currentChatId 
}) => {
  
  const formatChatTitle = (id) => {
    const date = new Date(parseInt(id));
    return `Chat on ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <>
      {/* Overlay - Darkened */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden transition-opacity duration-300 backdrop-blur-sm"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar - Deep Dark Theme */}
      <div
        className={`fixed lg:static inset-y-0 left-0 w-80 bg-gray-900 border-r border-green-500/20 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header - Styled with Green Accents */}
          <div className="flex items-center justify-between p-4 border-b border-green-500/10 bg-gray-800/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <h2 className="text-lg font-bold text-green-400">
                ChatBot AI
              </h2>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-green-500/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-green-500" />
            </button>
          </div>

          {/* New Chat Button - Green Gradient to match previous project */}
          <div className="p-4">
            <button
              onClick={onNewChat}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-black px-4 py-3 rounded-xl font-bold hover:from-green-400 hover:to-green-500 shadow-lg shadow-green-500/10 transform active:scale-95 transition-all duration-200"
            >
              + New Chat
            </button>
          </div>

          {/* Chat History List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <h3 className="text-xs font-semibold text-green-700 uppercase tracking-widest mb-3 px-2">
              Recent Chats
            </h3>
            <div className="space-y-1">
              {chatList.length > 0 ? (
                [...chatList].reverse().map((id) => (
                  <div
                    key={id}
                    onClick={() => onSelectChat(id)}
                    className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border ${
                      currentChatId === id 
                        ? 'bg-green-500/10 text-green-400 border-green-500/40 shadow-[0_0_15px_-5px_rgba(34,197,94,0.3)]' 
                        : 'hover:bg-gray-800 text-gray-400 border-transparent hover:border-green-500/10'
                    }`}
                  >
                    <MessageSquare className={`w-4 h-4 ${currentChatId === id ? 'text-green-400' : 'text-gray-600 group-hover:text-green-600'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {formatChatTitle(id)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-green-900 text-center mt-4 italic">No chat history yet</p>
              )}
            </div>
          </div>

          {/* Footer Actions - Themed */}
          <div className="p-4 border-t border-green-500/10 bg-gray-800/30 space-y-1">
            <button
              onClick={onClearHistory}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors group"
            >
              <Trash2 className="w-4 h-4 transition-transform group-hover:rotate-12" />
              <span className="text-sm font-medium">Clear Current Chat</span>
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2.5 text-green-500/70 hover:bg-green-500/10 hover:text-green-400 rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;