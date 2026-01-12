import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import {
    Map, FileText, Lightbulb, Phone, Search,
    User, LogIn, Bell, Menu, Users, BarChart3,
    MessageCircle, AlertTriangle, Heart, Globe as GlobeIcon
} from 'lucide-react';
import api from '../services/api';
import OfflineIndicator from '../components/OfflineIndicator';
import { usePullToRefresh, PullToRefreshContainer } from '../hooks/usePullToRefresh';

export default function Home() {
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'news' | 'community' | 'polls'>('news');
    const [cityStats, setCityStats] = useState({ population: 78000, activeUsers: 0, reports: 0 });
    const [newsItems, setNewsItems] = useState<any[]>([]);
    const [discussions, setDiscussions] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
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

    const { isRefreshing, pullMoveY, handlers } = usePullToRefresh(refreshData);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchDashboardData();
    }, [fetchDashboardData]);

    return (
        <div className="min-h-screen bg-slate-50 pb-20 relative" dir="rtl" {...handlers}>
            <PullToRefreshContainer isRefreshing={isRefreshing} pullMoveY={pullMoveY}>
                <OfflineIndicator />
                {/* Clean Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3 shadow-sm">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-600/20">
                                د
                            </div>
                            <div>
                                <span className="text-lg font-bold text-slate-800 block leading-tight">مجتمع داريا</span>
                                <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full inline-block border border-emerald-100">نسخة تجريبية beta</span>
                            </div>
                        </Link>

                        <div className="flex items-center gap-2">
                            {/* Duty Pharmacies */}
                            <button className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center hover:bg-rose-100 transition border border-rose-100">
                                <span className="text-lg">💊</span>
                            </button>

                            <button
                                onClick={() => navigate('/notifications')}
                                className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 transition-colors border border-slate-200 relative"
                            >
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                            </button>

                            {user ? (
                                <button onClick={() => navigate('/profile')} className="w-10 h-10 bg-emerald-100 rounded-xl border-2 border-emerald-200 flex items-center justify-center font-bold text-emerald-700 text-sm active:scale-95 transition-transform">
                                    {user.name.charAt(0)}
                                </button>
                            ) : (
                                <Link to="/login" className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-transform flex items-center gap-2">
                                    <LogIn size={14} />
                                    <span>دخول</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </header>



                <main className="px-4 space-y-6">
                    {/* Hero Banner - Welcome */}
                    <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl p-7 text-white relative overflow-hidden shadow-2xl shadow-emerald-500/20 -mx-4 mt-4 animate-fade-in-up animate-gradient-x">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse-slow"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24 blur-2xl"></div>

                        <div className="relative z-10 animate-slide-in-right delay-200">
                            <h2 className="text-2xl font-black mb-2 leading-tight">مرحباً بك في مجتمع داريا 👋</h2>
                            <p className="text-emerald-50 text-sm font-medium leading-relaxed opacity-90">
                                منصة ذكية لإدارة المدينة والتواصل المجتمعي
                            </p>
                        </div>
                    </div>

                    {/* Quick Stats Bar - Matching Dashboard */}
                    <div className="grid grid-cols-3 gap-4 animate-fade-in-up delay-100">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-300">
                            <span className="text-2xl mb-2 animate-float">👥</span>
                            <h3 className="text-xl font-black text-slate-800">{cityStats.population.toLocaleString()}</h3>
                            <p className="text-slate-400 text-[10px] font-bold uppercase">السكان</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-300 delay-100">
                            <span className="text-2xl mb-2 animate-float delay-200">✅</span>
                            <h3 className="text-xl font-black text-emerald-500">{cityStats.activeUsers}</h3>
                            <p className="text-slate-400 text-[10px] font-bold uppercase">نشط الآن</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-300 delay-200">
                            <span className="text-2xl mb-2 animate-float delay-400">📨</span>
                            <h3 className="text-xl font-black text-orange-500">{cityStats.reports}</h3>
                            <p className="text-slate-400 text-[10px] font-bold uppercase">بلاغات</p>
                        </div>
                    </div>

                    {/* Create Report Action Bar - Floating Effect */}
                    {user && (
                        <button
                            onClick={() => navigate('/add-report')}
                            className="w-full bg-white rounded-2xl border border-slate-200 p-5 shadow-lg shadow-slate-200/50 flex gap-4 items-center hover:border-emerald-200 hover:bg-emerald-50/10 active:scale-[0.98] transition-all animate-fade-in-up delay-200 group"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <AlertTriangle size={24} className="animate-pulse-slow" />
                            </div>
                            <div className="flex-1 text-right">
                                <h4 className="text-sm font-bold text-slate-800 mb-0.5 group-hover:text-emerald-700 transition-colors">هل من مشكلة تود الإبلاغ عنها؟</h4>
                                <p className="text-[11px] text-slate-500">اضغط هنا لإرسال بلاغ أو صورة</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                                <span className="text-lg">👈</span>
                            </div>
                        </button>
                    )}

                    {/* Interactive Grid Menu */}
                    <div className="grid grid-cols-2 gap-4 animate-fade-in-up delay-300">
                        <Link to="/map" className="col-span-2 group relative bg-gradient-to-br from-[#1e40af] to-[#3b82f6] rounded-3xl p-6 shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all overflow-hidden h-32 flex items-center">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl animate-pulse-slow"></div>
                            <div className="relative z-10 flex flex-row items-center gap-4 w-full">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 group-active:scale-90 transition-transform shadow-inner">
                                    <Map size={28} className="text-white drop-shadow-md" />
                                </div>
                                <div>
                                    <h4 className="font-black text-white text-lg mb-1 drop-shadow-sm">الخريطة التفاعلية</h4>
                                    <p className="text-blue-100/90 text-xs font-medium">استكشف الخدمات من حولك</p>
                                </div>
                            </div>
                        </Link>

                        <Link to="/directory" className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all active:scale-95 group">
                            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Phone size={24} />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm">دليل الطوارئ</h4>
                        </Link>

                        <Link to="/lost-found" className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-3xl hover:shadow-md transition-all active:scale-95 group relative overflow-hidden shadow-lg shadow-indigo-500/20">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-white/20">
                                    <Search size={24} />
                                </div>
                                <h4 className="font-bold text-white text-sm">المفقودات 🔍</h4>
                            </div>
                        </Link>

                        <Link to="/services-status" className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all active:scale-95 group">
                            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <AlertTriangle size={24} />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm">حالة الخدمات</h4>
                        </Link>

                        <Link to="/generators" className="bg-gradient-to-br from-yellow-500 to-orange-600 p-5 rounded-3xl hover:shadow-md transition-all active:scale-95 group relative overflow-hidden shadow-lg shadow-yellow-500/20">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-white/20">
                                    <span className="text-2xl">⚡</span>
                                </div>
                                <h4 className="font-bold text-white text-sm">شركات الأمبير</h4>
                            </div>
                        </Link>

                        <Link to="/books" className="bg-gradient-to-br from-teal-500 to-emerald-600 p-5 rounded-3xl hover:shadow-md transition-all active:scale-95 group relative overflow-hidden shadow-lg shadow-teal-500/20">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-white/20">
                                    <span className="text-2xl">📚</span>
                                </div>
                                <h4 className="font-bold text-white text-sm">مكتبة الكتب</h4>
                            </div>
                        </Link>

                        <Link to="/awareness" className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-3xl hover:shadow-md transition-all active:scale-95 group relative overflow-hidden shadow-lg shadow-indigo-500/20">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-white/20">
                                    <span className="text-2xl">🎓</span>
                                </div>
                                <h4 className="font-bold text-white text-sm">التوعية المجتمعية</h4>
                            </div>
                        </Link>
                    </div>

                    {/* Tabs Section */}
                    <div className="animate-fade-in-up delay-400">
                        <div className="flex border-b border-slate-200 mb-4 overflow-x-auto pb-1 scrollbar-hide">
                            {[
                                { key: 'news', label: '📰 الأخبار' },
                                { key: 'community', label: '💬 المجتمع' },
                                { key: 'polls', label: '📊 استطلاع' }
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key as any)}
                                    className={`px-6 py-2 ml-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.key
                                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10 scale-105'
                                        : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                                        } `}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content with Fade Transition */}
                        <div className="min-h-[200px]">
                            {activeTab === 'news' && (
                                <div className="space-y-4 animate-fade-in-up">
                                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-1 h-full bg-blue-500"></div>
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                                                م
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-bold text-slate-800">مجلس المدينة</span>
                                                    <span className="text-[10px] text-slate-400">• منذ ساعتين</span>
                                                </div>
                                                <h3 className="font-bold text-slate-900 mb-2 leading-tight">اجتماع دوري لمناقشة خطة الكهرباء</h3>
                                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                                    يدعو المجلس كافة المواطنين لحضور اللقاء المفتوح اليوم مساءً...
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group delay-100 animate-slide-in-right">
                                        <div className="absolute top-0 right-0 w-1 h-full bg-amber-500"></div>
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 font-bold text-sm shrink-0">
                                                ⚡
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-bold text-slate-800">الكهرباء</span>
                                                    <span className="text-[10px] text-slate-400">• أمس</span>
                                                </div>
                                                <h3 className="font-bold text-slate-900 mb-2 leading-tight">تعديل ساعات التقنين</h3>
                                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                                    تم اعتماد برنامج 3 وصل مقابل 3 قطع اعتباراً من الغد...
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'community' && (
                                <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-200 animate-fade-in-up">
                                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 animate-float">
                                        <MessageCircle size={32} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-1">نقاشات الجيران</h3>
                                    <p className="text-xs text-slate-500 mb-6">شارك في الحوارات المحلية</p>
                                    <button onClick={() => navigate('/discussions')} className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 active:scale-95 transition-transform hover:bg-emerald-700">
                                        دخول المنتدى
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Volunteering Banner */}
                    <Link to="/volunteering" className="block relative overflow-hidden rounded-3xl group active:scale-[0.98] transition-all animate-fade-in-up delay-500 shadow-lg shadow-teal-500/10">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 animate-gradient-x"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl animate-pulse-slow"></div>

                        <div className="relative p-6 flex items-center justify-between">
                            <div>
                                <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 mb-2">
                                    ✨ ساهم معنا
                                </span>
                                <h3 className="font-black text-white text-xl mb-1">فرص التطوع</h3>
                                <p className="text-white/80 text-xs font-medium">انضم لفريقنا المميز في داريا</p>
                            </div>
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-xl group-hover:scale-110 transition-transform">
                                <Heart size={24} className="fill-teal-600 animate-pulse-slow" />
                            </div>
                        </div>
                    </Link>
                </main>
            </PullToRefreshContainer>
        </div >
    );
}
