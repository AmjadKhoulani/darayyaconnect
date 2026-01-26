import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, Plus, Users, Calendar, MapPin, Check, X, Edit2, Trash2 } from 'lucide-react';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';

export default function VolunteerManagement() {
    const [opportunities, setOpportunities] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'opportunities' | 'applications'>('opportunities');
    const [showAddForm, setShowAddForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/manage/volunteering');
            setOpportunities(res.data.opportunities);
            setApplications(res.data.applications);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAppStatus = async (id: number, status: string) => {
        try {
            await api.post(`/admin/manage/volunteering/applications/${id}/status`, { status });
            fetchData();
        } catch (err) {
            alert('فشل تحديث الحالة');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('هل أنت متأكد من حذف هذه الفرصة؟')) return;
        try {
            await api.delete(`/admin/manage/volunteering/${id}`);
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
                    <h1 className="text-lg font-black text-slate-800">إدارة التطوع</h1>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200"
                >
                    <Plus size={24} />
                </button>
            </header>

            <div className="bg-white px-4 py-2 border-b border-slate-100 flex gap-4">
                <button
                    onClick={() => setActiveTab('opportunities')}
                    className={`pb-2 text-sm font-black transition-all ${activeTab === 'opportunities' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400'}`}
                >
                    الفرص ({opportunities.length})
                </button>
                <button
                    onClick={() => setActiveTab('applications')}
                    className={`pb-2 text-sm font-black transition-all ${activeTab === 'applications' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400'}`}
                >
                    الطلبات ({applications.length})
                </button>
            </div>

            <main className="p-4 space-y-4">
                {activeTab === 'opportunities' ? (
                    opportunities.map((opt) => (
                        <div key={opt.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-black text-slate-800">{opt.title}</h3>
                                    <p className="text-xs font-bold text-slate-400">{opt.organization}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 bg-slate-50 rounded-lg text-slate-400"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(opt.id)} className="p-2 bg-rose-50 rounded-lg text-rose-400"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                    <Users size={14} className="text-emerald-500" />
                                    {opt.spots_filled} / {opt.spots_total} مقعد
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                    <Calendar size={14} className="text-blue-500" />
                                    {new Date(opt.start_date).toLocaleDateString('ar-SY')}
                                </div>
                            </div>
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full ${opt.status === 'open' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {opt.status === 'open' ? 'مفتوح' : 'مغلق'}
                            </span>
                        </div>
                    ))
                ) : (
                    applications.map((app) => (
                        <div key={app.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400">
                                    {app.user.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{app.user.name}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold">فرصة: {app.opportunity?.title}</p>
                                </div>
                            </div>
                            {app.status === 'pending' ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAppStatus(app.id, 'approved')}
                                        className="flex-1 bg-emerald-50 text-emerald-600 py-2.5 rounded-xl flex items-center justify-center gap-2 font-black text-xs"
                                    >
                                        <Check size={16} /> قبول
                                    </button>
                                    <button
                                        onClick={() => handleAppStatus(app.id, 'rejected')}
                                        className="flex-1 bg-rose-50 text-rose-600 py-2.5 rounded-xl flex items-center justify-center gap-2 font-black text-xs"
                                    >
                                        <X size={16} /> رفض
                                    </button>
                                </div>
                            ) : (
                                <div className={`text-center py-2 rounded-xl text-xs font-black ${app.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                    }`}>
                                    {app.status === 'approved' ? 'تم القبول ✅' : 'تم الرفض ❌'}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </main>
        </div>
    );
}
