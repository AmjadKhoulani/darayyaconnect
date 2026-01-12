import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Zap, Filter, AlertCircle, Star } from 'lucide-react';
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
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl" {...handlers}>
            <PullToRefreshContainer isRefreshing={isRefreshing} pullMoveY={pullMoveY}>
                <header className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white sticky top-0 z-30 shadow-xl">
                    <div className="px-5 py-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-black flex items-center gap-2">
                                    <Zap size={28} className="text-yellow-300" />
                                    شركات الأمبير
                                </h1>
                                <p className="text-xs text-indigo-100 font-medium mt-1">دليل الشركات والأسعار</p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
                            <input
                                type="text"
                                placeholder="ابحث عن شركة أو حي..."
                                value={filters.neighborhood}
                                onChange={(e) => setFilters({ ...filters, neighborhood: e.target.value })}
                                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-xl text-xs text-white placeholder:text-white/60 backdrop-blur-md"
                            />
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
                            <Zap size={64} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-lg font-bold text-slate-700 mb-2">لا توجد شركات</h3>
                            <p className="text-sm text-slate-500">جرب تغيير البحث</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {generators.map((gen) => {
                                return (
                                    <div
                                        key={gen.id}
                                        onClick={() => navigate(`/generators/${gen.id}`)}
                                        className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 active:scale-[0.98] transition-transform"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-slate-800 text-lg mb-1">{gen.name}</h3>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <MapPin size={12} />
                                                    <span>{gen.neighborhood}</span>
                                                </div>
                                            </div>

                                            <div className="text-left">
                                                <div className="text-2xl font-black text-indigo-600">
                                                    {gen.ampere_price.toLocaleString()}
                                                </div>
                                                <div className="text-[10px] text-slate-500 font-bold">ل.س/كيلو واط</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
                                            <div className="flex items-center gap-1">
                                                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                                <span className="text-sm font-bold text-slate-700">
                                                    {gen.average_rating || 0}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    ({gen.ratings_count || 0})
                                                </span>
                                            </div>

                                            <div className="text-xs text-slate-500">
                                                ⏰ {gen.operating_hours}h يومياً
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                        <p className="text-xs text-blue-700 font-medium">
                            💡 اضغط على أي شركة لرؤية التفاصيل أو إضافة تقييم
                        </p>
                    </div>
                </main>
            </PullToRefreshContainer>
        </div>
    );
}
