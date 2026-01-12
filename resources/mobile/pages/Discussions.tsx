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
        navigate('/discussions/add');
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


    return (
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl" {...handlers}>
            <PullToRefreshContainer isRefreshing={isRefreshing} pullMoveY={pullMoveY}>

                {/* Header */}
                <header className="bg-white pb-14 pt-8 z-40 relative">
                    <div className="flex items-center justify-between px-5">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-12 h-12 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 transition-all border border-slate-200 active:scale-90 shadow-sm"
                            >
                                <ArrowRight size={22} className="rotate-180" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-black text-slate-800 tracking-tight">النقاشات</h1>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">صوتك مسموع في داريا</p>
                            </div>
                        </div>
                        <button
                            onClick={handleAddTopicClick}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 active:scale-90 transition-all"
                        >
                            <Plus size={24} />
                        </button>
                    </div>
                </header>

                <main className="px-5 -mt-10 relative z-50 bg-slate-50 rounded-t-[40px] pt-8 min-h-[calc(100vh-200px)] space-y-4">
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


            </PullToRefreshContainer>
        </div>
    );
}
