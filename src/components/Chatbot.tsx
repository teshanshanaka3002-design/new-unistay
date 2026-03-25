import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show welcome message when chat is first opened
  useEffect(() => {
    if (isOpen && !hasWelcomed) {
      setIsTyping(true);
      setHasWelcomed(true);
      
      // Simulate bot typing delay
      setTimeout(() => {
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          text: "Hey! I'm the AI assistant. How can I help you?",
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, welcomeMessage]);
        setIsTyping(false);
      }, 1000);
    }
  }, [isOpen, hasWelcomed]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim();
    
    // Keyword-based responses
    if (lowerMessage.includes('hey') || lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
      return "Hey! How can I help you today?";
    }
    
    if (lowerMessage.includes('booking') || lowerMessage.includes('book')) {
      return `To book accommodation:

1. Go to Stays section

2. Filter by your university and preferences

3. Select a boarding

4. Click 'Book Now' and fill your details`;
    }
    
    if (lowerMessage.includes('food') || lowerMessage.includes('order') || lowerMessage.includes('meal')) {
      return `To order food:

1. Go to Meals section

2. Select your university

3. Choose a cafe

4. Add items to cart and checkout`;
    }
    
    if (lowerMessage.includes('review') || lowerMessage.includes('rating')) {
      return "You can view and submit reviews after booking or using our services.";
    }
    
    // Default response
    return "I'm here to help with StudentNest features like bookings, meals, and requests. Ask me anything about the platform!";
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 right-6 z-50 w-14 h-14 bg-gold text-white rounded-full 
          shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 
          flex items-center justify-center group
          ${isOpen ? 'scale-90' : ''}
        `}
      >
        <MessageCircle 
          size={24} 
          className={`${isOpen ? 'rotate-45' : ''} transition-transform duration-300`}
        />
        <span className="absolute -top-8 -right-8 bg-ink text-paper text-xs 
          font-bold uppercase tracking-widest px-2 py-1 rounded-full opacity-0 
          group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          StudentNest Assistant
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 bg-white rounded-2xl 
          shadow-2xl border border-black/10 overflow-hidden">
          
          {/* Chat Header */}
          <div className="bg-ink text-paper p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot size={20} />
              <div>
                <h3 className="font-bold text-sm">StudentNest Assistant</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs opacity-75">Always Active</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-paper/60 hover:text-paper transition-colors p-1 rounded-full 
                hover:bg-paper/20"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-paper/30">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <Bot size={32} className="mx-auto text-ink/30 mb-4" />
                <p className="text-ink/50 text-sm">
                  Ask me anything about UniStay features!
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`
                      flex items-center gap-2 mb-1
                      ${message.sender === 'user' ? 'justify-end' : 'justify-start'}
                    `}>
                      <span className="text-xs text-ink/40">
                        {formatTime(message.timestamp)}
                      </span>
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        ${message.sender === 'user' 
                          ? 'bg-gold text-white' 
                          : 'bg-ink text-white'
                        }
                      `}>
                        {message.sender === 'user' ? (
                          <User size={16} />
                        ) : (
                          <Bot size={16} />
                        )}
                      </div>
                    </div>
                    <div className={`
                      px-4 py-3 rounded-2xl max-w-full
                      ${message.sender === 'user'
                        ? 'bg-gold text-white rounded-br-2xl'
                        : 'bg-white text-ink border border-black/10 rounded-bl-2xl'
                      }
                    `}>
                      <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                        {message.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] order-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center">
                      <Bot size={16} />
                    </div>
                  </div>
                  <div className="bg-white text-ink border border-black/10 rounded-bl-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-ink/40 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-ink/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-ink/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-ink/60 italic">StudentNest Assistant is typing...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-black/10 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-black/10 rounded-full 
                  focus:outline-none focus:ring-2 focus:ring-gold/20 
                  text-sm placeholder:text-ink/40"
              />
              <button
                onClick={handleSendMessage}
                disabled={inputValue.trim() === '' || isTyping}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  transition-all duration-200
                  ${inputValue.trim() === '' || isTyping
                    ? 'bg-ink/20 text-ink/40 cursor-not-allowed'
                    : 'bg-gold text-white hover:bg-ink hover:scale-105'
                  }
                `}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
