import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
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

export default function Dashboard({
    auth,
    stats,
    bottlenecks,
    recent_reports,
    active_alerts,
    infrastructure_points,
    users,
    services,
    departments,
}: Props) {
    // Safety Checks
    if (!stats)
        return (
            <div className="p-12 text-center font-bold text-red-500">
                ⚠️ Error: Stats data is missing.
            </div>
        );

    const safeRecentReports = Array.isArray(recent_reports)
        ? recent_reports
        : [];
    const safeActiveAlerts = Array.isArray(active_alerts) ? active_alerts : [];
    const safeInfrastructurePoints = Array.isArray(infrastructure_points)
        ? infrastructure_points
        : [];
    const safeUsers = Array.isArray(users) ? users : [];
    const safeServices = Array.isArray(services) ? services : [];

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-bold leading-tight text-slate-800">
                    غرفة العمليات المركزية
                </h2>
            }
        >
            <Head title="لوحة التحكم" />

            <div className="py-12" dir="rtl">
                <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
                    {/* 1. Services Health & Quick Stats */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                        {/* Services Status */}
                        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:col-span-4">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                                <span>🩺</span> حالة الخدمات العامة
                            </h3>
                            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                                {safeServices.map((service) => (
                                    <div
                                        key={service.id}
                                        className={`rounded-xl border p-4 ${service.status === 'on' ? 'border-emerald-100 bg-emerald-50' : service.status === 'warning' ? 'border-amber-100 bg-amber-50' : 'border-red-100 bg-red-50'} flex flex-col items-center text-center`}
                                    >
                                        <span className="mb-2 text-2xl">
                                            {service.icon}
                                        </span>
                                        <span className="font-bold text-slate-800">
                                            {service.name}
                                        </span>
                                        <span
                                            className={`mt-1 rounded-full px-2 py-0.5 text-xs font-bold ${service.status === 'on' ? 'bg-emerald-200 text-emerald-800' : service.status === 'warning' ? 'bg-amber-200 text-amber-800' : 'bg-red-200 text-red-800'}`}
                                        >
                                            {service.details}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* KPIS */}
                        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                            <div>
                                <p className="text-xs font-bold uppercase text-slate-500">
                                    بلاغات معلقة
                                </p>
                                <h3 className="mt-1 text-3xl font-black text-orange-500">
                                    {stats.reports_pending}
                                </h3>
                            </div>
                            <span className="text-3xl">📨</span>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                            <div>
                                <p className="text-xs font-bold uppercase text-slate-500">
                                    مشاريع جارية
                                </p>
                                <h3 className="mt-1 text-3xl font-black text-blue-500">
                                    {stats.projects_ongoing}
                                </h3>
                            </div>
                            <span className="text-3xl">🏗️</span>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                            <div>
                                <p className="text-xs font-bold uppercase text-slate-500">
                                    تنبيهات نشطة
                                </p>
                                <h3 className="mt-1 text-3xl font-black text-rose-500">
                                    {stats.active_alerts}
                                </h3>
                            </div>
                            <span className="text-3xl">🚨</span>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                            <div>
                                <p className="text-xs font-bold uppercase text-slate-500">
                                    مواطن مسجل
                                </p>
                                <h3 className="mt-1 text-3xl font-black text-emerald-500">
                                    {stats.citizens_count}
                                </h3>
                            </div>
                            <span className="text-3xl">👥</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* 2. User Management (Takes 2 Columns) */}
                        <div className="space-y-8 lg:col-span-2">
                            {/* Users Table */}
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center justify-between border-b border-slate-100 p-6">
                                    <h3 className="text-lg font-bold text-slate-800">
                                        👥 إدارة المستخدمين (أحدث 10)
                                    </h3>
                                    <button className="rounded px-3 py-1 text-xs font-bold text-emerald-600 transition hover:bg-emerald-50">
                                        عرض الكل
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-right">
                                        <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                                            <tr>
                                                <th className="px-6 py-3">
                                                    الاسم
                                                </th>
                                                <th className="px-6 py-3">
                                                    الدور
                                                </th>
                                                <th className="px-6 py-3">
                                                    القسم/المهنة
                                                </th>
                                                <th className="px-6 py-3">
                                                    الحالة
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {safeUsers.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    className="transition hover:bg-slate-50"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                                                                {user.name.charAt(
                                                                    0,
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-bold text-slate-900">
                                                                    {user.name}
                                                                </div>
                                                                <div className="text-xs text-slate-500">
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        {user.role ===
                                                        'admin' ? (
                                                            <span className="font-bold text-rose-600">
                                                                Admin
                                                            </span>
                                                        ) : user.role ===
                                                          'official' ? (
                                                            <span className="font-bold text-blue-600">
                                                                مسؤول
                                                            </span>
                                                        ) : user.role ===
                                                          'institution' ? (
                                                            <span className="font-bold text-purple-600">
                                                                مؤسسة
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-600">
                                                                مواطن
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">
                                                        {user.department_id
                                                            ? `قسم ${user.department_id}`
                                                            : user.profession ||
                                                              '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {user.is_verified_official ? (
                                                            <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-800">
                                                                موثق ✅
                                                            </span>
                                                        ) : (
                                                            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">
                                                                عادي
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="border-b border-slate-100 p-6">
                                    <h3 className="text-lg font-bold text-slate-800">
                                        📥 أحدث البلاغات الواردة
                                    </h3>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {safeRecentReports.map((report) => (
                                        <div
                                            key={report.id}
                                            className="flex items-start gap-4 p-4 transition hover:bg-slate-50"
                                        >
                                            <div
                                                className={`rounded-lg p-2 ${report.type === 'problem' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}
                                            >
                                                {report.type === 'problem'
                                                    ? '⚠️'
                                                    : '💡'}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <h4 className="mb-1 text-sm font-bold text-slate-800">
                                                        {report.description.substring(
                                                            0,
                                                            50,
                                                        )}
                                                        ...
                                                    </h4>
                                                    <span className="text-[10px] text-slate-400">
                                                        {new Date(
                                                            report.created_at,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                                                        {report.department_id
                                                            ? `موجه للقسم ${report.department_id}`
                                                            : 'عام'}
                                                    </span>
                                                    <span
                                                        className={`rounded px-2 py-0.5 text-xs font-bold ${report.status === 'received' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}
                                                    >
                                                        {report.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {safeRecentReports.length === 0 && (
                                        <div className="p-8 text-center text-slate-500">
                                            لا توجد بلاغات حديثة
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 3. Sidebar (Alerts, Infrastructure, etc) */}
                        <div className="space-y-6">
                            {/* Active Alerts */}
                            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-bold text-slate-800">
                                    🚨 التنبيهات النشطة
                                </h3>
                                <div className="space-y-3">
                                    {safeActiveAlerts.map((alert) => (
                                        <div
                                            key={alert.id}
                                            className="rounded border-r-4 border-rose-500 bg-rose-50 p-3 text-rose-900"
                                        >
                                            <h4 className="text-sm font-bold">
                                                {alert.title}
                                            </h4>
                                            <p className="mt-1 text-xs">
                                                {alert.body}
                                            </p>
                                        </div>
                                    ))}
                                    {safeActiveAlerts.length === 0 && (
                                        <p className="text-center text-sm text-slate-500">
                                            الوضع آمن، لا يوجد تنبيهات.
                                        </p>
                                    )}
                                </div>
                                <div className="mt-4 border-t border-slate-100 pt-4">
                                    <h4 className="mb-2 text-xs font-bold uppercase text-slate-500">
                                        إرسال تنبيه جديد
                                    </h4>
                                    <AlertForm />
                                </div>
                            </div>

                            {/* Infrastructure Manager */}
                            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-bold text-slate-800">
                                    🏗️ البنية التحتية
                                </h3>
                                <Link
                                    href={route('admin.infrastructure.water')}
                                    className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-3 text-center font-bold text-blue-700 transition hover:bg-blue-100"
                                >
                                    <span>💧</span> إدارة شبكة المياه
                                </Link>
                                <InfrastructureList
                                    initialPoints={safeInfrastructurePoints}
                                />
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
        duration_hours: 24,
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
                className="w-full rounded-lg border-slate-300 text-sm"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
            />
            <textarea
                placeholder="نص الرسالة..."
                className="h-20 w-full rounded-lg border-slate-300 text-sm"
                value={data.body}
                onChange={(e) => setData('body', e.target.value)}
            ></textarea>
            <button
                type="submit"
                disabled={processing}
                className="w-full rounded-lg bg-slate-900 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
            >
                إرسال للعموم
            </button>
        </form>
    );
}
