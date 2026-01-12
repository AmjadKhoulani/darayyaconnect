import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InfrastructureList from './InfrastructureList';

interface Props {
    auth: any;
    stats: {
        reports_pending: number;
        projects_ongoing: number;
        projects_stalled: number;
        avg_stall_days: number;
        citizens_count: number;
        active_alerts: number;
    };
    bottlenecks: {
        summary: any;
        list: any[];
    };
    recent_reports: any[];
    active_alerts: any[];
    infrastructure_points: any[];
    users: any[];
    services: any[];
    departments: any[];
}

export default function Dashboard({ auth, stats, bottlenecks, recent_reports, active_alerts, infrastructure_points, users, services, departments }: Props) {

    // Safety Checks
    if (!stats) return <div className="p-12 text-center text-red-500 font-bold">⚠️ Error: Stats data is missing.</div>;

    const safeRecentReports = Array.isArray(recent_reports) ? recent_reports : [];
    const safeActiveAlerts = Array.isArray(active_alerts) ? active_alerts : [];
    const safeInfrastructurePoints = Array.isArray(infrastructure_points) ? infrastructure_points : [];
    const safeUsers = Array.isArray(users) ? users : [];
    const safeServices = Array.isArray(services) ? services : [];

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="text-xl font-bold leading-tight text-slate-800">غرفة العمليات المركزية</h2>}
        >
            <Head title="لوحة التحكم" />

            <div className="py-12" dir="rtl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                    {/* 1. Services Health & Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Services Status */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 md:col-span-4">
                            <h3 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2">
                                <span>🩺</span> حالة الخدمات العامة
                            </h3>
                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                                {safeServices.map((service) => (
                                    <div key={service.id} className={`p-4 rounded-xl border ${service.status === 'on' ? 'bg-emerald-50 border-emerald-100' : service.status === 'warning' ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100'} flex flex-col items-center text-center`}>
                                        <span className="text-2xl mb-2">{service.icon}</span>
                                        <span className="font-bold text-slate-800">{service.name}</span>
                                        <span className={`text-xs mt-1 font-bold px-2 py-0.5 rounded-full ${service.status === 'on' ? 'bg-emerald-200 text-emerald-800' : service.status === 'warning' ? 'bg-amber-200 text-amber-800' : 'bg-red-200 text-red-800'}`}>
                                            {service.details}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* KPIS */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-xs font-bold uppercase">بلاغات معلقة</p>
                                <h3 className="text-3xl font-black text-orange-500 mt-1">{stats.reports_pending}</h3>
                            </div>
                            <span className="text-3xl">📨</span>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-xs font-bold uppercase">مشاريع جارية</p>
                                <h3 className="text-3xl font-black text-blue-500 mt-1">{stats.projects_ongoing}</h3>
                            </div>
                            <span className="text-3xl">🏗️</span>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-xs font-bold uppercase">تنبيهات نشطة</p>
                                <h3 className="text-3xl font-black text-rose-500 mt-1">{stats.active_alerts}</h3>
                            </div>
                            <span className="text-3xl">🚨</span>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-xs font-bold uppercase">مواطن مسجل</p>
                                <h3 className="text-3xl font-black text-emerald-500 mt-1">{stats.citizens_count}</h3>
                            </div>
                            <span className="text-3xl">👥</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* 2. User Management (Takes 2 Columns) */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Users Table */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-bold text-lg text-slate-800">👥 إدارة المستخدمين (أحدث 10)</h3>
                                    <button className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-3 py-1 rounded transition">عرض الكل</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-right">
                                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                                            <tr>
                                                <th className="px-6 py-3">الاسم</th>
                                                <th className="px-6 py-3">الدور</th>
                                                <th className="px-6 py-3">القسم/المهنة</th>
                                                <th className="px-6 py-3">الحالة</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {safeUsers.map((user) => (
                                                <tr key={user.id} className="hover:bg-slate-50 transition">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                                                                {user.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-slate-900 text-sm">{user.name}</div>
                                                                <div className="text-xs text-slate-500">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        {user.role === 'admin' ? <span className="text-rose-600 font-bold">Admin</span> :
                                                            user.role === 'official' ? <span className="text-blue-600 font-bold">مسؤول</span> :
                                                                user.role === 'institution' ? <span className="text-purple-600 font-bold">مؤسسة</span> :
                                                                    <span className="text-slate-600">مواطن</span>}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">
                                                        {user.department_id ? `قسم ${user.department_id}` : user.profession || '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {user.is_verified_official ?
                                                            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-bold">موثق ✅</span> :
                                                            <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-full">عادي</span>
                                                        }
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100">
                                    <h3 className="font-bold text-lg text-slate-800">📥 أحدث البلاغات الواردة</h3>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {safeRecentReports.map((report) => (
                                        <div key={report.id} className="p-4 hover:bg-slate-50 transition flex items-start gap-4">
                                            <div className={`p-2 rounded-lg ${report.type === 'problem' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {report.type === 'problem' ? '⚠️' : '💡'}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-slate-800 text-sm mb-1">{report.description.substring(0, 50)}...</h4>
                                                    <span className="text-[10px] text-slate-400">{new Date(report.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                                        {report.department_id ? `موجه للقسم ${report.department_id}` : 'عام'}
                                                    </span>
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${report.status === 'received' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                                        {report.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {safeRecentReports.length === 0 && <div className="p-8 text-center text-slate-500">لا توجد بلاغات حديثة</div>}
                                </div>
                            </div>
                        </div>

                        {/* 3. Sidebar (Alerts, Infrastructure, etc) */}
                        <div className="space-y-6">
                            {/* Active Alerts */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <h3 className="font-bold text-lg mb-4 text-slate-800">🚨 التنبيهات النشطة</h3>
                                <div className="space-y-3">
                                    {safeActiveAlerts.map((alert) => (
                                        <div key={alert.id} className="p-3 bg-rose-50 border-r-4 border-rose-500 rounded text-rose-900">
                                            <h4 className="font-bold text-sm">{alert.title}</h4>
                                            <p className="text-xs mt-1">{alert.body}</p>
                                        </div>
                                    ))}
                                    {safeActiveAlerts.length === 0 && <p className="text-slate-500 text-sm text-center">الوضع آمن، لا يوجد تنبيهات.</p>}
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <h4 className="font-bold text-xs text-slate-500 uppercase mb-2">إرسال تنبيه جديد</h4>
                                    <AlertForm />
                                </div>
                            </div>

                            {/* Infrastructure Manager */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <h3 className="font-bold text-lg mb-4 text-slate-800">🏗️ البنية التحتية</h3>
                                <Link
                                    href={route('admin.infrastructure.water')}
                                    className="flex items-center justify-center gap-2 w-full text-center bg-blue-50 text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-100 transition border border-blue-200 mb-4"
                                >
                                    <span>💧</span> إدارة شبكة المياه
                                </Link>
                                <InfrastructureList initialPoints={safeInfrastructurePoints} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function AlertForm() {
    const { data, setData, post, processing, reset } = useForm({
        title: '',
        body: '',
        type: 'info',
        duration_hours: 24
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.alerts.send'), { onSuccess: () => reset() });
    };

    return (
        <form onSubmit={submit} className="space-y-3">
            <input
                type="text"
                placeholder="عنوان التنبيه"
                className="w-full text-sm rounded-lg border-slate-300"
                value={data.title}
                onChange={e => setData('title', e.target.value)}
            />
            <textarea
                placeholder="نص الرسالة..."
                className="w-full text-sm rounded-lg border-slate-300 h-20"
                value={data.body}
                onChange={e => setData('body', e.target.value)}
            ></textarea>
            <button
                type="submit"
                disabled={processing}
                className="w-full bg-slate-900 text-white font-bold py-2 rounded-lg text-sm hover:bg-slate-800 transition"
            >
                إرسال للعموم
            </button>
        </form>
    );
}

