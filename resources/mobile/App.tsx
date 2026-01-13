import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';
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
import Login from './pages/Login';
import Register from './pages/Register';
import Splash from './pages/Splash';
import SetupLocation from './pages/SetupLocation';
import AddReport from './pages/AddReport';
import Initiatives from './pages/Initiatives';
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
import Polls from './pages/Polls';
import PollDetail from './pages/PollDetail';
import LostFound from './pages/LostFound';
import LostFoundDetail from './pages/LostFoundDetail';
import AddLostFound from './pages/AddLostFound';
import GeneratorMap from './pages/GeneratorMap';
import GeneratorDetail from './pages/GeneratorDetail';
import RateGenerator from './pages/RateGenerator';
import BookLibrary from './pages/BookLibrary';
import BookDetail from './pages/BookDetail';
import AddBook from './pages/AddBook';
import AwarenessCampaigns from './pages/AwarenessCampaigns';
import CampaignDetail from './pages/CampaignDetail';
import ArticleView from './pages/ArticleView';
import Settings from './pages/Settings';
import EditProfile from './pages/EditProfile';
import About from './pages/About';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import OfflineIndicator from './components/OfflineIndicator';
import { ThemeProvider } from './components/ThemeContext';
import api from './services/api';
import './animations.css';
import './styles/global.css';

function AppContent() {
    const location = useLocation();
    const navigate = useNavigate();
    const hideFabRoutes = ['/login', '/register', '/add-report', '/study', '/splash'];
    // Check if current path starts with any of the restricted paths
    const showFab = !hideFabRoutes.some(path => location.pathname.startsWith(path));

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
                    // If strictly no location, redirect to setup
                    // Note: API returns string or null.
                    if (!user.latitude) {
                        navigate('/setup-location');
                    }
                } catch (e) {
                    console.error('Error parsing user', e);
                }
            }
        }

        const trackLocation = async () => {
            try {
                const permissions = await Geolocation.checkPermissions();
                if (permissions.location !== 'granted') {
                    await Geolocation.requestPermissions();
                }
                const position = await Geolocation.getCurrentPosition();

                if (token) {
                    await api.post('/api/user/location', {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                }
            } catch (error) {
                console.error('Location tracking failed', error);
            }
        };

        if (token) {
            trackLocation();
            const interval = setInterval(trackLocation, 300000); // 5 mins
            return () => clearInterval(interval);
        }
    }, [location.pathname]);

    return (
        <div className="min-h-screen pb-20 safe-top">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/studies" element={<Studies />} />
                <Route path="/study/:id" element={<StudyDetail />} />
                <Route path="/awareness/:id" element={<AwarenessDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/services" element={<ServicesStatus />} />
                <Route path="/water-status" element={<WaterStatus />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/hashtag" element={<HashtagChat />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/splash" element={<Splash />} />
                <Route path="/setup-location" element={<SetupLocation />} />
                <Route path="/add-report" element={<AddReport />} />
                <Route path="/initiatives" element={<Initiatives />} />
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
                <Route path="/books/:id" element={<BookDetail />} />
                <Route path="/awareness" element={<AwarenessCampaigns />} />
                <Route path="/awareness/detail/:id" element={<AwarenessDetail />} />
                <Route path="/awareness/campaign/:campaignId" element={<CampaignDetail />} />
                <Route path="/awareness/campaign/:campaignId/:articleId" element={<ArticleView />} />
                <Route path="/awareness/campaign/:campaignId" element={<CampaignDetail />} />
                <Route path="/awareness/campaign/:campaignId/:articleId" element={<ArticleView />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/about" element={<About />} />
            </Routes>

            <BottomNav />
            <Toast />
            <OfflineIndicator />
        </div>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <HashRouter>
                <AppContent />
            </HashRouter>
        </ThemeProvider>
    );
}
