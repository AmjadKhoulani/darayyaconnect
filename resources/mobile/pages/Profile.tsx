import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, LogOut, Edit2, Shield, Award, ChevronLeft, Zap } from 'lucide-react';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';
import { usePullToRefresh, PullToRefreshContainer } from '../hooks/usePullToRefresh';
import { useTheme } from '../components/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function Profile() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [address, setAddress] = useState<string>('');

    const fetchAddress = async (lat: number, lon: number) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ar`);
            const data = await res.json();
            if (data.display_name) {
                // Try to construct a shorter address
                const addr = data.address;
                const shortAddr = [
                    addr.road || addr.pedestrian || addr.suburb,
                    addr.neighbourhood || addr.quarter,
                    addr.city || addr.town || addr.village
                ].filter(Boolean).join('، ');

                setAddress(shortAddr || data.display_name);
            }
        } catch (e) {
            console.error('Failed to resolve address', e);
            setAddress('تعذر تحديد العنوان');
        }
    };

    const fetchUser = useCallback(async () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);

                if (parsedUser.latitude && parsedUser.longitude) {
                    fetchAddress(parsedUser.latitude, parsedUser.longitude);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const { isRefreshing, pullMoveY, handlers } = usePullToRefresh(fetchUser);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) return <SkeletonLoader type="profile" />;

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl" {...handlers}>
            <PullToRefreshContainer isRefreshing={isRefreshing} pullMoveY={pullMoveY}>

                {/* Clean Header - Web Style */}
                <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 py-4 shadow-sm flex items-center justify-between transition-colors duration-300">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-800">
                            <ChevronLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">الملف الشخصي</h1>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">إدارة حسابك ونشاطاتك</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center border border-rose-100 hover:bg-rose-100 transition">
                        <LogOut size={18} />
                    </button>
                </header>

                <main className="px-4 py-6 space-y-6">
                    {/* ID Card Style */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-premium relative overflow-hidden animate-fade-in-up">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-50 dark:bg-emerald-900/10 rounded-full -ml-10 -mt-10 opacity-50 blur-2xl animate-pulse-slow"></div>

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-4 ring-4 ring-white shadow-md relative group">
                                <User size={40} className="group-hover:scale-110 transition-transform" />
                                <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                                    <Shield size={12} className="text-white fill-current" />
                                </div>
                            </div>

                            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-1">{user.name}</h2>
                            <span className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800/50 mb-6 inline-flex items-center gap-1 font-bold">
                                <Award size={12} />
                                مواطن فعال
                            </span>

                            <div className="grid grid-cols-2 gap-3 w-full">
                                <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/50 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-sm border border-slate-100 dark:border-slate-700">
                                        <Mail size={16} />
                                    </div>
                                    <div className="text-right overflow-hidden">
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-0.5">البريد الإلكتروني</p>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{user.email}</p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                                        <Phone size={16} />
                                    </div>
                                    <div className="text-right overflow-hidden">
                                        <p className="text-[10px] text-slate-400 font-bold mb-0.5">رقم الهاتف</p>
                                        <p className="text-xs font-bold text-slate-700 truncate">{user.phone || 'غير محدد'}</p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                                        <MapPin size={16} />
                                    </div>
                                    <div className="text-right overflow-hidden">
                                        <p className="text-[10px] text-slate-400 font-bold mb-0.5">العنوان</p>
                                        <p className="text-xs font-bold text-slate-700 truncate" dir="auto">
                                            {address || user.neighborhood || (user.is_resident ? 'جاري التحديد...' : 'غير مقيم')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions - Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => navigate('/service-log')}
                            className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-4 border border-orange-400/20 shadow-sm relative overflow-hidden group active:scale-[0.98] transition-all"
                        >
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-white/20 transition-all"></div>
                            <div className="relative z-10 flex flex-col items-start h-full justify-between gap-4">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    <Zap size={20} className="text-white" />
                                </div>
                                <div className="text-right">
                                    <h4 className="font-bold text-sm mb-0.5">سجل الخدمات</h4>
                                    <p className="text-[10px] text-orange-100">كهرباء / مياه</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/add-report')}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-premium relative overflow-hidden group active:scale-[0.98] transition-all"
                        >
                            <div className="relative z-10 flex flex-col items-start h-full justify-between gap-4">
                                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center border border-rose-100 dark:border-rose-800/50">
                                    <Edit2 size={20} className="text-rose-500 dark:text-rose-400" />
                                </div>
                                <div className="text-right">
                                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-0.5">تقديم شكوى</h4>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">أبلغ عن مشكلة</p>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 text-sm">نشاطاتك الأخيرة</h3>
                            <button className="text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-lg transition">
                                عرض الكل
                            </button>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {[1, 2, 3].map((item, i) => (
                                <div key={item} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition group">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                                        <Award size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xs font-bold text-slate-800 mb-1">تم التصويت في استطلاع</h4>
                                        <p className="text-[10px] text-slate-500 line-clamp-1">"ما هو أهم مشروع للمرحلة القادمة؟"</p>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded-lg">منذ يومين</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* App Settings / Info */}
                    <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2 text-sm px-1 mt-4">الإعدادات والتطبيق</h3>

                        {/* Theme Toggle in Settings */}
                        <button
                            onClick={toggleTheme}
                            className="w-full bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition active:scale-[0.99] shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl ${theme === 'light' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-900 text-slate-100 border-slate-800'} flex items-center justify-center border`}>
                                    {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-slate-700 dark:text-slate-200 text-sm block">مظهر التطبيق</span>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{theme === 'light' ? 'الوضع الفاتح' : 'الوضع الليلي'}</span>
                                </div>
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full text-[10px] font-black text-slate-500 dark:text-slate-400">
                                {theme === 'light' ? 'تغيير' : 'تبديل'}
                            </div>
                        </button>
                        {[
                            { icon: <Shield size={18} />, label: 'الخصوصية والأمان', color: 'emerald' },
                            { icon: <Award size={18} />, label: 'نقاطي ومستواي', color: 'purple' },
                        ].map((item, i) => (
                            <button key={i} className="w-full bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition active:scale-[0.99]">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center border border-${item.color}-100`}>
                                        {item.icon}
                                    </div>
                                    <span className="font-bold text-slate-700 text-sm">{item.label}</span>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-lg">
                                    <ChevronLeft size={16} className="text-slate-400" />
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 justify-center mt-8 text-slate-400 pb-4">
                        <Shield size={12} />
                        <span className="text-[10px] font-medium opacity-70">جميع بياناتك مشفرة ومحمية</span>
                    </div>
                </main>
            </PullToRefreshContainer>
        </div>
    );
}
