import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, reports }: any) {
    const { data: reportList, links } = reports;

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-bold leading-tight text-slate-800">
                    إدارة البلاغات
                </h2>
            }
        >
            <Head title="البلاغات" />

            <div className="py-12" dir="rtl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg border border-slate-200">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-800">
                                    كافة البلاغات الواردة
                                </h3>
                                <Link
                                    href={route('admin.reports.heatmap')}
                                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800"
                                >
                                    عرض الخريطة الحرارية 🗺️
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-right">
                                    <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500">
                                        <tr>
                                            <th className="px-6 py-3">العنوان / الوصف</th>
                                            <th className="px-6 py-3">النوع</th>
                                            <th className="px-6 py-3">الحالة</th>
                                            <th className="px-6 py-3">بواسطة</th>
                                            <th className="px-6 py-3">التاريخ</th>
                                            <th className="px-6 py-3">الإجراء</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {reportList.map((report: any) => (
                                            <tr key={report.id} className="hover:bg-slate-50 transition">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-800 text-sm max-w-xs truncate">
                                                        {report.description}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${report.category === 'electricity' ? 'bg-yellow-100 text-yellow-700' :
                                                        report.category === 'water' ? 'bg-blue-100 text-blue-700' :
                                                            report.category === 'sanitation' ? 'bg-orange-100 text-orange-700' :
                                                                'bg-slate-100 text-slate-700'
                                                        }`}>
                                                        {report.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${report.status === 'pending' ? 'bg-red-100 text-red-700' :
                                                        report.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-emerald-100 text-emerald-700'
                                                        }`}>
                                                        {report.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {report.user?.name || 'مجهول'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500">
                                                    {new Date(report.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link
                                                        href={route('admin.reports.show', report.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 font-bold text-sm"
                                                    >
                                                        عرض
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
