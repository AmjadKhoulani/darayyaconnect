import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { ArrowUp, Image as ImageIcon, MessageSquare, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
    const [newTopic, setNewTopic] = useState({
        title: '',
        body: '',
        category: 'general',
    });
    const [newImage, setNewImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedDiscussion, setSelectedDiscussion] =
        useState<Discussion | null>(null);
    const [replyBody, setReplyBody] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (selectedDiscussion) scrollToBottom();
    }, [selectedDiscussion?.replies]);

    useEffect(() => {
        fetchDiscussions();
    }, []);

    const fetchDiscussions = () => {
        axios
            .get('/api/portal/discussions')
            .then((res) => setDiscussions(res.data))
            .catch((e) => console.error('Failed to fetch discussions', e));
    };



    const handleCreateTopic = (e: any) => {
        e.preventDefault();
        setLoading(true);

        router.post(
            '/community',
            {
                title: newTopic.title,
                body: newTopic.body,
                category: newTopic.category,
                image: newImage,
            },
            {
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
                },
            },
        );
    };

    const categories = [
        { id: 'general', name: 'عام', color: 'slate' },
        { id: 'services', name: 'خدمات', color: 'blue' },
        { id: 'suggestions', name: 'اقتراحات', color: 'amber' },
        { id: 'complaints', name: 'شكاوى', color: 'red' },
        { id: 'help', name: 'مساعدة', color: 'emerald' },
    ];

    const getCategoryName = (id: string) =>
        categories.find((c) => c.id === id)?.name || id;
    const getCategoryColor = (id: string) =>
        categories.find((c) => c.id === id)?.color || 'slate';

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDiscussion) return;
        if (!replyBody.trim()) return;

        setLoading(true);

        try {
            const res = await axios.post(
                `/api/portal/discussions/${selectedDiscussion.id}/reply`,
                {
                    body: replyBody,
                },
            );
            const newReply = res.data;

            const updatedDiscussion = {
                ...selectedDiscussion,
                replies_count: selectedDiscussion.replies_count + 1,
                replies: [...(selectedDiscussion.replies || []), newReply],
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
            const res = await axios.get(
                `/api/portal/discussions/${discussion.id}`,
            );
            setSelectedDiscussion(res.data);
        } catch (e) {
            console.error('Failed to load replies', e);
        }
    };

    const filtered =
        activeTab === 'all'
            ? discussions
            : discussions.filter((d) => d.category === activeTab);

    return (
        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                        <span>💬</span> حوار المجتمع
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                        مساحة للنقاش الحر والبناء
                    </p>
                </div>
                {auth.user ? (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-md transition hover:bg-slate-800"
                    >
                        + موضوع جديد
                    </button>
                ) : (
                    <span className="rounded bg-slate-50 px-2 py-1 text-xs text-slate-400">
                        سجل للدخول للمشاركة
                    </span>
                )}
            </div>

            {/* Tabs */}
            <div className="mb-4 flex overflow-x-auto border-b border-slate-100">
                {['all', 'social', 'services', 'suggestions', 'complaints'].map(
                    (tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab
                                    ? 'border-emerald-500 text-emerald-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab === 'all'
                                ? 'الكل'
                                : tab === 'social'
                                    ? 'اجتماعي'
                                    : tab === 'services'
                                        ? 'خدمي'
                                        : tab === 'suggestions'
                                            ? 'اقتراحات'
                                            : 'شكاوى'}
                        </button>
                    ),
                )}
            </div>

            <div className="space-y-6">
                {filtered.map((topic) => (
                    <div
                        key={topic.id}
                        className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md"
                    >
                        <Link href={`/community/${topic.id}`} className="block">
                            {topic.image_url && (
                                <div className="relative h-48 w-full overflow-hidden bg-slate-50">
                                    <img
                                        src={topic.image_url}
                                        alt={topic.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute right-4 top-4">
                                        <span
                                            className={`rounded-lg px-3 py-1 text-xs font-bold shadow-sm backdrop-blur-md ${topic.category === 'general'
                                                    ? 'bg-slate-900/10 bg-white/90 text-slate-800'
                                                    : topic.category === 'tech'
                                                        ? 'bg-blue-900/10 bg-white/90 text-blue-800'
                                                        : topic.category ===
                                                            'events'
                                                            ? 'bg-purple-900/10 bg-white/90 text-purple-800'
                                                            : 'bg-emerald-900/10 bg-white/90 text-emerald-800'
                                                }`}
                                        >
                                            {getCategoryName(topic.category)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </Link>

                        <div className="p-5">
                            {!topic.image_url && (
                                <div className="mb-4 flex items-start justify-between">
                                    <span
                                        className={`rounded-lg px-3 py-1 text-xs font-bold ${getCategoryColor(topic.category)}`}
                                    >
                                        {getCategoryName(topic.category)}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        {new Date(
                                            topic.created_at,
                                        ).toLocaleDateString('ar-SY')}
                                    </span>
                                </div>
                            )}

                            <Link
                                href={`/community/${topic.id}`}
                                className="block transition-colors group-hover:text-emerald-600"
                            >
                                <h3 className="mb-2 line-clamp-1 text-xl font-bold text-slate-900">
                                    {topic.title}
                                </h3>
                            </Link>

                            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-600">
                                {topic.body}
                            </p>

                            <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                                        {topic.user.name[0]}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-700">
                                            {topic.user.name}
                                        </span>
                                        {topic.image_url && (
                                            <span className="text-[10px] text-slate-400">
                                                {new Date(
                                                    topic.created_at,
                                                ).toLocaleDateString('ar-SY')}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2">


                                    <Link
                                        href={`/community/${topic.id}`}
                                        className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-500 transition-all hover:bg-slate-100"
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
            <Modal
                show={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            >
                <div className="rounded-2xl bg-white p-6 text-right" dir="rtl">
                    <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                        <h2 className="text-xl font-bold text-slate-800">
                            ✨ طرح موضوع جديد
                        </h2>
                        <button
                            onClick={() => setIsCreateModalOpen(false)}
                            className="text-slate-400 transition hover:text-red-500"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleCreateTopic} className="space-y-5">
                        {/* Title */}
                        <div>
                            <InputLabel
                                value="عنوان الموضوع"
                                className="mb-2 text-sm font-bold text-slate-700"
                            />
                            <TextInput
                                className="w-full rounded-xl border-slate-200 px-4 py-3 font-medium text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                                value={newTopic.title}
                                onChange={(e) =>
                                    setNewTopic({
                                        ...newTopic,
                                        title: e.target.value,
                                    })
                                }
                                placeholder="اكتب عنواناً جذاباً لموضوعك..."
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <InputLabel
                                value="التصنيف"
                                className="mb-2 text-sm font-bold text-slate-700"
                            />
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                {categories
                                    .filter((c) => c.id !== 'all')
                                    .map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() =>
                                                setNewTopic({
                                                    ...newTopic,
                                                    category: cat.id,
                                                })
                                            }
                                            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition-all ${newTopic.category === cat.id
                                                    ? `bg-${cat.color}-50 border-${cat.color}-500 text-${cat.color}-700 ring-1 ring-${cat.color}-500`
                                                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                                                }`}
                                        >
                                            <span
                                                className={`h-2 w-2 rounded-full bg-${cat.color}-500`}
                                            ></span>
                                            {cat.name}
                                        </button>
                                    ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div>
                            <InputLabel
                                value="تفاصيل الموضوع"
                                className="mb-2 text-sm font-bold text-slate-700"
                            />
                            <textarea
                                className="h-40 w-full resize-none rounded-xl border-slate-200 px-4 py-3 font-medium text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                                value={newTopic.body}
                                onChange={(e) =>
                                    setNewTopic({
                                        ...newTopic,
                                        body: e.target.value,
                                    })
                                }
                                placeholder="شاركنا أفكارك، استفساراتك، أو مقترحاتك..."
                                required
                            ></textarea>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <InputLabel
                                value="إرفاق صورة (اختياري)"
                                className="mb-2 text-sm font-bold text-slate-700"
                            />
                            <label
                                className={`flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${newImage ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-white hover:border-emerald-400 hover:bg-slate-50'}`}
                            >
                                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                    {newImage ? (
                                        <div className="text-center">
                                            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                                <ImageIcon size={20} />
                                            </div>
                                            <p className="text-sm font-bold text-emerald-600">
                                                {newImage.name}
                                            </p>
                                            <p className="text-xs text-emerald-500">
                                                تم اختيار الصورة بنجاح
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <ImageIcon className="mb-2 h-8 w-8 text-slate-400" />
                                            <p className="text-sm text-slate-500">
                                                <span className="font-bold text-emerald-600">
                                                    اضغط للرفع
                                                </span>{' '}
                                                أو اسحب وأفلت
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                PNG, JPG, GIF up to 5MB
                                            </p>
                                        </>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) =>
                                        e.target.files &&
                                        setNewImage(e.target.files[0])
                                    }
                                />
                            </label>
                            {newImage && (
                                <button
                                    type="button"
                                    onClick={() => setNewImage(null)}
                                    className="mt-2 text-xs font-bold text-red-500 hover:underline"
                                >
                                    إزالة الصورة ❌
                                </button>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                            <SecondaryButton
                                onClick={() => setIsCreateModalOpen(false)}
                            >
                                إلغاء
                            </SecondaryButton>
                            <button
                                disabled={loading}
                                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2 font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <svg
                                            className="h-4 w-4 animate-spin text-white"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
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
            <Modal
                show={!!selectedDiscussion}
                onClose={() => setSelectedDiscussion(null)}
                maxWidth="2xl"
            >
                {selectedDiscussion && (
                    <div
                        className="flex h-[80vh] flex-col overflow-hidden rounded-lg bg-white"
                        dir="rtl"
                    >
                        {/* Header */}
                        <div className="flex flex-shrink-0 items-start justify-between border-b border-slate-100 bg-slate-50 p-4">
                            <div>
                                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                                    {selectedDiscussion.title}
                                    <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-normal text-slate-500">
                                        {selectedDiscussion.category}
                                    </span>
                                </h2>
                                <div className="mt-1 flex gap-2 text-xs text-slate-500">
                                    <span>
                                        بواسطة {selectedDiscussion.user.name}
                                    </span>
                                    <span>
                                        •{' '}
                                        {new Date(
                                            selectedDiscussion.created_at,
                                        ).toLocaleDateString('ar-SY')}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedDiscussion(null)}
                                className="text-slate-400 transition hover:text-slate-600"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    ></path>
                                </svg>
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
                            {/* Original Post as the First Message */}
                            <div className="flex justify-start">
                                <div className="max-w-[85%] rounded-2xl rounded-tr-none border border-slate-200 bg-white p-4 shadow-sm">
                                    <div className="mb-2 flex items-center gap-2 border-b border-slate-100 pb-2">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                                            {selectedDiscussion.user.name[0]}
                                        </div>
                                        <span className="text-xs font-bold text-slate-700">
                                            {selectedDiscussion.user.name}
                                        </span>
                                    </div>
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                                        {selectedDiscussion.body}
                                    </p>
                                </div>
                            </div>

                            {/* Replies */}
                            {selectedDiscussion.replies &&
                                selectedDiscussion.replies.map((reply) => {
                                    const isMe =
                                        auth.user &&
                                        reply.user.id === auth.user.id;
                                    return (
                                        <div
                                            key={reply.id}
                                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${isMe
                                                        ? 'rounded-tl-none bg-emerald-500 text-white'
                                                        : 'rounded-tr-none border border-slate-200 bg-white text-slate-700'
                                                    }`}
                                            >
                                                {!isMe && (
                                                    <div className="mb-1 flex items-center gap-2">
                                                        <span className="text-[10px] font-bold opacity-75">
                                                            {reply.user.name}
                                                        </span>
                                                    </div>
                                                )}
                                                <p className="whitespace-pre-wrap leading-relaxed">
                                                    {reply.body}
                                                </p>
                                                <div
                                                    className={`mt-1 text-left text-[10px] ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}
                                                >
                                                    {new Date(
                                                        reply.created_at,
                                                    ).toLocaleTimeString(
                                                        'ar-SY',
                                                        {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                            {/* Scroll Anchor */}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area (Sticky) */}
                        <div className="flex-shrink-0 border-t border-slate-100 bg-white p-4">
                            <form onSubmit={handleReply} className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 rounded-full border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    placeholder="اكتب ردك هنا..."
                                    value={replyBody}
                                    onChange={(e) =>
                                        setReplyBody(e.target.value)
                                    }
                                // disabled={loading}
                                />
                                <button
                                    disabled={loading || !replyBody.trim()}
                                    className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading ? (
                                        <svg
                                            className="h-5 w-5 animate-spin text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                    ) : (
                                        <svg
                                            className="h-5 w-5 -rotate-90"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                            ></path>
                                        </svg>
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
