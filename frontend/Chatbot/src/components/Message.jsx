import React from 'react';
import { Bot, User, FileText } from 'lucide-react';

const Message = ({ message, isUser }) => {
  // Extract text and citations from the message object
  const { text, timestamp, citations } = message;

  return (
    <div
      className={`flex gap-3 mb-6 animate-[slideUp_0.3s_ease-out] ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar Icon */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
          isUser
            ? 'bg-gradient-to-br from-green-600 to-green-700 shadow-green-900/20'
            : 'bg-gradient-to-br from-gray-700 to-gray-800 border border-green-500/30 shadow-black'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-black" />
        ) : (
          <Bot className="w-5 h-5 text-green-400" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-xl ${
          isUser
            ? 'bg-green-600 text-black font-medium'
            : 'bg-gray-800 border border-green-500/20 text-green-100'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
        
        {/* RAG Citations Section */}
        {!isUser && citations && citations.length > 0 && (
          <div className="mt-3 pt-2 border-t border-green-500/20">
            <div className="flex items-center gap-1.5 mb-1.5">
              <FileText className="w-3 h-3 text-green-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-green-500">
                Sources Found:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {citations.map((source, index) => (
                <span 
                  key={index} 
                  className="text-[10px] px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/30 text-green-400"
                >
                  {source}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <span className={`text-[10px] mt-2 block opacity-50 ${isUser ? 'text-black' : 'text-green-600'}`}>
          {new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
};

export default Message;