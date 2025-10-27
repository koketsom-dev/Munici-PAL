// API Configuration
const API_BASE_URL = 'http://localhost:8000';

// Authentication API
export const authAPI = {
  login: async (email, password, userType) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          user_type: userType
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Login failed: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      return data;

    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to server. Please check your connection.');
      }
      throw error;
    }
  }
};

export default authAPI;