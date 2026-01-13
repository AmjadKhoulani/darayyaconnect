import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, Clock, Share2, CalendarDays } from 'lucide-react';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';

const categoryLabels = {
    religious: { label: 'ديني', color: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50' },
    cultural: { label: 'ثقافي', color: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50' },
    social: { label: 'اجتماعي', color: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50' },
    emergency: { label: 'طوارئ', color: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50' },
    other: { label: 'أخرى', color: 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-700/30 dark:text-slate-400 dark:border-slate-600/50' }
};

export default function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/portal/events/${id}`);
                setEvent(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const addToCalendar = () => {
        // Simple alert for now, could be integrated with native calendar later
        alert('سيتم إضافة هذا الحدث إلى تقويمك قريباً');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!event) return null;

    const category = categoryLabels[event.category as keyof typeof categoryLabels] || categoryLabels.other;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl">
            {/* Hero Section */}
            <div className="relative h-72 bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 opacity-90"></div>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                {/* Image Placeholder */}
                {event.image && (
                    <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50" />
                )}

                {/* Navbar */}
                <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20 active:scale-95 transition-transform"
                    >
                        <ArrowRight size={20} />
                    </button>
                    <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20 active:scale-95 transition-transform">
                        <Share2 size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider mb-3 inline-block ${category.color} bg-opacity-100 border-none`}>
                        {category.label}
                    </span>
                    <h1 className="text-2xl font-black text-white mb-2 leading-tight">{event.title}</h1>
                    <div className="flex items-center gap-4 text-slate-300 text-xs font-bold">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-indigo-400" />
                            <span>{new Date(event.date).toLocaleDateString('ar-SY', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                        </div>
                        <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-emerald-400" />
                            <span>{event.time}</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="px-5 py-6 space-y-6">
                {/* Location Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">الموقع</p>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{event.location}</p>
                        </div>
                    </div>
                    <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg">
                        الخريطة
                    </button>
                </div>

                {/* Description */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-premium border border-slate-100 dark:border-slate-700/50">
                    <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-4">حول الفعالية</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-loose font-medium">
                        {event.description}
                    </p>
                </div>

                {/* Action Button */}
                <button
                    onClick={addToCalendar}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                    <CalendarDays size={20} />
                    <span>إضافة إلى التقويم</span>
                </button>
            </main>
        </div>
    );
}
