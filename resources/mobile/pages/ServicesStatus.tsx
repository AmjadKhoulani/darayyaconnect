import { useState, useEffect } from 'react';
import api from '../services/api';

export default function ServicesStatus() {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data - في الواقع نجلبها من API
        setServices([
            { id: 1, name: 'المياه', status: 'stable', icon: '💧' },
            { id: 2, name: 'الكهرباء', status: 'stable', icon: '⚡' },
            { id: 3, name: 'الإنترنت', status: 'down', icon: '🌐' },
            { id: 4, name: 'الاتصالات', status: 'stable', icon: '📱' },
        ]);
        setLoading(false);
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
                        <h1 className="text-lg font-bold text-slate-800">حالة الخدمات</h1>
                        <p className="text-[11px] text-slate-500 font-medium">متابعة حية للمرافق</p>
                    </div>
                </div>
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                    <span className="text-xl">⚡</span>
                </div>
            </header>

            <main className="px-4 py-6">
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-2xl border border-emerald-200">
                        ✅
                    </div>
                    <div>
                        <h3 className="font-bold text-emerald-800 text-sm mb-0.5">الوضع مستقر</h3>
                        <p className="text-emerald-600/80 text-[11px] font-medium">تعمل معظم الخدمات بشكل طبيعي</p>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-20 bg-white rounded-2xl border border-slate-200 shadow-sm animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {services.map(service => (
                            <div key={service.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-colors ${service.status === 'stable' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                        {service.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-sm mb-1">{service.name}</h3>
                                        <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md w-fit border ${service.status === 'stable' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${service.status === 'stable' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
                                            {service.status === 'stable' ? 'يعمل بشكل طبيعي' : 'توقف مؤقت'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
