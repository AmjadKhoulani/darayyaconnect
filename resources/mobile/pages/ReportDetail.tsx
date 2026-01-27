import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, MapPin, Clock, CheckCircle2, AlertCircle, Save, Shield } from 'lucide-react';
import api from '../services/api';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function ReportDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [notes, setNotes] = useState('');
    const [updating, setUpdating] = useState(false);
    const [userRole, setUserRole] = useState('');

    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);

    const locationState = useLocation().state as any;
    // Enhanced Error State
    const [debugError, setDebugError] = useState<string | null>(null);

    useEffect(() => {
        // Optimistic Load from State
        if (locationState?.report) {
            setReport(locationState.report);
            setStatus(locationState.report.status);
            setLoading(false); // Show immediately
        }

        // Fetch fresh data
        fetchReport();

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserRole(user.role || '');
    }, [id]);

    const fetchReport = async () => {
        setDebugError(null);
        try {
            // Explicitly constructing URL to show in debug if needed
            const url = `/infrastructure/reports/${id}`;
            const res = await api.get(url);
            setReport(res.data);
            setStatus(res.data.status);
            setNotes(res.data.official_notes || '');
            setLoading(false);
        } catch (err: any) {
            console.error(err);
            // If we have state data, don't show full error, just toast?
            // But we need images which are NOT in state.

            const status = err.response?.status;
            const url = err.config?.url;
            const msg = err.response?.data?.message || err.message;

            setDebugError(`خطأ ${status}: ${msg}\nURL: ${url}`);
            setLoading(false);
        }
    };

    // Initialize Map
    useEffect(() => {
        if (!loading && report && report.latitude && report.longitude && mapContainer.current && !map.current) {
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
                center: [parseFloat(report.longitude), parseFloat(report.latitude)],
                zoom: 15,
                interactive: false // Static map
            });

            new maplibregl.Marker({ color: '#f97316' })
                .setLngLat([parseFloat(report.longitude), parseFloat(report.latitude)])
                .addTo(map.current);
        }
    }, [loading, report]);

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            await api.post(`/reports/${id}/update`, {
                status,
                official_notes: notes
            });
            alert('تم التحديث بنجاح');
            fetchReport();
        } catch (err) {
            console.error(err);
            alert('فشل التحديث');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
                <p className="font-bold text-slate-400 text-sm">جاري تحميل البيانات...</p>
            </div>
        </div>
    );

    if (!report) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50 text-center" dir="rtl">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={40} className="text-rose-500" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">تعذر تحميل البلاغ</h3>
            <p className="text-slate-500 mb-6 text-sm">قد يكون المحتوى محذوفاً أو الرابط غير صحيح.</p>

            {debugError && (
                <div className="w-full bg-slate-900 text-slate-300 p-4 rounded-xl text-left text-[10px] font-mono mb-6 overflow-x-auto whitespace-pre-wrap" dir="ltr">
                    {debugError}
                    <div className="mt-2 text-rose-400 border-t border-slate-700 pt-2">
                        Admin Note: If status is 404, the route is missing on server. Run 'git pull' then 'php artisan route:clear'.
                    </div>
                </div>
            )}

            <button onClick={() => navigate(-1)} className="px-8 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 shadow-sm active:scale-95 transition-transform">
                عودة
            </button>
        </div>
    );

    const canEdit = userRole === 'admin' || userRole === 'official';

    // Helper to get image URL
    const getImageUrl = (path: string) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${api.defaults.baseURL?.replace('/api', '')}${path}`;
    };

    // Parse images safely
    const images = report.images ? (typeof report.images === 'string' ? JSON.parse(report.images) : report.images) : [];
    const rawImageUrl = Array.isArray(images) && images.length > 0 ? images[0] : null;
    const imageUrl = getImageUrl(rawImageUrl);

    return (
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
            <header className="bg-white px-4 py-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors">
                    <ArrowRight className="text-slate-600" />
                </button>
                <h1 className="text-lg font-black text-slate-800">تفاصيل البلاغ</h1>
            </header>

            <main className="p-4 space-y-6">
                {/* Header Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${report.status === 'pending' ? 'bg-rose-100 text-rose-700' :
                            report.status === 'in_progress' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                            {{
                                'pending': 'معلق',
                                'in_progress': 'قيد المعالجة',
                                'resolved': 'تم الحل'
                            }[report.status as string] || report.status}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">#{id?.substring(0, 8)}</span>
                    </div>

                    <h2 className="text-xl font-black text-slate-800 mb-2">{report.title || 'بلاغ خدمة'}</h2>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4 bg-slate-50 p-4 rounded-2xl font-medium">{report.description}</p>

                    <div className="flex items-center gap-4 text-slate-400 text-xs font-bold pt-2 border-t border-slate-50">
                        <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{new Date(report.created_at).toLocaleString('ar-SY')}</span>
                        </div>
                        {report.department && (
                            <div className="flex items-center gap-1 text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg">
                                <Shield size={12} />
                                <span>{report.department.name}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map Section */}
                {report.latitude && report.longitude && (
                    <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100 overflow-hidden">
                        <div className="h-48 w-full rounded-2xl relative overflow-hidden">
                            <div ref={mapContainer} className="absolute inset-0" />
                            <div className="absolute inset-0 pointer-events-none border-2 border-slate-100/50 rounded-2xl"></div>
                            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-bold shadow-sm">
                                <MapPin size={10} className="inline mr-1" />
                                {report.latitude}, {report.longitude}
                            </div>
                        </div>
                    </div>
                )}

                {/* Image Section */}
                {imageUrl && (
                    <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100">
                        <img
                            src={imageUrl}
                            className="w-full h-64 object-cover rounded-2xl shadow-sm"
                            alt="صورة البلاغ"
                            onClick={() => window.open(imageUrl, '_blank')}
                        />
                    </div>
                )}

                {/* Management Section */}
                {canEdit && (
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Shield size={18} className="text-emerald-500" />
                            إدارة البلاغ
                        </h3>
                        {/* ... (Existing management UI kept same) ... */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-2">تغيير الحالة</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['pending', 'in_progress', 'resolved'].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setStatus(s)}
                                            className={`py-2 rounded-xl text-[10px] font-black border transition-all ${status === s
                                                ? 'bg-emerald-600 text-white border-emerald-600'
                                                : 'bg-slate-50 text-slate-400 border-slate-100'
                                                }`}
                                        >
                                            {{
                                                'pending': 'معلق',
                                                'in_progress': 'قيد العمل',
                                                'resolved': 'تم الحل'
                                            }[s]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-2">ملاحظات رسمية</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    className="w-full bg-slate-50 border-slate-100 rounded-2xl text-sm font-bold p-4 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                                />
                            </div>
                            <button
                                onClick={handleUpdate}
                                disabled={updating}
                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                <Save size={18} />
                                {updating ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
