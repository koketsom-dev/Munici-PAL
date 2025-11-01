import React, { useEffect, useRef } from 'react';

function ChatForumPage({ messages, newMessage, setNewMessage, handleSendMessage, goBack }) {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-forum-page">
      <div className="chat-header">
        <button onClick={goBack} style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#e5e7eb',
          color: '#1f2937',
          padding: '8px 12px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s',
          fontSize: '14px',
          fontWeight: '500',
          fontFamily: 'inherit'
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#d1d5db';
          e.target.style.transform = 'translateY(-1px)';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = '#e5e7eb';
          e.target.style.transform = 'translateY(0)';
          }}
          >
            <svg 
            style={{ 
              width: '20px', 
              height: '20px', 
              marginRight: '8px',
              flexShrink: 0
              }} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>
    
        <div className="chat-title">
          <h1>Community Chat</h1>
          <p>Ward 12 Discussion Forum</p>
        </div>
      </div>
      
      <div className="chat-container" ref={chatContainerRef}>
        {messages.map(message => (
          <div key={message.id} className={`message ${message.user === 'You' ? 'own-message' : ''}`}>
            <div className="message-header">
              <span className="user">{message.user}</span>
              <span className="time">{message.time}</span>
            </div>
            <div className="message-content">{message.message}</div>
          </div>
        ))}
      </div>
      
      <div className="message-input-container">
        <div className="message-input">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here... (Max 200 characters)"
            rows="2"
            maxLength="200"
          ></textarea>
          <button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim()}
            className="send-btn"
          >
            <span className="send-icon">➤</span>
          </button>
        </div>
        <div className="message-info">
          <span className="char-count">{newMessage.length}/200</span>
          <span className="chat-notice">Messages are retained for 3 weeks</span>
        </div>
      </div>
    </div>
  );
}

export default ChatForumPage;
