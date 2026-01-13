import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, Clock, Search, Filter } from 'lucide-react';
import api from '../services/api';

interface DarayyaEvent {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: 'religious' | 'cultural' | 'social' | 'emergency' | 'other';
    image?: string;
}

const mockEvents: DarayyaEvent[] = [
    {
        id: 1,
        title: 'ندوة حول التنمية المجتمعية',
        description: 'ندوة حوارية لمناقشة آفاق التطوير في مدينة داريا وأهم التحديات الراهنة.',
        date: '2026-01-20',
        time: '14:00',
        location: 'المركز الثقافي - القاعة الرئيسية',
        category: 'cultural'
    },
    {
        id: 2,
        title: 'حملة تشجير في الساحة الرئيسية',
        description: 'حملة تطوعية لزيادة المساحات الخضراء في المدينة. شاركنا لنجعل مدينتنا أجمل.',
        date: '2026-01-22',
        time: '09:00',
        location: 'الساحة المركزية',
        category: 'social'
    },
    {
        id: 3,
        title: 'مسابقة القرآن الكريم السنوية',
        description: 'المسابقة السنوية لحفظ وتجويد القرآن الكريم لطلاب المدارس.',
        date: '2026-01-25',
        time: '10:00',
        location: 'جامع داريا الكبير',
        category: 'religious'
    },
    {
        id: 4,
        title: 'دورة تدريبية على الإسعافات الأولية',
        description: 'دورة مكثفة بالتنسيق مع الهلال الأحمر لتعلم مبادئ الإسعاف الأولي.',
        date: '2026-01-28',
        time: '16:00',
        location: 'مركز الخدمات البلدية',
        category: 'emergency'
    }
];

const categoryLabels = {
    religious: { label: 'ديني', color: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50' },
    cultural: { label: 'ثقافي', color: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50' },
    social: { label: 'اجتماعي', color: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50' },
    emergency: { label: 'طوارئ', color: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50' },
    other: { label: 'أخرى', color: 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-700/30 dark:text-slate-400 dark:border-slate-600/50' }
};

export default function Events() {
    const navigate = useNavigate();
    const [events, setEvents] = useState<DarayyaEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await api.get('/portal/events');
            setEvents(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Mock data fallback if API fails or empty (for dev purposes)
    const displayEvents = events.length > 0 ? events : [];

    const filteredEvents = displayEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'all' || event.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl">
            {/* Header */}
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm transition-all duration-300">
                <div className="px-4 py-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                            >
                                <ArrowRight size={20} />
                            </button>
                            <div>
                                <h1 className="text-xl font-black text-slate-800 dark:text-slate-100">الفعاليات</h1>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none mt-0.5">اكتشف ما يحدث في داريا</p>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
                            <Calendar size={24} />
                        </div>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="ابحث عن فعاليات..."
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pr-10 pl-4 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-slate-600 dark:text-slate-400 shadow-sm active:scale-95 transition-all">
                            <Filter size={20} />
                        </button>
                    </div>

                    {/* Categories Scroll */}
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 pr-4">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${activeCategory === 'all'
                                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-lg'
                                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            الكل
                        </button>
                        {Object.entries(categoryLabels).map(([key, data]) => (
                            <button
                                key={key}
                                onClick={() => setActiveCategory(key)}
                                className={`px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${activeCategory === key
                                    ? 'bg-indigo-600 text-white shadow-lg border-indigo-500'
                                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                                    }`}
                            >
                                {data.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Content List */}
            <main className="px-4 py-6 space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin w-8 h-8 border-2 border-slate-800 dark:border-slate-400 border-t-transparent rounded-full mb-4"></div>
                        <p className="text-xs text-slate-500">جاري تحميل الفعاليات...</p>
                    </div>
                ) : filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => {
                        const styleInfo = categoryLabels[event.category as keyof typeof categoryLabels] || categoryLabels.other;
                        return (
                            <div
                                key={event.id}
                                onClick={() => navigate(`/events/${event.id}`)}
                                className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-premium border border-slate-100 dark:border-slate-700/50 group active:scale-[0.98] transition-all cursor-pointer"
                            >
                                <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 relative">
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${styleInfo.color}`}>
                                            {styleInfo.label}
                                        </span>
                                    </div>
                                    {/* Placeholder for Event Image */}
                                    {event.image ? (
                                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Calendar size={48} className="text-slate-300 dark:text-slate-600 opacity-50 group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                    )}
                                </div>

                                <div className="p-5">
                                    <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                                        {event.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-4 line-clamp-2">
                                        {event.description}
                                    </p>

                                    <div className="space-y-2 border-t border-slate-50 dark:border-slate-700/50 pt-4">
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                                            <Calendar size={14} className="text-indigo-500" />
                                            <span>{new Date(event.date).toLocaleDateString('ar-SY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                                                <Clock size={14} className="text-emerald-500" />
                                                <span>الساعة {event.time}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                                <MapPin size={12} className="text-orange-500" />
                                                <span className="truncate max-w-[120px]">{event.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-4 border border-slate-200 dark:border-slate-700">
                            <Clock size={40} className="text-slate-300 dark:text-slate-600" />
                        </div>
                        <h4 className="text-slate-800 dark:text-slate-100 font-bold mb-1">لا توجد فعاليات</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 px-10 leading-relaxed font-medium">عذراً، لم نجد أي فعاليات تطابق بحثك حالياً.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
