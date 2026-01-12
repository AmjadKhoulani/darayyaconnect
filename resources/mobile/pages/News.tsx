import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Eye, Share2, Heart, MessageCircle, Bookmark } from 'lucide-react';
import api from '../services/api';
import { usePullToRefresh, PullToRefreshContainer } from '../hooks/usePullToRefresh';

interface NewsItem {
    id: number;
    title: string;
    content: string;
    summary: string;
    image?: string;
    source: string;
    source_icon: string;
    category: string;
    created_at: string;
    views: number;
    likes: number;
}

export default function News() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchNews = useCallback(async () => {
        try {
            const res = await api.get('/portal/posts');
            setNews(res.data);
        } catch (err) {
            // Demo data
            setNews([
                {
                    id: 1,
                    title: 'افتتاح مركز صحي جديد في حي الزهور',
                    content: 'أعلنت المديرية العامة للصحة عن افتتاح مركز صحي متكامل في حي الزهور بهدف تقديم الخدمات الصحية الأولية للمواطنين. يضم المركز عيادات متنوعة تشمل طب الأسرة والأطفال والنسائية، بالإضافة إلى مختبر وصيدلية.\n\nسيعمل المركز من الساعة 8 صباحاً حتى 8 مساءً يومياً عدا الجمعة. ويأتي هذا المشروع ضمن خطة وزارة الصحة لتطوير الرعاية الصحية الأولية في المناطق السكنية.',
                    summary: 'افتتاح مركز صحي متكامل يقدم خدمات طبية شاملة للأهالي',
                    source: 'مديرية الصحة',
                    source_icon: '🏥',
                    category: 'صحة',
                    created_at: new Date().toISOString(),
                    views: 1523,
                    likes: 89
                },
                {
                    id: 2,
                    title: 'إعلان عن حملة تطوعية لتنظيف الحدائق العامة',
                    content: 'تنظم بلدية داريا بالتعاون مع جمعية أصدقاء البيئة حملة تطوعية واسعة لتنظيف وتجميل الحدائق العامة في المدينة.\n\nستنطلق الحملة يوم السبت القادم من الساعة 8 صباحاً وحتى الظهر. ندعو جميع المتطوعين للتسجيل عبر رابط التسجيل أو الحضور مباشرة إلى حديقة الشهداء.\n\nسيتم توفير أدوات التنظيف والقفازات، ويرجى إحضار قبعة وماء. المشاركون سيحصلون على شهادات تقديرية.',
                    summary: 'حملة تنظيف الحدائق يوم السبت - سجل مشاركتك',
                    source: 'البلدية',
                    source_icon: '🏛️',
                    category: 'مجتمع',
                    created_at: new Date(Date.now() - 86400000).toISOString(),
                    views: 845,
                    likes: 156
                },
                {
                    id: 3,
                    title: 'تمديد ساعات تغذية الكهرباء خلال فصل الشتاء',
                    content: 'أعلنت شركة الكهرباء عن زيادة ساعات التغذية الكهربائية خلال فصل الشتاء لتصل إلى 8 ساعات يومياً بدلاً من 6 ساعات.\n\nالبرنامج الجديد:\n- من 6 صباحاً إلى 10 صباحاً\n- من 4 عصراً إلى 8 مساءً\n\nيرجى من المواطنين ترشيد الاستهلاك لضمان استمرار الخدمة.',
                    summary: 'زيادة ساعات الكهرباء إلى 8 ساعات يومياً',
                    source: 'شركة الكهرباء',
                    source_icon: '⚡',
                    category: 'خدمات',
                    created_at: new Date(Date.now() - 172800000).toISOString(),
                    views: 2341,
                    likes: 234
                }
            ]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    const { isRefreshing, pullMoveY, handlers } = usePullToRefresh(fetchNews);

    const getCategoryColor = (cat: string) => {
        const colors: Record<string, string> = {
            'صحة': 'emerald',
            'مجتمع': 'blue',
            'خدمات': 'amber',
            'أخبار': 'slate'
        };
        return colors[cat] || 'slate';
    };

    const formatDate = (date: string) => {
        const d = new Date(date);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 1) return 'منذ دقائق';
        if (diffHours < 24) return `منذ ${diffHours} ساعة`;
        if (diffHours < 48) return 'أمس';
        return d.toLocaleDateString('ar-SY');
    };

    // News List View
    return (
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl" {...handlers}>
            <PullToRefreshContainer isRefreshing={isRefreshing} pullMoveY={pullMoveY}>
                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 transition-colors border border-slate-200"
                            >
                                <ArrowRight size={20} className="rotate-180" />
                            </button>
                            <div>
                                <h1 className="text-lg font-bold text-slate-800">الأخبار</h1>
                                <p className="text-[11px] text-slate-500 font-medium">آخر أخبار المدينة</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="px-4 py-6 space-y-4">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-2xl p-5 animate-pulse border border-slate-100">
                                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
                                    <div className="h-3 bg-slate-100 rounded w-full mb-2"></div>
                                    <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        news.map((item, index) => {
                            const color = getCategoryColor(item.category);
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => navigate(`/news/${item.id}`)}
                                    className={`w-full bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-emerald-200 transition-all text-right group animate-fade-in-up`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`bg-${color}-50 text-${color}-600 text-[10px] font-bold px-2 py-1 rounded-lg border border-${color}-100`}>
                                                    {item.category}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-medium">{formatDate(item.created_at)}</span>
                                            </div>
                                            <h3 className="font-bold text-slate-900 text-sm mb-2 leading-relaxed line-clamp-2 group-hover:text-emerald-700 transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed opacity-80">
                                                {item.summary}
                                            </p>
                                            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg filter grayscale group-hover:grayscale-0 transition-all">{item.source_icon}</span>
                                                    <span className="text-[10px] text-slate-500 font-bold">{item.source}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                                                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full">
                                                        <Eye size={12} /> {item.views}
                                                    </span>
                                                    <span className="flex items-center gap-1 bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full">
                                                        <Heart size={12} className="fill-rose-500" /> {item.likes}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </main>
            </PullToRefreshContainer>
        </div>
    );
}
