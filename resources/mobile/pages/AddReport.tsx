import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GeolocationService } from '../services/GeolocationService';
import api from '../services/api';
import { NotificationService } from '../services/notification';
import { OfflineService, OfflineReport } from '../services/OfflineService';
import { Construction, Trash2, Lightbulb, FileText, MapPin, Send, MessageSquare, AlertTriangle, ArrowRight, Camera, RefreshCw, WifiOff, X } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function AddReport() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('infrastructure');
    const [severity, setSeverity] = useState(3);
    const [location, setLocation] = useState<any>(null);
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [locLoading, setLocLoading] = useState(true);
    const [locError, setLocError] = useState<string | null>(null);
    const [isDirty, setIsDirty] = useState(false);

    // Map Picker State
    const [showMapPicker, setShowMapPicker] = useState(false);
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const marker = useRef<maplibregl.Marker | null>(null);

    const navigate = useNavigate();
    const locationState = useLocation().state as any;

    // Prefill data if available
    useEffect(() => {
        if (locationState?.prefill) {
            const { title, type, latitude, longitude } = locationState.prefill;
            if (title) setTitle(title);
            if (type) setType(type);
            if (latitude && longitude) {
                setLocation({ lat: latitude, lng: longitude });
                setLocLoading(false);
            }
        }
    }, [locationState]);

    // Track changes
    useEffect(() => {
        if (title || description || image) {
            setIsDirty(true);
        } else {
            setIsDirty(false);
        }
    }, [title, description, image]);

    // Map Initialization
    useEffect(() => {
        if (showMapPicker && mapContainer.current && !map.current) {
            const initialLat = location?.lat || 33.456;
            const initialLng = location?.lng || 36.236;

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
                center: [initialLng, initialLat],
                zoom: 15,
            });

            // Add marker
            marker.current = new maplibregl.Marker({ draggable: true, color: '#10b981' })
                .setLngLat([initialLng, initialLat])
                .addTo(map.current);

            marker.current.on('dragend', () => {
                const lngLat = marker.current?.getLngLat();
                if (lngLat) {
                    setLocation({ lat: lngLat.lat, lng: lngLat.lng });
                    setLocError(null);
                }
            });

            map.current.on('click', (e) => {
                marker.current?.setLngLat(e.lngLat);
                setLocation({ lat: e.lngLat.lat, lng: e.lngLat.lng });
                setLocError(null);
            });
        }
    }, [showMapPicker]);

    const handleBack = () => {
        if (isDirty) {
            if (window.confirm('هل أنت متأكد من الخروج؟ ستفقد البيانات المدخلة.')) {
                navigate(-1);
            }
        } else {
            navigate(-1);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreviewUrl(null);
    };

    const reportTypes = [
        { id: 'infrastructure', label: 'بنية تحتية', icon: <Construction size={24} />, color: 'bg-orange-50 text-orange-600 border-orange-100' },
        { id: 'trash', label: 'نظافة', icon: <Trash2 size={24} />, color: 'bg-red-50 text-red-600 border-red-100' },
        { id: 'lighting', label: 'إنارة', icon: <Lightbulb size={24} />, color: 'bg-amber-50 text-amber-600 border-amber-100' },
        { id: 'other', label: 'أخرى', icon: <FileText size={24} />, color: 'bg-blue-50 text-blue-600 border-blue-100' },
    ];

    const fetchLocation = async () => {
        setLocLoading(true);
        setLocError(null);

        try {
            const result = await GeolocationService.getCurrentPosition();

            if (result.coords) {
                setLocation({
                    lat: result.coords.latitude,
                    lng: result.coords.longitude
                });
            } else if (result.error) {
                setLocError(result.error);
            }
        } catch (e) {
            setLocError('فشل الحصول على الموقع');
        } finally {
            setLocLoading(false);
        }
    };

    useEffect(() => {
        fetchLocation();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Convert image to Base64 for offline storage or API
        let imageBase64 = null;
        if (image) {
            imageBase64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(image);
            });
        }

        try {
            // Check online status first
            if (!navigator.onLine) {
                throw new Error('OFFLINE_MODE');
            }

            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('type', type /* mapped to category in controller if needed, or update controller to match */);
            formData.append('category', type === 'trash' ? 'sanitation' : (type === 'lighting' ? 'electricity' : 'safety')); // Mapping basic types to enum
            formData.append('severity', severity.toString());

            if (location) {
                formData.append('latitude', location.lat.toString());
                formData.append('longitude', location.lng.toString());
            }
            if (image) {
                formData.append('image', image);
            }

            await api.post('/infrastructure/reports', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 5000 // Short timeout to trigger offline mode quickly
            });

            await NotificationService.schedule(
                'تم استلام بلاغك! ✅',
                'شكراً لمساهمتك في تحسين داريا. سنقوم بمراجعة البلاغ قريباً.'
            );

            navigate('/', { replace: true });

        } catch (err: any) {
            // Check if it's a network error or offline mode
            if (err.message === 'OFFLINE_MODE' || err.code === 'ECONNABORTED' || err.message === 'Network Error' || !navigator.onLine) {
                console.log('Saving report offline...');

                await OfflineService.saveReport({
                    type,
                    title,
                    description,
                    latitude: location?.lat,
                    longitude: location?.lng,
                    image: imageBase64 || undefined
                });

                alert('⚠️ لا يوجد اتصال بالإنترنت.\nتم حفظ البلاغ في جهازك وسيتم إرساله تلقائياً عند عودة الاتصال.');
                navigate('/', { replace: true });
            } else {
                console.error('Report submission error:', err);
                alert('حدث خطأ أثناء إرسال البلاغ. يرجى المحاولة مرة أخرى.');
            }
        } finally {
            setIsDirty(false);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl">
            {/* Header */}
            <div className="bg-slate-900 dark:bg-black pb-12 pt-6 px-4 rounded-b-[40px] relative overflow-hidden shadow-2xl transition-colors duration-300">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full -ml-12 -mb-12 blur-3xl"></div>

                <header className="relative z-10 flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <button onClick={handleBack} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all">
                            <ArrowRight size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-white">إضافة بلاغ</h1>
                            <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">ساهم في تحسين مدينتك</p>
                        </div>
                    </div>
                </header>
            </div>

            <main className="px-5 -mt-8 relative z-20 space-y-5">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Report Type Selection */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-100 mb-3 px-1">
                            <div className="w-1.5 h-4 bg-slate-900 dark:bg-slate-400 rounded-full"></div>
                            نوع البلاغ
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {reportTypes.map((t) => (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => setType(t.id)}
                                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 relative overflow-hidden group ${type === t.id
                                        ? 'bg-slate-900 dark:bg-indigo-600 border-slate-900 dark:border-indigo-500 text-white shadow-lg'
                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                                        }`}
                                >
                                    <div className={`p-3 rounded-full mb-1 transition-colors ${type === t.id ? 'bg-white/10 text-white' : `${t.color.replace('border', 'bg').replace('text', 'text')} bg-opacity-50`
                                        }`}>
                                        {t.icon}
                                    </div>
                                    <span className="text-xs font-bold">{t.label}</span>
                                    {type === t.id && (
                                        <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Inputs Section */}
                    <div className="bg-white dark:bg-slate-800 rounded-[32px] p-2 border border-slate-100 dark:border-slate-700/50 shadow-sm">
                        <div className="space-y-4 p-4">
                            {/* Title Input */}
                            <div className="group">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-500 mb-2 px-1">عنوان البلاغ</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-slate-900 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 text-sm font-bold"
                                    placeholder="مثال: حفرة في الطريق الرئيسي"
                                    required
                                />
                            </div>

                            {/* Severity Slider */}
                            <div>
                                <label className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-500 mb-2 px-1">
                                    <span>درجة الخطورة ( {severity}/5 )</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${severity === 1 ? 'bg-green-100 text-green-700' :
                                        severity === 2 ? 'bg-blue-100 text-blue-700' :
                                            severity === 3 ? 'bg-yellow-100 text-yellow-700' :
                                                severity === 4 ? 'bg-orange-100 text-orange-700' :
                                                    'bg-red-100 text-red-700'
                                        }`}>
                                        {severity === 1 ? 'منخفضة' : severity === 2 ? 'عادية' : severity === 3 ? 'متوسطة' : severity === 4 ? 'عالية' : 'حرجة'}
                                    </span>
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={severity}
                                    onChange={(e) => setSeverity(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-slate-900 dark:accent-indigo-500"
                                />
                                <div className="flex justify-between px-1 mt-1 text-[10px] text-slate-400">
                                    <span>بسيط</span>
                                    <span>عاجل</span>
                                </div>
                            </div>

                            {/* Description Textarea */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-500 mb-2 px-1">التفاصيل</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-slate-900 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 text-sm min-h-[120px] resize-none leading-relaxed font-medium"
                                    placeholder="اشرح المشكلة بالتفصيل..."
                                    required
                                />
                            </div>

                            {/* Photo Selection */}
                            <div className="space-y-3">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-500 px-1">صورة البلاغ</label>

                                <input
                                    type="file"
                                    id="image-upload"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />

                                {previewUrl ? (
                                    <div className="relative group">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-2xl border border-slate-200 dark:border-slate-700 shadow-premium"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-3 right-3 w-10 h-10 bg-black/50 backdrop-blur-md text-white rounded-xl flex items-center justify-center hover:bg-black/70 transition-all border border-white/20"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <label
                                        htmlFor="image-upload"
                                        className="w-full py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl text-slate-400 dark:text-slate-600 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all flex flex-col items-center gap-3 bg-slate-50/50 dark:bg-slate-900/30 cursor-pointer"
                                    >
                                        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-slate-100 dark:border-slate-700">
                                            <Camera size={32} />
                                        </div>
                                        <span className="text-xs font-black">إرفاق صورة توضيحية</span>
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Location Info with Map Picker */}
                    <div className={`bg-white dark:bg-slate-800 border ${locError ? 'border-red-200' : 'border-slate-200 dark:border-slate-700/50'} p-4 rounded-3xl flex items-center gap-4 shadow-sm transition-colors`}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${locError
                            ? 'bg-red-50 text-red-500 border-red-100'
                            : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                            }`}>
                            {locError ? <AlertTriangle size={24} /> : <MapPin size={24} />}
                        </div>
                        <div className="flex-1 text-right">
                            <div className="flex items-center justify-between mb-1">
                                <div className={`font-black text-xs ${locError ? 'text-red-600' : 'text-slate-800 dark:text-slate-100'}`}>
                                    {locLoading ? 'جاري تحديد موقعك...' : (locError ? 'تعذر تحديد الموقع' : 'موقع البلاغ')}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowMapPicker(true)}
                                    className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg hover:bg-indigo-100 transition-colors"
                                >
                                    <MapPin size={10} />
                                    تحديد على الخريطة
                                </button>
                            </div>

                            {location ? (
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-700/50 inline-flex items-center gap-1">
                                    <span>تم التحديد:</span>
                                    <span className="font-mono" dir="ltr">{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</span>
                                </div>
                            ) : (
                                !locLoading && <span className="text-[10px] text-slate-400">يرجى تحديد الموقع</span>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || locLoading || !location}
                        className="w-full py-5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 text-white rounded-3xl font-black text-base shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <span>جاري الإرسال...</span>
                        ) : (
                            <>
                                <span>إرسال البلاغ</span>
                                <Send size={20} className="rtl:rotate-180" />
                            </>
                        )}
                    </button>
                    <div className="h-4"></div>
                </form>
            </main>

            {/* Map Selection Modal */}
            {showMapPicker && (
                <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col animate-in fade-in duration-200">
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 z-10 shadow-md">
                        <h3 className="font-bold text-slate-800 dark:text-white">تحديد الموقع</h3>
                        <button onClick={() => setShowMapPicker(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                            <X size={20} className="text-slate-600 dark:text-slate-300" />
                        </button>
                    </div>
                    <div className="flex-1 relative bg-slate-200">
                        <div ref={mapContainer} className="absolute inset-0" />
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-emerald-500/30 text-xs font-bold text-emerald-700 z-10 pointer-events-none">
                            اسحب الدبوس لتحديد الموقع
                        </div>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                        <button
                            onClick={() => setShowMapPicker(false)}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                        >
                            تأكيد الموقع
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

