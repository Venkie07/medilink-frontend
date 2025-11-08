// API Configuration
// This file centralizes the API URL configuration
// Update PRODUCTION_URL below with your Render backend URL after deployment

(function() {
    'use strict';
    
    // Configuration
    const PRODUCTION_URL = 'https://your-backend-url.onrender.com/api'; // ⚠️ UPDATE THIS with your Render URL
    const DEVELOPMENT_URL = 'http://localhost:5000/api';
    
    // Auto-detect environment
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname.includes('localhost');
    
    // Set global API_BASE_URL
    window.API_BASE_URL = isDevelopment ? DEVELOPMENT_URL : PRODUCTION_URL;
    
    console.log('API Base URL:', window.API_BASE_URL);
})();

