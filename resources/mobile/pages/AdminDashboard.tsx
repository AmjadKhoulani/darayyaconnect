import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, MessageSquare, ArrowRight, Map, Activity, Heart, Building2, Bot, Zap, BookOpen, Send, Crosshair, LayoutList } from 'lucide-react';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/dashboard');
            setStats(res.data.stats);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <SkeletonLoader type="profile" />;

    const managementTools = [
        { title: 'إدارة المستخدمين', icon: <Users className="text-indigo-500" />, path: '/admin/users' },
        { title: 'المؤسسات والجهات', icon: <Building2 className="text-cyan-500" />, path: '/admin/departments' },
        { title: 'حالة الخدمات', icon: <Activity className="text-amber-500" />, path: '/admin/services' },
        { title: 'مركز الرقابة', icon: <Shield className="text-rose-500" />, path: '/admin/moderation' },
        { title: 'فرص التطوع', icon: <Heart className="text-pink-500" />, path: '/admin/volunteers' },
        { title: 'الدراسات الآلية', icon: <Bot className="text-purple-500" />, path: '/admin/ai-studies' },
        { title: 'إدارة الأمبيرات', icon: <Zap className="text-yellow-500" />, path: '/admin/generators' },
        { title: 'دليل المدينة', icon: <BookOpen className="text-blue-500" />, path: '/admin/directory' },
        { title: 'محرر الخريطة', icon: <Map className="text-emerald-500" />, path: '/admin/map-editor' },
        { title: 'التتبع المباشر', icon: <Crosshair className="text-red-500" />, path: '/admin/user-map' },
        { title: 'سجل البنية التحتية', icon: <LayoutList className="text-teal-500" />, path: '/gov/inventory' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
            <header className="bg-white px-6 py-8 rounded-b-[40px] shadow-sm mb-6 border-b border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                            <ArrowRight className="text-slate-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800">غرفة العمليات</h1>
                            <p className="text-slate-400 font-bold text-sm">إدارة المدينة والخدمات</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/admin/broadcast')}
                        className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200"
                    >
                        <Send size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">بلاغات معلقة</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-rose-500">{stats?.reports_pending || 0}</span>
                            <span className="text-[10px] font-bold text-slate-300">بلاغ</span>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">بانتظار الموافقة</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-amber-500">{stats?.moderation_pending || 0}</span>
                            <span className="text-[10px] font-bold text-slate-300">طلب</span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-4 rounded-3xl border border-blue-100">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">مواطنون</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-blue-600">{stats?.citizens_count || 0}</span>
                            <span className="text-[10px] font-bold text-blue-300">نسمة</span>
                        </div>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100">
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">تنبيهات نشطة</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-emerald-600">{stats?.active_alerts || 0}</span>
                            <span className="text-[10px] font-bold text-emerald-300">تنبيه</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="px-6 space-y-6">
                <div>
                    <h2 className="text-lg font-black text-slate-800 mb-4 px-1">أدوات الإدارة الشاملة</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {managementTools.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => navigate(item.path)}
                                className="bg-white p-4 rounded-[32px] flex flex-col items-center justify-center gap-3 shadow-sm border border-slate-100 active:scale-95 transition-all text-center aspect-square"
                            >
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                                    {item.icon}
                                </div>
                                <span className="font-bold text-slate-700 text-[11px] leading-tight px-1">{item.title}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[32px] p-6 text-white shadow-xl shadow-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-black">مركز المراقبة</h3>
                        <Activity className="text-emerald-400" size={18} />
                    </div>
                    <p className="text-xs text-slate-400 font-bold mb-6 leading-relaxed">
                        يمكنك متابعة كافة التقارير الواردة والتحركات الميدانية مباشرة من هنا.
                    </p>
                    <button
                        onClick={() => navigate('/my-reports')}
                        className="w-full bg-white/10 hover:bg-white/20 py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm transition-all"
                    >
                        عرض كافة البلاغات <ArrowRight size={18} className="transform rotate-180" />
                    </button>
                </div>
            </main>
        </div>
    );
}
