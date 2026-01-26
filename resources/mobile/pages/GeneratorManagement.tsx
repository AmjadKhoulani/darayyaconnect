import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Plus, Edit2, Trash2, MapPin, DollarSign, Activity } from 'lucide-react';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';

export default function GeneratorManagement() {
    const [generators, setGenerators] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchGenerators();
    }, []);

    const fetchGenerators = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/manage/generators');
            setGenerators(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('هل أنت متأكد من حذف هذه المولدة؟')) return;
        try {
            await api.delete(`/admin/manage/generators/${id}`);
            fetchGenerators();
        } catch (err) {
            alert('فشل الحذف');
        }
    };

    if (loading) return <SkeletonLoader type="list" />;

    return (
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
            <header className="bg-white border-b border-slate-100 sticky top-0 z-10 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                        <ArrowRight className="text-slate-600" />
                    </button>
                    <h1 className="text-lg font-black text-slate-800">إدارة الأمبيرات</h1>
                </div>
                <button className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center">
                    <Plus size={24} />
                </button>
            </header>

            <main className="p-4 space-y-4">
                {generators.map((gen) => (
                    <div key={gen.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800">{gen.name}</h3>
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                        <MapPin size={10} />
                                        {gen.neighborhood}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 bg-slate-50 rounded-lg text-slate-400"><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(gen.id)} className="p-2 bg-rose-50 rounded-lg text-rose-400"><Trash2 size={16} /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                            <div className="bg-slate-50 rounded-2xl p-3">
                                <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">سعر الأمبير</span>
                                <div className="flex items-center gap-1 font-black text-slate-800">
                                    <DollarSign size={14} className="text-emerald-500" />
                                    {gen.ampere_price} ل.س
                                </div>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-3">
                                <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">حالة التشغيل</span>
                                <div className="flex items-center gap-1 font-black">
                                    <Activity size={14} className={gen.status === 'active' ? 'text-emerald-500' : 'text-rose-500'} />
                                    <span className={gen.status === 'active' ? 'text-emerald-600' : 'text-rose-600'}>
                                        {gen.status === 'active' ? 'يعمل' : gen.status === 'maintenance' ? 'صيانة' : 'توقف'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {generators.length === 0 && (
                    <div className="py-20 text-center text-slate-400 font-bold">لا توجد مولدات مسجلة</div>
                )}
            </main>
        </div>
    );
}
