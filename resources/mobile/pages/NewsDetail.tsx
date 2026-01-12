import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, Heart, Bookmark, Clock } from 'lucide-react';
import api from '../services/api';

export default function NewsDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    useEffect(() => {
        fetchNewsDetail();
    }, [id]);

    const fetchNewsDetail = async () => {
        try {
            const res = await api.get(`/portal/posts/${id}`);
            setNews(res.data);
        } catch (err) {
            // Fallback demo data
            setNews({
                id: Number(id),
                title: 'افتتاح مركز صحي جديد في حي الزهور',
                content: `أعلنت المديرية العامة للصحة عن افتتاح مركز صحي متكامل في حي الزهور بهدف تقديم الخدمات الصحية الأولية للمواطنين.

يضم المركز عيادات متنوعة تشمل طب الأسرة والأطفال والنسائية، بالإضافة إلى مختبر وصيدلية مجهزة بأحدث المعدات الطبية.

سيعمل المركز من الساعة 8 صباحاً حتى 8 مساءً يومياً عدا الجمعة. ويأتي هذا المشروع ضمن خطة وزارة الصحة لتطوير الرعاية الصحية الأولية في المناطق السكنية.

المواطنون مدعوون لزيارة المركز والاستفادة من الخدمات المجانية المقدمة ضمن برنامج التأمين الصحي الوطني.`,
                image: null,
                source: 'مديرية الصحة',
                source_icon: '🏥',
                category: 'صحة',
                created_at: new Date().toISOString(),
                views: 1523,
                likes: 89
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        try {
            await api.post(`/portal/posts/${id}/like`);
            setLiked(!liked);
            if (news) {
                setNews({ ...news, likes: news.likes + (liked ? -1 : 1) });
            }
        } catch (err) {
            // Toggle optimistically
            setLiked(!liked);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-pulse">
                    <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
                </div>
            </div>
        );
    }

    if (!news) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
                <div className="text-center">
                    <p className="text-slate-500 font-bold">الخبر غير موجود</p>
                    <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold">
                        العودة
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-xl transition text-slate-600"
                    >
                        <ArrowRight size={20} />
                    </button>
                    <h1 className="text-base font-bold text-slate-800">تفاصيل الخبر</h1>
                    <button
                        onClick={() => setBookmarked(!bookmarked)}
                        className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-amber-50 rounded-xl transition"
                    >
                        <Bookmark size={18} className={bookmarked ? 'fill-amber-500 text-amber-500' : 'text-slate-400'} />
                    </button>
                </div>
            </header>

            {/* Hero Image */}
            {news.image && (
                <div className="w-full h-56 bg-slate-200">
                    <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
                </div>
            )}

            {/* Content */}
            <main className="px-4 py-6 space-y-6">
                {/* Meta Info */}
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100">
                        <span className="text-xl">{news.source_icon}</span>
                        <span className="text-xs font-bold text-slate-700">{news.source}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                        <Clock size={14} />
                        <span>{new Date(news.created_at).toLocaleDateString('ar-SY', { month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                        <Eye size={14} />
                        <span>{news.views.toLocaleString()} مشاهدة</span>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-black text-slate-900 leading-tight">
                    {news.title}
                </h1>

                {/* Content */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="prose prose-slate max-w-none">
                        {news.content.split('\n\n').map((paragraph: string, idx: number) => (
                            <p key={idx} className="text-base text-slate-700 leading-relaxed mb-4 last:mb-0">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleLike}
                    className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${liked
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                >
                    <Heart size={18} className={liked ? 'fill-rose-600' : ''} />
                    <span>{news.likes} إعجاب</span>
                </button>
            </main>
        </div>
    );
}
