import axios from 'axios';

// The base URL for the API. 
// IMPORTANT: Update this IP if your Mac's IP changes
// To find your Mac's IP: System Preferences -> Network
const BASE_URL = 'http://192.168.1.90:8000/api';

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
            alert('⏱️ انتهت مهلة الطلب. السيرفر بطيء جداً.');
        } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
            console.error('🌐 Network Error - Cannot reach server');
            console.error(`Trying to connect to: ${BASE_URL}`);
            alert(`🌐 فشل الاتصال بالسيرفر.\n\nالسيرفر: ${BASE_URL}\n\nتأكد من:\n1. أنك متصل بنفس WiFi (${getWiFiName()})\n2. السيرفر شغال\n3. الـ firewall مش بلوك الاتصال`);
        } else if (error.response) {
            console.error(`❌ Response error: ${error.response.status}`, error.response.data);
            if (error.response.status === 404) {
                console.error('📭 Endpoint not found:', error.config.url);
            } else if (error.response.status === 500) {
                alert('💥 خطأ في السيرفر. تحقق من Laravel logs.');
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
