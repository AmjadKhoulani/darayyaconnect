import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    ArrowRight,
    Heart,
    Image as ImageIcon,
    MessageCircle,
    Reply,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Show({ id }: { id: string }) {
    const { auth } = usePage().props as any;
    const [discussion, setDiscussion] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [replyContent, setReplyContent] = useState('');
    const [replyImage, setReplyImage] = useState<File | null>(null);
    const [replyingTo, setReplyingTo] = useState<any>(null);

    useEffect(() => {
        fetchDiscussion();
    }, [id]);

    const fetchDiscussion = async () => {
        try {
            const res = await axios.get(`/api/portal/discussions/${id}`);
            setDiscussion(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    const handleReply = async (e: any) => {
        e.preventDefault();
        if (!replyContent.trim() && !replyImage) return;

        const formData = new FormData();
        formData.append('body', replyContent);
        if (replyImage) formData.append('image', replyImage);
        if (replyingTo) formData.append('parent_id', replyingTo.id);

        try {
            await axios.post(`/api/portal/discussions/${id}/reply`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setReplyContent('');
            setReplyImage(null);
            setReplyingTo(null);
            fetchDiscussion(); // Refresh
        } catch (err) {
            alert('فشل إضافة الرد');
        }
    };

    if (loading)
        return (
            <AuthenticatedLayout
                header={
                    <div className="h-6 w-32 animate-pulse rounded bg-slate-200"></div>
                }
            >
                <div className="py-12">
                    <div className="mx-auto max-w-7xl px-6">Loading...</div>
                </div>
            </AuthenticatedLayout>
        );

    if (!discussion) return <div>Not Found</div>;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <a
                        href="/community"
                        className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100"
                    >
                        <ArrowRight className="rotate-180" size={20} />
                    </a>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        النقاشات
                    </h2>
                </div>
            }
        >
            <Head title={discussion.title} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden border border-slate-200 bg-white shadow-sm sm:rounded-2xl">
                        <div className="p-6 sm:p-8">
                            {/* Header */}
                            <div className="mb-6 flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-lg font-bold text-slate-500">
                                    {discussion.user.name.charAt(0)}
                                </div>
                                <div>
                                    <h1 className="mb-1 text-2xl font-black text-slate-900">
                                        {discussion.title}
                                    </h1>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <span className="font-bold text-slate-700">
                                            {discussion.user.name}
                                        </span>
                                        <span>•</span>
                                        <span>
                                            {new Date(
                                                discussion.created_at,
                                            ).toLocaleDateString('ar-SY')}
                                        </span>
                                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
                                            {discussion.category}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="prose prose-slate mb-8 max-w-none">
                                <p className="whitespace-pre-wrap text-lg leading-relaxed text-slate-700">
                                    {discussion.body}
                                </p>
                                {discussion.image_url && (
                                    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                                        <img
                                            src={discussion.image_url}
                                            alt=""
                                            className="h-auto max-w-full"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-6 border-b border-t border-slate-100 py-6">

                                <div className="flex items-center gap-2 font-bold text-slate-500">
                                    <MessageCircle size={20} />
                                    <span>
                                        {discussion.replies_count} تعليق
                                    </span>
                                </div>
                            </div>

                            {/* Replies */}
                            <div className="mt-8 space-y-6">
                                <h3 className="text-lg font-bold text-slate-800">
                                    الردود
                                </h3>
                                {discussion.replies.map((reply: any) => (
                                    <ReplyItem
                                        key={reply.id}
                                        reply={reply}
                                        onReply={setReplyingTo}
                                    />
                                ))}
                            </div>

                            {/* Comment Form */}
                            <div className="mt-10 rounded-2xl border border-slate-100 bg-slate-50 p-6">
                                <h4 className="mb-4 flex items-center justify-between font-bold text-slate-700">
                                    {replyingTo ? (
                                        <span className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1 text-emerald-600">
                                            <Reply size={16} />
                                            الرد على {replyingTo.user.name}
                                            <button
                                                onClick={() =>
                                                    setReplyingTo(null)
                                                }
                                                className="hover:text-red-500"
                                            >
                                                <X size={16} />
                                            </button>
                                        </span>
                                    ) : (
                                        'أضف تعليقاً'
                                    )}
                                </h4>
                                <form onSubmit={handleReply}>
                                    <textarea
                                        value={replyContent}
                                        onChange={(e) =>
                                            setReplyContent(e.target.value)
                                        }
                                        className="mb-4 h-32 w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                                        placeholder="اكتب تعليقك هنا..."
                                        required
                                    />
                                    <div className="flex items-center justify-between">
                                        <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-slate-700">
                                            <div className="rounded-lg border border-slate-200 bg-white p-2">
                                                <ImageIcon size={20} />
                                            </div>
                                            <span>
                                                {replyImage
                                                    ? replyImage.name
                                                    : 'إرفاق صورة'}
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) =>
                                                    e.target.files &&
                                                    setReplyImage(
                                                        e.target.files[0],
                                                    )
                                                }
                                            />
                                        </label>

                                        <PrimaryButton>
                                            إرسال الرد
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function ReplyItem({ reply, onReply, depth = 0 }: any) {
    const isNested = depth > 0;
    return (
        <div className={`group ${isNested ? 'mr-12 mt-4' : ''}`}>
            <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 font-bold text-slate-500">
                    {reply.user.name.charAt(0)}
                </div>
                <div className="flex-1">
                    <div className="ro-tr-none rounded-2xl bg-slate-50 p-4">
                        <div className="mb-2 flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-900">
                                    {reply.user.name}
                                </span>
                                <span className="text-xs font-medium text-slate-400">
                                    منذ فترة
                                </span>
                            </div>
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                            {reply.body}
                        </p>
                        {reply.image_path && (
                            <div className="mt-3 max-w-sm overflow-hidden rounded-lg">
                                <img
                                    src={`/storage/${reply.image_path}`}
                                    alt=""
                                    className="h-auto w-full"
                                />
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => onReply(reply)}
                        className="mt-1 px-2 py-1 text-xs font-bold text-slate-500 opacity-0 transition-colors hover:text-emerald-600 group-hover:opacity-100"
                    >
                        رد
                    </button>

                    {/* Nested Replies */}
                    {reply.replies && reply.replies.length > 0 && (
                        <div className="mt-2 border-r-2 border-slate-100 pr-4">
                            {reply.replies.map((r: any) => (
                                <ReplyItem
                                    key={r.id}
                                    reply={r}
                                    onReply={onReply}
                                    depth={depth + 1}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
