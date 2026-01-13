import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Phone, Star, Zap, Clock, AlertCircle, Bell, BellOff } from 'lucide-react';
import api from '../services/api';

export default function GeneratorDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [generator, setGenerator] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const fetchGenerator = async () => {
            try {
                const res = await api.get(`/generators/${id}`);
                setGenerator(res.data);
                setIsSubscribed(res.data.is_subscribed || false);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchGenerator();
    }, [id]);

    const handleSubscribe = async () => {
        try {
            if (isSubscribed) {
                await api.delete(`/generators/${id}/subscribe`);
                setIsSubscribed(false);
                alert('تم إلغاء الاشتراك');
            } else {
                await api.post(`/generators/${id}/subscribe`);
                setIsSubscribed(true);
                alert('تم الاشتراك بالإشعارات');
            }
        } catch (err: any) {
            alert(err.response?.data?.message || 'حدث خطأ');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-300">
                <div className="animate-spin w-8 h-8 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!generator) return null;

    const statusConfig: any = {
        active: { bg: 'emerald', icon: '🟢', text: 'نشطة' },
        down: { bg: 'rose', icon: '🔴', text: 'معطلة' },
        maintenance: { bg: 'amber', icon: '🟡', text: 'صيانة' }
    };

    const status = statusConfig[generator.status];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl">
            {/* Hero Header */}
            <div className="relative h-72 bg-gradient-to-br from-indigo-600 to-purple-700 overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

                <button onClick={() => navigate(-1)} className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 z-10 active:scale-90 transition-transform">
                    <ArrowRight size={20} className="rotate-180" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white relative z-10">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-3xl font-black mb-2 leading-tight">{generator.name}</h1>
                            <div className="flex items-center gap-2 text-sm text-white/80 font-medium">
                                <MapPin size={14} />
                                <span>{generator.neighborhood}</span>
                            </div>
                        </div>
                        <div className="text-left bg-white/20 backdrop-blur-md rounded-3xl px-5 py-4 border border-white/30 shadow-2xl">
                            <div className="text-3xl font-black text-white leading-none">
                                {generator.ampere_price.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-white/70 font-black uppercase mt-1 tracking-widest text-center">ل.س/كيلو</div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="px-5 -mt-6 relative z-10 space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-premium border border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center">
                                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">التقييم</span>
                        </div>
                        <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{generator.average_rating || 0} <span className="text-sm opacity-50">/ 5</span></div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1 tracking-widest uppercase">{generator.ratings_count || 0} تقييم</div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-premium border border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                                <Clock size={16} className="text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">ساعات العمل</span>
                        </div>
                        <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{generator.operating_hours}h</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1 tracking-widest uppercase">يومياً</div>
                    </div>
                </div>

                {/* Contact Info */}
                {generator.phone && (
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-800/50 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 dark:bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <h3 className="font-black text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center">
                                <Phone size={18} className="text-indigo-600 dark:text-indigo-400" />
                            </div>
                            معلومات التواصل
                        </h3>
                        <a href={`tel:${generator.phone}`} className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-lg shadow-indigo-600/20 active:scale-95 transition-all relative z-10">
                            <Phone size={16} />
                            اتصال مباشر: {generator.phone}
                        </a>
                    </div>
                )}

                {/* Status/Subscription (Added enhancement) */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-premium border border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full animate-pulse ${generator.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                        <span className="font-black text-slate-800 dark:text-slate-100">{status?.text}</span>
                    </div>
                    <button
                        onClick={handleSubscribe}
                        className={`p-3 rounded-2xl transition-all ${isSubscribed ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' : 'bg-slate-50 dark:bg-slate-900 text-slate-400'}`}
                    >
                        {isSubscribed ? <Bell size={20} /> : <BellOff size={20} />}
                    </button>
                </div>

                {/* Action Buttons */}
                <button
                    onClick={() => navigate(`/generators/${id}/rate`)}
                    className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-[32px] font-black flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-indigo-600/30"
                >
                    <Star size={24} className="fill-yellow-400 text-yellow-400" />
                    <span>تقييم تجربة الخدمة</span>
                </button>
            </main>
        </div>
    );
}
