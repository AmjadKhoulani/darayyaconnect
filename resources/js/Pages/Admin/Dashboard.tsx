import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    PieChart, Pie, Cell
} from 'recharts';
import {
    Activity, Users, FileText, AlertTriangle, Construction, TrendingUp,
    CheckCircle2, Clock, Map as MapIcon, Zap, Droplets, MessageSquare,
    Search, Lightbulb, ShieldAlert, Cpu, Sparkles, HandHelping, Package,
    ArrowUpRight, ArrowDownRight, MoreHorizontal, Bell, Phone, Send
} from 'lucide-react';

interface Props {
    auth: any;
    stats: {
        reports_pending: number;
        projects_ongoing: number;
        projects_stalled: number;
        avg_stall_days: number;
        citizens_count: number;
        active_alerts: number;
        moderation_pending: number;
        total_ai_studies: number;
        volunteers_active: number;
        lost_found_active: number;
        initiatives_pending: number;
        discussion_posts: number;
    };
    trends: {
        reports: any[];
        users: any[];
        services: any;
    };
    report_breakdown: Record<string, number>;
    recent_reports: any[];
    active_alerts: any[];
    active_sos_alerts: any[];
    infrastructure_points: any[];
    users: any[];
    services: any[];
    departments: any[];
}

export default function Dashboard({
    auth,
    stats,
    recent_reports,
    active_alerts,
    infrastructure_points,
    users,
    services,
    departments,
    trends,
    active_sos_alerts,
    report_breakdown
}: Props) {
    const { settings } = usePage().props as any;
    const [selectedSos, setSelectedSos] = useState<any>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Auto-refresh SOS alerts
    useEffect(() => {
        if (active_sos_alerts && active_sos_alerts.length > 0) {
            const interval = setInterval(() => {
                router.reload({ only: ['active_sos_alerts'] });
            }, 10000);
            return () => clearInterval(interval);
        }
    }, [active_sos_alerts]);

    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    const pieData = Object.entries(report_breakdown || {}).map(([name, value]) => ({
        name: name === 'water' ? 'مياه' : name === 'electricity' ? 'كهرباء' : name === 'trash' ? 'نظافة' : name === 'lighting' ? 'إنارة' : name === 'road' ? 'طرق' : name,
        value
    }));

    return (
        <AdminLayout
            user={auth?.user}
            header={
                <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg">
                        <Cpu size={24} className="text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900">غرفة العمليات المركزية</h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            بث مباشر للنظام • {currentTime.toLocaleTimeString('ar-SY')}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="لوحة التحكم" />

            <div className="min-h-screen bg-slate-50/50 p-6 lg:p-8" dir="rtl">
                <div className="mx-auto max-w-[1600px] space-y-8">

                    {/* EMERGENCY SIGNALS - REAMPED */}
                    {active_sos_alerts && active_sos_alerts.length > 0 && (
                        <section className="animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="overflow-hidden rounded-[2rem] border-2 border-red-500/20 bg-white shadow-2xl shadow-red-100">
                                <div className="flex items-center justify-between border-b border-red-50 bg-red-50/50 px-8 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-200 animate-pulse">
                                            <ShieldAlert size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-red-900">إشارات استغاثة نشطة (SOS)</h3>
                                            <p className="text-xs font-bold text-red-600/70 uppercase">تتطلب استجابة فورية من فرق الميدان</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-1.5 text-sm font-black text-white">
                                        {active_sos_alerts ? active_sos_alerts.length : 0} إشارة
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 divide-y divide-red-50 lg:grid-cols-2 lg:divide-y-0 lg:divide-x lg:divide-x-reverse">
                                    {active_sos_alerts.map((sos) => (
                                        <div key={sos.id} className="flex items-center justify-between p-6 transition hover:bg-red-50/30">
                                            <div className="flex items-center gap-5">
                                                <div className="relative">
                                                    <div className="h-16 w-16 overflow-hidden rounded-2xl border-2 border-white bg-slate-100 shadow-md">
                                                        {sos.user?.avatar ? (
                                                            <img src={sos.user.avatar} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-2xl font-black text-slate-300">
                                                                {sos.user?.name?.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-lg bg-red-600 text-white shadow-sm ring-2 ring-white">
                                                        {sos.emergency_type === 'medical' ? <Activity size={12} /> : sos.emergency_type === 'fire' ? <Zap size={12} /> : <AlertTriangle size={12} />}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-lg font-black text-slate-900">{sos.user?.name || 'مواطن'}</div>
                                                    <div className="flex items-center gap-2 text-sm font-bold text-red-600">
                                                        <Clock size={14} />
                                                        منذ {new Date(sos.created_at).toLocaleTimeString('ar-SY')}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedSos(sos)}
                                                className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:bg-slate-800 hover:scale-105 active:scale-95"
                                            >
                                                <Send size={18} className="rotate-180" />
                                                تفاصيل الاستجابة
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* TOP LEVEL STATS - PREMIUM CARDS */}
                    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="بلاغات معلقة"
                            value={stats.reports_pending}
                            icon={<FileText />}
                            trend="+5%"
                            color="orange"
                            delay="0"
                        />
                        <StatCard
                            title="مشاريع الميدان"
                            value={stats.projects_ongoing}
                            icon={<Construction />}
                            trend="مستقر"
                            color="blue"
                            delay="100"
                        />
                        <StatCard
                            title="التنبيهات النشطة"
                            value={stats.active_alerts}
                            icon={<Bell />}
                            trend="-2"
                            color="rose"
                            delay="200"
                        />
                        <StatCard
                            title="إجمالي السكان"
                            value={stats.citizens_count}
                            icon={<Users />}
                            trend="+12"
                            color="emerald"
                            delay="300"
                        />
                    </section>

                    {/* CORE DASHBOARD GRID */}
                    <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                        {/* MAIN ANALYTICS COLUMN (2/3) */}
                        <div className="space-y-8 lg:col-span-2">

                            {/* ACTIVITY CHART */}
                            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
                                <div className="mb-8 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900">نشاط البلاغات الواردة</h3>
                                        <p className="text-xs font-bold text-slate-400">آخر 7 أيام من التفاعل الميداني</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-[10px] font-black text-orange-600">
                                            <TrendingUp size={12} />
                                            +12.5% نمو
                                        </div>
                                    </div>
                                </div>
                                <div className="h-[350px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={trends?.reports || []}>
                                            <defs>
                                                <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis
                                                dataKey="date"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 'bold' }}
                                                tickFormatter={(val) => val.split('-').slice(1).reverse().join('/')}
                                            />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
                                                labelStyle={{ fontWeight: 'black', marginBottom: '8px' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="count"
                                                stroke="#f97316"
                                                strokeWidth={5}
                                                fillOpacity={1}
                                                fill="url(#colorReports)"
                                                animationDuration={2000}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* RECENT REPORTS FEED */}
                            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
                                <div className="mb-8 flex items-center justify-between">
                                    <h3 className="text-xl font-black text-slate-900">آخر المستجدات والبلاغات</h3>
                                    <Link href={route('admin.reports.index')} className="text-sm font-black text-emerald-600 hover:underline">عرض جميع البلاغات</Link>
                                </div>
                                <div className="space-y-4">
                                    {recent_reports && recent_reports.map((report) => (
                                        <div key={report.id} className="group flex items-center justify-between rounded-3xl border border-slate-50 bg-slate-50/50 p-5 transition hover:border-emerald-200 hover:bg-white hover:shadow-xl hover:shadow-emerald-500/5">
                                            <div className="flex items-center gap-5">
                                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm bg-white text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors`}>
                                                    {report.category === 'water' ? <Droplets size={24} /> : report.category === 'electricity' ? <Zap size={24} /> : <MessageSquare size={24} />}
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-900">{report.description.substring(0, 60)}...</div>
                                                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                                                        <span className="flex items-center gap-1">
                                                            <Users size={12} /> {report.user?.name || 'مواطن'}
                                                        </span>
                                                        <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={12} /> {new Date(report.created_at).toLocaleDateString('ar-SY')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${report.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                    {report.status}
                                                </span>
                                                <Link href={route('admin.reports.show', report.id)} className="rounded-xl bg-white p-2 text-slate-400 shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ArrowUpRight size={18} />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* SIDEBAR ANALYTICS (1/3) */}
                        <div className="space-y-8">

                            {/* MODULE DISCOVERY GRID (New Small Grid) */}
                            <div className="grid grid-cols-2 gap-4">
                                <QuickStatCard label="أبحاث الذكاء" value={stats.total_ai_studies} icon={<Sparkles />} color="purple" />
                                <QuickStatCard label="المتطوعين" value={stats.volunteers_active} icon={<HandHelping />} color="emerald" />
                                <QuickStatCard label="مفقودات" value={stats.lost_found_active} icon={<Search />} color="amber" />
                                <QuickStatCard label="مبادرات نشطة" value={stats.projects_ongoing} icon={<Construction />} color="blue" />
                            </div>

                            {/* REPORT BREAKDOWN PIE */}
                            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
                                <h3 className="mb-6 text-xl font-black text-slate-900">توزيع البلاغات</h3>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {pieData && pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* SYSTEM BROADCAST PANEL */}
                            <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/20">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 text-xl">
                                        📢
                                    </div>
                                    <h3 className="text-xl font-black">بث تنبيه عام</h3>
                                </div>
                                <AlertForm />
                                <p className="mt-6 text-[10px] font-bold text-slate-400 leading-relaxed">
                                    سيتم إرسال هذا التنبيه لجميع المواطنين عبر تطبيق الموبايل وبوابة الويب فوراً. يرجى التأكد من صحة المعلومات قبل البث.
                                </p>
                            </div>

                            {/* USER LIST MINI */}
                            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-lg font-black text-slate-900">آخر المسجلين</h3>
                                    <Link href={route('admin.users.index')} className="text-slate-400 hover:text-slate-900">
                                        <MoreHorizontal />
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {users && users.slice(0, 5).map(user => (
                                        <div key={user.id} className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-slate-400">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-black text-slate-900">{user.name}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{user.role}</div>
                                            </div>
                                            {user.is_verified_official && (
                                                <CheckCircle2 size={16} className="text-emerald-500" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </section>
                </div>
            </div>

            {/* SOS MODAL - PREMIUM REDESIGN */}
            {selectedSos && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300 overflow-y-auto">
                    <div className="w-full max-w-xl rounded-[2.5rem] bg-white shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="relative h-32 bg-red-600">
                            <div className="absolute -bottom-8 right-8 h-24 w-24 overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-xl">
                                {selectedSos.user?.avatar ? (
                                    <img src={selectedSos.user.avatar} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-4xl font-black text-slate-200">
                                        {selectedSos.user?.name?.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setSelectedSos(null)}
                                className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/40"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="px-8 pb-8 pt-12">
                            <div className="mb-8">
                                <h3 className="text-3xl font-black text-slate-900">{selectedSos.user?.name || 'مواطن'}</h3>
                                <div className="mt-1 flex items-center gap-2 text-red-600 font-bold">
                                    <Phone size={18} />
                                    <a href={`tel:${selectedSos.user?.mobile}`} className="text-xl underline underline-offset-4">{selectedSos.user?.mobile}</a>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="rounded-3xl bg-red-50 p-5 border border-red-100">
                                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">نوع الحالة</p>
                                    <div className="text-lg font-black text-red-700">
                                        {selectedSos.emergency_type === 'medical' ? '🚑 طبية عاجلة' : selectedSos.emergency_type === 'fire' ? '🔥 حريق' : '🚨 استغاثة'}
                                    </div>
                                </div>
                                <div className="rounded-3xl bg-slate-50 p-5 border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">وقت التفعيل</p>
                                    <div className="text-lg font-black text-slate-900">{new Date(selectedSos.created_at).toLocaleTimeString('ar-SY')}</div>
                                </div>
                            </div>

                            {selectedSos.message && (
                                <div className="mb-8 rounded-3xl bg-slate-50 p-6 border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">ملاحظات إضافية</p>
                                    <p className="text-lg font-bold text-slate-700 leading-relaxed">{selectedSos.message}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <a
                                    href={`https://www.google.com/maps?q=${selectedSos.current_latitude || selectedSos.latitude},${selectedSos.current_longitude || selectedSos.longitude}`}
                                    target="_blank"
                                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-5 text-xl font-black text-white shadow-xl shadow-slate-900/20 transition hover:bg-slate-800"
                                >
                                    📍 تتبع الموقع المباشر
                                </a>
                                <button
                                    onClick={() => {
                                        if (confirm('هل تم التأكد من التعامل مع الحالة وإنهائها؟')) {
                                            router.post(route('admin.sos.resolve', selectedSos.id));
                                            setSelectedSos(null);
                                        }
                                    }}
                                    className="w-full rounded-2xl border-2 border-slate-200 py-4 text-sm font-black text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
                                >
                                    إغلاق البلاغ نهائياً
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

function StatCard({ title, value, icon, trend, color, delay }: any) {
    const colorClasses: Record<string, string> = {
        emerald: 'bg-emerald-50 text-emerald-500 border-emerald-100',
        blue: 'bg-blue-50 text-blue-500 border-blue-100',
        rose: 'bg-rose-50 text-rose-500 border-rose-100',
        orange: 'bg-orange-50 text-orange-500 border-orange-100',
    };

    return (
        <div
            className={`group animate-in fade-in zoom-in duration-500 fill-mode-backwards rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colorClasses[color]} shadow-sm transition-transform group-hover:scale-110`}>
                    {icon && typeof icon === 'object' ? { ...icon, props: { ...icon.props, size: 24 } } : icon}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-black ${trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                        {trend.includes('+') ? <ArrowUpRight size={10} /> : trend.includes('-') ? <ArrowDownRight size={10} /> : null}
                        {trend}
                    </div>
                )}
            </div>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{title}</p>
            <h3 className="text-4xl font-black text-slate-900 mt-1">{value?.toLocaleString()}</h3>
        </div>
    );
}

function QuickStatCard({ label, value, icon, color }: any) {
    const colors: Record<string, string> = {
        purple: 'text-purple-500 bg-purple-50',
        emerald: 'text-emerald-500 bg-emerald-50',
        amber: 'text-amber-500 bg-amber-50',
        blue: 'text-blue-500 bg-blue-50',
    };
    return (
        <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]}`}>
                {icon && typeof icon === 'object' ? { ...icon, props: { ...icon.props, size: 20 } } : icon}
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase truncate">{label}</div>
            <div className="text-xl font-black text-slate-900">{value}</div>
        </div>
    );
}

function AlertForm() {
    const { data, setData, post, processing, reset } = useForm({
        title: '',
        body: '',
        type: 'warning',
        duration_hours: 24,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.alerts.send'), { onSuccess: () => reset() });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
                <input
                    type="text"
                    placeholder="عنوان التنبيه الموجه للجمهور..."
                    className="w-full rounded-2xl border-none bg-white/10 text-sm font-bold placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                />
                <textarea
                    placeholder="اكتب رسالتك هنا بوضوح..."
                    className="h-28 w-full rounded-2xl border-none bg-white/10 text-sm font-bold placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500"
                    value={data.body}
                    onChange={(e) => setData('body', e.target.value)}
                ></textarea>
            </div>
            <div className="flex gap-2">
                <select
                    className="flex-1 rounded-xl border-none bg-white/10 text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                    value={data.type}
                    onChange={(e) => setData('type', e.target.value)}
                >
                    <option value="warning" className="text-slate-900">تنبيه تحذيري</option>
                    <option value="info" className="text-slate-900">معلومات عامة</option>
                    <option value="success" className="text-slate-900">إشعار نجاح</option>
                    <option value="danger" className="text-slate-900">خطر عاجل</option>
                </select>
                <button
                    type="submit"
                    disabled={processing}
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-95 disabled:opacity-50"
                >
                    {processing ? 'جاري البث...' : (
                        <>
                            <span>بث للحظي</span>
                            <Send size={16} className="rotate-180" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
