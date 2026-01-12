import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageCircle, Plus, Send, X, Tag, Users, TrendingUp, Heart, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';
import { usePullToRefresh, PullToRefreshContainer } from '../hooks/usePullToRefresh';
import { showToast } from '../components/Toast';
import LazyImage from '../components/LazyImage';

export default function Discussions() {
    const [discussions, setDiscussions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newImage, setNewImage] = useState<File | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('general');
    const [submitting, setSubmitting] = useState(false);
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    // Check if user is logged in
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleAddTopicClick = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setShowAddModal(true);
    };

    const categories = [
        { id: 'general', name: 'عام', icon: '💬', color: 'slate' },
        { id: 'services', name: 'خدمات', icon: '🛠️', color: 'blue' },
        { id: 'suggestions', name: 'اقتراحات', icon: '💡', color: 'amber' },
        { id: 'complaints', name: 'شكاوى', icon: '⚠️', color: 'red' },
        { id: 'help', name: 'مساعدة', icon: '🤝', color: 'emerald' },
    ];

    const fetchDiscussions = useCallback(async () => {
        try {
            const res = await api.get('/portal/discussions');
            setDiscussions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDiscussions();
    }, [fetchDiscussions]);

    const { isRefreshing, pullMoveY, handlers } = usePullToRefresh(fetchDiscussions);

    const handleSubmit = async () => {
        if (!newTitle.trim() || !newContent.trim()) return;

        setSubmitting(true);
        const formData = new FormData();
        formData.append('title', newTitle);
        formData.append('body', newContent);
        formData.append('category', selectedCategory);
        if (newImage) {
            formData.append('image', newImage);
        }

        try {
            await api.post('/portal/discussions', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            showToast('تم نشر الموضوع بنجاح 🎉', 'success');
            setShowAddModal(false);
            setNewTitle('');
            setNewContent('');
            setNewImage(null);
            fetchDiscussions();
        } catch (err) {
            console.error(err);
            showToast('حدث خطأ أثناء النشر', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleVote = async (id: number, e: any) => {
        e.stopPropagation();
        if (!user) {
            showToast('يجب تسجيل الدخول للتصويت', 'error');
            return;
        }
        try {
            await api.post(`/portal/discussions/${id}/vote`);
            setDiscussions(discussions.map(d =>
                d.id === id ? {
                    ...d,
                    votes_count: (d.votes_count || 0) + (d.current_user_vote ? -1 : 1),
                    current_user_vote: !d.current_user_vote
                } : d
            ));
        } catch (err) {
            console.error(err);
        }
    };

    const handleImageSelect = (e: any) => {
        if (e.target.files && e.target.files[0]) {
            setNewImage(e.target.files[0]);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl" {...handlers}>
            <PullToRefreshContainer isRefreshing={isRefreshing} pullMoveY={pullMoveY}>

                {/* Header */}
                <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-4 py-4 flex justify-between items-center transition-all">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="hover:bg-slate-100 p-2 rounded-full transition-colors">
                            <ArrowRight className="text-slate-600 rotate-180" size={24} />
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 tracking-tight">النقاشات</h1>
                            <p className="text-[10px] text-slate-500 font-bold">صوتك مسموع في داريا</p>
                        </div>
                    </div>
                    <button
                        onClick={handleAddTopicClick}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                    >
                        <Plus size={16} />
                        <span>موضوع جديد</span>
                    </button>
                </div>

                <main className="pt-24 px-4 space-y-4">
                    {/* Categories Scroll */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all whitespace-nowrap ${selectedCategory === cat.id
                                    ? `bg-${cat.color}-600 text-white border-${cat.color}-600 shadow-md`
                                    : `bg-white text-slate-600 border-slate-200 hover:bg-slate-50`
                                    }`}
                            >
                                <span className="text-xs">{cat.icon}</span>
                                <span className="text-xs font-bold">{cat.name}</span>
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        [1, 2, 3].map(i => <SkeletonLoader key={i} type="card" />)
                    ) : (
                        discussions
                            .filter(d => selectedCategory === 'general' || d.category === selectedCategory)
                            .map(discussion => (
                                <div
                                    key={discussion.id}
                                    onClick={() => navigate(`/discussions/${discussion.id}`)}
                                    className="bg-white rounded-2xl border border-slate-100 shadow-sm active:scale-[0.99] transition-all overflow-hidden mb-4"
                                >
                                    {/* Image on Top */}
                                    {discussion.image_url && (
                                        <div className="h-40 w-full bg-slate-50 relative">
                                            <LazyImage src={discussion.image_url} alt={discussion.title} className="w-full h-full object-cover" />
                                            <div className="absolute top-3 right-3">
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm backdrop-blur-md bg-white/90 text-slate-800`}>
                                                    {categories.find(c => c.id === discussion.category)?.name || discussion.category}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-4">
                                        {!discussion.image_url && (
                                            <div className="flex justify-between items-start mb-3">
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600`}>
                                                    {categories.find(c => c.id === discussion.category)?.name || discussion.category}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-medium">
                                                    {new Date(discussion.created_at).toLocaleDateString('ar-SY')}
                                                </span>
                                            </div>
                                        )}

                                        <h3 className="font-bold text-slate-900 text-base mb-2 line-clamp-1">{discussion.title}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">
                                            {discussion.body}
                                        </p>

                                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-[10px]">
                                                    {discussion.user?.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-700">{discussion.user?.name}</span>
                                                    {discussion.image_url && <span className="text-[10px] text-slate-400">{new Date(discussion.created_at).toLocaleDateString('ar-SY')}</span>}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={(e) => handleVote(discussion.id, e)}
                                                    className={`flex items-center gap-1 text-xs font-bold transition-colors ${discussion.current_user_vote ? 'text-emerald-600' : 'text-slate-400'}`}
                                                >
                                                    {discussion.current_user_vote ? <div className="text-emerald-600">☝️</div> : <div className="grayscale opacity-50">☝️</div>}
                                                    <span>{discussion.votes_count || 0}</span>
                                                </button>
                                                <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                                                    <MessageCircle size={16} />
                                                    <span>{discussion.replies_count || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                    )}
                </main>

                {/* Add Topic Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
                            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                <h2 className="text-xl font-bold text-slate-800">✨ موضوع جديد</h2>
                                <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">عنوان الموضوع</label>
                                    <input
                                        type="text"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        placeholder="اكتب عنواناً مختصراً..."
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all text-sm font-bold placeholder-slate-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">التفاصيل</label>
                                    <textarea
                                        value={newContent}
                                        onChange={(e) => setNewContent(e.target.value)}
                                        placeholder="اشرح موضوعك بالتفصيل..."
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all text-sm resize-none placeholder-slate-400"
                                    />
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border border-dashed ${newImage ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-300 hover:border-emerald-400'}`}>
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${newImage ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                            <ImageIcon size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <span className={`text-xs font-bold block ${newImage ? 'text-emerald-700' : 'text-slate-600'}`}>{newImage ? 'تم اختيار الصورة' : 'إضافة صورة (اختياري)'}</span>
                                            <span className={`text-[10px] block ${newImage ? 'text-emerald-600' : 'text-slate-400'}`}>{newImage ? newImage.name : 'اضغط للاختيار'}</span>
                                        </div>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                                        {newImage && <button onClick={(e) => { e.preventDefault(); setNewImage(null) }} className="text-red-500 p-1 hover:bg-red-50 rounded-full"><X size={16} /></button>}
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">القسم</label>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.filter(c => c.id !== 'all').map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setSelectedCategory(cat.id)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedCategory === cat.id
                                                    ? `bg-${cat.color}-500 text-white border-${cat.color}-500 shadow-md`
                                                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                                    }`}
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting || !newTitle || !newContent}
                                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-base shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                                >
                                    {submitting ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            <span>نشر الموضوع</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </PullToRefreshContainer>
        </div>
    );
}
