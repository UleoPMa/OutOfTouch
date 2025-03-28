import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../css/Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?", sender: 'bot', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ⚠️ IMPORTANT: In production, this API key should be stored on the server side
  // Use an environment variable or server proxy to protect your API key
  const API_KEY = process.env.REACT_APP_DEEPSEEK_API_KEY || "sk-fabc1906b7834664a5ac0dc358d2c768";
  const URL = "https://api.deepseek.com/chat/completions ";

  // Load saved messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Error loading saved messages:', e);
      }
    }
    scrollToBottom();
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 1) { // Don't save just the welcome message
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages]);

  // Focus input field when chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    // Add user message
    const userMessage = { 
      text: inputText, 
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Configure API request to Deepseek
      const headers = {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      };
      
      // Get conversation history for context (last 10 messages)
      const recentMessages = messages.slice(-10).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      
      const data = {
        "model": "deepseek-chat",
        "messages": [
          ...recentMessages,
          {"role": "user", "content": inputText}
        ]
      };
      
      // Send request with error handling
      const response = await axios.post(URL, data, { 
        headers,
        timeout: 30000 // 30 second timeout
      });
      
      const botResponse = response.data.choices[0].message.content;

      // Add bot response with a small delay to simulate typing
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: botResponse, 
          sender: 'bot',
          timestamp: new Date()
        }]);
        setIsLoading(false);
      }, 500);

    } catch (error) {
      console.error('Error communicating with API:', error);
      
      // More detailed error logging
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      
      // User-friendly error message
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, inténtalo de nuevo más tarde.", 
          sender: 'bot',
          timestamp: new Date(),
          isError: true
        }]);
        setIsLoading(false);
      }, 500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format timestamp to display time only (HH:MM)
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Component for loading indicators
  const LoadingIndicator = () => (
    <div className="loading-dots">
      <div className="dot" style={{animationDelay: '0s'}}></div>
      <div className="dot" style={{animationDelay: '0.2s'}}></div>
      <div className="dot" style={{animationDelay: '0.4s'}}></div>
    </div>
  );

  // Clear all messages except the welcome message
  const clearChat = () => {
    const welcomeMessage = messages[0];
    setMessages([welcomeMessage]);
    localStorage.removeItem('chatMessages');
  };

  return (
    <>
      {/* Chat floating button */}
      <div 
        className="chat-button" 
        onClick={toggleChat}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen ? (
          <svg className="chat-icon" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        ) : (
          <svg className="chat-icon" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
        )}
      </div>

      {/* Chat window */}
      <div 
        className={`chat-window ${!isOpen ? 'hidden' : ''}`}
        aria-hidden={!isOpen}
      >
        <div className="chat-header">
          <h3>Asistente Virtual</h3>
          <div className="header-actions">
            {messages.length > 1 && (
              <button 
                onClick={clearChat}
                className="clear-button"
                aria-label="Borrar conversación"
                title="Borrar conversación"
              >
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </button>
            )}
            <button 
              onClick={toggleChat}
              className="close-button"
              aria-label="Cerrar chat"
            >
              <svg 
                className="close-icon" 
                viewBox="0 0 24 24"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'} ${message.isError ? 'error-message' : ''}`}
            >
              <div className="message-content">{message.text}</div>
              <div className="message-time">{formatTime(message.timestamp)}</div>
            </div>
          ))}
          {isLoading && <LoadingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="message-input"
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            ref={inputRef}
            aria-label="Mensaje"
          />
          <button 
            className="send-button"
            onClick={sendMessage}
            disabled={inputText.trim() === '' || isLoading}
            aria-label="Enviar mensaje"
          >
            <svg className="send-icon" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;