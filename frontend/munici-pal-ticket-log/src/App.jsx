import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import DashboardPage from './DashboardPage';
import CreateTicketPage from './CreateTicket';
import ChatForumPage from './ChatForum';
import MyProfilePage from './MyProfile';
import MyTicketHistoryPage from './MyTicketHistory';
import FeedbackPage from './Feedback';
import TechnicalIssuePage from './TechnicalIssue';
import OperationalIssuePage from './OperationalIssue';
import SuggestionPage from './Suggestion';
import HelpPage from './Help';
import AboutPage from './AboutPage';
import logo from './municiPAL.svg';
import { forumAPI, notificationAPI, authAPI, userAPI, ticketAPI } from '../../src/services/api';

const COMMUNITY_TIME_ZONE = 'Africa/Johannesburg';
const communityMessageFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: COMMUNITY_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
});
const communityEnsureDate = (value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }
  const parsed = value ? new Date(value) : new Date();
  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }
  return parsed;
};
const normalizeCommunityStatus = (status) => {
  if (!status) {
    return 'Pending';
  }
  const formatted = String(status).trim().toLowerCase().replace(/[_-]+/g, ' ');
  if (formatted.includes('progress')) {
    return 'In Progress';
  }
  if (formatted.includes('resolve') || formatted.includes('close') || formatted.includes('complete')) {
    return 'Resolved';
  }
  return 'Pending';
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [ticketStatusNotifications, setTicketStatusNotifications] = useState([]);
  const ticketStatusCacheRef = useRef(new Map());
  const ticketStatusInitializedRef = useRef(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const fetchNotifications = async () => {
      // Only fetch notifications if user is authenticated
      if (!authAPI.isLoggedIn()) {
        return;
      }

      try {
        const response = await notificationAPI.list();
        if (response.success && Array.isArray(response.data) && active) {
          const formatted = response.data.map((notification) => {
            const rawId = notification.notification_id ?? notification.id ?? notification.ticket_id ?? null;
            const markPayload = notification.notification_id ?? notification.id ?? notification.ticket_id ?? null;
            const createdAtSource = notification.created_at ?? notification.time ?? null;
            const ticketId = notification.ticket_id ?? null;
            const text = notification.message || notification.notification || notification.description || (ticketId ? `Ticket #${ticketId} update` : 'Ticket update');
            return {
              id: rawId !== null ? `server-${rawId}` : `server-${ticketId ?? Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              text,
              ticketId,
              time: createdAtSource ? communityMessageFormatter.format(communityEnsureDate(createdAtSource)) : '',
              source: 'server',
              markPayload
            };
          });
          setNotifications(formatted);
        }
      } catch (error) {
        console.error('Failed to load notifications:', error);
        // Don't throw error, just log it to prevent app crash
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadTicketStatusUpdates = async () => {
      if (!authAPI.isLoggedIn()) {
        return;
      }
      try {
        const response = await ticketAPI.list({});
        if (!active) {
          return;
        }
        if (response.success && Array.isArray(response.data)) {
          const updates = [];
          const seenIds = new Set();
          response.data.forEach((ticket) => {
            const rawTicketId = ticket.id || ticket.ticket_id;
            if (!rawTicketId) {
              return;
            }
            const ticketKey = String(rawTicketId);
            const statusValue = normalizeCommunityStatus(ticket.status || ticket.ticket_status || ticket.current_status);
            const previousStatus = ticketStatusCacheRef.current.get(ticketKey);
            if (ticketStatusInitializedRef.current && previousStatus && previousStatus !== statusValue) {
              const updatedAtSource = ticket.updated_at || ticket.date_updated || ticket.modified_at || ticket.completedAt || ticket.date_completed || ticket.resolved_at || ticket.createdAt || ticket.date_created || ticket.created_at || new Date();
              updates.push({
                id: `status-${ticketKey}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                text: `Ticket #${rawTicketId} status updated to ${statusValue}`,
                ticketId: rawTicketId,
                time: communityMessageFormatter.format(communityEnsureDate(updatedAtSource)),
                source: 'status',
                status: statusValue
              });
            }
            ticketStatusCacheRef.current.set(ticketKey, statusValue);
            seenIds.add(ticketKey);
          });
          const existingKeys = Array.from(ticketStatusCacheRef.current.keys());
          existingKeys.forEach((key) => {
            if (!seenIds.has(key)) {
              ticketStatusCacheRef.current.delete(key);
            }
          });
          if (!ticketStatusInitializedRef.current) {
            ticketStatusInitializedRef.current = true;
          } else if (updates.length > 0) {
            setTicketStatusNotifications((prev) => {
              const combined = [...updates, ...prev];
              return combined.slice(0, 50);
            });
          }
        }
      } catch (error) {
        if (active) {
          console.error('Failed to fetch ticket updates:', error);
        }
      }
    };

    loadTicketStatusUpdates();
    const interval = setInterval(loadTicketStatusUpdates, 15000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (currentPage === 'chat-forum') {
      fetchMessages();
    }
  }, [currentPage]);

  const fetchMessages = async () => {
    try {
      setChatLoading(true);
      const response = await forumAPI.getMessages(50, 0, 1, null, false);
      if (response.success && response.data.messages) {
        const currentUser = userAPI.getCurrentUser();
        const formattedMessages = response.data.messages.map(msg => ({
          id: msg.message_id,
          user: msg.user_name || 'User',
          userId: msg.user_id,
          message: msg.message_description,
          time: communityMessageFormatter.format(communityEnsureDate(msg.message_sent_timestamp)),
          isOwn: currentUser && msg.user_id === currentUser.id
        }));
        setChatMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setChatLoading(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNotificationClick = async (notification) => {
    if (notification.source === 'status') {
      setTicketStatusNotifications((prev) => prev.filter((item) => item.id !== notification.id));
      return;
    }
    if (notification.source === 'server') {
      const markId = notification.markPayload;
      if (markId !== null && markId !== undefined) {
        const payload = (Array.isArray(markId) ? markId : [markId]).map((value) => {
          const numeric = Number(value);
          return Number.isNaN(numeric) ? value : numeric;
        });
        try {
          await notificationAPI.markRead(payload);
        } catch (error) {
          console.error('Failed to mark notification as read:', error);
        }
      }
      setNotifications((prev) => prev.filter((item) => item.id !== notification.id));
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const messageText = newMessage;
    setNewMessage('');

    try {
      const response = await forumAPI.addMessage('General', messageText, 1, null, false);
      if (response.success) {
        const msg = response.data;
        const currentUser = userAPI.getCurrentUser();
        const newChatMessage = {
          id: msg.message_id,
          user: msg.user_name || 'You',
          userId: msg.user_id,
          message: msg.message_description,
          time: communityMessageFormatter.format(communityEnsureDate(msg.message_sent_timestamp)),
          isOwn: currentUser && msg.user_id === currentUser.id
        };
        setChatMessages([...chatMessages, newChatMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setNewMessage(messageText);
    }
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
    { id: 8, name: 'About', icon: 'ℹ️' },
    { id: 9, name: 'Logout', icon: '🚪', isLogout: true }
  ];

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    } finally {
      setCurrentPage('dashboard');
      setIsMenuOpen(false);
      setChatMessages([]);
      setNotifications([]);
      setNewMessage('');
      setChatLoading(false);
      navigate('/', { replace: true });
    }
  };

  const handleMenuClick = async (itemName) => {
    console.log(`Clicked: ${itemName}`);
    setIsMenuOpen(false);

    switch(itemName) {
      case 'My Profile':
        setCurrentPage('my-profile');
        break;
      case 'My Ticket History':
        setCurrentPage('ticket-history');
        break;
      case 'Munici-PAL Feedback':
        setCurrentPage('feedback');
        break;
      case 'Technical Issue':
        setCurrentPage('technical-issue');
        break;
      case 'Operational Issue':
        setCurrentPage('operational-issue');
        break;
      case 'Suggestion':
        setCurrentPage('suggestion');
        break;
      case 'Help':
        setCurrentPage('help');
        break;
      case 'About':
        setCurrentPage('about');
        break;
      case 'Logout':
        await handleLogout();
        return;
      default:
        break;
    }
  };

  // Rotating banner content
  const bannerContent = [
    "Report issues faster with Munici-PAL",
    "Track your ticket status in real-time",
    "Join your community chat forum"
  ];

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

  const combinedNotifications = [...ticketStatusNotifications, ...notifications];

  // Render different pages based on currentPage state
  const renderPage = () => {
    switch(currentPage) {
      case 'create-ticket':
        return <CreateTicketPage goBack={() => setCurrentPage('dashboard')} />;
      case 'chat-forum':
        return <ChatForumPage 
          messages={chatMessages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          goBack={() => setCurrentPage('dashboard')}
          loading={chatLoading}
        />;
        case 'my-profile':
        return <MyProfilePage goBack={() => setCurrentPage('dashboard')} />;
      case 'ticket-history':
        return <MyTicketHistoryPage goBack={() => setCurrentPage('dashboard')} />;
      case 'feedback':
        return <FeedbackPage goBack={() => setCurrentPage('dashboard')} />;
      case 'technical-issue':
        return <TechnicalIssuePage goBack={() => setCurrentPage('dashboard')} />;
      case 'operational-issue':
        return <OperationalIssuePage goBack={() => setCurrentPage('dashboard')} />;
      case 'suggestion':
        return <SuggestionPage goBack={() => setCurrentPage('dashboard')} />;
      case 'help':
        return <HelpPage goBack={() => setCurrentPage('dashboard')} />;
      case 'about':
      return <AboutPage goBack={() => setCurrentPage('dashboard')} />;
      default:
        return <DashboardPage 
          setCurrentPage={setCurrentPage}
          bannerContent={bannerContent}
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
              {combinedNotifications.length > 0 && (
                <span className="notification-badge">
                  {combinedNotifications.length}
                </span>
              )}
            </button>
            
            {/* Notification dropdown */}
            <div className="notification-dropdown">
              <h3>Notifications</h3>
              {combinedNotifications.length === 0 ? (
                <p>No new notifications</p>
              ) : (
                combinedNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className="notification-item unread"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div>{notification.text}</div>
                    {notification.time ? (
                      <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <div className="header-right">
          <img src={logo} alt="Munich-PAL Logo" className="logo" onClick={() => setCurrentPage('dashboard')} style={{ cursor: 'pointer' }}/>
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
