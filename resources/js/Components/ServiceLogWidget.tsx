import { useState } from 'react';
import { useForm } from '@inertiajs/react';

interface Props {
    userLogs: string[]; // ['electricity', 'water']
    communityStats: {
        electricity: number;
        water: string;
    };
}

export default function ServiceLogWidget({ userLogs, communityStats }: Props) {
    const [submittingType, setSubmittingType] = useState<string | null>(null);

    const { data, setData, post, processing, reset } = useForm({
        service_type: '',
        status: 'available',
        arrival_time: '',
        departure_time: '',
        quality: '',
        notes: '',
        duration_hours: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('service-logs.store'), {
            onSuccess: () => {
                setSubmittingType(null);
                reset();
            }
        });
    };

    const openLog = (type: string) => {
        setData('service_type', type);
        setSubmittingType(type);
    };

    const hasLoggedElec = userLogs.includes('electricity');
    const hasLoggedWater = userLogs.includes('water');

    return (
        <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm sm:rounded-lg mb-6 border-b-4 border-emerald-500">
            <div className="p-6 text-gray-900 dark:text-gray-100">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span>📅</span>
                    <span>سجل الخدمات اليومي</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Electricity Card */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-amber-700 dark:text-amber-400">⚡ الكهرباء</h4>
                            {hasLoggedElec && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">تم التسجيل ✅</span>
                            )}
                        </div>

                        {!hasLoggedElec ? (
                            submittingType === 'electricity' ? (
                                <form onSubmit={handleSubmit} className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">الوضع اليوم؟</label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setData('status', 'available')}
                                                className={`flex-1 py-2 text-xs rounded-lg border ${data.status === 'available' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white border-gray-300'}`}
                                            >
                                                إجت ✅
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setData('status', 'cut_off')}
                                                className={`flex-1 py-2 text-xs rounded-lg border ${data.status === 'cut_off' ? 'bg-rose-500 text-white border-rose-600' : 'bg-white border-gray-300'}`}
                                            >
                                                مقطوعة ❌
                                            </button>
                                        </div>
                                    </div>

                                    {data.status === 'available' && (
                                        <>
                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">من الساعة</label>
                                                    <input
                                                        type="time"
                                                        className="w-full rounded-lg border-gray-300 text-xs"
                                                        onChange={e => setData('arrival_time', e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">إلى الساعة</label>
                                                    <input
                                                        type="time"
                                                        className="w-full rounded-lg border-gray-300 text-xs"
                                                        onChange={e => setData('departure_time', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">الجودة؟</label>
                                                <div className="flex gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setData('quality', 'good')}
                                                        className={`flex-1 py-1 text-[10px] rounded border ${data.quality === 'good' ? 'bg-emerald-100 text-emerald-700 border-emerald-300 ring-1 ring-emerald-500' : 'bg-white border-gray-200'}`}
                                                    >
                                                        🟢 ممتازة
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setData('quality', 'weak')}
                                                        className={`flex-1 py-1 text-[10px] rounded border ${data.quality === 'weak' ? 'bg-amber-100 text-amber-700 border-amber-300 ring-1 ring-amber-500' : 'bg-white border-gray-200'}`}
                                                    >
                                                        🟡 ضعيفة
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setData('quality', 'bad')}
                                                        className={`flex-1 py-1 text-[10px] rounded border ${data.quality === 'bad' ? 'bg-rose-100 text-rose-700 border-rose-300 ring-1 ring-rose-500' : 'bg-white border-gray-200'}`}
                                                    >
                                                        🔴 سيئة
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">ملاحظات (اختياري)</label>
                                                <textarea
                                                    rows={2}
                                                    className="w-full rounded-lg border-gray-300 text-xs"
                                                    placeholder="مثلاً: انقطعت مرتين بالنص..."
                                                    onChange={e => setData('notes', e.target.value)}
                                                ></textarea>
                                            </div>
                                        </>
                                    )}

                                    <div className="flex gap-2">
                                        <button disabled={processing} className="flex-1 bg-slate-900 text-white py-2 rounded-lg text-xs font-bold">
                                            {processing ? 'جاري الحفظ...' : 'حفظ'}
                                        </button>
                                        <button type="button" onClick={() => setSubmittingType(null)} className="px-3 bg-gray-200 rounded-lg text-xs">إلغاء</button>
                                    </div>
                                </form>
                            ) : (
                                <button
                                    onClick={() => openLog('electricity')}
                                    className="w-full py-2 bg-white border border-amber-200 text-amber-700 rounded-lg text-sm font-bold hover:bg-amber-50 transition shadow-sm"
                                >
                                    سجل حالة الكهرباء
                                </button>
                            )
                        ) : (
                            <div className="text-center py-4 bg-white/50 rounded-lg border border-amber-100">
                                <p className="text-sm font-medium text-amber-800">شكراً لمشاركتك! ✅</p>
                            </div>
                        )}
                    </div>

                    {/* Water Card */}
                    <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-xl border border-cyan-100 dark:border-cyan-800">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-cyan-700 dark:text-cyan-400">💧 المياه</h4>
                            {hasLoggedWater && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">تم التسجيل ✅</span>
                            )}
                        </div>

                        {!hasLoggedWater ? (
                            submittingType === 'water' ? (
                                <form onSubmit={handleSubmit} className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">الوضع اليوم؟</label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setData('status', 'available')}
                                                className={`flex-1 py-2 text-xs rounded-lg border ${data.status === 'available' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white border-gray-300'}`}
                                            >
                                                إجت ✅
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setData('status', 'cut_off')}
                                                className={`flex-1 py-2 text-xs rounded-lg border ${data.status === 'cut_off' ? 'bg-rose-500 text-white border-rose-600' : 'bg-white border-gray-300'}`}
                                            >
                                                مقطوعة ❌
                                            </button>
                                        </div>
                                    </div>
                                    <button disabled={processing} className="w-full bg-slate-900 text-white py-2 rounded-lg text-xs font-bold">
                                        {processing ? 'جاري الحفظ...' : 'حفظ'}
                                    </button>
                                </form>
                            ) : (
                                <button
                                    onClick={() => openLog('water')}
                                    className="w-full py-2 bg-white border border-cyan-200 text-cyan-700 rounded-lg text-sm font-bold hover:bg-cyan-50 transition shadow-sm"
                                >
                                    سجل حالة المياه
                                </button>
                            )
                        ) : (
                            <div className="text-center py-4 bg-white/50 rounded-lg border border-cyan-100">
                                <p className="text-sm font-medium text-cyan-800">شكراً لمشاركتك! ✅</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
