// Unified API Service for Munici-PAL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper function to handle API responses
const handleResponse = async (response) => {
  let data;
  let responseText = '';
  try {
    responseText = await response.text();
    data = JSON.parse(responseText);
  } catch (e) {
    console.error('Response parsing error:', {
      status: response.status,
      statusText: response.statusText,
      responseText: responseText.substring(0, 500),
      error: e.message
    });
    throw new Error(`Invalid response from server: ${response.status} - ${e.message}`);
  }

  if (!response.ok) {
    const errorMessage = data.message || data.error || `Request failed: ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
};

// Helper function for authenticated requests
const authenticatedFetch = (url, options = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include', // Include cookies for session authentication
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
};

// Authentication API
export const authAPI = {
  login: async (email, password, userType) => {
    const response = await fetch(`${API_BASE_URL}/login/login.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
        password,
        user_type: userType
      })
    });

    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/login/register.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    return handleResponse(response);
  },

  logout: async () => {
    try {
      await fetch(`${API_BASE_URL}/login/logout.php`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('user');
  },

  verify: async () => {
    const response = await fetch(`${API_BASE_URL}/login/verify.php`, {
      method: 'GET',
      credentials: 'include'
    });

    return handleResponse(response);
  },

  resetPassword: async (email) => {
    const response = await fetch(`${API_BASE_URL}/login/reset-password.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email })
    });

    return handleResponse(response);
  },

  isLoggedIn: () => {
    const userStr = localStorage.getItem('user');
    return !!userStr;
  }
};

// Forum API
export const forumAPI = {
  getMessages: async (limit = 50, offset = 0, roomId = 1, ticketId = null, isPrivate = null) => {
    let url = `${API_BASE_URL}/forum/get-messages.php?limit=${limit}&offset=${offset}&room_id=${roomId}`;
    if (ticketId !== null) {
      url += `&ticket_id=${ticketId}`;
    }
    if (isPrivate !== null) {
      url += `&is_private=${isPrivate}`;
    }
    const response = await authenticatedFetch(url, {
      method: 'GET'
    });

    return handleResponse(response);
  },

  addMessage: async (subject, message, roomId = 1, ticketId = null, isPrivate = null) => {
    const body = {
      message_subject: subject,
      message_description: message,
      room_id: roomId,
      is_private: isPrivate
    };
    if (ticketId) {
      body.ticket_id = ticketId;
    }
    const response = await authenticatedFetch(`${API_BASE_URL}/forum/add-message.php`, {
      method: 'POST',
      body: JSON.stringify(body)
    });

    return handleResponse(response);
  }
};

// Ticket API
export const ticketAPI = {
  create: async (ticketData) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/ticket/add-ticket.php`, {
      method: 'POST',
      body: JSON.stringify(ticketData)
    });

    return handleResponse(response);
  },

  list: async (filters = {}) => {
    const user = userAPI.getCurrentUser();
    const isAdmin = user && user.access_level === 'Admin';
    const endpoint = isAdmin ? `${API_BASE_URL}/admin/get-all-tickets.php` : `${API_BASE_URL}/ticket/get-my-tickets.php`;
    const queryParams = new URLSearchParams(filters);
    const response = await authenticatedFetch(`${endpoint}?${queryParams}`, {
      method: 'GET'
    });

    return handleResponse(response);
  },

  getById: async (ticketId) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/ticket/ticket-search.php?id=${ticketId}`, {
      method: 'GET'
    });

    return handleResponse(response);
  },

  update: async (ticketId, updateData) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/ticket/update-ticket.php`, {
      method: 'PUT',
      body: JSON.stringify({
        ticket_id: ticketId,
        ...updateData
      })
    });

    return handleResponse(response);
  },

  delete: async (ticketId) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/ticket/delete-ticket.php`, {
      method: 'DELETE',
      body: JSON.stringify({ ticket_id: ticketId })
    });

    return handleResponse(response);
  },

  search: async (searchTerm) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/ticket/ticket-search.php?search=${encodeURIComponent(searchTerm)}`, {
      method: 'GET'
    });

    return handleResponse(response);
  },

  sort: async (sortBy, order = 'ASC') => {
    const response = await authenticatedFetch(`${API_BASE_URL}/ticket/sort-ticket.php?sort_by=${sortBy}&order=${order}`, {
      method: 'GET'
    });

    return handleResponse(response);
  },

  uploadImage: async (ticketId, imageFile) => {
    const formData = new FormData();
    formData.append('ticket_id', ticketId);
    formData.append('image', imageFile);

    // No token needed, using session-based authentication
    const response = await fetch(`${API_BASE_URL}/ticket/upload-ticket-image.php`, {
      method: 'POST',
      body: formData
    });

    return handleResponse(response);
  },

  assign: async (ticketId, employeeId) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/admin/assign-ticket.php`, {
      method: 'POST',
      body: JSON.stringify({
        ticket_id: ticketId,
        assignee_id: employeeId
      })
    });

    return handleResponse(response);
  }
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/dashboard/stats.php`, {
      method: 'GET'
    });

    return handleResponse(response);
  }
};

// Notification API
export const notificationAPI = {
  list: async () => {
    const response = await authenticatedFetch(`${API_BASE_URL}/ticket/notifications.php`, {
      method: 'GET'
    });

    return handleResponse(response);
  },

  markRead: async (notificationIds) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/ticket/notifications.php`, {
      method: 'PUT',
      body: JSON.stringify({ notification_ids: notificationIds })
    });

    return handleResponse(response);
  }
};

// Admin API
export const adminAPI = {
  getEmployees: async () => {
    const response = await authenticatedFetch(`${API_BASE_URL}/admin/get-employees.php`, {
      method: 'GET'
    });

    return handleResponse(response);
  },

  assignTicket: async (ticketId, assigneeId) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/admin/assign-ticket.php`, {
      method: 'POST',
      body: JSON.stringify({
        ticket_id: ticketId,
        assignee_id: assigneeId,
      }),
    });

    return handleResponse(response);
  },

  addEmployee: async (employeeData) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/admin/add-employee.php`, {
      method: 'POST',
      body: JSON.stringify(employeeData)
    });

    return handleResponse(response);
  },

  updateEmployee: async (employeeId, updateData) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/admin/update-employee.php`, {
      method: 'PUT',
      body: JSON.stringify({
        employee_id: employeeId,
        ...updateData
      })
    });

    return handleResponse(response);
  },

  deleteEmployee: async (employeeId) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/admin/delete-employee.php`, {
      method: 'DELETE',
      body: JSON.stringify({ employee_id: employeeId })
    });

    return handleResponse(response);
  },

  // Community User Management
  getCommunityUsers: async () => {
    const response = await authenticatedFetch(`${API_BASE_URL}/admin/get-community-users.php`, {
      method: 'GET'
    });

    return handleResponse(response);
  },

  addCommunityUser: async (userData) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/admin/add-community-user.php`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    return handleResponse(response);
  },

  updateCommunityUser: async (userId, updateData) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/admin/update-community-user.php`, {
      method: 'PUT',
      body: JSON.stringify({
        user_id: userId,
        ...updateData
      })
    });

    return handleResponse(response);
  },

  deleteCommunityUser: async (userId) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/admin/delete-community-user.php`, {
      method: 'DELETE',
      body: JSON.stringify({ user_id: userId })
    });

    return handleResponse(response);
  },

  // Contacts Management
  getContacts: async () => {
    const response = await authenticatedFetch(`${API_BASE_URL}/admin/get-contacts.php`, {
      method: 'GET'
    });

    return handleResponse(response);
  },

  addContact: async (contactData) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/admin/add-contact.php`, {
      method: 'POST',
      body: JSON.stringify(contactData)
    });

    return handleResponse(response);
  },

  deleteContact: async (contactId) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/admin/delete-contact.php`, {
      method: 'DELETE',
      body: JSON.stringify({ contact_id: contactId })
    });

    return handleResponse(response);
  },

  // Leave Calendar Management
  getLeaveEntries: async () => {
    const response = await authenticatedFetch(`${API_BASE_URL}/admin/get-leave-entries.php`, {
      method: 'GET'
    });

    return handleResponse(response);
  },

  addLeaveEntry: async (leaveData) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/admin/add-leave-entry.php`, {
      method: 'POST',
      body: JSON.stringify(leaveData)
    });

    return handleResponse(response);
  },

  deleteLeaveEntry: async (leaveId) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/admin/delete-leave-entry.php`, {
      method: 'DELETE',
      body: JSON.stringify({ leave_id: leaveId })
    });

    return handleResponse(response);
  }
};

// User Management
export const userAPI = {
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!userAPI.getCurrentUser();
  },

  getUserType: () => {
    const user = userAPI.getCurrentUser();
    return user?.user_type || null;
  },

  getProfile: async () => {
    const response = await authenticatedFetch(`${API_BASE_URL}/user/get-profile.php`, {
      method: 'GET'
    });

    return handleResponse(response);
  },

  updateProfile: async (profileData) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/user/update-profile.php`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });

    return handleResponse(response);
  }
};

export default {
  authAPI,
  forumAPI,
  ticketAPI,
  dashboardAPI,
  notificationAPI,
  adminAPI,
  userAPI
};
