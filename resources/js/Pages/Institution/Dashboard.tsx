import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useState } from 'react';

export default function Dashboard({ auth, directoryEntry, posts }: any) {
    const { data: statusData, setData: setStatusData, post: postStatus, processing: processingStatus } = useForm({
        status: directoryEntry.status
    });

    const { data: postData, setData: setPostData, post: postAnnouncement, processing: processingPost, reset: resetPost } = useForm({
        content: ''
    });

    const handleStatusUpdate = (newStatus: string) => {
        setStatusData('status', newStatus);
        // We need to trigger the post manually after state update, or just use a helper
        // Inertia useForm helper is quirky with immediate submits, so we'll do it cleanly:
        // Actually, let's just create a quick direct submission handler
        // But for consistency with Inertia hooks, we set data then post. Only problem is setState is async.
        // We'll use a local handler.
    };

    // Better way for buttons:
    const updateStatus = (s: string) => {
        postStatus(route('institution.status.update', { status: s }), {
            preserveScroll: true
        });
    }

    const submitPost = (e: React.FormEvent) => {
        e.preventDefault();
        postAnnouncement(route('institution.posts.store'), {
            onSuccess: () => resetPost()
        });
    };

    const getStatusColor = (s: string) => {
        if (s === 'open') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        if (s === 'closed') return 'bg-red-100 text-red-700 border-red-200';
        return 'bg-orange-100 text-orange-700 border-orange-200';
    };

    const getStatusText = (s: string) => {
        if (s === 'open') return 'متاح / مفتوح';
        if (s === 'closed') return 'مغلق / غير متاح';
        return 'مشغول / مزدحم';
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">لوحة إدارة المؤسسة 🕌🏫</h2>}
        >
            <Head title="إدارة المؤسسة" />

            <div className="py-12" dir="rtl">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Status Card */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-slate-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">{auth.user.name}</h3>
                                <p className="text-slate-500 text-sm">{directoryEntry.role}</p>
                            </div>
                            <div className={`px-4 py-2 rounded-full border text-sm font-bold flex items-center gap-2 ${getStatusColor(directoryEntry.status)}`}>
                                <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                                {getStatusText(directoryEntry.status)}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={() => updateStatus('open')}
                                className={`p-4 rounded-xl border-2 font-bold transition-all ${directoryEntry.status === 'open' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-500 hover:border-emerald-200'}`}
                            >
                                🟢 متاح / مفتوح
                            </button>
                            <button
                                onClick={() => updateStatus('busy')}
                                className={`p-4 rounded-xl border-2 font-bold transition-all ${directoryEntry.status === 'busy' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-100 text-slate-500 hover:border-orange-200'}`}
                            >
                                🟠 مزدحم / مشغول
                            </button>
                            <button
                                onClick={() => updateStatus('closed')}
                                className={`p-4 rounded-xl border-2 font-bold transition-all ${directoryEntry.status === 'closed' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-100 text-slate-500 hover:border-red-200'}`}
                            >
                                🔴 مغلق
                            </button>
                        </div>
                    </div>

                    {/* Announcement Card */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-slate-100 p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">📢 نشر تعميم أو خبر</h3>
                        <form onSubmit={submitPost}>
                            <textarea
                                className="w-full border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 mb-4 h-32"
                                placeholder="اكتب خبراً جديداً ليظهر للمجتمع (مثلاً: أوقات الدوام في رمضان، حملة تلقيح، مجلس عزاء...)"
                                value={postData.content}
                                onChange={e => setPostData('content', e.target.value)}
                            ></textarea>
                            <div className="flex justify-end">
                                <PrimaryButton disabled={processingPost} className="bg-indigo-600 hover:bg-indigo-700">
                                    نشر الخبر
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Recent History */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-slate-100 p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">📜 المنشورات السابقة</h3>
                        <div className="space-y-4">
                            {posts.map((post: any) => (
                                <div key={post.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                                    <p className="text-slate-700 text-sm">{post.content}</p>
                                    <span className="text-xs text-slate-400 whitespace-nowrap mr-4">
                                        {new Date(post.created_at).toLocaleDateString('ar-SY')}
                                    </span>
                                </div>
                            ))}
                            {posts.length === 0 && <p className="text-slate-400 text-sm text-center">لا يوجد منشورات سابقة.</p>}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
