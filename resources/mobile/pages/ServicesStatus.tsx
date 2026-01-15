import { useState, useEffect } from 'react';
import api from '../services/api';

export default function ServicesStatus() {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [debugError, setDebugError] = useState<string>('');

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await api.get('/infrastructure/status-summary');
                console.log('Services API Response:', response.data);

                if (Array.isArray(response.data)) {
                    setServices(response.data);
                } else {
                    throw new Error('Invalid data format received');
                }
            } catch (error: any) {
                console.error("Failed to fetch services status", error);
                setDebugError(error.message || 'Unknown Error');

                // Fallback Mock data
                setServices([
                    { id: 'water', name: 'المياه', status: 'stable', icon: '💧', label: 'تجريبي (فشل الاتصال)' },
                    { id: 'electricity', name: 'الكهرباء', status: 'stable', icon: '⚡', label: 'تجريبي (فشل الاتصال)' },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
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
                        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">حالة الخدمات</h1>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">متابعة حية للمرافق</p>
                    </div>
                </div>
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-800/50">
                    <span className="text-xl">⚡</span>
                </div>
            </header>

            <main className="px-4 py-6">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl p-4 mb-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800 rounded-xl flex items-center justify-center text-2xl border border-emerald-200 dark:border-emerald-700">
                        ✅
                    </div>
                    <div>
                        <h3 className="font-bold text-emerald-800 dark:text-emerald-400 text-sm mb-0.5">الوضع مستقر</h3>
                        <p className="text-emerald-600/80 dark:text-emerald-500/80 text-[11px] font-medium">تعمل معظم الخدمات بشكل طبيعي</p>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {services.length === 0 && (
                            <div className="text-center p-8 text-slate-400">
                                <p>لا توجد بيانات للعرض</p>
                                {debugError && <p className="text-xs text-red-400 mt-2 ltr">{debugError}</p>}
                            </div>
                        )}

                        {services.map(service => (
                            <div key={service.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-4 shadow-premium flex items-center justify-between group hover:border-blue-200 dark:hover:border-blue-700 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-colors ${service.status === 'stable' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600' : 'bg-red-50 dark:bg-red-900/30 text-red-600'
                                        }`}>
                                        {service.icon}
                                    </div>
                                    <div className="text-right">
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">{service.name}</h3>
                                        <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md w-fit border ${service.status === 'stable' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800/50'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${service.status === 'stable' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
                                            {service.label || (service.status === 'stable' ? 'يعمل بشكل طبيعي' : 'توقف مؤقت')}
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
