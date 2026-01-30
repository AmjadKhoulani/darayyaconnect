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
// Note: I will update the MenuGrid component file separately as it defines the grid.
// But first let me update ServicesStatus grids.
import TabContent from '../components/home/TabContent';
import MenuGrid from '../components/home/MenuGrid';
import StatusWidget from '../components/home/StatusWidget';

export default function Home() {
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'news' | 'community' | 'polls'>('news');
    const [cityStats, setCityStats] = useState({ population: 0, activeUsers: 0, reports: 0 });
    const [newsItems, setNewsItems] = useState<any[]>([]);
    const [discussions, setDiscussions] = useState<any[]>([]);
    const [serviceStates, setServiceStates] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [featuredSlides, setFeaturedSlides] = useState<any[]>([]);

    // Fetch dashboard data
    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const [statsRes, newsRes, discussionsRes, servicesRes, notificationsRes, featuredRes] = await Promise.all([
                api.get('/dashboard/stats'),
                api.get('/dashboard/news'),
                api.get('/dashboard/discussions'),
                api.get('/service-states').catch(() => ({ data: [] })),
                api.get('/notifications/unread-count').catch(() => ({ data: { count: 0 } })),
                api.get('/ai-studies/featured').catch(() => ({ data: [] }))
            ]);

            setCityStats({
                population: statsRes.data.population || 78000, // Keep 78000 as a fallback if API returns 0, assuming real pop is ~78k
                activeUsers: statsRes.data.citizens_count || 0,
                reports: statsRes.data.reports_pending || 0
            });
            setNewsItems(newsRes.data);
            setDiscussions(discussionsRes.data);
            setServiceStates(servicesRes.data || []);
            setUnreadCount(notificationsRes.data.count || 0);

            // Transform Featured Studies to Slides
            if (featuredRes.data && featuredRes.data.length > 0) {
                const slides = featuredRes.data.map((study: any) => ({
                    id: study.id,
                    title: study.title, // Title of the study
                    highlight: study.category, // e.g. "Environment"
                    subtitle: study.summary, // Description
                    type: 'study'
                }));
                setFeaturedSlides(slides);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
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
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl" {...handlers}>
            <PullToRefreshContainer isRefreshing={isRefreshing} containerRef={containerRef} indicatorRef={indicatorRef}>
                <OfflineIndicator />

                <HomeHeader user={user} unreadCount={unreadCount} />

                <main className="px-4 space-y-6 w-full max-w-5xl mx-auto pt-2">
                    {/* 1. Live Status Ticker - Critical Info First */}
                    <StatusWidget serviceStates={serviceStates} loading={loading} />

                    {/* 2. Hero Banner - Welcome & Brand */}
                    <div className="relative overflow-hidden rounded-[32px] p-6 shadow-premium group min-h-[140px] flex items-center mb-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-800 dark:from-emerald-700 dark:to-teal-900 transition-all duration-500 group-hover:scale-105"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                        <div className="absolute top-[-50%] left-[-20%] w-[150px] h-[150px] bg-white/10 rounded-full blur-3xl animate-float-slow"></div>

                        <div className="relative z-10 w-full">
                            <HelloCarousel slides={featuredSlides} />
                        </div>
                    </div>

                    {/* 3. Primary Actions Grid (Map & Directory) */}
                    <MenuGrid serviceStates={serviceStates} />

                    {/* 4. Community Pulse (Tabs) - Promoted Higher */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-indigo-500 rounded-full"></span>
                                نبض المدينة
                            </h3>
                        </div>

                        <div className="bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl flex relative">
                            {[
                                { key: 'news', label: '📰 الأخبار' },
                                { key: 'community', label: '💬 المجتمع' },
                                { key: 'polls', label: '📊 استطلاع' }
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key as any)}
                                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all relative z-10 ${activeTab === tab.key
                                        ? 'text-slate-800 dark:text-slate-100 shadow-sm'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                >
                                    {activeTab === tab.key && (
                                        <div className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg shadow-sm -z-10 animate-in fade-in zoom-in-95 duration-200"></div>
                                    )}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="animate-in slide-in-from-bottom-2 duration-300">
                            <TabContent activeTab={activeTab} newsItems={newsItems} />
                        </div>
                    </div>

                    {/* 5. Reporting Action (Contextual) */}
                    {user && <ActionBanner />}

                    {/* 6. Volunteering Banner (Footer) */}
                    <Link
                        to="/volunteering"
                        className="block relative overflow-hidden rounded-[24px] group active:scale-[0.98] transition-all shadow-sm border border-violet-100 dark:border-violet-900/50 mt-4"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-700 dark:to-indigo-700 opacity-90"></div>
                        <div className="relative p-6 flex items-center justify-between">
                            <div>
                                <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/20 mb-2 shadow-sm">
                                    ✨ ساهم معنا
                                </span>
                                <h3 className="font-bold text-white text-lg drop-shadow-sm">فرص التطوع</h3>
                            </div>
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white shadow-inner border border-white/10 group-hover:scale-110 transition-transform">
                                <Heart size={24} className="fill-white/20 text-white" />
                            </div>
                        </div>
                    </Link>
                </main>
            </PullToRefreshContainer>
        </div>
    );
}
