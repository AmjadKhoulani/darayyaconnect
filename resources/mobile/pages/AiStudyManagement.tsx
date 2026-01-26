import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, Plus, Edit2, Trash2, Globe, TrendingUp, Info } from 'lucide-react';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';

export default function AiStudyManagement() {
    const [studies, setStudies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudies();
    }, []);

    const fetchStudies = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/manage/ai-studies');
            setStudies(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('هل أنت متأكد من حذف هذه الدراسة؟')) return;
        try {
            await api.delete(`/admin/manage/ai-studies/${id}`);
            fetchStudies();
        } catch (err) {
            alert('فشل الحذف');
        }
    };

    const handleToggleFeatured = async (study: any) => {
        try {
            await api.post(`/admin/manage/ai-studies/${study.id}`, {
                ...study,
                is_featured: !study.is_featured,
                // Ensure array fields are sent back correctly if API expects them
                scenario: study.scenario || [],
                economics: study.economics || [],
                social: study.social || [],
                implementation: study.implementation || [],
            });
            fetchStudies();
        } catch (err) {
            console.error(err);
            alert('فشل التعديل');
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
                    <h1 className="text-lg font-black text-slate-800">إدارة الدراسات الآلية</h1>
                </div>
                <button className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center">
                    <Plus size={24} />
                </button>
            </header>

            <main className="p-4 space-y-4">
                {studies.map((study) => (
                    <div key={study.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                        <div className="p-1 h-2" style={{ background: study.gradient || study.color }}></div>
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{study.icon}</span>
                                    <div>
                                        <h3 className="font-black text-slate-800 text-sm">{study.title}</h3>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">{study.category}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 bg-slate-50 rounded-lg text-slate-400"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(study.id)} className="p-2 bg-rose-50 rounded-lg text-rose-400"><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <p className="text-xs text-slate-500 line-clamp-2 mb-4 font-medium leading-relaxed">
                                {study.summary}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <div className="flex gap-2">
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full ${study.is_published ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                        {study.is_published ? 'منشور' : 'مسودة'}
                                    </span>
                                    <button
                                        onClick={() => handleToggleFeatured(study)}
                                        className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-colors ${study.is_featured ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-white text-slate-400 border-slate-200'}`}
                                    >
                                        {study.is_featured ? '⭐ مميز' : '☆ عادي'}
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe size={12} className="text-slate-300" />
                                    <TrendingUp size={12} className="text-slate-300" />
                                    <Info size={12} className="text-slate-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {studies.length === 0 && (
                    <div className="py-20 text-center text-slate-400 font-bold">لا توجد دراسات مسجلة</div>
                )}
            </main>
        </div>
    );
}
