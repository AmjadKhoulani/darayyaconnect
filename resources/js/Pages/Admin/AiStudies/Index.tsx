import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, studies }: any) {
    const handleDelete = (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذه الدراسة؟')) {
            router.delete(route('admin.ai-studies.destroy', id));
        }
    };

    return (
        <AdminLayout user={auth.user} header={<h2 className="font-bold text-xl text-slate-800">إدارة دراسات الذكاء الاصطناعي</h2>}>
            <Head title="إدارة الدراسات" />

            <div className="py-12 px-6 lg:px-8" dir="rtl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-700">قائمة المشاريع ({studies.length})</h3>
                    <Link
                        href={route('admin.ai-studies.create')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2"
                    >
                        <span>+</span> إضافة دراسة جديدة
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
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
                                <tr key={study.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 text-sm font-bold text-slate-400">{study.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${study.gradient} flex items-center justify-center text-xl text-white shadow-sm`}>
                                                {study.icon}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{study.title}</div>
                                                <div className="text-xs text-slate-500 truncate max-w-xs">{study.summary}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold bg-${study.color}-100 text-${study.color}-700`}>
                                            {study.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono text-slate-600">
                                        {study.economics?.investment || '-'}
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        <Link
                                            href={route('admin.ai-studies.edit', study.id)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            title="تعديل"
                                        >
                                            ✏️
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(study.id)}
                                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                            title="حذف"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {studies.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
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
