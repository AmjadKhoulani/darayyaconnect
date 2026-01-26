import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { Heart } from 'lucide-react';
import api from '../services/api';
import OfflineIndicator from '../components/OfflineIndicator';
import { usePullToRefresh, PullToRefreshContainer } from '../hooks/usePullToRefresh';
import HomeHeader from '../components/home/HomeHeader';
import HelloCarousel from '../components/home/HelloCarousel';
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
                api.get('/dashboard/stats'),
                api.get('/dashboard/news'),
                api.get('/dashboard/discussions'),
                api.get('/service-states').catch(() => ({ data: [] })),
                api.get('/notifications/unread-count').catch(() => ({ data: { count: 0 } }))
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 relative transition-colors duration-300 overflow-x-hidden" dir="rtl" {...handlers}>
            <PullToRefreshContainer isRefreshing={isRefreshing} containerRef={containerRef} indicatorRef={indicatorRef}>
                <OfflineIndicator />

                <HomeHeader user={user} unreadCount={unreadCount} />

                <main className="px-5 space-y-8 max-w-md mx-auto pt-4">
                    {/* Hero Banner - Premium Design */}
                    <div className="relative overflow-hidden rounded-[32px] p-8 shadow-premium group">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-700 dark:from-emerald-600 dark:to-teal-800 transition-all duration-500 group-hover:scale-105"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                        <div className="absolute top-[-50%] left-[-20%] w-[200px] h-[200px] bg-white/10 rounded-full blur-3xl animate-float-slow"></div>

                        <div className="relative z-10 w-full">
                            <HelloCarousel />
                        </div>
                    </div>


                    {user && <ActionBanner />}

                    <div className="py-2">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 px-1 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                            الخدمات السريعة
                        </h3>
                        <MenuGrid serviceStates={serviceStates} />
                    </div>

                    {/* Tabs Section - Segmented Control Style */}
                    <div className="space-y-6">
                        <div className="bg-slate-200/50 dark:bg-slate-800/50 p-1.5 rounded-2xl flex relative">
                            {[
                                { key: 'news', label: '📰 الأخبار' },
                                { key: 'community', label: '💬 المجتمع' },
                                { key: 'polls', label: '📊 استطلاع' }
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key as any)}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all relative z-10 ${activeTab === tab.key
                                        ? 'text-slate-800 dark:text-slate-100 shadow-sm'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                >
                                    {activeTab === tab.key && (
                                        <div className="absolute inset-0 bg-white dark:bg-slate-700 rounded-xl shadow-sm -z-10 animate-in fade-in zoom-in-95 duration-200"></div>
                                    )}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="animate-in slide-in-from-bottom-2 duration-300">
                            <TabContent activeTab={activeTab} newsItems={newsItems} />
                        </div>
                    </div>

                    {/* Volunteering Banner */}
                    <Link
                        to="/volunteering"
                        className="block relative overflow-hidden rounded-[32px] group active:scale-[0.98] transition-all shadow-premium mb-8"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-700 dark:to-indigo-700"></div>
                        <div className="relative p-8 flex items-center justify-between">
                            <div>
                                <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 mb-3 shadow-sm">
                                    ✨ ساهم معنا
                                </span>
                                <h3 className="font-black text-white text-2xl mb-2 drop-shadow-sm">فرص التطوع</h3>
                                <p className="text-indigo-100 text-xs font-medium">كن جزءاً من التغيير الإيجابي في المدينة</p>
                            </div>
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white shadow-inner border border-white/10 group-hover:scale-110 transition-transform">
                                <Heart size={32} className="fill-white/20 text-white" />
                            </div>
                        </div>
                    </Link>
                </main>
            </PullToRefreshContainer>
        </div>
    );
}
