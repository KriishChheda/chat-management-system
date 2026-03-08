import React from 'react';
import { Sparkles, X, Trash2, Settings, MessageSquare } from 'lucide-react';

const Sidebar = ({ 
  isOpen, 
  onClose, 
  onNewChat, 
  onClearHistory, 
  chatList = [], // Default to empty array to avoid errors
  onSelectChat, 
  currentChatId 
}) => {
  
  // Helper to format the Chat ID (timestamp) into something readable
  const formatChatTitle = (id) => {
    const date = new Date(parseInt(id));
    return `Chat on ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 w-80 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ChatBot AI
              </h2>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <button
              onClick={onNewChat}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
            >
              + New Chat
            </button>
          </div>

          {/* Chat History List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
              Recent Chats
            </h3>
            <div className="space-y-1">
              {chatList.length > 0 ? (
                // We reverse the list so the newest chats are at the top
                [...chatList].reverse().map((id) => (
                  <div
                    key={id}
                    onClick={() => onSelectChat(id)}
                    className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      currentChatId === id 
                        ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <MessageSquare className={`w-4 h-4 ${currentChatId === id ? 'text-blue-500' : 'text-gray-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {formatChatTitle(id)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 text-center mt-4 italic">No chat history yet</p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200 space-y-1">
            <button
              onClick={onClearHistory}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
            >
              <Trash2 className="w-4 h-4 transition-transform group-hover:shake" />
              <span className="text-sm font-medium">Clear Current Chat</span>
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
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