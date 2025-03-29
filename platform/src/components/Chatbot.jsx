import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../css/Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "¡Hola! Me alegra ayudarte con tus finanzas. ¿En qué puedo asistirte hoy?", sender: 'bot', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyDUp1l7xzq-_Goz2XpUmW_HIwUR4LUFOQk";
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  const IMAGE_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${API_KEY}`;
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile({
          file,
          base64: reader.result.split(',')[1]
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() === '' && !imageFile) return;
  
    const userMessage = { 
      text: inputText, 
      sender: 'user',
      timestamp: new Date(),
      image: imageFile?.file
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
  
    try {
      let response;
      const headers = {
        "Content-Type": "application/json"
      };
      
      const systemPrompt = "Eres un asistente experto en finanzas personales. Proporciona mensajes acerca de ese tema, no muy largos, charla un poco con el y si te pide una respuesta concisa adelante.";
      // Determine which API endpoint to use based on whether an image is present
      if (imageFile) {
        // Para imágenes seguimos usando la API de Gemini Pro Vision
        const data = {
          contents: [{
            role: "user",
            parts: [
              { text: systemPrompt + " " + (inputText || "Analiza esta imagen financiera") },
              { 
                inlineData: { 
                  mimeType: imageFile.file.type, 
                  data: imageFile.base64 
                } 
              }
            ]
          }]
        };
        
        response = await axios.post(IMAGE_URL, data, { headers });
      } else {
        // Para texto usamos Gemini 2.0 Flash con la nueva estructura
        const data = {
          contents: [{
            parts: [{text: systemPrompt + " " + inputText}]
          }]
        };
        
        response = await axios.post(URL, data, { 
          headers,
          timeout: 30000
        });
      }
      
      const botResponse = response.data.candidates[0].content.parts[0].text;
  
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: botResponse, 
          sender: 'bot',
          timestamp: new Date()
        }]);
        setIsLoading(false);
        setImageFile(null);
      }, 500);
  
    } catch (error) {
      console.error('Error comunicating with Gemini API:', error);
      
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.", 
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

  const startVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'es-ES';
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
    };
    recognition.start();
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const LoadingIndicator = () => (
    <div className="loading-dots">
      <div className="dot" style={{animationDelay: '0s'}}></div>
      <div className="dot" style={{animationDelay: '0.2s'}}></div>
      <div className="dot" style={{animationDelay: '0.4s'}}></div>
    </div>
  );

  const clearChat = () => {
    setMessages([
      { text: "¡Hola! Soy tu asistente de gestión financiera. Estoy aquí para ayudarte con consejos de ahorro, presupuesto y finanzas personales.", sender: 'bot', timestamp: new Date() }
    ]);
  };

  return (
    <>
      <div 
        className="chat-button" 
        onClick={toggleChat}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        <svg className="chat-icon" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
        </svg>
      </div>

      <div 
        className={`chat-window finance-chat ${!isOpen ? 'hidden' : ''}`}
        aria-hidden={!isOpen}
      >
        <div className="chat-header">
          <h3>Asesor Financiero</h3>
          <div className="header-actions">
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
              {message.image && (
                <div className="message-image">
                  <img 
                    src={URL.createObjectURL(message.image)} 
                    alt="Uploaded" 
                    className="uploaded-image"
                  />
                </div>
              )}
              <div className="message-content">{message.text}</div>
              <div className="message-time">{formatTime(message.timestamp)}</div>
            </div>
          ))}
          {isLoading && <LoadingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <button 
            className="microphone-button"
            onClick={startVoiceInput}
            aria-label="Iniciar entrada de voz"
          >
            <svg viewBox="0 0 24 24" className="mic-icon">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.21-1.79 4-4 4s-4-1.79-4-4H5c0 3.21 2.3 5.88 5.31 6.41V21h2.14v-3.59C16.7 17.48 19 14.81 19 11h-2z"/>
            </svg>
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button 
            className="image-upload-button"
            onClick={() => fileInputRef.current.click()}
            aria-label="Subir imagen"
          >
            <svg viewBox="0 0 24 24" className="image-icon">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          </button>
          
          <input
            type="text"
            placeholder="Pregunta sobre finanzas..."
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
            disabled={inputText.trim() === '' && !imageFile}
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