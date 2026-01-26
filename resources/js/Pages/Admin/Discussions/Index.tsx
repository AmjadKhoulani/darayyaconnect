import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';

interface Props {
    auth: any;
    discussions: {
        data: any[];
        links: any[];
    };
}

export default function Index({ auth, discussions }: Props) {
    const updateStatus = (id: number, status: string) => {
        router.put(route('admin.discussions.update', id), {
            moderation_status: status
        });
    };

    const deleteDiscussion = (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذا الموضوع؟')) {
            router.delete(route('admin.discussions.destroy', id));
        }
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="text-xl font-bold leading-tight text-slate-800">إدارة النقاشات المجتمعية</h2>}
        >
            <Head title="إدارة النقاشات" />

            <div className="py-12" dir="rtl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                                    <tr>
                                        <th className="px-6 py-3">الموضوع</th>
                                        <th className="px-6 py-3">الكاتب</th>
                                        <th className="px-6 py-3">القسم</th>
                                        <th className="px-6 py-3">الحالة</th>
                                        <th className="px-6 py-3 text-left">العمليات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {discussions.data.map((discussion) => (
                                        <tr key={discussion.id} className="transition hover:bg-slate-50">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{discussion.title}</div>
                                                <div className="max-w-xs truncate text-xs text-slate-500">{discussion.body}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">{discussion.user?.name}</td>
                                            <td className="px-6 py-4">
                                                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold">{discussion.category}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`rounded-full px-2 py-1 text-xs font-bold ${discussion.moderation_status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                                        discussion.moderation_status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                                                            'bg-amber-100 text-amber-800'
                                                    }`}>
                                                    {discussion.moderation_status === 'approved' ? 'مقبول' :
                                                        discussion.moderation_status === 'rejected' ? 'مرفوض' : 'قيد الانتظار'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-left">
                                                <div className="flex justify-end gap-2">
                                                    {discussion.moderation_status !== 'approved' && (
                                                        <button onClick={() => updateStatus(discussion.id, 'approved')} className="text-emerald-600 hover:text-emerald-900 font-bold text-xs bg-emerald-50 px-2 py-1 rounded">موافقة</button>
                                                    )}
                                                    {discussion.moderation_status !== 'rejected' && (
                                                        <button onClick={() => updateStatus(discussion.id, 'rejected')} className="text-rose-600 hover:text-rose-900 font-bold text-xs bg-rose-50 px-2 py-1 rounded">رفض</button>
                                                    )}
                                                    <button onClick={() => deleteDiscussion(discussion.id)} className="text-slate-400 hover:text-slate-600 font-bold text-xs">حذف</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
