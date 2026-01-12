import { useState, useEffect, useRef } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import axios from 'axios';
import { MessageCircle, Heart, Share2, Image as ImageIcon, X, ArrowUp, Send, MessageSquare } from 'lucide-react';

interface Discussion {
    id: number;
    title: string;
    body: string;
    category: string;
    user: { id: number; name: string };
    created_at: string;
    views: number;
    votes_count: number;
    replies_count: number;
    current_user_vote: boolean;
    image_path?: string;
    image_url?: string; // Accessor from backend
    replies?: any[];
}

export default function CommunityForum() {
    const { auth } = usePage().props as any;
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [activeTab, setActiveTab] = useState('all');

    // Create Modal
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newTopic, setNewTopic] = useState({ title: '', body: '', category: 'general' });
    const [newImage, setNewImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
    const [replyBody, setReplyBody] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (selectedDiscussion) scrollToBottom();
    }, [selectedDiscussion?.replies]);

    useEffect(() => {
        fetchDiscussions();
    }, []);

    const fetchDiscussions = () => {
        axios.get('/api/portal/discussions')
            .then(res => setDiscussions(res.data))
            .catch(e => console.error("Failed to fetch discussions", e));
    };

    const handleVote = async (id: number, e: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (!auth.user) return alert('يرجى تسجيل الدخول للتصويت');

        // Optimistic Update
        setDiscussions(prev => prev.map(d => {
            if (d.id === id) {
                return {
                    ...d,
                    votes_count: d.current_user_vote ? d.votes_count - 1 : d.votes_count + 1,
                    current_user_vote: !d.current_user_vote
                };
            }
            return d;
        }));

        try {
            await axios.post(`/api/portal/discussions/${id}/vote`);
        } catch (error) {
            console.error(error);
            fetchDiscussions(); // Revert on error
        }
    };

    const handleCreateTopic = (e: any) => {
        e.preventDefault();
        setLoading(true);

        router.post('/community', {
            title: newTopic.title,
            body: newTopic.body,
            category: newTopic.category,
            image: newImage,
        }, {
            forceFormData: true,
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setNewTopic({ title: '', body: '', category: 'general' });
                setNewImage(null);
                fetchDiscussions(); // Refresh the list
                setLoading(false);
            },
            onError: (errors) => {
                console.error(errors);
                alert('فشل النشر: ' + Object.values(errors).join(', '));
                setLoading(false);
            }
        });
    };

    const categories = [
        { id: 'general', name: 'عام', color: 'slate' },
        { id: 'services', name: 'خدمات', color: 'blue' },
        { id: 'suggestions', name: 'اقتراحات', color: 'amber' },
        { id: 'complaints', name: 'شكاوى', color: 'red' },
        { id: 'help', name: 'مساعدة', color: 'emerald' },
    ];

    const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || id;
    const getCategoryColor = (id: string) => categories.find(c => c.id === id)?.color || 'slate';




    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDiscussion) return;
        if (!replyBody.trim()) return;

        setLoading(true);

        try {
            const res = await axios.post(`/api/portal/discussions/${selectedDiscussion.id}/reply`, {
                body: replyBody
            });
            const newReply = res.data;

            const updatedDiscussion = {
                ...selectedDiscussion,
                replies_count: selectedDiscussion.replies_count + 1,
                replies: [...(selectedDiscussion.replies || []), newReply]
            };
            setSelectedDiscussion(updatedDiscussion);
            setReplyBody('');
            fetchDiscussions();
        } catch (e) {
            console.error(e);
            alert('فشل إضافة الرد. يرجى المحاولة مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    const openDiscussion = async (discussion: Discussion) => {
        setSelectedDiscussion(discussion);
        try {
            const res = await axios.get(`/api/portal/discussions/${discussion.id}`);
            setSelectedDiscussion(res.data);
        } catch (e) {
            console.error("Failed to load replies", e);
        }
    };

    const filtered = activeTab === 'all' ? discussions : discussions.filter(d => d.category === activeTab);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mt-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <span>💬</span> حوار المجتمع
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">مساحة للنقاش الحر والبناء (بدون لايكات! فقط دعم)</p>
                </div>
                {auth.user ? (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-slate-800 transition"
                    >
                        + موضوع جديد
                    </button>
                ) : (
                    <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">سجل للدخول للمشاركة</span>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 mb-4 overflow-x-auto">
                {['all', 'social', 'services', 'suggestions', 'complaints'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab
                            ? 'border-emerald-500 text-emerald-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {tab === 'all' ? 'الكل' :
                            tab === 'social' ? 'اجتماعي' :
                                tab === 'services' ? 'خدمي' :
                                    tab === 'suggestions' ? 'اقتراحات' : 'شكاوى'}
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                {filtered.map((topic) => (
                    <div key={topic.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                        <Link href={`/community/${topic.id}`} className="block">
                            {topic.image_url && (
                                <div className="h-48 w-full bg-slate-50 relative overflow-hidden">
                                    <img
                                        src={topic.image_url}
                                        alt={topic.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold shadow-sm backdrop-blur-md ${topic.category === 'general' ? 'bg-slate-900/10 text-slate-800 bg-white/90' :
                                            topic.category === 'tech' ? 'bg-blue-900/10 text-blue-800 bg-white/90' :
                                                topic.category === 'events' ? 'bg-purple-900/10 text-purple-800 bg-white/90' :
                                                    'bg-emerald-900/10 text-emerald-800 bg-white/90'
                                            }`}>
                                            {getCategoryName(topic.category)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </Link>

                        <div className="p-5">
                            {!topic.image_url && (
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getCategoryColor(topic.category)}`}>
                                        {getCategoryName(topic.category)}
                                    </span>
                                    <span className="text-slate-400 text-xs">{new Date(topic.created_at).toLocaleDateString('ar-SY')}</span>
                                </div>
                            )}

                            <Link href={`/community/${topic.id}`} className="block group-hover:text-emerald-600 transition-colors">
                                <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">{topic.title}</h3>
                            </Link>

                            <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">{topic.body}</p>

                            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                        {topic.user.name[0]}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-700">{topic.user.name}</span>
                                        {topic.image_url && <span className="text-[10px] text-slate-400">{new Date(topic.created_at).toLocaleDateString('ar-SY')}</span>}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => { e.preventDefault(); handleVote(topic.id, e); }}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${topic.current_user_vote
                                            ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200'
                                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                            }`}
                                    >
                                        <ArrowUp size={14} className={topic.current_user_vote ? 'fill-current' : ''} />
                                        <span>{topic.votes_count}</span>
                                    </button>

                                    <Link
                                        href={`/community/${topic.id}`}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-500 text-xs font-bold hover:bg-slate-100 transition-all"
                                    >
                                        <MessageSquare size={14} />
                                        <span>{topic.replies_count}</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Topic Modal */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                <div className="p-6 text-right bg-white rounded-2xl" dir="rtl">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                        <h2 className="text-xl font-bold text-slate-800">✨ طرح موضوع جديد</h2>
                        <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-red-500 transition">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleCreateTopic} className="space-y-5">
                        {/* Title */}
                        <div>
                            <InputLabel value="عنوان الموضوع" className="text-slate-700 font-bold mb-2 text-sm" />
                            <TextInput
                                className="w-full border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 font-medium"
                                value={newTopic.title}
                                onChange={e => setNewTopic({ ...newTopic, title: e.target.value })}
                                placeholder="اكتب عنواناً جذاباً لموضوعك..."
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <InputLabel value="التصنيف" className="text-slate-700 font-bold mb-2 text-sm" />
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {categories.filter(c => c.id !== 'all').map(cat => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setNewTopic({ ...newTopic, category: cat.id })}
                                        className={`py-2 px-3 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${newTopic.category === cat.id
                                            ? `bg-${cat.color}-50 border-${cat.color}-500 text-${cat.color}-700 ring-1 ring-${cat.color}-500`
                                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                            }`}
                                    >
                                        <span className={`w-2 h-2 rounded-full bg-${cat.color}-500`}></span>
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div>
                            <InputLabel value="تفاصيل الموضوع" className="text-slate-700 font-bold mb-2 text-sm" />
                            <textarea
                                className="w-full border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 font-medium h-40 resize-none"
                                value={newTopic.body}
                                onChange={e => setNewTopic({ ...newTopic, body: e.target.value })}
                                placeholder="شاركنا أفكارك، استفساراتك، أو مقترحاتك..."
                                required
                            ></textarea>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <InputLabel value="إرفاق صورة (اختياري)" className="text-slate-700 font-bold mb-2 text-sm" />
                            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${newImage ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50 bg-white'}`}>
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {newImage ? (
                                        <div className="text-center">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2 mx-auto">
                                                <ImageIcon size={20} />
                                            </div>
                                            <p className="text-sm text-emerald-600 font-bold">{newImage.name}</p>
                                            <p className="text-xs text-emerald-500">تم اختيار الصورة بنجاح</p>
                                        </div>
                                    ) : (
                                        <>
                                            <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                                            <p className="text-sm text-slate-500"><span className="font-bold text-emerald-600">اضغط للرفع</span> أو اسحب وأفلت</p>
                                            <p className="text-xs text-slate-400">PNG, JPG, GIF up to 5MB</p>
                                        </>
                                    )}
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && setNewImage(e.target.files[0])} />
                            </label>
                            {newImage && (
                                <button type="button" onClick={() => setNewImage(null)} className="text-red-500 text-xs font-bold mt-2 hover:underline">
                                    إزالة الصورة ❌
                                </button>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <SecondaryButton onClick={() => setIsCreateModalOpen(false)}>إلغاء</SecondaryButton>
                            <button
                                disabled={loading}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        <span>جاري النشر...</span>
                                    </>
                                ) : (
                                    'نشر الموضوع'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* View Discussion & Conversation Modal */}
            <Modal show={!!selectedDiscussion} onClose={() => setSelectedDiscussion(null)} maxWidth="2xl">
                {selectedDiscussion && (
                    <div className="flex flex-col h-[80vh] bg-white rounded-lg overflow-hidden" dir="rtl">
                        {/* Header */}
                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex-shrink-0 flex justify-between items-start">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    {selectedDiscussion.title}
                                    <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-500 font-normal">
                                        {selectedDiscussion.category}
                                    </span>
                                </h2>
                                <div className="flex gap-2 text-xs text-slate-500 mt-1">
                                    <span>بواسطة {selectedDiscussion.user.name}</span>
                                    <span>• {new Date(selectedDiscussion.created_at).toLocaleDateString('ar-SY')}</span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedDiscussion(null)} className="text-slate-400 hover:text-slate-600 transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
                            {/* Original Post as the First Message */}
                            <div className="flex justify-start">
                                <div className="bg-white border border-slate-200 rounded-2xl p-4 max-w-[85%] shadow-sm rounded-tr-none">
                                    <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-2">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                            {selectedDiscussion.user.name[0]}
                                        </div>
                                        <span className="font-bold text-slate-700 text-xs">{selectedDiscussion.user.name}</span>
                                    </div>
                                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                                        {selectedDiscussion.body}
                                    </p>
                                </div>
                            </div>

                            {/* Replies */}
                            {selectedDiscussion.replies && selectedDiscussion.replies.map((reply) => {
                                const isMe = auth.user && reply.user.id === auth.user.id;
                                return (
                                    <div key={reply.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`p-3 rounded-2xl max-w-[80%] shadow-sm text-sm ${isMe
                                            ? 'bg-emerald-500 text-white rounded-tl-none'
                                            : 'bg-white text-slate-700 border border-slate-200 rounded-tr-none'
                                            }`}>
                                            {!isMe && (
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-bold opacity-75">{reply.user.name}</span>
                                                </div>
                                            )}
                                            <p className="leading-relaxed whitespace-pre-wrap">{reply.body}</p>
                                            <div className={`text-[10px] mt-1 text-left ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}>
                                                {new Date(reply.created_at).toLocaleTimeString('ar-SY', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Scroll Anchor */}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area (Sticky) */}
                        <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0">
                            <form onSubmit={handleReply} className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 border-slate-200 rounded-full py-3 px-4 text-sm focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50"
                                    placeholder="اكتب ردك هنا..."
                                    value={replyBody}
                                    onChange={e => setReplyBody(e.target.value)}
                                // disabled={loading}
                                />
                                <button
                                    disabled={loading || !replyBody.trim()}
                                    className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
                                >
                                    {loading ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    ) : (
                                        <svg className="w-5 h-5 -rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
