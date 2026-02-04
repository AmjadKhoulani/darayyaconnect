import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { MessageCircle, Heart, Share2, ArrowRight, Image as ImageIcon, Reply, ChevronDown } from 'lucide-react';
import { showToast } from '../components/Toast';
import SkeletonLoader from '../components/SkeletonLoader';
import LazyImage from '../components/LazyImage';

export default function DiscussionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [discussion, setDiscussion] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [replyContent, setReplyContent] = useState('');
    const [replyImage, setReplyImage] = useState<File | null>(null);
    const [replyingTo, setReplyingTo] = useState<any>(null); // For nested replies

    useEffect(() => {
        fetchDiscussion();
    }, [id]);

    const fetchDiscussion = async () => {
        try {
            const res = await api.get(`/portal/discussions/${id}`);
            setDiscussion(res.data);
        } catch (err) {
            console.error(err);
            showToast('خطأ في تحميل النقاش', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async () => {
        try {
            const res = await api.post(`/portal/discussions/${id}/vote`);
            if (discussion) {
                setDiscussion({
                    ...discussion,
                    votes_count: res.data.votes_count,
                    current_user_vote: res.data.status === 'voted'
                });
            }
        } catch (err) {
            showToast('يجب تسجيل الدخول للتفاعل', 'error');
        }
    };

    const handleReply = async () => {
        if (!replyContent.trim() && !replyImage) return;

        const formData = new FormData();
        formData.append('body', replyContent);
        if (replyImage) formData.append('image', replyImage);
        if (replyingTo) formData.append('parent_id', replyingTo.id);

        try {
            await api.post(`/portal/discussions/${id}/reply`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            showToast('تم إضافة ردك بنجاح', 'success');
            setReplyContent('');
            setReplyImage(null);
            setReplyingTo(null);
            fetchDiscussion(); // Refresh to see new reply
        } catch (err) {
            showToast('فشل إضافة الرد', 'error');
        }
    };

    const handleImageSelect = (e: any) => {
        if (e.target.files && e.target.files[0]) {
            setReplyImage(e.target.files[0]);
        }
    };

    if (loading) return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-300"><SkeletonLoader type="card" /></div>;
    if (!discussion) return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 text-center text-slate-500 dark:text-slate-400">النقاش غير موجود</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 transition-colors duration-300" dir="rtl">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-3 transition-colors duration-300">
                <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                    <ArrowRight size={20} className="rotate-180" />
                </button>
                <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-1 flex-1">{discussion.title}</h1>
            </header>

            <main className="pt-20 px-4 space-y-4">
                {/* Original Post */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-premium border border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold border border-slate-100 dark:border-slate-700">
                            {discussion.user.name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100">{discussion.user.name}</div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500">منذ فترة</div>
                        </div>
                        <span className="mr-auto bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg text-[10px] text-slate-500 dark:text-slate-400 font-bold">{discussion.category}</span>
                    </div>

                    <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-3 leading-snug">{discussion.title}</h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm mb-4 whitespace-pre-wrap">{discussion.body}</p>

                    {discussion.image_url && (
                        <div className="mb-4 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                            <LazyImage src={discussion.image_url} alt="Discussion" className="w-full h-auto" />
                        </div>
                    )}

                    <div className="flex items-center gap-4 pt-4 border-t border-slate-50 dark:border-slate-700/50">
                        <button
                            onClick={handleVote}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${discussion.current_user_vote ? 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                        >
                            <Heart size={18} className={discussion.current_user_vote ? 'fill-current' : ''} />
                            <span className="text-xs font-bold">{discussion.votes_count}</span>
                        </button>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <MessageCircle size={18} />
                            <span className="text-xs font-bold">{discussion.replies_count} تعليق</span>
                        </div>
                        <button className="mr-auto text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>

                {/* Replies List */}
                <div className="space-y-4 pb-20">
                    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 px-2">الردود ({discussion.replies_count})</h3>
                    {discussion.replies.map((reply: any) => (
                        <ReplyItem key={reply.id} reply={reply} onReply={(r) => setReplyingTo(r)} />
                    ))}
                </div>
            </main>

            {/* Reply Input */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 z-50 transition-colors duration-300">
                {replyingTo && (
                    <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-2 rounded-lg mb-2 text-xs text-slate-700 dark:text-slate-300">
                        <span>الرد على <b>{replyingTo.user.name}</b></span>
                        <button onClick={() => setReplyingTo(null)} className="text-slate-500 dark:text-slate-400 hover:text-red-500"><ChevronDown size={14} /></button>
                    </div>
                )}

                <div className="flex items-end gap-2">
                    <label className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-100 dark:border-slate-800">
                        <ImageIcon size={20} />
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                    </label>
                    <div className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-800 focus-within:border-emerald-500 dark:focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all">
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder={replyingTo ? "اكتب ردك هنا..." : "شارك برأيك..."}
                            className="w-full bg-transparent border-none p-0 text-sm text-slate-800 dark:text-slate-200 focus:ring-0 resize-none max-h-24 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            rows={1}
                        />
                        {replyImage && (
                            <div className="mt-2 relative inline-block">
                                <img src={URL.createObjectURL(replyImage)} className="h-12 w-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
                                <button onClick={() => setReplyImage(null)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><ChevronDown size={10} /></button>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleReply}
                        disabled={!replyContent.trim() && !replyImage}
                        className="p-3 bg-emerald-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                    >
                        <ArrowRight size={20} className="rotate-180" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// Recursive Reply Component
function ReplyItem({ reply, onReply, depth = 0 }: { reply: any, onReply: (r: any) => void, depth?: number }) {
    const isNested = depth > 0;
    return (
        <div className={`flex gap-3 ${isNested ? 'mr-8 mt-2 relative' : ''}`}>
            {isNested && <div className="absolute -right-6 top-4 w-4 h-px bg-slate-200 dark:bg-slate-700"></div>}

            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-xs shrink-0 border border-slate-100 dark:border-slate-700">
                {reply.user.name.charAt(0)}
            </div>

            <div className="flex-1 bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tr-none border border-slate-100 dark:border-slate-700/50 shadow-sm">
                <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-xs">{reply.user.name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">منذ فترة</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[13px] leading-relaxed mb-2">{reply.body}</p>

                {reply.image_path && (
                    <div className="mb-2 rounded-lg overflow-hidden max-w-[200px] border border-slate-100 dark:border-slate-700">
                        <LazyImage src={reply.image_url || `/storage/${reply.image_path}`} alt="Reply" className="w-full h-auto" />
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <button onClick={() => onReply(reply)} className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                        <Reply size={12} /> رد
                    </button>
                </div>

                {/* Nested Replies */}
                {reply.replies && reply.replies.length > 0 && (
                    <div className="mt-2 space-y-2 border-r-2 border-slate-100 dark:border-slate-700 pr-2">
                        {reply.replies.map((subReply: any) => (
                            <ReplyItem key={subReply.id} reply={subReply} onReply={onReply} depth={depth + 1} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
