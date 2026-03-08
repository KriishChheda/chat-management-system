import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex gap-3 mb-4 animate-[slideUp_0.3s_ease-out]">
      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600">
        <Bot className="w-5 h-5 text-white" />
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-[bounce_1s_infinite_0ms]"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-[bounce_1s_infinite_400ms]"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;