import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, AlertTriangle, Filter, Calendar, Map as MapIcon, List } from 'lucide-react';
import api from '../services/api';
import { usePullToRefresh, PullToRefreshContainer } from '../hooks/usePullToRefresh';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function CityReports() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const navigate = useNavigate();

    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);

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

    // Initialize Map when viewMode is map
    useEffect(() => {
        if (viewMode === 'map' && mapContainer.current && !map.current && !loading) {
            map.current = new maplibregl.Map({
                container: mapContainer.current,
                style: {
                    version: 8,
                    sources: {
                        'osm': {
                            type: 'raster',
                            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                            tileSize: 256,
                            attribution: '&copy; OpenStreetMap'
                        }
                    },
                    layers: [
                        {
                            id: 'osm',
                            type: 'raster',
                            source: 'osm',
                        }
                    ]
                },
                center: [36.236, 33.456], // Default center Darayya
                zoom: 13,
            });

            // Add Markers
            if (reports.length > 0) {
                const bounds = new maplibregl.LngLatBounds();

                filteredReports.forEach(report => {
                    if (!report.latitude || !report.longitude) return;

                    // Create DOM element for marker
                    const el = document.createElement('div');
                    el.className = 'w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer';

                    // Set color based on status or type
                    if (report.category === 'electricity') {
                        if (report.status === 'resolved') {
                            el.style.backgroundImage = 'url(/icons/elektricity-on.png)';
                            el.style.backgroundSize = 'contain';
                        } else {
                            el.style.backgroundImage = 'url(/icons/elektricity-off.png)';
                            el.style.backgroundSize = 'contain';
                        }
                        el.className += ' bg-white';
                    } else {
                        // Icon for others
                        el.style.backgroundColor = getCategoryColorHex(report.category);
                        el.innerHTML = getCategoryIconEmoji(report.category);
                        el.style.fontSize = '16px';
                    }

                    // Popup
                    const popupHTML = `
                        <div class="text-right p-1" dir="rtl">
                            <h3 class="font-bold text-sm mb-1 text-slate-900">${report.title || 'بلاغ'}</h3>
                            <p class="text-xs text-slate-500 mb-2">${getStatusText(report.status)}</p>
                            <button id="btn-${report.id}" class="bg-indigo-600 text-white text-[10px] px-3 py-1 rounded-lg font-bold w-full">التفاصيل</button>
                        </div>
                      `;

                    const popup = new maplibregl.Popup({ offset: 25 })
                        .setHTML(popupHTML);

                    // Add click event for button inside popup
                    popup.on('open', () => {
                        document.getElementById(`btn-${report.id}`)?.addEventListener('click', () => {
                            navigate(`/report-detail/${report.id}`);
                        });
                    });

                    new maplibregl.Marker({ element: el })
                        .setLngLat([parseFloat(report.longitude), parseFloat(report.latitude)])
                        .setPopup(popup)
                        .addTo(map.current!);

                    bounds.extend([parseFloat(report.longitude), parseFloat(report.latitude)]);
                });

                if (!bounds.isEmpty()) {
                    map.current.fitBounds(bounds, { padding: 50 });
                }
            }
        }

        // Cleanup if component unmounts or view changes? 
        // Better to keep map instance if switching back and forth?
        // simple approach: destroy on unmount of effect if viewMode changes to list
        return () => {
            if (viewMode === 'list' && map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [viewMode, loading, filter]); // Re-run if filter changes to update markers? simpler to remove and re-add

    const filteredReports = filter === 'all'
        ? reports
        : reports.filter(r => r.category === filter);

    const getIcon = (report: any) => {
        if (report.category === 'electricity') {
            if (report.status === 'resolved') {
                return <img src="/icons/elektricity-on.png" alt="On" className="w-8 h-8 object-contain" />;
            }
            return <img src="/icons/elektricity-off.png" alt="Off" className="w-8 h-8 object-contain" />;
        }

        return <span className="text-2xl">{getCategoryIconEmoji(report.category)}</span>;
    };

    const getCategoryIconEmoji = (category: string) => {
        switch (category) {
            case 'water': return '💧';
            case 'sanitation': return '🚽';
            case 'road': return '🚧';
            default: return '⚠️';
        }
    };

    const getCategoryColorHex = (category: string) => {
        switch (category) {
            case 'water': return '#3b82f6';
            case 'sanitation': return '#64748b';
            case 'road': return '#f97316';
            default: return '#fbbf24';
        }
    }

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
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
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
                            <button
                                onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-lg hover:scale-105 transition-all"
                            >
                                {viewMode === 'list' ? <><MapIcon size={16} /> الخريطة</> : <><List size={16} /> القائمة</>}
                            </button>
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

                <main className="px-5 py-4 space-y-4 h-[calc(100vh-180px)]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <div className="animate-spin w-8 h-8 border-2 border-current border-t-transparent rounded-full mb-4"></div>
                            <p className="text-sm">جاري تحميل البلاغات...</p>
                        </div>
                    ) : viewMode === 'list' ? (
                        /* List View */
                        filteredReports.length > 0 ? (
                            filteredReports.map((report) => (
                                <div
                                    key={report.id}
                                    onClick={() => navigate(`/report-detail/${report.id}`)}
                                    className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-700/50 cursor-pointer active:scale-[0.98] transition-all"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getColor(report.category)}`}>
                                            {getIcon(report)}
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
                            </div>
                        )
                    ) : (
                        /* Map View */
                        <div className="w-full h-full rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 relative">
                            <div ref={mapContainer} className="absolute inset-0" />
                        </div>
                    )}
                </main>
            </PullToRefreshContainer>
        </div>
    );
}
