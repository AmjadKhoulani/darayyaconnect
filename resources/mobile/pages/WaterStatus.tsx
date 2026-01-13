import { useState, useEffect } from 'react';
import api from '../services/api';

export default function WaterStatus() {
    const [zones, setZones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/api/infrastructure/water')
            .then(res => setZones(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl">
            {/* Clean Header */}
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 py-4 shadow-sm flex items-center justify-between transition-colors duration-300">
                <div className="flex items-center gap-3">
                    <button onClick={() => window.history.back()} className="w-10 h-10 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700">
                        <span className="text-xl transform rotate-180">➜</span>
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">حالة المياه</h1>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">مراقبة ضخ المياه في المناطق</p>
                    </div>
                </div>
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-800/50">
                    <span className="text-xl">💧</span>
                </div>
            </header>

            <main className="px-4 py-6">
                {loading ? <p className="text-center py-10 opacity-50 text-sm font-medium text-slate-500">جاري التحميل...</p> : (
                    <div className="grid grid-cols-1 gap-3">
                        {zones.map((zone: any) => (
                            <div key={zone.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex justify-between items-center shadow-premium">
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{zone.name}</h3>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium text-right">آخر تحديث: {new Date(zone.updated_at).toLocaleTimeString('ar-SY')}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-md text-[10px] font-bold border transition-colors ${zone.status === 'Working' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800/50'
                                    }`}>
                                    {zone.status === 'Working' ? 'متوفرة' : 'مقطوعة'}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/50 flex gap-3 text-blue-800 dark:text-blue-400 shadow-sm">
                    <span className="text-lg">ℹ️</span>
                    <p className="text-xs leading-relaxed font-medium pt-0.5 text-right">
                        يتم تحديث هذه البيانات بناءً على بلاغات المواطنين والفنيين في الميدان بشكل دوري.
                    </p>
                </div>
            </main>
        </div>
    );
}
