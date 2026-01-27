import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, CheckCircle2, Clock, AlertCircle, Building2, User, MapPin } from 'lucide-react';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';

export default function GovDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/gov/dashboard');
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <SkeletonLoader type="list" />;

    return (
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
            <header className="bg-indigo-900 text-white px-6 pt-12 pb-12 rounded-b-[40px] shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <ChevronLeft className="text-white" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black">{data?.department_name || 'بوابة الجهة'}</h1>
                        <p className="text-indigo-300 text-[11px] font-bold uppercase tracking-wider">نظام إدارة بلاغات المدينة</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/10 p-4 rounded-3xl border border-white/10 text-center">
                        <div className="text-2xl font-black">{data?.stats?.pending || 0}</div>
                        <div className="text-[9px] text-indigo-300 font-bold uppercase">انتظار</div>
                    </div>
                    <div className="bg-white/10 p-4 rounded-3xl border border-white/10 text-center text-amber-400">
                        <div className="text-2xl font-black">{data?.stats?.in_progress || 0}</div>
                        <div className="text-[9px] text-indigo-300 font-bold uppercase">قيد العمل</div>
                    </div>
                    <div className="bg-white/10 p-4 rounded-3xl border border-white/10 text-center text-emerald-400">
                        <div className="text-2xl font-black">{data?.stats?.resolved || 0}</div>
                        <div className="text-[9px] text-indigo-300 font-bold uppercase">تم الحل</div>
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={() => navigate('/gov/inventory')}
                        className="flex-1 bg-white/10 active:bg-white/20 p-4 rounded-2xl flex items-center justify-center gap-2 border border-white/10 transition-colors"
                    >
                        <Building2 size={20} className="text-white" />
                        <span className="text-white font-bold text-xs">سجل البنية التحتية</span>
                    </button>
                    <button
                        onClick={() => navigate('/admin/map-editor')}
                        className="flex-1 bg-white/10 active:bg-white/20 p-4 rounded-2xl flex items-center justify-center gap-2 border border-white/10 transition-colors"
                    >
                        <MapPin size={20} className="text-white" />
                        <span className="text-white font-bold text-xs">خريطة الخدمات</span>
                    </button>
                </div>
            </header>

            <main className="px-6 -mt-6">
                <h3 className="font-bold text-slate-800 mb-4 px-2 flex items-center justify-between">
                    <span>البلاغات الموجهة لكم</span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">الأحدث أولاً</span>
                </h3>

                <div className="space-y-4">
                    {data?.reports?.map((report: any) => (
                        <div
                            key={report.id}
                            onClick={() => navigate(`/my-reports`)} // Link to existing detailed report list or create a Show page for mobile
                            className="bg-white rounded-3xl p-5 shadow-premium border border-slate-100 active:scale-[0.98] transition-all relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${report.status === 'pending' ? 'bg-rose-50 text-rose-500' :
                                        report.status === 'in_progress' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'
                                        }`}>
                                        {report.status === 'pending' ? <AlertCircle size={20} /> :
                                            report.status === 'in_progress' ? <Clock size={20} /> : <CheckCircle2 size={20} />}
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-400 font-bold mb-0.5">#{report.id.substring(0, 8)}</div>
                                        <div className="font-bold text-slate-800 text-sm">{report.category === 'water' ? 'مشكلة مياه' : 'بلاغ خدمة'}</div>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${report.status === 'pending' ? 'bg-rose-100 text-rose-700' :
                                    report.status === 'in_progress' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                    }`}>
                                    {{
                                        'pending': 'انتظار',
                                        'in_progress': 'قيد المعالجة',
                                        'resolved': 'تم الحل'
                                    }[report.status as string]}
                                </span>
                            </div>

                            <p className="text-xs text-slate-600 font-medium mb-4 line-clamp-2">
                                {report.description}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                                        <User size={12} className="text-slate-400" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500">{report.user?.name || 'مواطن'}</span>
                                </div>
                                <div className="text-[10px] font-bold text-slate-400">
                                    {new Date(report.created_at).toLocaleDateString('ar-SY')}
                                </div>
                            </div>
                        </div>
                    ))}

                    {(!data?.reports || data.reports.length === 0) && (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto flex items-center justify-center">
                                <Building2 size={32} className="text-slate-300" />
                            </div>
                            <p className="text-slate-500 font-bold">لا يوجد بلاغات نشطة حالياً</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
