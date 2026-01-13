import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Zap, Filter, AlertCircle, Star, Search } from 'lucide-react';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';
import { usePullToRefresh, PullToRefreshContainer } from '../hooks/usePullToRefresh';

const statusConfig = {
    active: { bg: 'emerald', icon: '🟢', text: 'نشطة' },
    down: { bg: 'rose', icon: '🔴', text: 'معطلة' },
    maintenance: { bg: 'amber', icon: '🟡', text: 'صيانة' }
};

export default function GeneratorMap() {
    const [generators, setGenerators] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        neighborhood: '',
        status: '',
        search: ''
    });
    const navigate = useNavigate();

    const fetchGenerators = useCallback(async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (filters.neighborhood) params.neighborhood = filters.neighborhood;
            if (filters.status) params.status = filters.status;

            const res = await api.get('/generators', { params });
            setGenerators(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const { isRefreshing, pullMoveY, handlers } = usePullToRefresh(fetchGenerators);

    useEffect(() => {
        fetchGenerators();
    }, [fetchGenerators]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl" {...handlers}>
            <PullToRefreshContainer isRefreshing={isRefreshing} pullMoveY={pullMoveY}>
                <header className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white sticky top-0 z-30 shadow-xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="px-5 py-6 relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-black flex items-center gap-2 leading-none">
                                    <Zap size={28} className="text-yellow-300 animate-pulse" />
                                    شركات الأمبير
                                </h1>
                                <p className="text-xs text-indigo-100 font-medium mt-1">دليل الشركات والأسعار والتقييمات</p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 active:bg-white/20 transition-colors">
                            <div className="relative">
                                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60" />
                                <input
                                    type="text"
                                    placeholder="ابحث عن شركة أو حي..."
                                    value={filters.neighborhood}
                                    onChange={(e) => setFilters({ ...filters, neighborhood: e.target.value })}
                                    className="w-full pr-10 pl-3 py-2 bg-white/20 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/60 backdrop-blur-md outline-none focus:ring-1 focus:ring-white/40 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="px-5 py-6">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => <SkeletonLoader key={i} type="card" />)}
                        </div>
                    ) : generators.length === 0 ? (
                        <div className="text-center py-16">
                            <Zap size={64} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">لا توجد شركات</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-500 font-medium">جرب تغيير البحث أو الحي</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {generators.map((gen) => {
                                return (
                                    <div
                                        key={gen.id}
                                        onClick={() => navigate(`/generators/${gen.id}`)}
                                        className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-premium border border-slate-100 dark:border-slate-700 active:scale-[0.98] transition-all relative overflow-hidden group"
                                    >
                                        <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg mb-1 leading-tight">{gen.name}</h3>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                    <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                                        <MapPin size={10} className="text-slate-400" />
                                                    </div>
                                                    <span>{gen.neighborhood}</span>
                                                </div>
                                            </div>

                                            <div className="text-left bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                                                <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 leading-none">
                                                    {gen.ampere_price.toLocaleString()}
                                                </div>
                                                <div className="text-[10px] text-indigo-400 dark:text-indigo-500 font-black uppercase tracking-tighter mt-1 text-center">ل.س/كيلو</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 pt-4 border-t border-slate-50 dark:border-slate-700/50">
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-100 dark:border-yellow-800/50">
                                                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                                <span className="text-sm font-black text-slate-800 dark:text-slate-200">
                                                    {gen.average_rating || 0}
                                                </span>
                                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                                                    ({gen.ratings_count || 0})
                                                </span>
                                            </div>

                                            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1">
                                                <span className="opacity-60">⏰</span>
                                                <span>{gen.operating_hours}h يومياً</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl p-4 text-center">
                        <p className="text-xs text-indigo-700 dark:text-indigo-400 font-bold leading-relaxed">
                            💡 اضغط على أي شركة لرؤية التفاصيل الكاملة، الأسعار التفصيلية أو إضافة تقييمك الخاص
                        </p>
                    </div>
                </main>
            </PullToRefreshContainer>
        </div>
    );
}
