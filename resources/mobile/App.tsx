import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import Home from './pages/Home';
import Studies from './pages/Studies';
import StudyDetail from './pages/StudyDetail';
import AwarenessDetail from './pages/AwarenessDetail';
import Profile from './pages/Profile';
import ServicesStatus from './pages/ServicesStatus';
import Login from './pages/Login';
import Register from './pages/Register';
import AddReport from './pages/AddReport';
import Initiatives from './pages/Initiatives';
import Discussions from './pages/Discussions';
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
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import OfflineIndicator from './components/OfflineIndicator';
import api from './services/api';
import './animations.css';
import './styles/global.css';

function AppContent() {
    const location = useLocation();
    const hideFabRoutes = ['/login', '/register', '/add-report', '/study'];
    // Check if current path starts with any of the restricted paths
    const showFab = !hideFabRoutes.some(path => location.pathname.startsWith(path));

    useEffect(() => {
        const trackLocation = async () => {
            try {
                const permissions = await Geolocation.checkPermissions();
                if (permissions.location !== 'granted') {
                    await Geolocation.requestPermissions();
                }
                const position = await Geolocation.getCurrentPosition();
                const token = localStorage.getItem('token');
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

        trackLocation();
        const interval = setInterval(trackLocation, 300000); // 5 mins
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen pb-20 safe-top">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/studies" element={<Studies />} />
                <Route path="/study/:id" element={<StudyDetail />} />
                <Route path="/awareness/:id" element={<AwarenessDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/services" element={<ServicesStatus />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/add-report" element={<AddReport />} />
                <Route path="/initiatives" element={<Initiatives />} />
                <Route path="/discussions" element={<Discussions />} />
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
            </Routes>

            <BottomNav />
            <Toast />
            <OfflineIndicator />
        </div>
    );
}

export default function App() {
    return (
        <HashRouter>
            <AppContent />
        </HashRouter>
    );
}
