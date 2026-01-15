import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { Heart } from 'lucide-react';
import api from '../services/api';
import OfflineIndicator from '../components/OfflineIndicator';
import { usePullToRefresh, PullToRefreshContainer } from '../hooks/usePullToRefresh';
import HomeHeader from '../components/home/HomeHeader';
import QuickStats from '../components/home/QuickStats';
import ActionBanner from '../components/home/ActionBanner';
import MenuGrid from '../components/home/MenuGrid';
import TabContent from '../components/home/TabContent';

export default function Home() {
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'news' | 'community' | 'polls'>('news');
    const [cityStats, setCityStats] = useState({ population: 78000, activeUsers: 0, reports: 0 });
    const [newsItems, setNewsItems] = useState<any[]>([]);
    const [discussions, setDiscussions] = useState<any[]>([]);
    const [serviceStates, setServiceStates] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Fetch dashboard data
    const fetchDashboardData = useCallback(async () => {
        try {
            const [statsRes, newsRes, discussionsRes, servicesRes, notificationsRes] = await Promise.all([
                api.get('/api/dashboard/stats'),
                api.get('/api/dashboard/news'),
                api.get('/api/dashboard/discussions'),
                api.get('/api/service-states').catch(() => ({ data: [] })),
                api.get('/api/notifications/unread-count').catch(() => ({ data: { count: 0 } }))
            ]);

            setCityStats(statsRes.data);
            setNewsItems(newsRes.data);
            setDiscussions(discussionsRes.data);
            setServiceStates(servicesRes.data || []);
            setUnreadCount(notificationsRes.data.count || 0);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        }
    }, []);

    const refreshData = useCallback(async () => {
        setLoading(true);
        await fetchDashboardData();
        setLoading(false);
    }, [fetchDashboardData]);

    const { isRefreshing, containerRef, indicatorRef, handlers } = usePullToRefresh(refreshData);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchDashboardData();
    }, [fetchDashboardData]);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 pb-20 relative transition-colors duration-300 overflow-x-hidden touch-pan-y" dir="rtl" {...handlers}>
            <PullToRefreshContainer isRefreshing={isRefreshing} containerRef={containerRef} indicatorRef={indicatorRef}>
                <OfflineIndicator />

                <HomeHeader user={user} unreadCount={unreadCount} />

                <main className="px-4 space-y-6">
                    {/* Hero Banner */}
                    <div className="bg-emerald-600 dark:bg-emerald-700 rounded-[32px] p-7 text-white relative overflow-hidden shadow-md -mx-2 mt-4">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black mb-2 leading-tight">مرحباً بك في مجتمع داريا 👋</h2>
                            <p className="text-emerald-50/90 text-sm font-medium leading-relaxed">
                                منصة ذكية لإدارة المدينة والتواصل المجتمعي
                            </p>
                        </div>
                    </div>

                    <QuickStats stats={cityStats} />

                    {user && <ActionBanner />}

                    <MenuGrid serviceStates={serviceStates} />

                    {/* Tabs Section */}
                    <div className="space-y-4">
                        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-4 overflow-x-auto pb-1 no-scrollbar">
                            {[
                                { key: 'news', label: '📰 الأخبار' },
                                { key: 'community', label: '💬 المجتمع' },
                                { key: 'polls', label: '📊 استطلاع' }
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key as any)}
                                    className={`px-6 py-2 ml-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.key
                                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-lg shadow-slate-900/10 scale-105'
                                        : 'bg-white/60 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <TabContent activeTab={activeTab} newsItems={newsItems} />
                    </div>

                    {/* Volunteering Banner */}
                    <Link
                        to="/volunteering"
                        className="block relative overflow-hidden rounded-[32px] group active:scale-[0.98] transition-all shadow-xl shadow-teal-500/10 mb-6"
                    >
                        <div className="absolute inset-0 bg-teal-700 dark:bg-teal-800"></div>
                        <div className="relative p-7 flex items-center justify-between">
                            <div>
                                <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 mb-2 shadow-sm">
                                    ✨ ساهم معنا
                                </span>
                                <h3 className="font-black text-white text-xl mb-1 drop-shadow-sm">فرص التطوع</h3>
                                <p className="text-teal-50 text-xs font-medium">انضم لفريقنا المميز في داريا</p>
                            </div>
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-xl group-hover:scale-110 transition-transform">
                                <Heart size={28} className="fill-teal-600" />
                            </div>
                        </div>
                    </Link>
                </main>
            </PullToRefreshContainer>
        </div>
    );
}
