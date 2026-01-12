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
                return <h3 key={idx} className="text-lg font-bold text-slate-800 mt-4 mb-2">{line.substring(3)}</h3>;
            }
            if (line.startsWith('# ')) {
                return <h2 key={idx} className="text-xl font-black text-slate-800 mt-6 mb-3">{line.substring(2)}</h2>;
            }

            // Bold text
            if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={idx} className="font-bold text-slate-700 mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>;
            }

            // Bullet points
            if (line.startsWith('•')) {
                return <li key={idx} className="text-sm text-slate-600 leading-relaxed mr-5 mb-1">{line.substring(1).trim()}</li>;
            }

            // Numbered lists
            if (/^\d+️⃣/.test(line)) {
                return <li key={idx} className="text-sm text-slate-600 leading-relaxed mr-6 mb-2 list-none">{line}</li>;
            }

            // Warning/special lines
            if (line.includes('⚠️') || line.includes('🚨') || line.includes('❌') || line.includes('✅')) {
                const bgColor = line.includes('❌') || line.includes('⚠️') || line.includes('🚨') ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700';
                return <p key={idx} className={`text-sm font-bold py-2 px-3 rounded-lg border ${bgColor} my-2`}>{line}</p>;
            }

            // Special emoji lines
            if (line.includes('💡') || line.includes('🎯') || line.includes('💚') || line.includes('🌟')) {
                return <p key={idx} className="text-sm bg-blue-50 border border-blue-200 text-blue-700 font-medium py-2 px-3 rounded-lg my-2">{line}</p>;
            }

            // Empty line
            if (line.trim() === '') {
                return <div key={idx} className="h-2"></div>;
            }

            // Regular paragraph
            return <p key={idx} className="text-sm text-slate-600 leading-relaxed mb-2">{line}</p>;
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 p-5 space-y-4" dir="rtl">
                <SkeletonLoader type="card" />
                <div className="bg-white rounded-3xl p-6 h-64 shadow-sm border border-slate-200 animate-pulse"></div>
            </div>
        );
    }

    if (!article) {
        return <div className="p-4 text-center pb-20" dir="rtl">مقالة غير موجودة</div>;
    }

    const campaignColor = article.color || 'emerald';
    const campaignIcon = article.icon || '🌱';
    const campaignTitle = campaignId === 'clean-daraya' ? 'ثقافة النظافة' : (campaignId === 'traffic-safety' ? 'السلامة المرورية' : (article.tags || 'توعية'));

    return (
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
            <header className={`bg-gradient-to-br ${colorClasses[campaignColor] || colorClasses.emerald} relative`}>
                <div className="px-5 py-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 mb-4"
                    >
                        <ArrowRight size={20} className="rotate-180" />
                    </button>

                    <div className="text-5xl mb-3">{campaignIcon}</div>
                    <p className="text-xs text-white/70 font-medium mb-1">{campaignTitle}</p>
                    <h1 className="text-2xl font-black text-white">{article.title}</h1>
                </div>
            </header>

            <main className="px-5 py-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                    {renderContent(article.content)}
                </div>

                <div className={`mt-4 bg-gradient-to-r ${colorClasses[campaignColor] || colorClasses.emerald} bg-opacity-10 border rounded-2xl p-4 text-center`}>
                    <p className="text-xs font-medium text-slate-700">
                        شارك هذه المعلومات مع عائلتك وأصدقائك 💚
                    </p>
                </div>
            </main>
        </div>
    );
}
