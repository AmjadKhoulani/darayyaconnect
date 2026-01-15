import axios from 'axios';

// The base URL for the API. 
// IMPORTANT: Update this IP if your Mac's IP changes
// To find your Mac's IP: System Preferences -> Network
// Update this to your local IP for Android testing
const BASE_URL = 'https://darayyaconnect.com/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Add request interceptor for auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Debug logging
        console.log(`✅ API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);

        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
    (response) => {
        console.log(`✅ API Success: ${response.config.url} - Status: ${response.status}`);
        return response;
    },
    (error) => {
        console.error('❌ API Error:', error);

        if (error.code === 'ECONNABORTED') {
            console.error('⏱️ Request timeout - Server took too long');
        } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
            console.error('🌐 Network Error - Cannot reach server');
            console.error(`Trying to connect to: ${BASE_URL}`);
            // Alert removed to avoid annoyance in production
        } else if (error.response) {
            console.error(`❌ Response error: ${error.response.status}`, error.response.data);
            if (error.response.status === 404) {
                console.error('📭 Endpoint not found:', error.config.url);
            }
        } else if (error.request) {
            console.error('📡 No response received from server');
            console.error('Request was sent but no response:', error.request);
        }

        return Promise.reject(error);
    }
);

function getWiFiName() {
    // Try to extract WiFi name from IP
    const ip = BASE_URL.split('://')[1].split(':')[0];
    return ip.startsWith('192.168.') ? 'Local WiFi' : 'Unknown Network';
}

export default api;
