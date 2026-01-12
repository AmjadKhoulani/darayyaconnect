import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, Heart, Share2, Image as ImageIcon, Reply, ChevronDown, ArrowRight, X } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';

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

    const handleVote = async () => {
        if (!auth.user) return alert('يرجى تسجيل الدخول');

        // Optimistic
        setDiscussion((prev: any) => ({
            ...prev,
            votes_count: prev.current_user_vote ? prev.votes_count - 1 : prev.votes_count + 1,
            current_user_vote: !prev.current_user_vote
        }));

        try {
            await axios.post(`/api/portal/discussions/${id}/vote`);
        } catch (err) {
            // Revert
            fetchDiscussion();
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
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setReplyContent('');
            setReplyImage(null);
            setReplyingTo(null);
            fetchDiscussion(); // Refresh
        } catch (err) {
            alert('فشل إضافة الرد');
        }
    };

    if (loading) return (
        <AuthenticatedLayout header={<div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>}>
            <div className="py-12"><div className="max-w-7xl mx-auto px-6">Loading...</div></div>
        </AuthenticatedLayout>
    );

    if (!discussion) return <div>Not Found</div>;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <a href="/community" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <ArrowRight className="rotate-180" size={20} />
                    </a>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">النقاشات</h2>
                </div>
            }
        >
            <Head title={discussion.title} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-slate-200">
                        <div className="p-6 sm:p-8">
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg border border-slate-200">
                                    {discussion.user.name.charAt(0)}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black text-slate-900 mb-1">{discussion.title}</h1>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <span className="font-bold text-slate-700">{discussion.user.name}</span>
                                        <span>•</span>
                                        <span>{new Date(discussion.created_at).toLocaleDateString('ar-SY')}</span>
                                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-xs font-bold">
                                            {discussion.category}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="prose prose-slate max-w-none mb-8">
                                <p className="text-lg leading-relaxed text-slate-700 whitespace-pre-wrap">
                                    {discussion.body}
                                </p>
                                {discussion.image_url && (
                                    <div className="mt-6 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                                        <img src={discussion.image_url} alt="" className="max-w-full h-auto" />
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-6 py-6 border-t border-b border-slate-100">
                                <button
                                    onClick={handleVote}
                                    className={`flex items-center gap-2 text-base font-bold transition-all ${discussion.current_user_vote ? 'text-red-500 bg-red-50 px-4 py-2 rounded-xl' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Heart size={20} className={discussion.current_user_vote ? 'fill-current' : ''} />
                                    <span>{discussion.votes_count} تأييد</span>
                                </button>
                                <div className="flex items-center gap-2 text-slate-500 font-bold">
                                    <MessageCircle size={20} />
                                    <span>{discussion.replies_count} تعليق</span>
                                </div>
                            </div>

                            {/* Replies */}
                            <div className="mt-8 space-y-6">
                                <h3 className="text-lg font-bold text-slate-800">الردود</h3>
                                {discussion.replies.map((reply: any) => (
                                    <ReplyItem key={reply.id} reply={reply} onReply={setReplyingTo} />
                                ))}
                            </div>

                            {/* Comment Form */}
                            <div className="mt-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <h4 className="font-bold text-slate-700 mb-4 flex justify-between items-center">
                                    {replyingTo ? (
                                        <span className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                                            <Reply size={16} />
                                            الرد على {replyingTo.user.name}
                                            <button onClick={() => setReplyingTo(null)} className="hover:text-red-500"><X size={16} /></button>
                                        </span>
                                    ) : 'أضف تعليقاً'}
                                </h4>
                                <form onSubmit={handleReply}>
                                    <textarea
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        className="w-full border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500 h-32 mb-4"
                                        placeholder="اكتب تعليقك هنا..."
                                        required
                                    />
                                    <div className="flex justify-between items-center">
                                        <label className="flex items-center gap-2 text-sm font-bold text-slate-500 cursor-pointer hover:text-slate-700 transition-colors">
                                            <div className="p-2 bg-white border border-slate-200 rounded-lg">
                                                <ImageIcon size={20} />
                                            </div>
                                            <span>{replyImage ? replyImage.name : 'إرفاق صورة'}</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && setReplyImage(e.target.files[0])} />
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
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200 shrink-0">
                    {reply.user.name.charAt(0)}
                </div>
                <div className="flex-1">
                    <div className="bg-slate-50 p-4 rounded-2xl ro-tr-none">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">{reply.user.name}</span>
                                <span className="text-xs text-slate-400 font-medium">منذ فترة</span>
                            </div>
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{reply.body}</p>
                        {reply.image_path && (
                            <div className="mt-3 rounded-lg overflow-hidden max-w-sm">
                                <img src={`/storage/${reply.image_path}`} alt="" className="w-full h-auto" />
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => onReply(reply)}
                        className="mt-1 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors px-2 py-1 opacity-0 group-hover:opacity-100"
                    >
                        رد
                    </button>

                    {/* Nested Replies */}
                    {reply.replies && reply.replies.length > 0 && (
                        <div className="border-r-2 border-slate-100 pr-4 mt-2">
                            {reply.replies.map((r: any) => (
                                <ReplyItem key={r.id} reply={r} onReply={onReply} depth={depth + 1} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
