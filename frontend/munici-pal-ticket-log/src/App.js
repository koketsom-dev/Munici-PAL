import React, { useState, useEffect } from 'react';
import './App.css';
import DashboardPage from './DashboardPage';
import CreateTicketPage from './CreateTicket';
import ChatForumPage from './ChatForum';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Your ticket #1234 has been resolved', read: false },
    { id: 2, text: 'New message in community chat', read: false },
    { id: 3, text: 'Water outage reported in your area', read: true }
  ]);
  const [chatThreads, setChatThreads] = useState([
    { 
      id: 1, 
      title: 'Pothole on Main Street', 
      user: 'Sarah K', 
      initialMessage: 'Has anyone reported the pothole on Main St? It\'s getting really bad near the intersection with Oak Ave.', 
      time: '10:30 AM',
      replies: [
        { id: 2, user: 'John M', message: 'Yes, I reported it yesterday. Status is "In Progress"', time: '10:45 AM' },
        { id: 3, user: 'Municipal Worker', message: 'We\'ve scheduled repairs for tomorrow morning', time: '11:00 AM' }
      ],
      category: 'Road Issues',
      isResolved: false
    },
    { 
      id: 4, 
      title: 'Street Light Outage', 
      user: 'Mike T', 
      initialMessage: 'The street light at the corner of 5th and Maple has been out for 3 days now. It\'s getting dangerous at night.', 
      time: 'Yesterday',
      replies: [
        { id: 5, user: 'Municipal Worker', message: 'We have a work order for this. Electrician will visit tomorrow.', time: 'Yesterday' }
      ],
      category: 'Electrical',
      isResolved: false
    },
    { 
      id: 6, 
      title: 'Garbage Collection Missed', 
      user: 'Lisa R', 
      initialMessage: 'Our garbage wasn\'t collected on Tuesday on Elm Street between numbers 100-150. Anyone else experiencing this?', 
      time: '2 days ago',
      replies: [
        { id: 7, user: 'Robert J', message: 'Same here at #142. Called the sanitation department and they said they\'ll collect tomorrow.', time: '2 days ago' }
      ],
      category: 'Refuse',
      isResolved: true
    }
  ]);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadMessage, setNewThreadMessage] = useState('');
  const [newReply, setNewReply] = useState('');
  const [selectedThread, setSelectedThread] = useState(null);
  const [threadCategory, setThreadCategory] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? {...notification, read: true} : notification
    ));
  };

  const handleCreateThread = () => {
    if (newThreadTitle.trim() !== '' && newThreadMessage.trim() !== '' && threadCategory !== '') {
      const newThread = {
        id: chatThreads.length + 1,
        title: newThreadTitle,
        user: 'You',
        initialMessage: newThreadMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        replies: [],
        category: threadCategory,
        isResolved: false
      };
      setChatThreads([newThread, ...chatThreads]);
      setNewThreadTitle('');
      setNewThreadMessage('');
      setThreadCategory('');
      setSelectedThread(newThread.id);
    }
  };

  const handleSendReply = (threadId) => {
    if (newReply.trim() !== '') {
      const updatedThreads = chatThreads.map(thread => {
        if (thread.id === threadId) {
          const newReplyObj = {
            id: thread.replies.length + 1,
            user: 'You',
            message: newReply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          return {
            ...thread,
            replies: [...thread.replies, newReplyObj]
          };
        }
        return thread;
      });
      setChatThreads(updatedThreads);
      setNewReply('');
    }
  };

  const markThreadAsResolved = (threadId) => {
    const updatedThreads = chatThreads.map(thread => 
      thread.id === threadId ? {...thread, isResolved: true} : thread
    );
    setChatThreads(updatedThreads);
  };

  // Menu items data
  const menuItems = [
    { id: 1, name: 'My Profile', icon: '👤' },
    { id: 2, name: 'My Ticket History', icon: '📋' },
    { id: 3, name: 'Munici-PAL Feedback', icon: '💬' },
    { id: 4, name: 'Technical Issue', icon: '🔧' },
    { id: 5, name: 'Operational Issue', icon: '⚙️' },
    { id: 6, name: 'Suggestion', icon: '💡' },
    { id: 7, name: 'Help', icon: '❓' },
    { id: 8, name: 'Logout', icon: '🚪', isLogout: true }
  ];

  const handleMenuClick = (itemName) => {
    console.log(`Clicked: ${itemName}`);
    setIsMenuOpen(false);
  };

  // Rotating banner content
  const bannerContent = [
    "Report issues faster with Munich-PAL",
    "Track your ticket status in real-time",
    "Join your community chat forum"
  ];
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerContent.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerContent.length]);

  // Common issues data
  const commonIssues = [
    {
      id: 1,
      type: 'Road Issues',
      color: '#E50914',
      icon: '🛣️',
      description: 'Potholes, road damage, traffic signs',
      examples: 'Potholes, cracked pavement, missing signs'
    },
    {
      id: 2,
      type: 'Electrical',
      color: '#FFFF00',
      icon: '💡',
      description: 'Street lights, power outages, electrical hazards',
      examples: 'Street light outage, exposed wires, power failure'
    },
    {
      id: 3,
      type: 'Water',
      color: '#2BA1C5',
      icon: '💧',
      description: 'Water leaks, pipe bursts, water quality',
      examples: 'Leaking pipes, low water pressure, discolored water'
    },
    {
      id: 4,
      type: 'Refuse',
      color: '#9C5708',
      icon: '🗑️',
      description: 'Garbage collection, illegal dumping, recycling',
      examples: 'Missed collection, overflowing bins, illegal dumping'
    }
  ];

  // Render different pages based on currentPage state
  const renderPage = () => {
    switch(currentPage) {
      case 'create-ticket':
        return <CreateTicketPage goBack={() => setCurrentPage('dashboard')} />;
      case 'chat-forum':
        return <ChatForumPage 
          chatThreads={chatThreads}
          newThreadTitle={newThreadTitle}
          setNewThreadTitle={setNewThreadTitle}
          newThreadMessage={newThreadMessage}
          setNewThreadMessage={setNewThreadMessage}
          newReply={newReply}
          setNewReply={setNewReply}
          threadCategory={threadCategory}
          setThreadCategory={setThreadCategory}
          handleCreateThread={handleCreateThread}
          handleSendReply={handleSendReply}
          selectedThread={selectedThread}
          setSelectedThread={setSelectedThread}
          markThreadAsResolved={markThreadAsResolved}
          goBack={() => setCurrentPage('dashboard')}
        />;
      default:
        return <DashboardPage 
          setCurrentPage={setCurrentPage}
          bannerContent={bannerContent}
          currentBanner={currentBanner}
          commonIssues={commonIssues}
        />;
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <button className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          {/* Notifications */}
          <div className="notifications">
            <button className="notification-btn">
              <span className="notification-icon">🔔</span>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="notification-badge">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            
            {/* Notification dropdown */}
            <div className="notification-dropdown">
              <h3>Notifications</h3>
              {notifications.length === 0 ? (
                <p>No new notifications</p>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    {notification.text}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <div className="header-right">
          <img src="/logo.JPG" alt="Munich-PAL Logo" className="logo" />
        </div>
      </header>

      {/* Hamburger Menu */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={toggleMenu}>
          <div className="menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="menu-header">
              <h2>Menu</h2>
              <button className="close-menu" onClick={toggleMenu}>×</button>
            </div>
            <ul>
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button 
                    className={item.isLogout ? 'logout-btn' : ''}
                    onClick={() => handleMenuClick(item.name)}
                  >
                    <span className="menu-item-icon">{item.icon}</span>
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
