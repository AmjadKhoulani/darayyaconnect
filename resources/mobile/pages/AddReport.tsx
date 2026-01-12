import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Geolocation } from '@capacitor/geolocation';
import api from '../services/api';
import { NotificationService } from '../services/notification';
import { Construction, Trash2, Lightbulb, FileText, MapPin, Send, MessageSquare, AlertTriangle, ArrowRight, Camera } from 'lucide-react';

export default function AddReport() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('infrastructure');
    const [location, setLocation] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [locLoading, setLocLoading] = useState(true);
    const navigate = useNavigate();

    const reportTypes = [
        { id: 'infrastructure', label: 'بنية تحتية', icon: <Construction size={24} />, color: 'bg-orange-50 text-orange-600 border-orange-100' },
        { id: 'trash', label: 'نظافة', icon: <Trash2 size={24} />, color: 'bg-red-50 text-red-600 border-red-100' },
        { id: 'lighting', label: 'إنارة', icon: <Lightbulb size={24} />, color: 'bg-amber-50 text-amber-600 border-amber-100' },
        { id: 'other', label: 'أخرى', icon: <FileText size={24} />, color: 'bg-blue-50 text-blue-600 border-blue-100' },
    ];

    useEffect(() => {
        NotificationService.requestPermissions();
        async function getInitialLocation() {
            try {
                const pos = await Geolocation.getCurrentPosition();
                setLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
            } catch (e) {
                console.error('Error getting location', e);
            } finally {
                setLocLoading(false);
            }
        }
        getInitialLocation();
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
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
            {/* Immersive Header */}
            <div className="bg-slate-900 pb-12 pt-6 px-4 rounded-b-[40px] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full -ml-12 -mb-12 blur-3xl"></div>

                <header className="relative z-10 flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all">
                            <span className="text-xl transform rotate-180">➜</span>
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-white">إضافة بلاغ</h1>
                            <p className="text-slate-400 text-xs font-medium">ساهم في تحسين مدينتك</p>
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 text-white shadow-lg">
                        <AlertTriangle size={24} />
                    </div>
                </header>
            </div>

            <main className="px-5 -mt-8 relative z-20 space-y-5">
                {/* Transparency Widget - Glass Effect */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                    <div className="flex items-start gap-4 relaztive z-10">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100 shrink-0">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-800 mb-1">صوتك مسموع</h3>
                            <p className="text-slate-500 text-xs leading-relaxed font-medium">
                                بلاغك يساعدنا في تحديد الأولويات. يتم معالجة البلاغات حسب الأهمية وتوفر الإمكانيات.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Report Type Selection */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-black text-slate-800 mb-3 px-1">
                            <div className="w-1.5 h-4 bg-slate-900 rounded-full"></div>
                            نوع البلاغ
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {reportTypes.map((t) => (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => setType(t.id)}
                                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 relative overflow-hidden group ${type === t.id
                                            ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20'
                                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
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
                    <div className="bg-white rounded-[32px] p-2 border border-slate-100 shadow-sm">
                        <div className="space-y-4 p-4">
                            {/* Title Input */}
                            <div className="group">
                                <label className="block text-xs font-bold text-slate-500 mb-2 px-1 peer-focus:text-emerald-600 transition-colors">عنوان البلاغ</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-slate-900 placeholder-slate-400 text-sm font-bold"
                                    placeholder="مثال: حفرة في الطريق الرئيسي"
                                    required
                                />
                            </div>

                            {/* Description Textarea */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2 px-1">التفاصيل</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-slate-900 placeholder-slate-400 text-sm min-h-[120px] resize-none leading-relaxed font-medium"
                                    placeholder="اشرح المشكلة بالتفصيل..."
                                    required
                                />
                            </div>

                            {/* Photo Placeholder (Visual Only) */}
                            <button type="button" className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-colors flex flex-col items-center gap-2">
                                <Camera size={24} />
                                <span className="text-xs font-bold">إرفاق صورة (اختياري)</span>
                            </button>
                        </div>
                    </div>

                    {/* Location Info */}
                    <div className="bg-white border border-slate-200 p-4 rounded-3xl flex items-center gap-4 shadow-sm">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100 animate-bounce-slow">
                            <MapPin size={24} />
                        </div>
                        <div className="flex-1">
                            <div className="font-black text-slate-800 text-xs mb-1">
                                {locLoading ? 'جاري تحديد موقعك...' : 'موقع البلاغ'}
                            </div>
                            {location ? (
                                <div className="text-[10px] text-slate-500 font-bold bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 inline-flex items-center gap-1">
                                    <span>تم التحديد:</span>
                                    <span className="font-mono" dir="ltr">{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</span>
                                </div>
                            ) : (
                                <div className="h-4 w-24 bg-slate-100 rounded animate-pulse"></div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || locLoading}
                        className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-3xl font-black text-base shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
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
