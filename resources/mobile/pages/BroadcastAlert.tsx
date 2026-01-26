import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Send, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';
import api from '../services/api';

export default function BroadcastAlert() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [type, setType] = useState('info');
    const [duration, setDuration] = useState(24);
    const [sending, setSending] = useState(false);
    const navigate = useNavigate();

    const handleSend = async () => {
        if (!title || !body) return alert('يرجى ملء كافة الحقول');
        setSending(true);
        try {
            await api.post('/admin/manage/alerts', {
                title,
                body,
                type,
                duration_hours: duration
            });
            alert('تم بث التنبيه بنجاح');
            navigate(-1);
        } catch (err) {
            alert('فشل الإرسال');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50" dir="rtl">
            <header className="bg-white border-b border-slate-100 px-4 py-4 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                    <ArrowRight className="text-slate-600" />
                </button>
                <h1 className="text-lg font-black text-slate-800">بث تنبيه للمدينة</h1>
            </header>

            <main className="p-4 space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">عنوان التنبيه</label>
                        <input
                            type="text"
                            placeholder="مثلاً: قطع مياه مبرمج..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-slate-50 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-slate-900"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">نص الرسالة</label>
                        <textarea
                            rows={4}
                            placeholder="اكتب تفاصيل التنبيه هنا..."
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="w-full bg-slate-50 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-slate-900"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">نوع التنبيه</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: 'info', label: 'معلومة', icon: <Info size={16} />, color: 'blue' },
                                { id: 'warning', label: 'تحذير', icon: <AlertTriangle size={16} />, color: 'amber' },
                                { id: 'danger', label: 'خطر عاجل', icon: <AlertTriangle size={16} />, color: 'rose' },
                                { id: 'success', label: 'إنجاز/تنبيه إيجابي', icon: <CheckCircle size={16} />, color: 'emerald' },
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setType(t.id)}
                                    className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-black transition-all ${type === t.id ? `bg-${t.color}-50 border-${t.color}-200 text-${t.color}-600` : 'bg-white border-slate-100 text-slate-400'
                                        }`}
                                >
                                    {t.icon} {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-center">مدة العرض: {duration} ساعة</label>
                        <input
                            type="range"
                            min="1"
                            max="72"
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                        />
                        <div className="flex justify-between text-[8px] font-black text-slate-300 mt-1">
                            <span>1 ساعة</span>
                            <span>3 أيام</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSend}
                    disabled={sending}
                    className="w-full bg-slate-900 text-white py-5 rounded-3xl flex items-center justify-center gap-3 font-black shadow-xl shadow-slate-200 active:scale-95 transition-all disabled:opacity-50"
                >
                    <Send size={20} />
                    {sending ? 'جاري البث...' : 'بث للعموم الآن'}
                </button>
            </main>
        </div>
    );
}
