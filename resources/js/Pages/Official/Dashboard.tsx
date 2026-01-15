import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function OfficialDashboard({
    auth,
    reports,
    service_logs,
    stats,
    managed_services,
}: any) {
    // Quick status update handler
    const updateStatus = (reportId: number, status: string) => {
        router.post(
            route('official.report.update', reportId),
            {
                status: status,
            },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    بوابة الموظفين 👮‍♂️ - {auth.user.name}
                </h2>
            }
        >
            <Head title="Official Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-lg border-r-4 border-yellow-400 bg-white p-6 shadow">
                            <div className="text-sm text-gray-500">
                                بلاغات قيد الانتظار
                            </div>
                            <div className="text-3xl font-bold">
                                {stats.pending}
                            </div>
                        </div>
                        <div className="rounded-lg border-r-4 border-green-500 bg-white p-6 shadow">
                            <div className="text-sm text-gray-500">تم الحل</div>
                            <div className="text-3xl font-bold">
                                {stats.resolved}
                            </div>
                        </div>
                        <div className="rounded-lg border-r-4 border-blue-500 bg-white p-6 shadow">
                            <div className="text-sm text-gray-500">
                                سجلات الخدمة اليوم
                            </div>
                            <div className="text-3xl font-bold">
                                {stats.today_logs}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* MAIN COLUMN: Report Inbox */}
                        <div className="space-y-4 lg:col-span-2">
                            <h3 className="text-lg font-bold text-gray-700">
                                📥 صندوق البلاغات الواردة
                            </h3>
                            {reports.length === 0 ? (
                                <div className="rounded-lg bg-white p-8 text-center text-gray-400">
                                    لا توجد بلاغات جديدة. ممتاز! 🎉
                                </div>
                            ) : (
                                reports.map((report: any) => (
                                    <div
                                        key={report.id}
                                        className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm md:flex-row"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <h4 className="font-bold text-gray-800">
                                                    {report.type === 'water'
                                                        ? 'مشكلة مياه'
                                                        : report.type ===
                                                            'electricity'
                                                          ? 'عطل كهرباء'
                                                          : 'بلاغ عام'}
                                                </h4>
                                                <span
                                                    className={`rounded px-2 py-1 text-xs font-bold ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : report.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}
                                                >
                                                    {report.status}
                                                </span>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-600">
                                                {report.description}
                                            </p>
                                            <div className="mt-3 flex gap-4 text-xs text-gray-400">
                                                <span>
                                                    👤 {report.user?.name}
                                                </span>
                                                <span>
                                                    📍{' '}
                                                    {report.neighborhood ||
                                                        'غير محدد'}
                                                </span>
                                                <span>
                                                    🕒{' '}
                                                    {new Date(
                                                        report.created_at,
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-row justify-center gap-2 border-t border-gray-100 pt-4 md:flex-col md:border-r md:border-t-0 md:pr-4 md:pt-0">
                                            {report.status !==
                                                'in_progress' && (
                                                <button
                                                    onClick={() =>
                                                        updateStatus(
                                                            report.id,
                                                            'in_progress',
                                                        )
                                                    }
                                                    className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600 transition hover:bg-blue-100"
                                                >
                                                    استلام 🛠️
                                                </button>
                                            )}
                                            {report.status !== 'resolved' && (
                                                <button
                                                    onClick={() =>
                                                        updateStatus(
                                                            report.id,
                                                            'resolved',
                                                        )
                                                    }
                                                    className="rounded-lg bg-green-50 px-4 py-2 text-sm font-bold text-green-600 transition hover:bg-green-100"
                                                >
                                                    تم الحل ✅
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* SIDEBAR: Pulse Feed */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-700">
                                نبض الخدمة (Live) 💓
                            </h3>
                            <div className="h-[600px] space-y-3 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-4">
                                {service_logs.map((log: any) => (
                                    <div
                                        key={log.id}
                                        className="rounded border-r-4 border-indigo-400 bg-white p-3 text-sm shadow-sm"
                                    >
                                        <div className="font-bold text-gray-800">
                                            {log.neighborhood}
                                        </div>
                                        <div className="mt-1 text-gray-600">
                                            {log.status === 'available'
                                                ? 'الخدمة وصلت ✅'
                                                : 'انقطعت ❌'}
                                        </div>
                                        <div className="mt-2 flex justify-between text-xs text-gray-400">
                                            <span>{log.user?.name}</span>
                                            <span>
                                                {new Date(
                                                    log.created_at,
                                                ).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Service Control Panel (New) */}
                    <div className="mt-6 overflow-hidden border border-slate-100 bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="mb-4 text-lg font-bold text-slate-800">
                            🎛️ لوحة تحكم الخدمات العامة
                        </h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {(managed_services || []).map((service: any) => (
                                <div
                                    key={service.id}
                                    className="rounded-xl border bg-slate-50 p-4"
                                >
                                    <div className="mb-2 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">
                                                {service.icon || '🔧'}
                                            </span>
                                            <h4 className="font-bold text-slate-700">
                                                {service.name}
                                            </h4>
                                        </div>
                                        <span
                                            className={`rounded px-2 py-1 text-xs font-bold ${service.status === 'on' ? 'bg-green-100 text-green-700' : service.status === 'off' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}
                                        >
                                            {service.status === 'on'
                                                ? 'فعال'
                                                : service.status === 'off'
                                                  ? 'مقطوع'
                                                  : 'تحذير'}
                                        </span>
                                    </div>
                                    <p className="mb-4 h-10 text-xs text-slate-500">
                                        {service.details ||
                                            'لا يوجد تفاصيل إضافية'}
                                    </p>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                router.post(
                                                    route(
                                                        'official.service.update',
                                                    ),
                                                    {
                                                        id: service.id,
                                                        status: 'on',
                                                        details:
                                                            'يعمل بشكل جيد',
                                                    },
                                                )
                                            }
                                            className={`flex-1 rounded py-2 text-xs font-bold ${service.status === 'on' ? 'bg-green-600 text-white' : 'border bg-white hover:bg-green-50'}`}
                                        >
                                            ✅ تشغيل
                                        </button>
                                        <button
                                            onClick={() =>
                                                router.post(
                                                    route(
                                                        'official.service.update',
                                                    ),
                                                    {
                                                        id: service.id,
                                                        status: 'off',
                                                        details: 'متوقف مؤقتاً',
                                                    },
                                                )
                                            }
                                            className={`flex-1 rounded py-2 text-xs font-bold ${service.status === 'off' ? 'bg-red-600 text-white' : 'border bg-white hover:bg-red-50'}`}
                                        >
                                            ❌ إيقاف
                                        </button>
                                    </div>
                                    {/* Simplified detail update via prompt could be added here */}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
