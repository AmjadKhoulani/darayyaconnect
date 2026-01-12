import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function OfficialDashboard({ auth, reports, service_logs, stats, managed_services }: any) {
    // Quick status update handler
    const updateStatus = (reportId: number, status: string) => {
        router.post(route('official.report.update', reportId), {
            status: status
        }, {
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">بوابة الموظفين 👮‍♂️ - {auth.user.name}</h2>}
        >
            <Head title="Official Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-6 rounded-lg shadow border-r-4 border-yellow-400">
                            <div className="text-gray-500 text-sm">بلاغات قيد الانتظار</div>
                            <div className="text-3xl font-bold">{stats.pending}</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow border-r-4 border-green-500">
                            <div className="text-gray-500 text-sm">تم الحل</div>
                            <div className="text-3xl font-bold">{stats.resolved}</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow border-r-4 border-blue-500">
                            <div className="text-gray-500 text-sm">سجلات الخدمة اليوم</div>
                            <div className="text-3xl font-bold">{stats.today_logs}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* MAIN COLUMN: Report Inbox */}
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="font-bold text-lg text-gray-700">📥 صندوق البلاغات الواردة</h3>
                            {reports.length === 0 ? (
                                <div className="bg-white p-8 rounded-lg text-center text-gray-400">
                                    لا توجد بلاغات جديدة. ممتاز! 🎉
                                </div>
                            ) : (
                                reports.map((report: any) => (
                                    <div key={report.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-gray-800">{report.type === 'water' ? 'مشكلة مياه' : report.type === 'electricity' ? 'عطل كهرباء' : 'بلاغ عام'}</h4>
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : report.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {report.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mt-2 text-sm">{report.description}</p>
                                            <div className="mt-3 text-xs text-gray-400 flex gap-4">
                                                <span>👤 {report.user?.name}</span>
                                                <span>📍 {report.neighborhood || 'غير محدد'}</span>
                                                <span>🕒 {new Date(report.created_at).toLocaleString()}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-row md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-r border-gray-100 pt-4 md:pt-0 md:pr-4">
                                            {report.status !== 'in_progress' && (
                                                <button
                                                    onClick={() => updateStatus(report.id, 'in_progress')}
                                                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition"
                                                >
                                                    استلام 🛠️
                                                </button>
                                            )}
                                            {report.status !== 'resolved' && (
                                                <button
                                                    onClick={() => updateStatus(report.id, 'resolved')}
                                                    className="px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-bold hover:bg-green-100 transition"
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
                            <h3 className="font-bold text-lg text-gray-700">نبض الخدمة (Live) 💓</h3>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 h-[600px] overflow-y-auto space-y-3">
                                {service_logs.map((log: any) => (
                                    <div key={log.id} className="bg-white p-3 rounded shadow-sm text-sm border-r-4 border-indigo-400">
                                        <div className="font-bold text-gray-800">{log.neighborhood}</div>
                                        <div className="text-gray-600 mt-1">
                                            {log.status === 'available' ? 'الخدمة وصلت ✅' : 'انقطعت ❌'}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-2 flex justify-between">
                                            <span>{log.user?.name}</span>
                                            <span>{new Date(log.created_at).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Service Control Panel (New) */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-slate-100 p-6 mt-6">
                        <h3 className="font-bold text-lg text-slate-800 mb-4">🎛️ لوحة تحكم الخدمات العامة</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(managed_services || []).map((service: any) => (
                                <div key={service.id} className="border rounded-xl p-4 bg-slate-50">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{service.icon || '🔧'}</span>
                                            <h4 className="font-bold text-slate-700">{service.name}</h4>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${service.status === 'on' ? 'bg-green-100 text-green-700' : service.status === 'off' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {service.status === 'on' ? 'فعال' : service.status === 'off' ? 'مقطوع' : 'تحذير'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-4 h-10">{service.details || 'لا يوجد تفاصيل إضافية'}</p>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => router.post(route('official.service.update'), { id: service.id, status: 'on', details: 'يعمل بشكل جيد' })}
                                            className={`flex-1 py-2 rounded text-xs font-bold ${service.status === 'on' ? 'bg-green-600 text-white' : 'bg-white border hover:bg-green-50'}`}
                                        >
                                            ✅ تشغيل
                                        </button>
                                        <button
                                            onClick={() => router.post(route('official.service.update'), { id: service.id, status: 'off', details: 'متوقف مؤقتاً' })}
                                            className={`flex-1 py-2 rounded text-xs font-bold ${service.status === 'off' ? 'bg-red-600 text-white' : 'bg-white border hover:bg-red-50'}`}
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
