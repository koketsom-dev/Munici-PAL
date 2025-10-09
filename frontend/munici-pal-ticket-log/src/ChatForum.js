import React, { useEffect, useRef } from 'react';

function ChatForumPage({ 
  chatThreads, 
  newThreadTitle, 
  setNewThreadTitle, 
  newThreadMessage, 
  setNewThreadMessage,
  newReply,
  setNewReply,
  threadCategory,
  setThreadCategory,
  handleCreateThread,
  handleSendReply,
  selectedThread,
  setSelectedThread,
  markThreadAsResolved,
  goBack 
}) {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatThreads, selectedThread]);

  const selectedThreadData = chatThreads.find(thread => thread.id === selectedThread);

  return (
    <div className="chat-forum-page">
      <div className="chat-header">
        <button className="back-btn" onClick={goBack}>
          <span className="back-icon">←</span>
          Back to Dashboard
        </button>
        <div className="chat-title">
          <h1>Community Forum</h1>
          <p>Ward 12 Discussion Forum - Organized Threads</p>
        </div>
      </div>
      
      <div className="forum-container">
        {/* Threads List*/}
        <div className="threads-list">
          <div className="threads-header">
            <h3>Discussion Threads</h3>
            <span className="threads-count">{chatThreads.length} threads</span>
          </div>
          
          {/* Quick Create Thread */}
          <div className="create-thread-section">
            <button 
              className="primary-btn create-thread-btn"
              onClick={() => {
                if (newThreadTitle.trim() === '') {
                  setNewThreadTitle('New Discussion');
                }
                document.querySelector('.thread-title-input')?.focus();
              }}
            >
              <span className="btn-icon">➕</span>
              Start New Thread
            </button>
          </div>
          
          {/* Threads List - SCROLLABLE AREA */}
          <div className="threads-container">
            {chatThreads.map(thread => (
              <div 
                key={thread.id} 
                className={`thread-item ${selectedThread === thread.id ? 'active' : ''} ${thread.isResolved ? 'resolved' : ''}`}
                onClick={() => setSelectedThread(thread.id)}
              >
                <div className="thread-header">
                  <h4 className="thread-title">{thread.title}</h4>
                  {thread.isResolved && <span className="resolved-badge">Resolved</span>}
                </div>
                <div className="thread-meta">
                  <span className="thread-category">{thread.category}</span>
                  <span className="thread-time">{thread.time}</span>
                </div>
                <div className="thread-preview-container">
                  <p className="thread-preview">{thread.initialMessage}</p>
                  <div className="thread-stats">
                    <span className="replies-count">{thread.replies.length} replies</span>
                    <span className="thread-user">by {thread.user}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Thread View & Creation - COMBINED */}
        <div className="thread-view">
          {selectedThreadData ? (
            <>
              <div className="thread-view-header">
                <div className="thread-view-title">
                  <h3>{selectedThreadData.title}</h3>
                  <div className="thread-actions">
                    {selectedThreadData.isResolved ? (
                      <span className="resolved-badge">Resolved</span>
                    ) : (
                      <button 
                        onClick={() => markThreadAsResolved(selectedThreadData.id)}
                        className="resolve-btn"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
                <div className="thread-view-meta">
                  <span>Started by <strong>{selectedThreadData.user}</strong></span>
                  <span>{selectedThreadData.time}</span>
                  <span className="thread-category-badge">{selectedThreadData.category}</span>
                </div>
              </div>
              
              {/* Messages Area - SINGLE SCROLLABLE AREA */}
              <div className="thread-messages" ref={chatContainerRef}>
                {/* Initial message */}
                <div className="thread-initial-message">
                  <div className="message-header">
                    <span className="user">{selectedThreadData.user}</span>
                    <span className="time">{selectedThreadData.time}</span>
                  </div>
                  <div className="message-content">{selectedThreadData.initialMessage}</div>
                </div>
                
                {/* Replies */}
                {selectedThreadData.replies.map(reply => (
                  <div key={reply.id} className={`message ${reply.user === 'You' ? 'own-message' : ''}`}>
                    <div className="message-header">
                      <span className="user">{reply.user}</span>
                      <span className="time">{reply.time}</span>
                    </div>
                    <div className="message-content">{reply.message}</div>
                  </div>
                ))}
              </div>
              
              {/* Reply Input - FIXED AT BOTTOM */}
              {!selectedThreadData.isResolved && (
                <div className="reply-input-container">
                  <div className="message-input">
                    <textarea
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      placeholder="Type your reply here... (Max 300 characters)"
                      rows="2"
                      maxLength="300"
                    ></textarea>
                    <button 
                      onClick={() => handleSendReply(selectedThreadData.id)}
                      disabled={!newReply.trim()}
                      className="send-btn"
                    >
                      <span className="send-icon">➤</span>
                    </button>
                  </div>
                  <div className="message-info">
                    <span className="char-count">{newReply.length}/300</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Create new thread view when no thread is selected */
            <div className="create-thread-view">
              <div className="create-thread-header">
                <h3>Start a New Discussion</h3>
                <p>Create a new thread to discuss community issues</p>
              </div>
              
              <div className="thread-creation-form">
                <div className="form-group">
                  <label htmlFor="threadTitle">Thread Title *</label>
                  <input
                    type="text"
                    id="threadTitle"
                    value={newThreadTitle}
                    onChange={(e) => setNewThreadTitle(e.target.value)}
                    placeholder="What would you like to discuss?"
                    className="thread-title-input"
                    maxLength="100"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="threadCategory">Category *</label>
                  <select
                    id="threadCategory"
                    value={threadCategory}
                    onChange={(e) => setThreadCategory(e.target.value)}
                    className="thread-category-select"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Road Issues">Road Issues</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Water">Water</option>
                    <option value="Refuse">Refuse</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="threadMessage">Your Message *</label>
                  <textarea
                    id="threadMessage"
                    value={newThreadMessage}
                    onChange={(e) => setNewThreadMessage(e.target.value)}
                    placeholder="Describe your issue or topic in detail..."
                    rows="6"
                    className="thread-message-input"
                    maxLength="500"
                  ></textarea>
                </div>
                
                <div className="form-actions">
                  <button 
                    onClick={handleCreateThread}
                    disabled={!newThreadTitle.trim() || !newThreadMessage.trim() || !threadCategory}
                    className="primary-btn create-thread-btn"
                  >
                    Create Discussion Thread
                  </button>
                </div>
              </div>
              
              <div className="creation-tips">
                <h4>💡 Tips for a good discussion:</h4>
                <ul>
                  <li>Be clear and specific about the issue</li>
                  <li>Include location details if relevant</li>
                  <li>Keep the discussion respectful</li>
                  <li>Choose the right category for better visibility</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatForumPage;