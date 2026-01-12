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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
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
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
            {/* Hero Header */}
            <div className="relative h-72 bg-gradient-to-br from-indigo-600 to-purple-700 overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>

                <button onClick={() => navigate(-1)} className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 z-10">
                    <ArrowRight size={20} className="rotate-180" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-3xl font-black mb-2">{generator.name}</h1>
                            <div className="flex items-center gap-2 text-sm text-white/80">
                                <MapPin size={14} />
                                <span>{generator.neighborhood}</span>
                            </div>
                        </div>
                        <div className="text-left bg-white/20 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/30">
                            <div className="text-3xl font-black text-white">
                                {generator.ampere_price.toLocaleString()}
                            </div>
                            <div className="text-xs text-white/70 font-bold">ل.س/كيلو واط</div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="px-5 -mt-4 relative z-10 space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Star size={16} className="text-yellow-500" />
                            <span className="text-xs font-bold text-slate-500 uppercase">التقييم</span>
                        </div>
                        <div className="text-2xl font-black text-slate-800">{generator.average_rating || 0} ⭐</div>
                        <div className="text-xs text-slate-500">{generator.ratings_count || 0} تقييم</div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock size={16} className="text-indigo-600" />
                            <span className="text-xs font-bold text-slate-500 uppercase">ساعات العمل</span>
                        </div>
                        <div className="text-2xl font-black text-slate-800">{generator.operating_hours}h</div>
                        <div className="text-xs text-slate-500">يومياً</div>
                    </div>
                </div>

                {/* Contact Info */}
                {generator.phone && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-5 border border-blue-100">
                        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <Phone size={18} className="text-indigo-600" />
                            معلومات التواصل
                        </h3>
                        <a href={`tel:${generator.phone}`} className="text-indigo-600 font-bold">
                            {generator.phone}
                        </a>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => navigate(`/generators/${id}/rate`)}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg"
                    >
                        <Star size={20} />
                        <span>تقييم الشركة</span>
                    </button>
                </div>
            </main>
        </div>
    );
}
