// Authentication utilities
// API URL is configured in config.js - make sure config.js is loaded first
const API_BASE_URL = window.API_BASE_URL || 'https://medilink-backend-24jm.onrender.com//api';

const auth = {
    // Get token from localStorage
    getToken() {
        return localStorage.getItem('token');
    },

    // Get user from localStorage
    getUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    },

    // Set token and user
    setAuth(token, user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },

    // Clear authentication
    clearAuth() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Get headers with token
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return headers;
    },

    // Login
    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.setAuth(data.token, data.user);
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.error || 'Login failed' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Network error. Please check your connection.' };
        }
    },

    // Signup
    async signup(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                this.setAuth(data.token, data.user);
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.error || 'Signup failed' };
            }
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: 'Network error. Please check your connection.' };
        }
    },

    // Get current user
    async getCurrentUser() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, user: data };
            } else {
                this.clearAuth();
                return { success: false, error: data.error || 'Failed to get user' };
            }
        } catch (error) {
            console.error('Get user error:', error);
            return { success: false, error: 'Network error' };
        }
    },

    // Logout
    logout() {
        this.clearAuth();
        window.location.href = '../login.html';
    },

    // Make authenticated API request
    async apiRequest(url, options = {}) {
        const defaultOptions = {
            headers: this.getHeaders(),
            ...options
        };

        if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
            defaultOptions.body = JSON.stringify(options.body);
            defaultOptions.headers['Content-Type'] = 'application/json';
        }

        try {
            const response = await fetch(`${API_BASE_URL}${url}`, defaultOptions);
            const data = await response.json();

            if (response.status === 401) {
                // Token expired or invalid
                this.clearAuth();
                window.location.href = '../login.html';
                return { success: false, error: 'Session expired. Please login again.' };
            }

            return { success: response.ok, data, error: data.error };
        } catch (error) {
            console.error('API request error:', error);
            return { success: false, error: 'Network error' };
        }
    }
};

