import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Droplets, Save, RefreshCcw } from 'lucide-react';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';

export default function ServiceManagement() {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/service-states');
            setServices(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (key: string, data: any) => {
        setUpdating(key);
        try {
            await api.put(`/service-states/${key}`, data);
            await fetchServices();
        } catch (err) {
            console.error(err);
            alert('فشل التحديث');
        } finally {
            setUpdating(null);
        }
    };

    if (loading) return <SkeletonLoader type="list" />;

    return (
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
            <header className="bg-white px-4 py-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                    <ArrowRight className="text-slate-600" />
                </button>
                <h1 className="text-lg font-black text-slate-800">إدارة حالة الخدمات</h1>
            </header>

            <main className="p-4 space-y-4">
                {services.map((service) => (
                    <div key={service.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${service.service_key === 'electricity' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                {service.service_key === 'electricity' ? <Zap size={24} /> : <Droplets size={24} />}
                            </div>
                            <div>
                                <h3 className="font-black text-slate-800">{service.service_key === 'electricity' ? 'قطاع الكهرباء' : 'قطاع المياه'}</h3>
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${service.status_color === 'green' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                    <span className="text-xs font-bold text-slate-400">{service.status_text}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">نص الحالة</label>
                                <input
                                    type="text"
                                    defaultValue={service.status_text}
                                    onBlur={(e) => {
                                        if (e.target.value !== service.status_text) {
                                            handleUpdate(service.service_key, { ...service, status_text: e.target.value });
                                        }
                                    }}
                                    className="w-full bg-slate-50 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-slate-900"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleUpdate(service.service_key, { ...service, status_color: 'green' })}
                                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all border ${service.status_color === 'green' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-400 border-slate-100'
                                        }`}
                                >
                                    متوفر (أخضر)
                                </button>
                                <button
                                    onClick={() => handleUpdate(service.service_key, { ...service, status_color: 'red' })}
                                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all border ${service.status_color === 'red' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-400 border-slate-100'
                                        }`}
                                >
                                    مقطوع (أحمر)
                                </button>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <span className="text-[10px] font-bold text-slate-400">آخر تحديث: {new Date(service.last_updated_at).toLocaleString('ar-SY')}</span>
                                {updating === service.service_key && <RefreshCcw size={16} className="text-slate-400 animate-spin" />}
                            </div>
                        </div>
                    </div>
                ))}

                {services.length === 0 && (
                    <div className="py-20 text-center text-slate-400 font-bold">لا توجد خدمات مسجلة</div>
                )}
            </main>
        </div>
    );
}
