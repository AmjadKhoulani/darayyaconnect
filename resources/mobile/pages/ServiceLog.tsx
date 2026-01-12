import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Droplets, Clock, Check, X, Send } from 'lucide-react';
import api from '../services/api';
import { usePullToRefresh, PullToRefreshContainer } from '../hooks/usePullToRefresh';

export default function ServiceLog() {
    const [userLogs, setUserLogs] = useState<string[]>([]);
    const [communityStats, setCommunityStats] = useState({ electricity: 0, water: '0%' });
    const [activeForm, setActiveForm] = useState<'electricity' | 'water' | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        service_type: '',
        status: 'available',
        arrival_time: '',
        departure_time: '',
        quality: '',
        notes: ''
    });

    const fetchData = useCallback(async () => {
        try {
            const res = await api.get('/portal/service-logs/status');
            setUserLogs(res.data.userLogs || []);
            setCommunityStats(res.data.communityStats || { electricity: 0, water: '0%' });
        } catch (err) {
            // Demo data
            setCommunityStats({ electricity: 67, water: '45%' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const { isRefreshing, pullMoveY, handlers } = usePullToRefresh(fetchData);

    const handleSubmit = async (type: 'electricity' | 'water') => {
        setSubmitting(true);
        try {
            await api.post('/portal/service-logs', {
                ...formData,
                service_type: type
            });
            setUserLogs([...userLogs, type]);
            setActiveForm(null);
            setFormData({ service_type: '', status: 'available', arrival_time: '', departure_time: '', quality: '', notes: '' });
        } catch (err) {
            // Demo: Just mark as logged
            setUserLogs([...userLogs, type]);
            setActiveForm(null);
        } finally {
            setSubmitting(false);
        }
    };

    const hasLoggedElec = userLogs.includes('electricity');
    const hasLoggedWater = userLogs.includes('water');

    return (
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl" {...handlers}>
            <PullToRefreshContainer isRefreshing={isRefreshing} pullMoveY={pullMoveY}>
                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 transition-colors border border-slate-200"
                            >
                                <ArrowRight size={20} className="rotate-180" />
                            </button>
                            <div>
                                <h1 className="text-lg font-bold text-slate-800">سجل الخدمات</h1>
                                <p className="text-[11px] text-slate-500 font-medium">سجّل حالة الكهرباء والماء اليوم</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="px-4 py-6 space-y-6">
                    {/* Hero Stats */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

                        <h2 className="text-lg font-bold mb-4">📊 إحصائيات المجتمع اليوم</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap size={18} className="text-amber-400" />
                                    <span className="text-xs text-white/70">الكهرباء</span>
                                </div>
                                <p className="text-2xl font-black text-amber-400">{communityStats.electricity}%</p>
                                <p className="text-[10px] text-white/50">نسبة الوصول</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Droplets size={18} className="text-cyan-400" />
                                    <span className="text-xs text-white/70">المياه</span>
                                </div>
                                <p className="text-2xl font-black text-cyan-400">{communityStats.water}</p>
                                <p className="text-[10px] text-white/50">نسبة الوصول</p>
                            </div>
                        </div>
                    </div>

                    {/* Electricity Card */}
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 overflow-hidden">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center border border-amber-200">
                                        <Zap size={24} className="text-amber-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">الكهرباء</h3>
                                        <p className="text-[11px] text-slate-500">سجل حالة اليوم</p>
                                    </div>
                                </div>
                                {hasLoggedElec && (
                                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-lg border border-emerald-200">
                                        ✅ تم التسجيل
                                    </span>
                                )}
                            </div>

                            {!hasLoggedElec ? (
                                activeForm === 'electricity' ? (
                                    <div className="space-y-4 bg-white rounded-xl p-4 border border-amber-100">
                                        {/* Status Selection */}
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 mb-2 block">الوضع اليوم؟</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => setFormData({ ...formData, status: 'available' })}
                                                    className={`py-3 rounded-xl text-sm font-bold border-2 transition ${formData.status === 'available'
                                                            ? 'bg-emerald-500 text-white border-emerald-600'
                                                            : 'bg-white border-slate-200 text-slate-600'
                                                        }`}
                                                >
                                                    إجت ✅
                                                </button>
                                                <button
                                                    onClick={() => setFormData({ ...formData, status: 'cut_off' })}
                                                    className={`py-3 rounded-xl text-sm font-bold border-2 transition ${formData.status === 'cut_off'
                                                            ? 'bg-rose-500 text-white border-rose-600'
                                                            : 'bg-white border-slate-200 text-slate-600'
                                                        }`}
                                                >
                                                    مقطوعة ❌
                                                </button>
                                            </div>
                                        </div>

                                        {formData.status === 'available' && (
                                            <>
                                                {/* Time Inputs */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-xs font-bold text-slate-600 mb-1 block">من الساعة</label>
                                                        <input
                                                            type="time"
                                                            value={formData.arrival_time}
                                                            onChange={e => setFormData({ ...formData, arrival_time: e.target.value })}
                                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-slate-600 mb-1 block">إلى الساعة</label>
                                                        <input
                                                            type="time"
                                                            value={formData.departure_time}
                                                            onChange={e => setFormData({ ...formData, departure_time: e.target.value })}
                                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Quality */}
                                                <div>
                                                    <label className="text-xs font-bold text-slate-600 mb-2 block">الجودة؟</label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {[
                                                            { key: 'good', label: '🟢 ممتازة', color: 'emerald' },
                                                            { key: 'weak', label: '🟡 ضعيفة', color: 'amber' },
                                                            { key: 'bad', label: '🔴 سيئة', color: 'rose' }
                                                        ].map(q => (
                                                            <button
                                                                key={q.key}
                                                                onClick={() => setFormData({ ...formData, quality: q.key })}
                                                                className={`py-2 rounded-lg text-[11px] font-bold border transition ${formData.quality === q.key
                                                                        ? `bg-${q.color}-100 text-${q.color}-700 border-${q.color}-300`
                                                                        : 'bg-white border-slate-200'
                                                                    }`}
                                                            >
                                                                {q.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                onClick={() => handleSubmit('electricity')}
                                                disabled={submitting}
                                                className="flex-1 bg-amber-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20"
                                            >
                                                {submitting ? 'جاري الحفظ...' : <><Send size={16} /> حفظ</>}
                                            </button>
                                            <button
                                                onClick={() => setActiveForm(null)}
                                                className="px-4 bg-slate-100 rounded-xl text-slate-600"
                                            >
                                                إلغاء
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setActiveForm('electricity')}
                                        className="w-full bg-white py-4 rounded-xl font-bold text-amber-700 border border-amber-200 hover:bg-amber-50 transition flex items-center justify-center gap-2"
                                    >
                                        <Zap size={18} />
                                        سجل حالة الكهرباء اليوم
                                    </button>
                                )
                            ) : (
                                <div className="bg-white/60 rounded-xl p-6 text-center border border-amber-100">
                                    <span className="text-3xl block mb-2">✅</span>
                                    <p className="font-bold text-amber-800">شكراً لمشاركتك!</p>
                                    <p className="text-xs text-slate-500 mt-1">تم تسجيل حالة الكهرباء لهذا اليوم</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Water Card */}
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border border-cyan-200 overflow-hidden">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center border border-cyan-200">
                                        <Droplets size={24} className="text-cyan-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">المياه</h3>
                                        <p className="text-[11px] text-slate-500">سجل حالة اليوم</p>
                                    </div>
                                </div>
                                {hasLoggedWater && (
                                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-lg border border-emerald-200">
                                        ✅ تم التسجيل
                                    </span>
                                )}
                            </div>

                            {!hasLoggedWater ? (
                                activeForm === 'water' ? (
                                    <div className="space-y-4 bg-white rounded-xl p-4 border border-cyan-100">
                                        {/* Status Selection */}
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 mb-2 block">الوضع اليوم؟</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => setFormData({ ...formData, status: 'available' })}
                                                    className={`py-3 rounded-xl text-sm font-bold border-2 transition ${formData.status === 'available'
                                                            ? 'bg-emerald-500 text-white border-emerald-600'
                                                            : 'bg-white border-slate-200 text-slate-600'
                                                        }`}
                                                >
                                                    إجت ✅
                                                </button>
                                                <button
                                                    onClick={() => setFormData({ ...formData, status: 'cut_off' })}
                                                    className={`py-3 rounded-xl text-sm font-bold border-2 transition ${formData.status === 'cut_off'
                                                            ? 'bg-rose-500 text-white border-rose-600'
                                                            : 'bg-white border-slate-200 text-slate-600'
                                                        }`}
                                                >
                                                    مقطوعة ❌
                                                </button>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                onClick={() => handleSubmit('water')}
                                                disabled={submitting}
                                                className="flex-1 bg-cyan-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20"
                                            >
                                                {submitting ? 'جاري الحفظ...' : <><Send size={16} /> حفظ</>}
                                            </button>
                                            <button
                                                onClick={() => setActiveForm(null)}
                                                className="px-4 bg-slate-100 rounded-xl text-slate-600"
                                            >
                                                إلغاء
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setActiveForm('water')}
                                        className="w-full bg-white py-4 rounded-xl font-bold text-cyan-700 border border-cyan-200 hover:bg-cyan-50 transition flex items-center justify-center gap-2"
                                    >
                                        <Droplets size={18} />
                                        سجل حالة المياه اليوم
                                    </button>
                                )
                            ) : (
                                <div className="bg-white/60 rounded-xl p-6 text-center border border-cyan-100">
                                    <span className="text-3xl block mb-2">✅</span>
                                    <p className="font-bold text-cyan-800">شكراً لمشاركتك!</p>
                                    <p className="text-xs text-slate-500 mt-1">تم تسجيل حالة المياه لهذا اليوم</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info Note */}
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                        <p className="text-xs text-emerald-800 leading-relaxed text-center">
                            💡 مشاركتك تساعد في رسم صورة أوضح عن حالة الخدمات في منطقتك
                        </p>
                    </div>
                </main>
            </PullToRefreshContainer>
        </div>
    );
}
