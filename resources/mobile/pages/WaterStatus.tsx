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
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
            {/* Clean Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => window.history.back()} className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 transition-colors border border-slate-200">
                        <span className="text-xl transform rotate-180">➜</span>
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800">حالة المياه</h1>
                        <p className="text-[11px] text-slate-500 font-medium">مراقبة ضخ المياه في المناطق</p>
                    </div>
                </div>
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                    <span className="text-xl">💧</span>
                </div>
            </header>

            <main className="px-4 py-6">
                {loading ? <p className="text-center py-10 opacity-50 text-sm font-medium text-slate-500">جاري التحميل...</p> : (
                    <div className="grid grid-cols-1 gap-3">
                        {zones.map((zone: any) => (
                            <div key={zone.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">{zone.name}</h3>
                                    <p className="text-[10px] text-slate-400 mt-1 font-medium">آخر تحديث: {new Date(zone.updated_at).toLocaleTimeString('ar-SY')}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-md text-[10px] font-bold border ${zone.status === 'Working' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                                    }`}>
                                    {zone.status === 'Working' ? 'متوفرة' : 'مقطوعة'}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-6 bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3 text-blue-800">
                    <span className="text-lg">ℹ️</span>
                    <p className="text-xs leading-relaxed font-medium pt-0.5">
                        يتم تحديث هذه البيانات بناءً على بلاغات المواطنين والفنيين في الميدان بشكل دوري.
                    </p>
                </div>
            </main>
        </div>
    );
}
