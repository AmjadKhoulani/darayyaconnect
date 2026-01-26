import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Plus, Edit2, Trash2, Phone, Tag } from 'lucide-react';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';

export default function DirectoryManagement() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/manage/directory');
            setItems(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;
        try {
            await api.delete(`/admin/manage/directory/${id}`);
            fetchItems();
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
                    <h1 className="text-lg font-black text-slate-800">دليل المدينة</h1>
                </div>
                <button className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                    <Plus size={24} />
                </button>
            </header>

            <main className="p-4 space-y-3">
                {items.map((item) => (
                    <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl">
                                {item.icon || '📒'}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{item.type}</span>
                                    <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                                        <Phone size={10} />
                                        {item.phone || '-'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="p-2 bg-slate-50 rounded-lg text-slate-300"><Edit2 size={14} /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 bg-rose-50 rounded-lg text-rose-300"><Trash2 size={14} /></button>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
}
