import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Plus, Edit2, Trash2, MapPin, Users, Activity } from 'lucide-react';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';

export default function DepartmentManagement() {
    const [departments, setDepartments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/manage/departments');
            setDepartments(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('سيؤدي الحذف إلى إزالة القسم وربما التأثير على المستخدمين التابعين له. هل أنت متأكد؟')) return;
        try {
            await api.delete(`/admin/manage/departments/${id}`);
            fetchData();
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
                    <h1 className="text-lg font-black text-slate-800">إدارة المؤسسات</h1>
                </div>
                <button className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                    <Plus size={24} />
                </button>
            </header>

            <main className="p-4 space-y-3">
                {departments.map((dept) => (
                    <div key={dept.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl"
                                style={{ color: dept.color || '#64748b' }}>
                                {dept.icon || '🏢'}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-black text-slate-800">{dept.name}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                        <Users size={12} />
                                        {dept.users_count} موظف
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                        <Activity size={12} />
                                        نشط
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button className="p-2 bg-slate-50 rounded-lg text-slate-400"><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(dept.id)} className="p-2 bg-rose-50 rounded-lg text-rose-400"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    </div>
                ))}

                {departments.length === 0 && (
                    <div className="py-20 text-center text-slate-400 font-bold">لا توجد مؤسسات مسجلة</div>
                )}
            </main>
        </div>
    );
}
