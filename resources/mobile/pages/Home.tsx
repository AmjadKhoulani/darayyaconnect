import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import {
    Map, FileText, Lightbulb, Phone, Search,
    User, LogIn, Bell, Menu, Users, BarChart3,
    MessageCircle, AlertTriangle, Heart, Globe as GlobeIcon,
    Calendar, Hash
} from 'lucide-react';
import api from '../services/api';
import OfflineIndicator from '../components/OfflineIndicator';
import { usePullToRefresh, PullToRefreshContainer } from '../hooks/usePullToRefresh';
import { useTheme } from '../components/ThemeContext';

export default function Home() {
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'news' | 'community' | 'polls'>('news');
    const [cityStats, setCityStats] = useState({ population: 78000, activeUsers: 0, reports: 0 });
    const [newsItems, setNewsItems] = useState<any[]>([]);
    const [discussions, setDiscussions] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    // Fetch dashboard data
    const fetchDashboardData = useCallback(async () => {
        try {
            const [statsRes, newsRes, discussionsRes] = await Promise.all([
                api.get('/api/dashboard/stats'),
                api.get('/api/dashboard/news'),
                api.get('/api/dashboard/discussions')
            ]);

            setCityStats(statsRes.data);
            setNewsItems(newsRes.data);
            setDiscussions(discussionsRes.data);
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
                {/* Clean Header - Optimized Blur */}
                <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-40 px-4 py-3 shadow-md transition-colors duration-300">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-premium">
                                د
                            </div>
                            <div>
                                <span className="text-lg font-bold text-slate-900 dark:text-slate-100 block leading-tight">مجتمع داريا</span>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full inline-block border border-emerald-100 dark:border-emerald-800/50">نسخة تجريبية beta</span>
                            </div>
                        </Link>

                        <div className="flex items-center gap-2">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="w-10 h-10 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl flex items-center justify-center shadow-card hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                            >
                                {theme === 'light' ? '🌙' : '☀️'}
                            </button>

                            {/* Duty Pharmacies */}
                            <button className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center hover:bg-rose-100 dark:hover:bg-rose-900/40 transition border border-rose-100 dark:border-rose-800/50 shadow-card">
                                <span className="text-lg">💊</span>
                            </button>

                            <button
                                onClick={() => navigate('/notifications')}
                                className="w-10 h-10 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-800 relative shadow-card"
                            >
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                            </button>

                            {user ? (
                                <button onClick={() => navigate('/profile')} className="w-10 h-10 bg-emerald-100 rounded-xl border-2 border-emerald-200 flex items-center justify-center font-bold text-emerald-700 text-sm active:scale-95 transition-transform shadow-card">
                                    {user.name.charAt(0)}
                                </button>
                            ) : (
                                <Link to="/login" className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl shadow-premium active:scale-95 transition-transform flex items-center gap-2">
                                    <LogIn size={14} />
                                    <span>دخول</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                <main className="px-4 space-y-6">
                    {/* Hero Banner - Welcome - Zero Animations */}
                    <div className="bg-emerald-600 dark:bg-emerald-700 rounded-[32px] p-7 text-white relative overflow-hidden shadow-md -mx-2 mt-4">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black mb-2 leading-tight">مرحباً بك في مجتمع داريا 👋</h2>
                            <p className="text-emerald-50/90 text-sm font-medium leading-relaxed">
                                منصة ذكية لإدارة المدينة والتواصل المجتمعي
                            </p>
                        </div>
                    </div>

                    {/* Quick Stats Bar - Matching Dashboard */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'السكان', value: cityStats.population.toLocaleString(), icon: '👥', color: 'text-slate-900' },
                            { label: 'نشط الآن', value: cityStats.activeUsers, icon: '✅', color: 'text-emerald-600' },
                            { label: 'بلاغات', value: cityStats.reports, icon: '📨', color: 'text-orange-600' }
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col items-center justify-center text-center transition-all duration-200 [contain:content]"
                            >
                                <span className="text-2xl mb-2 drop-shadow-sm">{stat.icon}</span>
                                <h3 className={`text-xl font-black ${stat.color} dark:text-slate-100`}>{stat.value}</h3>
                                <p className="text-slate-500 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Create Report Action Bar - Floating Effect */}
                    {user && (
                        <button
                            onClick={() => navigate('/add-report')}
                            className="w-full bg-white dark:bg-slate-800 rounded-[28px] border border-slate-200/60 dark:border-slate-700 p-5 shadow-premium flex gap-4 items-center hover:border-emerald-200 dark:hover:border-emerald-700 hover:bg-emerald-50/10 active:scale-[0.98] transition-all group"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                                <AlertTriangle size={24} />
                            </div>
                            <div className="flex-1 text-right">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-0.5">هل من مشكلة تود الإبلاغ عنها؟</h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">اضغط هنا لإرسال بلاغ أو صورة</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-300 dark:text-slate-500 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-100 transition-colors">
                                <span className="text-lg">👈</span>
                            </div>
                        </button>
                    )}

                    {/* Interactive Grid Menu */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Link
                                to="/map"
                                className="group relative bg-blue-600 dark:bg-blue-700 rounded-[32px] p-6 shadow-md active:scale-[0.98] transition-all h-32 flex items-center"
                            >
                                <div className="relative z-10 flex flex-row items-center gap-4 w-full">
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                                        <Map size={28} className="text-white drop-shadow-md" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white text-lg mb-1 drop-shadow-sm">الخريطة التفاعلية</h4>
                                        <p className="text-blue-100/90 text-xs font-medium">استكشف الخدمات من حولك</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div>
                            <Link to="/directory" className="bg-white/80 dark:bg-slate-800 p-5 rounded-[28px] shadow-card border border-white dark:border-slate-700 hover:shadow-premium transition-all active:scale-95 group block">
                                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-3 border border-amber-100 dark:border-amber-800/50 shadow-inner-soft">
                                    <Phone size={24} />
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">دليل المدينة</h4>
                            </Link>
                        </div>

                        <div>
                            <Link to="/lost-found" className="bg-indigo-600 dark:bg-indigo-700 p-5 rounded-[28px] hover:shadow-md transition-all active:scale-95 group block">
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-3 border border-white/20 shadow-inner">
                                        <Search size={24} />
                                    </div>
                                    <h4 className="font-bold text-white text-sm">المفقودات 🔍</h4>
                                </div>
                            </Link>
                        </div>

                        <div className="col-span-2">
                            <Link to="/services-status" className="bg-white dark:bg-slate-800 p-5 rounded-[28px] shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-premium transition-all active:scale-[0.98] group flex items-center justify-between [contain:content]">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 rounded-2xl flex items-center justify-center border border-rose-100 dark:border-rose-800/50 shadow-inner-soft">
                                        <AlertTriangle size={28} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 dark:text-slate-100 text-base mb-1">حالة الخدمات</h4>
                                        <div className="flex gap-2">
                                            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold shadow-sm">كهرباء: مستقر</span>
                                            <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold shadow-sm">مياه: ضخ</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/40 group-hover:text-rose-500 transition-colors">
                                    <span className="text-xl rotate-180">➜</span>
                                </div>
                            </Link>
                        </div>

                        <div>
                            <Link to="/books" className="bg-teal-600 dark:bg-teal-700 p-5 rounded-[28px] hover:shadow-md transition-all active:scale-95 group block">
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-3 border border-white/20 shadow-inner">
                                        <span className="text-2xl">📚</span>
                                    </div>
                                    <h4 className="font-bold text-white text-sm">مكتبة الكتب</h4>
                                </div>
                            </Link>
                        </div>

                        <div>
                            <Link to="/events" className="bg-orange-500 dark:bg-orange-600 p-5 rounded-[28px] hover:shadow-md transition-all active:scale-95 group block">
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-3 border border-white/20 shadow-inner">
                                        <Calendar size={24} />
                                    </div>
                                    <h4 className="font-bold text-white text-sm">فعاليات المدينة 🗓️</h4>
                                </div>
                            </Link>
                        </div>

                        <div className="col-span-2">
                            <Link to="/hashtag" className="bg-white/80 dark:bg-slate-800 p-5 rounded-[28px] shadow-card border border-white dark:border-slate-700 hover:shadow-premium transition-all active:scale-95 group relative overflow-hidden block">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-800/50 shadow-inner-soft">
                                        <Hash size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">هاشتاغ #الدردشة 💬</h4>
                                        <p className="text-[10px] text-slate-500">انضم للنقاشات المباشرة</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div className="col-span-2">
                            <Link to="/skills" className="bg-white/80 dark:bg-slate-800 p-5 rounded-[28px] shadow-card border border-white dark:border-slate-700 hover:shadow-premium transition-all active:scale-95 group relative overflow-hidden block">
                                <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/0 rounded-full blur-2xl -ml-6 -mt-6"></div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center border border-purple-100 dark:border-purple-800/50 shadow-inner-soft">
                                        <Lightbulb size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">دليل النجاح والربح 🚀</h4>
                                        <p className="text-[10px] text-slate-500">نصائح للعمل الحر والذكاء الاصطناعي</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div className="col-span-2">
                            <Link to="/awareness" className="bg-purple-600 dark:bg-purple-700 p-6 rounded-[32px] shadow-md active:scale-[0.98] transition-all h-32 flex items-center block">
                                <div className="relative z-10 flex flex-row items-center gap-4 w-full">
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                                        <span className="text-3xl">🎓</span>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white text-lg mb-1 drop-shadow-sm">التوعية المجتمعية</h4>
                                        <p className="text-indigo-100/90 text-xs font-medium">مقالات، نصائح، وإرشادات تهمك</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

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

                        {/* Tab Content */}
                        <div className="min-h-[200px]">
                            {activeTab === 'news' && (
                                <div className="space-y-4">
                                    {[
                                        { title: 'اجتماع دوري لمناقشة خطة الكهرباء', body: 'يدعو المجلس كافة المواطنين لحضور اللقاء المفتوح اليوم مساءً...', color: 'bg-blue-500', icon: 'م', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', time: 'منذ ساعتين', source: 'مجلس المدينة' },
                                        { title: 'تعديل ساعات التقنين', body: 'تم اعتماد برنامج 3 وصل مقابل 3 قطع اعتباراً من الغد...', color: 'bg-amber-500', icon: '⚡', iconBg: 'bg-amber-50', iconColor: 'text-amber-600', time: 'أمس', source: 'الكهرباء' }
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/60 dark:border-slate-700/50 shadow-sm relative overflow-hidden group [contain:layout_style]"
                                        >
                                            <div className={`absolute top-0 right-0 w-1.5 h-full ${item.color}`}></div>
                                            <div className="flex gap-4">
                                                <div className={`w-11 h-11 ${item.iconBg} dark:bg-slate-900 rounded-xl flex items-center justify-center ${item.iconColor} font-bold text-sm shrink-0 border border-slate-100 dark:border-slate-800 shadow-inner-soft`}>
                                                    {item.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.source}</span>
                                                        <span className="text-[10px] text-slate-400 dark:text-slate-500">• {item.time}</span>
                                                    </div>
                                                    <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2 leading-tight">{item.title}</h3>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                                                        {item.body}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'community' && (
                                <div className="text-center py-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 shadow-inner-soft">
                                    <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400 shadow-md">
                                        <MessageCircle size={32} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">نقاشات الجيران</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">شارك في الحوارات المحلية</p>
                                    <button
                                        onClick={() => navigate('/discussions')}
                                        className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-premium active:scale-95 transition-transform hover:bg-emerald-700"
                                    >
                                        دخول المنتدى
                                    </button>
                                </div>
                            )}
                        </div>
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
