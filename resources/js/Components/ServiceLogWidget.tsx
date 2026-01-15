import { useForm } from '@inertiajs/react';
import { useState } from 'react';

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
            },
        });
    };

    const openLog = (type: string) => {
        setData('service_type', type);
        setSubmittingType(type);
    };

    const hasLoggedElec = userLogs.includes('electricity');
    const hasLoggedWater = userLogs.includes('water');

    return (
        <div className="mb-6 overflow-hidden border-b-4 border-emerald-500 bg-white shadow-sm dark:bg-slate-800 sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                    <span>📅</span>
                    <span>سجل الخدمات اليومي</span>
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Electricity Card */}
                    <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                        <div className="mb-2 flex items-center justify-between">
                            <h4 className="font-bold text-amber-700 dark:text-amber-400">
                                ⚡ الكهرباء
                            </h4>
                            {hasLoggedElec && (
                                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                                    تم التسجيل ✅
                                </span>
                            )}
                        </div>

                        {!hasLoggedElec ? (
                            submittingType === 'electricity' ? (
                                <form
                                    onSubmit={handleSubmit}
                                    className="animate-in fade-in slide-in-from-top-2 space-y-3"
                                >
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-gray-700">
                                            الوضع اليوم؟
                                        </label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData(
                                                        'status',
                                                        'available',
                                                    )
                                                }
                                                className={`flex-1 rounded-lg border py-2 text-xs ${data.status === 'available' ? 'border-emerald-600 bg-emerald-500 text-white' : 'border-gray-300 bg-white'}`}
                                            >
                                                إجت ✅
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData('status', 'cut_off')
                                                }
                                                className={`flex-1 rounded-lg border py-2 text-xs ${data.status === 'cut_off' ? 'border-rose-600 bg-rose-500 text-white' : 'border-gray-300 bg-white'}`}
                                            >
                                                مقطوعة ❌
                                            </button>
                                        </div>
                                    </div>

                                    {data.status === 'available' && (
                                        <>
                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <label className="mb-1 block text-xs font-medium text-gray-700">
                                                        من الساعة
                                                    </label>
                                                    <input
                                                        type="time"
                                                        className="w-full rounded-lg border-gray-300 text-xs"
                                                        onChange={(e) =>
                                                            setData(
                                                                'arrival_time',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="mb-1 block text-xs font-medium text-gray-700">
                                                        إلى الساعة
                                                    </label>
                                                    <input
                                                        type="time"
                                                        className="w-full rounded-lg border-gray-300 text-xs"
                                                        onChange={(e) =>
                                                            setData(
                                                                'departure_time',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-xs font-medium text-gray-700">
                                                    الجودة؟
                                                </label>
                                                <div className="flex gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setData(
                                                                'quality',
                                                                'good',
                                                            )
                                                        }
                                                        className={`flex-1 rounded border py-1 text-[10px] ${data.quality === 'good' ? 'border-emerald-300 bg-emerald-100 text-emerald-700 ring-1 ring-emerald-500' : 'border-gray-200 bg-white'}`}
                                                    >
                                                        🟢 ممتازة
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setData(
                                                                'quality',
                                                                'weak',
                                                            )
                                                        }
                                                        className={`flex-1 rounded border py-1 text-[10px] ${data.quality === 'weak' ? 'border-amber-300 bg-amber-100 text-amber-700 ring-1 ring-amber-500' : 'border-gray-200 bg-white'}`}
                                                    >
                                                        🟡 ضعيفة
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setData(
                                                                'quality',
                                                                'bad',
                                                            )
                                                        }
                                                        className={`flex-1 rounded border py-1 text-[10px] ${data.quality === 'bad' ? 'border-rose-300 bg-rose-100 text-rose-700 ring-1 ring-rose-500' : 'border-gray-200 bg-white'}`}
                                                    >
                                                        🔴 سيئة
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-xs font-medium text-gray-700">
                                                    ملاحظات (اختياري)
                                                </label>
                                                <textarea
                                                    rows={2}
                                                    className="w-full rounded-lg border-gray-300 text-xs"
                                                    placeholder="مثلاً: انقطعت مرتين بالنص..."
                                                    onChange={(e) =>
                                                        setData(
                                                            'notes',
                                                            e.target.value,
                                                        )
                                                    }
                                                ></textarea>
                                            </div>
                                        </>
                                    )}

                                    <div className="flex gap-2">
                                        <button
                                            disabled={processing}
                                            className="flex-1 rounded-lg bg-slate-900 py-2 text-xs font-bold text-white"
                                        >
                                            {processing
                                                ? 'جاري الحفظ...'
                                                : 'حفظ'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSubmittingType(null)
                                            }
                                            className="rounded-lg bg-gray-200 px-3 text-xs"
                                        >
                                            إلغاء
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <button
                                    onClick={() => openLog('electricity')}
                                    className="w-full rounded-lg border border-amber-200 bg-white py-2 text-sm font-bold text-amber-700 shadow-sm transition hover:bg-amber-50"
                                >
                                    سجل حالة الكهرباء
                                </button>
                            )
                        ) : (
                            <div className="rounded-lg border border-amber-100 bg-white/50 py-4 text-center">
                                <p className="text-sm font-medium text-amber-800">
                                    شكراً لمشاركتك! ✅
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Water Card */}
                    <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-4 dark:border-cyan-800 dark:bg-cyan-900/20">
                        <div className="mb-2 flex items-center justify-between">
                            <h4 className="font-bold text-cyan-700 dark:text-cyan-400">
                                💧 المياه
                            </h4>
                            {hasLoggedWater && (
                                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                                    تم التسجيل ✅
                                </span>
                            )}
                        </div>

                        {!hasLoggedWater ? (
                            submittingType === 'water' ? (
                                <form
                                    onSubmit={handleSubmit}
                                    className="animate-in fade-in slide-in-from-top-2 space-y-3"
                                >
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-gray-700">
                                            الوضع اليوم؟
                                        </label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData(
                                                        'status',
                                                        'available',
                                                    )
                                                }
                                                className={`flex-1 rounded-lg border py-2 text-xs ${data.status === 'available' ? 'border-emerald-600 bg-emerald-500 text-white' : 'border-gray-300 bg-white'}`}
                                            >
                                                إجت ✅
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData('status', 'cut_off')
                                                }
                                                className={`flex-1 rounded-lg border py-2 text-xs ${data.status === 'cut_off' ? 'border-rose-600 bg-rose-500 text-white' : 'border-gray-300 bg-white'}`}
                                            >
                                                مقطوعة ❌
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        disabled={processing}
                                        className="w-full rounded-lg bg-slate-900 py-2 text-xs font-bold text-white"
                                    >
                                        {processing ? 'جاري الحفظ...' : 'حفظ'}
                                    </button>
                                </form>
                            ) : (
                                <button
                                    onClick={() => openLog('water')}
                                    className="w-full rounded-lg border border-cyan-200 bg-white py-2 text-sm font-bold text-cyan-700 shadow-sm transition hover:bg-cyan-50"
                                >
                                    سجل حالة المياه
                                </button>
                            )
                        ) : (
                            <div className="rounded-lg border border-cyan-100 bg-white/50 py-4 text-center">
                                <p className="text-sm font-medium text-cyan-800">
                                    شكراً لمشاركتك! ✅
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
