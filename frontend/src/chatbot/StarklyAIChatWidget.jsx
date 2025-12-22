import React, { useState, useRef, useEffect } from 'react';
import { Send, ThumbsUp, ThumbsDown, Copy, X } from 'lucide-react';

export default function StarklyAIChatWidget() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! 👋 Welcome to Booking CRM! I'm your personal AI assistant. I'd love to get to know you better to provide personalized assistance. What's your name?",
      isUser: false,
      timestamp: "7:20"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '',
    location: '',
    interests: [],
    visitReason: '',
    conversationStage: 'askingName'
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getPersonalizedResponse = (userMessage, stage) => {
    const msg = userMessage.toLowerCase().trim();

    switch (stage) {
      case 'askingName':
        if (msg.length > 0) {
          const name = userMessage.charAt(0).toUpperCase() + userMessage.slice(1);
          setUserProfile(prev => ({ ...prev, name, conversationStage: 'askingLocation' }));
          return `Nice to meet you, ${name}! 😊 That's a lovely name. I'd like to provide you with location-specific information and services. Could you tell me which city or country you're from?`;
        }
        return "I'd love to know your name so I can personalize our conversation. What should I call you? 😊";

      case 'askingLocation':
        if (msg.length > 0) {
          const location = userMessage.charAt(0).toUpperCase() + userMessage.slice(1);
          setUserProfile(prev => ({ ...prev, location, conversationStage: 'askingInterests' }));
          return `${location} sounds like a wonderful place, ${userProfile.name}! 🌍 Now I can provide location-specific information when needed. \n\nTo help me assist you better, what are you most interested in? Please select from the options below:`;
        }
        return `${userProfile.name}, I'd love to know where you're from so I can provide relevant local information. Which city or country are you in?`;

      case 'askingInterests':
        if (msg.length > 0) {
          const interests = userMessage.split(',').map(interest => interest.trim());
          setUserProfile(prev => ({ ...prev, interests, conversationStage: 'askingReason' }));
          return `Excellent choices, ${userProfile.name}! I can see you're interested in ${interests.join(', ')}. That's really exciting! 🚀\n\nOne last question - what brought you to StarklyAI today? Please choose the option that best describes your visit:`;
        }
        return `${userProfile.name}, what topics interest you most? This helps me provide more relevant information! Please select from the options below:`;

      case 'askingReason':
        if (msg.length > 0) {
          setUserProfile(prev => ({ ...prev, visitReason: userMessage, conversationStage: 'general' }));
          return `Perfect! Thanks for sharing that, ${userProfile.name}! 🎉\n\nNow I have a complete picture:\n👋 Name: ${userProfile.name}\n📍 Location: ${userProfile.location}\n💭 Interests: ${userProfile.interests.join(', ')}\n🎯 Goal: ${userMessage}\n\nI'm all set to provide you with personalized assistance! Feel free to ask me anything about WappGPT, our services, pricing, or any questions related to your interests. How can I help you today?`;
        }
        return `${userProfile.name}, what's your main goal for today's visit? Please select the most relevant option:`;

      case 'general':
        return getGeneralResponse(userMessage);

      default:
        return getGeneralResponse(userMessage);
    }
  };

  const getGeneralResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    const { name, location, interests } = userProfile;

    if (msg.includes('wappgpt') || msg.includes('what is')) {
      return `Great question, ${name}! WappGPT is an advanced AI-powered WhatsApp automation platform perfect for businesses ${location ? `like yours in ${location}` : ''}. It helps create intelligent chatbots for customer service, sales, and support with seamless WhatsApp Business API integration! 🤖\n\n${interests.includes('AI & Technology') ? 'Since you\'re interested in AI, you\'ll love our machine learning capabilities!' : ''}`;
    } else if (msg.includes('pricing') || msg.includes('price') || msg.includes('cost')) {
      return `Here's our pricing structure, ${name}! ${location ? `Prices may vary slightly in ${location} due to local factors.` : ''}\n\n💼 Starter: $29/month - Up to 1,000 messages\n🚀 Professional: $99/month - Up to 10,000 messages\n⭐ Enterprise: Custom pricing for unlimited usage\n\nAll plans include 24/7 support and advanced analytics! ${interests.includes('Business Solutions') ? 'For business solutions, I\'d recommend starting with Professional!' : ''} 💰`;
    } else if (msg.includes('faq') || msg.includes('help') || msg.includes('question')) {
      return `Here are some frequently asked questions, ${name}:\n\n❓ How do I set up my bot?\n❓ Can I integrate with existing CRM?\n❓ What languages are supported? ${location ? `(We support most languages used in ${location}!)` : ''}\n❓ Is there a free trial?\n\n${interests.includes('Chatbots') ? 'Since you\'re interested in chatbots, I can provide detailed setup guidance!' : ''} Feel free to ask me any specific questions! 📋`;
    } else if (msg.includes('features') || msg.includes('what can')) {
      return `${name}, here are StarklyAI's amazing features:\n\n✨ Smart AI responses\n📊 Advanced analytics ${interests.includes('Analytics') ? '(Perfect for your analytics interest!)' : ''}\n🔗 CRM integrations\n🌍 Multi-language support\n📱 Mobile-first design ${interests.includes('Mobile Apps') ? '(Great for mobile app integration!)' : ''}\n⚡ Real-time processing\n\n${location ? `We have special features optimized for ${location} market too!` : ''} What would you like to know more about?`;
    } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return `Hello again, ${name}! 👋 How are things in ${location}? I'm here and ready to help you with anything related to ${interests.length > 0 ? interests.join(', ') + ' or' : ''} StarklyAI services!`;
    } else if (msg.includes('thank') || msg.includes('thanks')) {
      return `You're very welcome, ${name}! 😊 I'm always here to help${location ? `, whether you\'re in ${location} or anywhere else` : ''}. Is there anything else about ${interests.length > 0 ? interests.join(', ') + ' or' : ''} StarklyAI you'd like to explore?`;
    } else if (msg.includes('location') || msg.includes('where')) {
      return `You mentioned you're from ${location}! That's awesome! 🌍 We have ${location === 'Delhi' ? 'excellent local support in your area' : 'global coverage including your region'}. Are you looking for any location-specific services or features?`;
    } else if (msg.includes('profile') || msg.includes('about me')) {
      return `Here's what I know about you, ${name}:\n\n👤 Name: ${name}\n📍 Location: ${location}\n💭 Interests: ${interests.join(', ')}\n🎯 Visit Purpose: ${userProfile.visitReason}\n\nIs there anything you'd like to update or add to your profile?`;
    } else if (msg.includes('reset') || msg.includes('start over')) {
      setUserProfile({
        name: '',
        location: '',
        interests: [],
        visitReason: '',
        conversationStage: 'askingName'
      });
      return "No problem! Let's start fresh. What's your name? 😊";
    } else {
      return `That's interesting, ${name}! 🤔 ${interests.length > 0 ? `Given your interest in ${interests[0]}, ` : ''}I can help you with information about WappGPT, pricing, features, and chatbot development. ${location ? `I can also provide ${location}-specific information when relevant.` : ''}\n\nWhat would you like to explore? You can ask about:\n• Our services and features\n• Pricing and plans\n• Technical integration\n• Support options\n• Or anything else on your mind!`;
    }
  };

  const simulateTyping = () => {
    setIsTyping(true);
    const typingDuration = Math.random() * 2000 + 1500;
    return new Promise(resolve => {
      setTimeout(() => {
        setIsTyping(false);
        resolve();
      }, typingDuration);
    });
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      const userMessage = {
        id: Date.now(),
        text: message,
        isUser: true,
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: false 
        }),
        isRead: false
      };

      setMessages(prev => [...prev, userMessage]);
      const currentMessage = message;
      setMessage('');

      await simulateTyping();

      const aiResponse = {
        id: Date.now() + 1,
        text: getPersonalizedResponse(currentMessage, userProfile.conversationStage),
        isUser: false,
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: false 
        })
      };

      setMessages(prev => [...prev, aiResponse]);

      if (!isOpen) {
        setHasNewMessage(true);
      }

      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === userMessage.id ? { ...msg, isRead: true } : msg
        ));
      }, 500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action) => {
    setMessage(action);
  };

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessage(false);
    }
  };

  const getQuickActions = () => {
    const { conversationStage } = userProfile;
    
    switch (conversationStage) {
      case 'askingName':
        return {
          type: 'horizontal',
          actions: [
            { text: "Alex", emoji: "👤" },
            { text: "Sarah", emoji: "👤" },
            { text: "John", emoji: "👤" }
          ]
        };
      case 'askingLocation':
        return {
          type: 'horizontal',
          actions: [
            { text: "New York", emoji: "🏙️" },
            { text: "London", emoji: "🇬🇧" },
            { text: "Delhi", emoji: "🇮🇳" }
          ]
        };
      case 'askingInterests':
        return {
          type: 'vertical',
          actions: [
            { text: "AI & Technology", emoji: "🤖", description: "Machine learning, automation, and AI solutions" },
            { text: "Business Solutions", emoji: "💼", description: "Enterprise tools and business automation" },
            { text: "Mobile Apps", emoji: "📱", description: "Mobile development and app integration" },
            { text: "Web Design", emoji: "🎨", description: "UI/UX design and web development" },
            { text: "Analytics", emoji: "📊", description: "Data analysis and reporting tools" },
            { text: "Chatbots", emoji: "💬", description: "Conversational AI and bot development" }
          ]
        };
      case 'askingReason':
        return {
          type: 'vertical',
          actions: [
            { text: "Just exploring and learning", emoji: "🔍", description: "Want to understand what StarklyAI offers" },
            { text: "Looking for business solutions", emoji: "🏢", description: "Need enterprise-grade automation tools" },
            { text: "Need help with a specific project", emoji: "🛠️", description: "Have a particular use case in mind" },
            { text: "Want to build something new", emoji: "💡", description: "Interested in creating custom solutions" },
            { text: "Seeking customer support", emoji: "📞", description: "Need assistance with existing services" }
          ]
        };
      default:
        return {
          type: 'horizontal',
          actions: [
            { text: "What is WappGPT?", emoji: "👋" },
            { text: "What's your pricing?", emoji: "💰" },
            { text: "Show me my profile", emoji: "👤" }
          ]
        };
    }
  };

  const TypingIndicator = () => (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-gray-800 rounded-full"></div>
          <div className="w-1.5 h-0.5 bg-gray-800 rounded-full ml-0.5"></div>
        </div>
      </div>
      <div className="flex-1">
        <div className="bg-gray-200 rounded-2xl px-4 py-3 max-w-xs">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );

  const quickActions = getQuickActions();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Widget - Fixed Height Container */}
      {isOpen && (
        <div className="mb-4 w-80 h-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300 flex flex-col">
          {/* Header - Fixed */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
                    <div className="w-2 h-1 bg-white rounded-full"></div>
                    <div className="w-2 h-1 bg-white rounded-full ml-1"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-lg font-semibold">
                    Booking ChatBot {userProfile.name && `- ${userProfile.name}`}
                  </h1>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm opacity-90">
                      Online {userProfile.location && `from ${userProfile.location}`}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={toggleChat}
                className="p-2 hover:bg-white/20 rounded-full transition-colors flex items-center justify-center"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Chat Messages - Scrollable */}
          <div className="px-4 py-4 space-y-4 bg-gray-50 flex-1 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start space-x-3 ${msg.isUser ? '' : ''}`}>
                {!msg.isUser && (
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-0.5 bg-gray-800 rounded-full"></div>
                      <div className="w-1.5 h-0.5 bg-gray-800 rounded-full ml-0.5"></div>
                    </div>
                  </div>
                )}
                
                <div className="flex-1">
                  <div className={`rounded-2xl px-4 py-3 max-w-xs ${
                    msg.isUser 
                      ? 'bg-gray-200 text-gray-800' 
                      : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {msg.text}
                    </p>
                  </div>
                  <div className={`flex items-center mt-2 ${msg.isUser ? 'space-x-1' : 'space-x-3'}`}>
                    <span className="text-xs text-gray-500">{msg.timestamp}</span>
                    {msg.isUser && (
                      <div className={`w-3 h-3 ${msg.isRead ? 'text-blue-500' : 'text-gray-400'}`}>
                        <svg viewBox="0 0 12 12" fill="currentColor">
                          <path d="M9.707 3.293a1 1 0 0 0-1.414 0L4 7.586 2.707 6.293a1 1 0 1 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l5-5a1 1 0 0 0 0-1.414z"/>
                        </svg>
                      </div>
                    )}
                    {!msg.isUser && (
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => copyMessage(msg.text)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Copy className="w-3 h-3 text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                          <ThumbsUp className="w-3 h-3 text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                          <ThumbsDown className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {msg.isUser && (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" 
                      alt="User avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions - Fixed */}
          <div className="px-4 py-3 bg-gray-50 flex-shrink-0">
            {quickActions.type === 'horizontal' ? (
              <div className="flex space-x-2 overflow-x-auto">
                {quickActions.actions.map((action, index) => (
                  <button 
                    key={index}
                    onClick={() => handleQuickAction(action.text)}
                    className="bg-white px-3 py-2 rounded-full text-sm text-gray-600 hover:bg-gray-100 transition-colors flex items-center space-x-1 whitespace-nowrap flex-shrink-0"
                  >
                    <span>{action.emoji}</span>
                    <span>{action.text}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {quickActions.actions.map((action, index) => (
                  <button 
                    key={index}
                    onClick={() => handleQuickAction(action.text)}
                    className="w-full bg-white p-3 rounded-xl text-left text-gray-600 hover:bg-gray-100 transition-colors flex items-start space-x-3 group"
                  >
                    <span className="text-lg flex-shrink-0 mt-0.5">{action.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm group-hover:text-gray-800">
                        {action.text}
                      </div>
                      {action.description && (
                        <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                          {action.description}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input Area - Fixed */}
          <div className="px-4 pb-4 bg-gray-50 flex-shrink-0">
            <div className="bg-white rounded-full px-4 py-3 flex items-center space-x-3 shadow-sm">
              <input
                type="text"
                placeholder={
                  userProfile.conversationStage === 'askingName' ? 'Enter your name...' :
                  userProfile.conversationStage === 'askingLocation' ? 'Enter your location...' :
                  userProfile.conversationStage === 'askingInterests' ? 'Tell me your interests...' :
                  userProfile.conversationStage === 'askingReason' ? 'What brings you here?' :
                  'Type your message here...'
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 outline-none text-gray-700 placeholder-gray-400"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!message.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="relative w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        >
          {/* Bot Icon */}
          <div className="relative">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center relative">
                <div className="w-1.5 h-1 bg-cyan-400 rounded-full"></div>
                <div className="w-1.5 h-1 bg-cyan-400 rounded-full ml-1"></div>
                {/* Antenna */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-white rounded-full"></div>
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Hi Speech Bubble */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-cyan-400 text-gray-800 px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce">
            HI!
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-cyan-400"></div>
          </div>

          {/* New Message Notification */}
          {hasNewMessage && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-white text-xs font-bold">1</span>
            </div>
          )}
        </button>
      )}
    </div>
  );
}