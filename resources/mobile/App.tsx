import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { PermissionService } from './services/PermissionService';
import Home from './pages/Home';
import Studies from './pages/Studies';
import StudyDetail from './pages/StudyDetail';
import AwarenessDetail from './pages/AwarenessDetail';
import Profile from './pages/Profile';
import ServicesStatus from './pages/ServicesStatus';
import WaterStatus from './pages/WaterStatus';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import HashtagChat from './pages/HashtagChat';
import SkillsPortal from './pages/SkillsPortal';
import PrivacyPolicyMobile from './pages/PrivacyPolicyMobile';
import Login from './pages/Login';
import Register from './pages/Register';
import Splash from './pages/Splash';
import SetupLocation from './pages/SetupLocation';
import AddReport from './pages/AddReport';
import Initiatives from './pages/Initiatives';
import AddInitiative from './pages/AddInitiative';
import InitiativeDetail from './pages/InitiativeDetail';
import Discussions from './pages/Discussions';
import AddDiscussion from './pages/AddDiscussion';
import DiscussionDetail from './pages/DiscussionDetail';
import Directory from './pages/Directory';
import Map from './pages/Map';
import Volunteering from './pages/Volunteering';
import VolunteeringDetail from './pages/VolunteeringDetail';
import ServiceLog from './pages/ServiceLog';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Notifications from './pages/Notifications';
import MyReports from './pages/MyReports';
import Polls from './pages/Polls';
import PollDetail from './pages/PollDetail';
import LostFound from './pages/LostFound';
import LostFoundDetail from './pages/LostFoundDetail';
import AddLostFound from './pages/AddLostFound';
import GeneratorMap from './pages/GeneratorMap';
import GeneratorDetail from './pages/GeneratorDetail';
import RateGenerator from './pages/RateGenerator';
import BookLibrary from './pages/BookLibrary';
import BookManagement from './pages/BookManagement';
import BookDetail from './pages/BookDetail';
import AddBook from './pages/AddBook';
import AwarenessCampaigns from './pages/AwarenessCampaigns';
import CampaignDetail from './pages/CampaignDetail';
import ArticleView from './pages/ArticleView';
import AdminDashboard from './pages/AdminDashboard';
import GovDashboard from './pages/GovDashboard';
import ReportDetail from './pages/ReportDetail';
import ServiceManagement from './pages/ServiceManagement';
import ModerationCenter from './pages/ModerationCenter';
import AdminUserList from './pages/AdminUserList';
import VolunteerManagement from './pages/VolunteerManagement';
import DepartmentManagement from './pages/DepartmentManagement';
import AiStudyManagement from './pages/AiStudyManagement';
import GeneratorManagement from './pages/GeneratorManagement';
import DirectoryManagement from './pages/DirectoryManagement';
import MapEditor from './pages/MapEditor';
import BroadcastAlert from './pages/BroadcastAlert';
import AdminUserMap from './pages/AdminUserMap';
import LiveTrackUser from './pages/LiveTrackUser';
import Settings from './pages/Settings';
import EditProfile from './pages/EditProfile';
import About from './pages/About';
import About from './pages/About';
import CityReports from './pages/CityReports';
import InfrastructureInventory from './pages/InfrastructureInventory';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import { NotificationService } from './services/notification';
import OfflineIndicator from './components/OfflineIndicator';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from './components/ThemeContext';
import api from './services/api';
import './animations.css';
import './styles/global.css';

function AppContent() {
    const location = useLocation();
    const navigate = useNavigate();
    const hideNavRoutes = ['/login', '/register', '/splash', '/skills', '/add-report', '/study', '/privacy-policy-mobile', '/hashtag'];
    const showBottomNav = !hideNavRoutes.some(path => location.pathname.includes(path));
    const showFab = showBottomNav;

    // Effect 1: Check permissions ONCE on mount
    useEffect(() => {
        PermissionService.checkAndRequestLocationPermission();
    }, []);

    // Effect 2: Track location on navigation (only if allowed)
    useEffect(() => {
        // Auth Guard
        const publicRoutes = ['/splash', '/login', '/register'];
        const token = localStorage.getItem('token');

        if (!token && !publicRoutes.includes(location.pathname)) {
            navigate('/splash');
        } else if (token && location.pathname !== '/setup-location' && !publicRoutes.includes(location.pathname)) {
            // Check if user has location set
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    if (!user.location_verified_at) {
                        navigate('/setup-location');
                    }
                } catch (e) {
                    console.error('Error parsing user', e);
                }
            }
        }

        const trackLocation = async () => {
            try {
                // SILENT CHECK: Do not request permissions here!
                const hasPermission = await PermissionService.hasLocationPermission();

                if (hasPermission && token) {
                    const position = await Geolocation.getCurrentPosition();
                    await api.post('/api/user/location', {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    // Live SOS Tracking
                    const activeSosId = localStorage.getItem('active_sos_id');
                    if (activeSosId) {
                        try {
                            const sosStatus = await api.get(`/api/sos/status/${activeSosId}`);
                            if (sosStatus.data.status === 'active') {
                                await api.post(`/api/sos/track/${activeSosId}`, {
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude,
                                });
                            } else {
                                localStorage.removeItem('active_sos_id');
                            }
                        } catch (e) {
                            console.error('SOS Tracking Error:', e);
                            localStorage.removeItem('active_sos_id');
                        }
                    }
                }
            } catch (error) {
                // Silent fail on tracking
            }
        };

        // Notification Polling
        const checkNotifications = async () => {
            if (!token) return;
            try {
                const res = await api.get('/notifications/unread-count');
                const lastCount = parseInt(localStorage.getItem('last_notif_count') || '0');
                const newCount = res.data.count;

                if (newCount > lastCount) {
                    const latestRes = await api.get('/notifications');
                    const latest = latestRes.data.data[0]; // Paginated result
                    if (latest && !latest.read_at) {
                        const notifData = latest.data;
                        if (notifData.type === 'chat_message') {
                            await NotificationService.schedule(
                                `رسالة جديدة في #${notifData.channel_name}`,
                                `${notifData.sender_name}: ${notifData.message_snippet}`
                            );
                        } else {
                            await NotificationService.schedule(latest.data.title || 'تنبيه جديد', latest.data.body || 'لديك إشعار جديد');
                        }
                    }
                }
                localStorage.setItem('last_notif_count', newCount.toString());
            } catch (e) {
                console.error('Notification polling error', e);
            }
        };

        if (token) {
            trackLocation();
            checkNotifications();
            // We can keep the interval if we want background-ish tracking, but ensure it's silent
            const activeSosId = localStorage.getItem('active_sos_id');
            const intervalTime = activeSosId ? 30000 : 300000; // 30s during SOS, 5m regular
            const interval = setInterval(trackLocation, intervalTime);

            const notifInterval = setInterval(checkNotifications, 2000); // Check every 2s (Near Real-time)

            return () => {
                clearInterval(interval);
                clearInterval(notifInterval);
            };
        }

        // Global Sync Logic (moved inside here to respect token but it was general before)
        const handleSync = async () => {
            if (navigator.onLine) {
                await import('./services/OfflineService').then(m => m.OfflineService.syncReports());
            }
        };

        window.addEventListener('online', handleSync);
        handleSync();

        return () => window.removeEventListener('online', handleSync);
    }, [location.pathname]);

    return (
        <div className={`min-h-screen safe-top ${showBottomNav ? 'pb-20' : ''}`}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/studies" element={<Studies />} />
                <Route path="/study/:id" element={<StudyDetail />} />
                <Route path="/awareness/:id" element={<AwarenessDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/services-status" element={<ServicesStatus />} />
                <Route path="/water-status" element={<WaterStatus />} />
                <Route path="/privacy-policy-mobile" element={<PrivacyPolicyMobile />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/hashtag" element={<HashtagChat />} />
                <Route path="/skills" element={<SkillsPortal />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/splash" element={<Splash />} />
                <Route path="/setup-location" element={<SetupLocation />} />
                <Route path="/add-report" element={<AddReport />} />
                <Route path="/initiatives" element={<Initiatives />} />
                <Route path="/initiatives/add" element={<AddInitiative />} />
                <Route path="/initiatives/:id" element={<InitiativeDetail />} />
                <Route path="/discussions" element={<Discussions />} />
                <Route path="/discussions/add" element={<AddDiscussion />} />
                <Route path="/discussions/:id" element={<DiscussionDetail />} />
                <Route path="/directory" element={<Directory />} />
                <Route path="/map" element={<Map />} />
                <Route path="/volunteering" element={<Volunteering />} />
                <Route path="/volunteering/:id" element={<VolunteeringDetail />} />
                <Route path="/service-log" element={<ServiceLog />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/my-reports" element={<MyReports />} />
                <Route path="/polls" element={<Polls />} />
                <Route path="/polls/:id" element={<PollDetail />} />
                <Route path="/lost-found" element={<LostFound />} />
                <Route path="/lost-found/add" element={<AddLostFound />} />
                <Route path="/lost-found/:id" element={<LostFoundDetail />} />
                <Route path="/generators" element={<GeneratorMap />} />
                <Route path="/generators/:id" element={<GeneratorDetail />} />
                <Route path="/generators/:id/rate" element={<RateGenerator />} />
                <Route path="/books" element={<BookLibrary />} />
                <Route path="/books/add" element={<AddBook />} />
                <Route path="/books/add" element={<AddBook />} />
                <Route path="/books/manage" element={<BookManagement />} />
                <Route path="/books/:id" element={<BookDetail />} />
                <Route path="/awareness" element={<AwarenessCampaigns />} />
                <Route path="/awareness/detail/:id" element={<AwarenessDetail />} />
                <Route path="/awareness/campaign/:campaignId" element={<CampaignDetail />} />
                <Route path="/awareness/campaign/:campaignId/:articleId" element={<ArticleView />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin/services" element={<ServiceManagement />} />
                <Route path="/admin/moderation" element={<ModerationCenter />} />
                <Route path="/admin/users" element={<AdminUserList />} />
                <Route path="/admin/volunteers" element={<VolunteerManagement />} />
                <Route path="/admin/departments" element={<DepartmentManagement />} />
                <Route path="/admin/ai-studies" element={<AiStudyManagement />} />
                <Route path="/admin/generators" element={<GeneratorManagement />} />
                <Route path="/admin/directory" element={<DirectoryManagement />} />
                <Route path="/admin/map-editor" element={<MapEditor />} />
                <Route path="/admin/broadcast" element={<BroadcastAlert />} />
                <Route path="/admin/user-map" element={<AdminUserMap />} />
                <Route path="/live-track" element={<LiveTrackUser />} />
                <Route path="/gov-dashboard" element={<GovDashboard />} />
                <Route path="/gov/inventory" element={<InfrastructureInventory />} />
                <Route path="/report-detail/:id" element={<ReportDetail />} />
                <Route path="/city-reports" element={<CityReports />} />
                <Route path="/about" element={<About />} />
            </Routes>

            {showBottomNav && <BottomNav />}
            <Toast />
            <OfflineIndicator />
        </div>
    );
}

import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <HashRouter>
                    <ScrollToTop />
                    <AppContent />
                </HashRouter>
            </ThemeProvider>
        </ErrorBoundary>
    );
}
