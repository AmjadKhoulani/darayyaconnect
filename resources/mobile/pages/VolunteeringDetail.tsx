import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    ArrowRight, MapPin, Calendar, Clock, Users, CheckCircle2,
    Share2, Heart, Shield, Award, ChevronLeft, Phone, User
} from 'lucide-react';
import api from '../services/api';
import { usePullToRefresh, PullToRefreshContainer } from '../hooks/usePullToRefresh';

import { showToast } from '../components/Toast';

export default function VolunteeringDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Initialize from state if available, otherwise loading
    const [opp, setOpp] = useState<any>(location.state?.opp || null);
    const [loading, setLoading] = useState(!location.state?.opp);
    const [applying, setApplying] = useState(false);

    // Fetch Data
    const fetchData = async () => {
        if (!opp) setLoading(true);
        try {
            const res = await api.get(`/api/volunteering/${id}`);
            setOpp(res.data);
        } catch (error) {
            console.error(error);
            showToast('فشل تحميل الفرصة', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            showToast('يجب تسجيل الدخول أولاً', 'error');
            navigate('/login');
            return;
        }

        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : {};

        // In a real app we might show a modal to confirm details first
        setApplying(true);
        try {
            await api.post(`/api/volunteering/${id}/apply`, {
                full_name: user?.name || 'Unknown',
                phone_number: user?.phone || '0000000000', // Should be collected from user if missing
                availability: 'Flexible' // Placeholder
            });
            showToast('تم تقديم طلبك بنجاح! سنتواصل معك قريباً', 'success');
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 400 && err.response?.data?.message === 'Already applied') {
                showToast('لقد قدمت على هذه الفرصة مسبقاً', 'info');
            } else {
                showToast('فشل التقديم. حاول مرة أخرى', 'error');
            }
        } finally {
            setApplying(false);
        }
    };

    const { isRefreshing, containerRef, indicatorRef, handlers } = usePullToRefresh(fetchData);

    useEffect(() => {
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-300">
                <div className="w-10 h-10 border-4 border-emerald-200 dark:border-emerald-900/40 border-t-emerald-600 dark:border-t-emerald-400 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!opp) return null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 transition-colors duration-300" dir="rtl" {...handlers}>
            <PullToRefreshContainer isRefreshing={isRefreshing} containerRef={containerRef} indicatorRef={indicatorRef}>

                {/* Hero Image */}
                <div className="relative h-72 w-full">
                    <img
                        src={opp.image}
                        alt={opp.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                    {/* Header Actions */}
                    <div className="absolute top-0 w-full p-4 flex items-center justify-between z-10">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 bg-black/20 dark:bg-slate-900/40 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10 dark:border-white/5 hover:bg-black/30 transition shadow-lg"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div className="flex gap-2">
                            <button className="w-10 h-10 bg-black/20 dark:bg-slate-900/40 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10 dark:border-white/5 hover:bg-black/30 transition shadow-lg">
                                <Share2 size={20} />
                            </button>
                            <button className="w-10 h-10 bg-black/20 dark:bg-slate-900/40 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10 dark:border-white/5 hover:bg-black/30 transition shadow-lg">
                                <Heart size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 w-full p-6 text-white animate-slide-up">
                        <div className="flex items-center gap-2 mb-3">
                            {opp.tags.map((tag: string) => (
                                <span key={tag} className="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-100 px-3 py-1 rounded-lg text-[10px] font-bold">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-2xl font-black leading-tight mb-2 drop-shadow-md">{opp.title}</h1>
                        <p className="text-sm text-slate-300 font-medium flex items-center gap-2">
                            <Shield size={14} className="text-emerald-400" />
                            تنظيم: {opp.org}
                        </p>
                    </div>
                </div>

                <main className="px-4 -mt-6 relative z-10 space-y-6">
                    {/* Quick Stats Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-premium border border-slate-100 dark:border-slate-700/50 flex items-center justify-between animate-fade-in-up">
                        <div className="text-center flex-1 border-l border-slate-100 dark:border-slate-700 px-2">
                            <Calendar size={20} className="text-blue-500 dark:text-blue-400 mx-auto mb-1" />
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-0.5">الموعد</p>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{opp.date}</p>
                        </div>
                        <div className="text-center flex-1 border-l border-slate-100 dark:border-slate-700 px-2">
                            <Clock size={20} className="text-amber-500 dark:text-amber-400 mx-auto mb-1" />
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-0.5">المدة</p>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{opp.duration}</p>
                        </div>
                        <div className="text-center flex-1 px-2">
                            <Users size={20} className="text-emerald-500 dark:text-emerald-400 mx-auto mb-1" />
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-0.5">المقاعد</p>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{opp.filled}/{opp.spots}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 shadow-premium animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3 text-sm flex items-center gap-2">
                            <div className="w-1 h-4 bg-emerald-500 dark:bg-emerald-400 rounded-full"></div>
                            حول الفرصة
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify opacity-90">
                            {opp.description}
                        </p>

                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{opp.location}</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">انقر للعرض على الخريطة</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Two Col Info */}
                    <div className="grid grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        {/* Requirements */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 shadow-premium">
                            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3 text-sm flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-blue-500 dark:text-blue-400" />
                                الشروط
                            </h3>
                            <ul className="space-y-2">
                                {opp.requirements.map((req: string, i: number) => (
                                    <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2 leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                                        {req}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Benefits */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 shadow-premium">
                            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3 text-sm flex items-center gap-2">
                                <Award size={16} className="text-amber-500 dark:text-amber-400" />
                                المزايا
                            </h3>
                            <ul className="space-y-2">
                                {opp.benefits.map((ben: string, i: number) => (
                                    <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2 leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></div>
                                        {ben}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Coordinator */}
                    <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between mb-20 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-indigo-500 dark:text-indigo-400 shadow-sm">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-indigo-400 dark:text-indigo-500 font-bold mb-0.5">منسق الحملة</p>
                                <p className="text-xs font-bold text-indigo-900 dark:text-indigo-100">{opp.coordinator.name}</p>
                            </div>
                        </div>
                        <button className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center hover:bg-indigo-200 dark:hover:bg-indigo-900 transition">
                            <Phone size={16} />
                        </button>
                    </div>

                </main>

                {/* Fixed Bottom Action */}
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 pb-8 z-20 shadow-premium-reverse animate-slide-up transition-colors duration-300">
                    <div className="flex gap-3">
                        <button
                            onClick={handleApply}
                            disabled={applying || (opp.spots_total && opp.spots_filled >= opp.spots_total)}
                            className="flex-1 bg-emerald-600 dark:bg-emerald-500 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                        >
                            {applying ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span className="text-lg">👋</span>
                                    {opp.spots_total && opp.spots_filled >= opp.spots_total ? 'اكتمل العدد' : 'تطوع الآن'}
                                </>
                            )}
                        </button>
                        <div className="flex flex-col items-center justify-center px-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">المقاعد</span>
                            <span className="text-sm font-black text-slate-800 dark:text-slate-100">{opp.spots_total ? (opp.spots_total - opp.spots_filled) : '-'}</span>
                        </div>
                    </div>
                </div>

            </PullToRefreshContainer>
        </div>
    );
}
