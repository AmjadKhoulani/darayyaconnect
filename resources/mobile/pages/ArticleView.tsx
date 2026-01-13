import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';

const colorClasses: Record<string, string> = {
    emerald: 'from-emerald-500 to-green-600',
    blue: 'from-blue-500 to-indigo-600',
    amber: 'from-amber-500 to-orange-600',
    yellow: 'from-yellow-500 to-orange-500',
    purple: 'from-purple-500 to-indigo-600',
    red: 'from-red-500 to-rose-600'
};

interface AwarenessArticle {
    id: number | string;
    title: string;
    content: string;
    summary: string;
    icon?: string;
    color?: string;
    tags?: string;
}

export default function ArticleView() {
    const { campaignId, articleId } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState<AwarenessArticle | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/ai-studies/${articleId}`);
                setArticle(response.data);
            } catch (error) {
                console.error('Error fetching article:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [articleId]);

    // Simple markdown-like rendering
    const renderContent = (content: string) => {
        if (!content) return null;
        return content.split('\n').map((line, idx) => {
            // Headers
            if (line.startsWith('## ')) {
                return <h3 key={idx} className="text-xl font-black text-slate-800 dark:text-slate-100 mt-6 mb-3 leading-tight tracking-tight">{line.substring(3)}</h3>;
            }
            if (line.startsWith('# ')) {
                return <h2 key={idx} className="text-2xl font-black text-slate-900 dark:text-white mt-8 mb-4 leading-none tracking-tighter">{line.substring(2)}</h2>;
            }

            // Bold text
            if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={idx} className="font-black text-slate-800 dark:text-slate-200 mt-4 mb-2 text-sm uppercase tracking-wide">{line.replace(/\*\*/g, '')}</p>;
            }

            // Bullet points
            if (line.startsWith('•')) {
                return <li key={idx} className="text-sm text-slate-600 dark:text-slate-300 leading-loose mr-5 mb-2 list-disc marker:text-indigo-500">{line.substring(1).trim()}</li>;
            }

            // Numbered lists
            if (/^\d+️⃣/.test(line)) {
                return <li key={idx} className="text-sm text-slate-600 dark:text-slate-300 leading-loose mr-6 mb-3 list-none relative before:absolute before:-right-6 before:content-['']">{line}</li>;
            }

            // Warning/special lines
            if (line.includes('⚠️') || line.includes('🚨') || line.includes('❌') || line.includes('✅')) {
                const isError = line.includes('❌') || line.includes('⚠️') || line.includes('🚨');
                const bgColor = isError
                    ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800/50 text-rose-700 dark:text-rose-400'
                    : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400';
                return <p key={idx} className={`text-sm font-black py-4 px-5 rounded-2xl border shadow-sm ${bgColor} my-4 leading-relaxed`}>{line}</p>;
            }

            // Special emoji lines
            if (line.includes('💡') || line.includes('🎯') || line.includes('💚') || line.includes('🌟')) {
                return <p key={idx} className="text-sm bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-400 font-bold py-4 px-5 rounded-2xl my-4 shadow-sm leading-relaxed">{line}</p>;
            }

            // Empty line
            if (line.trim() === '') {
                return <div key={idx} className="h-4"></div>;
            }

            // Regular paragraph
            return <p key={idx} className="text-sm text-slate-600 dark:text-slate-300 leading-loose mb-3 font-medium opacity-90">{line}</p>;
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-5 space-y-4 transition-colors duration-300" dir="rtl">
                <SkeletonLoader type="card" />
                <div className="bg-white dark:bg-slate-800 rounded-[40px] p-8 h-96 shadow-premium border border-slate-100 dark:border-slate-700/50 animate-pulse"></div>
            </div>
        );
    }

    if (!article) {
        return <div className="p-10 text-center text-slate-500 font-black tracking-widest uppercase" dir="rtl">مقالة غير موجودة</div>;
    }

    const campaignColor = article.color || 'emerald';
    const campaignIcon = article.icon || '🌱';
    const campaignTitle = campaignId === 'clean-daraya' ? 'ثقافة النظافة' : (campaignId === 'traffic-safety' ? 'السلامة المرورية' : (article.tags || 'توعية'));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl">
            <header className={`bg-gradient-to-br ${colorClasses[campaignColor] || colorClasses.emerald} relative shadow-xl overflow-hidden`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                <div className="px-5 py-10 relative z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 mb-6 active:scale-90 transition-transform"
                    >
                        <ArrowRight size={20} className="rotate-180" />
                    </button>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="text-5xl animate-float drop-shadow-lg">{campaignIcon}</div>
                        <div>
                            <p className="text-[10px] text-white/70 font-black uppercase tracking-[0.2em] mb-0.5">{campaignTitle}</p>
                            <h1 className="text-2xl font-black text-white leading-tight tracking-tight shadow-text">{article.title}</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="px-5 -mt-6 relative z-20">
                <div className="bg-white dark:bg-slate-800 rounded-[40px] p-8 shadow-premium border border-slate-100 dark:border-slate-700/50 min-h-[400px]">
                    {renderContent(article.content)}
                </div>

                <div className={`mt-8 bg-gradient-to-br ${colorClasses[campaignColor] || colorClasses.emerald} p-6 rounded-[32px] text-center shadow-lg relative overflow-hidden group`}>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 blur-2xl group-hover:scale-150 transition-transform cursor-default"></div>
                    <p className="text-sm font-black text-white leading-relaxed relative z-10">
                        شارك هذه المعرفة لبناء داريا أفضل 💚
                    </p>
                </div>

                <div className="mt-10 py-6 text-center border-t border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 dark:text-slate-600 font-black uppercase tracking-widest">شكراً لمتابعتك محتوى التوعية</p>
                </div>
            </main>
        </div>
    );
}
