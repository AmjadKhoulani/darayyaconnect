import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, AlertTriangle, Filter, Calendar } from 'lucide-react';
import api from '../services/api';
import { usePullToRefresh, PullToRefreshContainer } from '../hooks/usePullToRefresh';

export default function CityReports() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await api.get('/infrastructure/public-reports');
            // The API returns GeoJSON FeatureCollection
            if (res.data.features) {
                setReports(res.data.features.map((f: any) => f.properties));
            } else {
                setReports([]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const { isRefreshing, containerRef, indicatorRef, handlers } = usePullToRefresh(fetchReports);

    useEffect(() => {
        fetchReports();
    }, []);

    const filteredReports = filter === 'all'
        ? reports
        : reports.filter(r => r.category === filter);

    const getIcon = (category: string) => {
        switch (category) {
            case 'electricity': return '⚡';
            case 'water': return '💧';
            case 'sanitation': return '🚽';
            case 'road': return '🚧';
            default: return '⚠️';
        }
    };

    const getColor = (category: string) => {
        switch (category) {
            case 'electricity': return 'bg-amber-100 text-amber-700';
            case 'water': return 'bg-blue-100 text-blue-700';
            case 'sanitation': return 'bg-slate-100 text-slate-700';
            case 'road': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusText = (status: string) => {
        if (status === 'resolved') return 'تم الحل ✅';
        if (status === 'in_progress') return 'قيد المعالجة 🔨';
        return 'قيد الانتظار ⏳';
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl" {...handlers}>
            <PullToRefreshContainer isRefreshing={isRefreshing} containerRef={containerRef} indicatorRef={indicatorRef}>
                {/* Header */}
                <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm transition-colors duration-300">
                    <div className="px-5 py-4">
                        <div className="flex items-center gap-3 mb-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                <ArrowRight size={20} />
                            </button>
                            <div>
                                <h1 className="text-xl font-black text-slate-800 dark:text-slate-100">بلاغات المدينة 📢</h1>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">تابع ما يحدث في داريا لحظة بلحظة</p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {[
                                { id: 'all', label: 'الكل' },
                                { id: 'electricity', label: '⚡ كهرباء' },
                                { id: 'water', label: '💧 مياه' },
                                { id: 'road', label: '🚧 طرقات' },
                                { id: 'sanitation', label: '🚽 صرف صحي' }
                            ].map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setFilter(f.id)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${filter === f.id
                                        ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900'
                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                <main className="px-5 py-4 space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <div className="animate-spin w-8 h-8 border-2 border-current border-t-transparent rounded-full mb-4"></div>
                            <p className="text-sm">جاري تحميل البلاغات...</p>
                        </div>
                    ) : filteredReports.length > 0 ? (
                        filteredReports.map((report) => (
                            <div key={report.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-700/50">
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${getColor(report.category)}`}>
                                        {getIcon(report.category)}
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${report.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                report.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    'bg-amber-50 text-amber-700 border-amber-100'
                                            }`}>
                                            {getStatusText(report.status)}
                                        </span>
                                        {report.department && (
                                            <span className="text-[9px] text-slate-400 font-medium">الجهة: {report.department}</span>
                                        )}
                                    </div>
                                </div>

                                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">{report.title || 'بلاغ بدون عنوان'}</h3>
                                <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400 mt-2">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        {report.created_at}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin size={12} />
                                        موقع مسجل
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                            <AlertTriangle size={48} className="mx-auto text-slate-300 mb-4" />
                            <p className="font-bold text-slate-500">لا توجد بلاغات حالياً</p>
                            <p className="text-xs text-slate-400 mt-1">الحمد لله، الأمور بخير!</p>
                        </div>
                    )}
                </main>
            </PullToRefreshContainer>
        </div>
    );
}
