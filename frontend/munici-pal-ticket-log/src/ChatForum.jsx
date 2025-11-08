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
        <button className="back-btn" onClick={goBack}>
          <span className="back-icon">←</span>
          Back
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
