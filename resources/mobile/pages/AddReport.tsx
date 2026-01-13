import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GeolocationService } from '../services/GeolocationService';
import api from '../services/api';
import { NotificationService } from '../services/notification';
import { Construction, Trash2, Lightbulb, FileText, MapPin, Send, MessageSquare, AlertTriangle, ArrowRight, Camera, RefreshCw } from 'lucide-react';

export default function AddReport() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('infrastructure');
    const [location, setLocation] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [locLoading, setLocLoading] = useState(true);
    const [locError, setLocError] = useState<string | null>(null);
    const navigate = useNavigate();

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
        NotificationService.requestPermissions();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/infrastructure/reports', {
                title,
                description,
                type,
                latitude: location?.lat,
                longitude: location?.lng,
            });

            await NotificationService.schedule(
                'تم استلام بلاغك! ✅',
                'شكراً لمساهمتك في تحسين داريا. سنقوم بمراجعة البلاغ قريباً.'
            );

            navigate('/');
        } catch (err: any) {
            alert('حدث خطأ أثناء إرسال البلاغ.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl">
            {/* Immersive Header */}
            <div className="bg-slate-900 dark:bg-black pb-12 pt-6 px-4 rounded-b-[40px] relative overflow-hidden shadow-2xl transition-colors duration-300">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full -ml-12 -mb-12 blur-3xl"></div>

                <header className="relative z-10 flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all">
                            <span className="text-xl transform rotate-180">➜</span>
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-white">إضافة بلاغ</h1>
                            <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">ساهم في تحسين مدينتك</p>
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 text-white shadow-lg">
                        <AlertTriangle size={24} />
                    </div>
                </header>
            </div>

            <main className="px-5 -mt-8 relative z-20 space-y-5">
                {/* Transparency Widget - Glass Effect */}
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl p-5 shadow-premium border border-slate-100 dark:border-slate-700/50 relative overflow-hidden">
                    <div className="flex items-start gap-4 relative z-10">
                        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 shrink-0">
                            <MessageSquare size={24} />
                        </div>
                        <div className="text-right">
                            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-1">صوتك مسموع</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium">
                                بلاغك يساعدنا في تحديد الأولويات. يتم معالجة البلاغات حسب الأهمية وتوفر الإمكانيات.
                            </p>
                        </div>
                    </div>
                </div>

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
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-500 mb-2 px-1 peer-focus:text-emerald-600 transition-colors">عنوان البلاغ</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-slate-900 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 text-sm font-bold"
                                    placeholder="مثال: حفرة في الطريق الرئيسي"
                                    required
                                />
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

                            {/* Photo Placeholder (Visual Only) */}
                            <button type="button" className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex flex-col items-center gap-2">
                                <span className="text-slate-400 dark:text-slate-600"><Camera size={24} /></span>
                                <span className="text-xs font-bold">إرفاق صورة (اختياري)</span>
                            </button>
                        </div>
                    </div>

                    {/* Location Info with Retry */}
                    <div className={`bg-white dark:bg-slate-800 border ${locError ? 'border-red-200 dark:border-red-900/50' : 'border-slate-200 dark:border-slate-700/50'} p-4 rounded-3xl flex items-center gap-4 shadow-sm transition-colors`}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${locError
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-500 border-red-100'
                            : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/50 animate-bounce-slow'
                            }`}>
                            {locError ? <AlertTriangle size={24} /> : <MapPin size={24} />}
                        </div>
                        <div className="flex-1 text-right">
                            <div className="flex items-center justify-between mb-1">
                                <div className={`font-black text-xs ${locError ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-100'}`}>
                                    {locLoading ? 'جاري تحديد موقعك...' : (locError ? 'تعذر تحديد الموقع' : 'موقع البلاغ')}
                                </div>
                                {!locLoading && (locError || !location) && (
                                    <button
                                        type="button"
                                        onClick={fetchLocation}
                                        className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg"
                                    >
                                        <RefreshCw size={10} />
                                        إعادة المحاولة
                                    </button>
                                )}
                            </div>

                            {location ? (
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-700/50 inline-flex items-center gap-1">
                                    <span>تم التحديد:</span>
                                    <span className="font-mono" dir="ltr">{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</span>
                                </div>
                            ) : (
                                locLoading ? (
                                    <div className="h-4 w-24 bg-slate-100 dark:bg-slate-700 rounded animate-pulse"></div>
                                ) : (
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{locError || 'يرجى تفعيل الموقع للمتابعة'}</span>
                                )
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || locLoading || !location}
                        className="w-full py-5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white rounded-3xl font-black text-base shadow-xl dark:shadow-indigo-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>جاري الإرسال...</span>
                            </>
                        ) : (
                            <>
                                <span className="relative z-10">إرسال البلاغ</span>
                                <Send size={20} className="relative z-10 rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                    <div className="h-4"></div>
                </form>
            </main>
        </div>
    );
}
