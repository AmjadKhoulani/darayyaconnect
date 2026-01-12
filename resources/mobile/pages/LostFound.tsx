import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, PackageSearch, AlertCircle, CheckCircle2, Calendar, MapPin } from 'lucide-react';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';
import { usePullToRefresh, PullToRefreshContainer } from '../hooks/usePullToRefresh';

const categories = {
    documents: { icon: "📄", label: "مستندات", color: "blue" },
    phone: { icon: "📱", label: "هاتف", color: "purple" },
    keys: { icon: "🔑", label: "مفاتيح", color: "amber" },
    bag: { icon: "👜", label: "حقيبة", color: "pink" },
    wallet: { icon: "💳", label: "محفظة", color: "green" },
    jewelry: { icon: "💍", label: "مجوهرات", color: "yellow" },
    pet: { icon: "🐾", label: "حيوان أليف", color: "orange" },
    other: { icon: "📦", label: "أخرى", color: "slate" }
};

export default function LostFound() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found'>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        location: '',
        search: ''
    });
    const navigate = useNavigate();

    const fetchItems = useCallback(async () => {
        try {
            setLoading(true);
            const params: any = {};

            if (activeTab !== 'all') params.type = activeTab;
            if (filters.category) params.category = filters.category;
            if (filters.location) params.location = filters.location;
            if (filters.search) params.search = filters.search;

            const res = await api.get('/lost-found', { params });
            setItems(res.data.data || res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [activeTab, filters]);

    const { isRefreshing, pullMoveY, handlers } = usePullToRefresh(fetchItems);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const getTimeDiff = (date: string) => {
        const now = new Date();
        const itemDate = new Date(date);
        const diff = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diff === 0) return 'اليوم';
        if (diff === 1) return 'أمس';
        if (diff < 7) return `منذ ${diff} أيام`;
        if (diff < 30) return `منذ ${Math.floor(diff / 7)} أسابيع`;
        return `منذ ${Math.floor(diff / 30)} شهر`;
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl" {...handlers}>
            <PullToRefreshContainer isRefreshing={isRefreshing} pullMoveY={pullMoveY}>
                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                    <div className="px-5 py-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-black text-slate-800">المفقودات 🔍</h1>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">ساعد في إعادة الأغراض لأصحابها</p>
                            </div>
                            <button
                                onClick={() => navigate('/lost-found/add')}
                                className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                            >
                                <Plus size={24} />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="relative mb-3">
                            <Search size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="ابحث عن غرض..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full pr-11 pl-4 py-3 bg-slate-100 border-none rounded-2xl text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Tabs */}
                        <div className="bg-slate-100 p-1.5 rounded-2xl flex">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
                            >
                                الكل
                            </button>
                            <button
                                onClick={() => setActiveTab('lost')}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'lost' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
                            >
                                مفقود 🔴
                            </button>
                            <button
                                onClick={() => setActiveTab('found')}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'found' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
                            >
                                موجود 🟢
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="px-5 py-6">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => <SkeletonLoader key={i} type="card" />)}
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-16">
                            <PackageSearch size={64} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-lg font-bold text-slate-700 mb-2">لا توجد إعلانات</h3>
                            <p className="text-sm text-slate-500">جرب تغيير الفلاتر أو البحث</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => navigate(`/lost-found/${item.id}`)}
                                    className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 active:scale-[0.98] transition-transform cursor-pointer"
                                >
                                    <div className="flex gap-4">
                                        {/* Icon/Image */}
                                        <div className={`w-20 h-20 rounded-2xl bg-${categories[item.category as keyof typeof categories]?.color || 'slate'}-50 flex items-center justify-center text-4xl shrink-0 border border-${categories[item.category as keyof typeof categories]?.color || 'slate'}-100`}>
                                            {categories[item.category as keyof typeof categories]?.icon || '📦'}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h3 className="font-bold text-slate-800 text-base line-clamp-1 flex-1">
                                                    {item.title}
                                                </h3>
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase shrink-0 ${item.type === 'lost'
                                                        ? 'bg-rose-100 text-rose-700'
                                                        : 'bg-emerald-100 text-emerald-700'
                                                    }`}>
                                                    {item.type === 'lost' ? 'مفقود' : 'موجود'}
                                                </span>
                                            </div>

                                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                                                {item.description}
                                            </p>

                                            <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={12} className="text-slate-400" />
                                                    <span>{item.location}</span>
                                                </div>
                                                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={12} className="text-slate-400" />
                                                    <span>{getTimeDiff(item.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Bottom Tip */}
                    {!loading && items.length > 0 && (
                        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                            <p className="text-xs text-blue-700 font-medium leading-relaxed">
                                💡 إذا وجدت أو فقدت شيئاً، أضف إعلان مباشرة لمساعدة المجتمع
                            </p>
                        </div>
                    )}
                </main>
            </PullToRefreshContainer>
        </div>
    );
}
