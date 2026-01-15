import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, studies }: any) {
    const handleDelete = (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذه الدراسة؟')) {
            router.delete(route('admin.ai-studies.destroy', id));
        }
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-bold text-slate-800">
                    إدارة دراسات الذكاء الاصطناعي
                </h2>
            }
        >
            <Head title="إدارة الدراسات" />

            <div className="px-6 py-12 lg:px-8" dir="rtl">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-700">
                        قائمة المشاريع ({studies.length})
                    </h3>
                    <Link
                        href={route('admin.ai-studies.create')}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700"
                    >
                        <span>+</span> إضافة دراسة جديدة
                    </Link>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-right">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                            <tr>
                                <th className="px-6 py-4">#</th>
                                <th className="px-6 py-4">العنوان</th>
                                <th className="px-6 py-4">التصنيف</th>
                                <th className="px-6 py-4">التكلفة المتوقعة</th>
                                <th className="px-6 py-4">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {studies.map((study: any) => (
                                <tr
                                    key={study.id}
                                    className="transition hover:bg-slate-50"
                                >
                                    <td className="px-6 py-4 text-sm font-bold text-slate-400">
                                        {study.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`h-10 w-10 rounded-lg bg-gradient-to-br ${study.gradient} flex items-center justify-center text-xl text-white shadow-sm`}
                                            >
                                                {study.icon}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">
                                                    {study.title}
                                                </div>
                                                <div className="max-w-xs truncate text-xs text-slate-500">
                                                    {study.summary}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-bold bg-${study.color}-100 text-${study.color}-700`}
                                        >
                                            {study.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm text-slate-600">
                                        {study.economics?.investment || '-'}
                                    </td>
                                    <td className="flex items-center gap-2 px-6 py-4">
                                        <Link
                                            href={route(
                                                'admin.ai-studies.edit',
                                                study.id,
                                            )}
                                            className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                                            title="تعديل"
                                        >
                                            ✏️
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDelete(study.id)
                                            }
                                            className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50"
                                            title="حذف"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {studies.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center text-slate-500"
                                    >
                                        لا توجد دراسات حالياً. أضف دراسة جديدة!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
