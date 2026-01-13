import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';
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
}

interface Campaign {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    color: string;
    description: string;
}

export default function CampaignDetail() {
    const { campaignId } = useParams();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [articles, setArticles] = useState<AwarenessArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaignDetail = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/ai-studies?category=awareness&tags=${campaignId}`);
                const fetchedArticles: AwarenessArticle[] = response.data.data || response.data;

                if (fetchedArticles.length > 0) {
                    const first = fetchedArticles[0];
                    setCampaign({
                        id: campaignId || '',
                        title: campaignId === 'clean-daraya' ? 'ثقافة النظافة' : (campaignId === 'traffic-safety' ? 'السلامة المرورية' : first.title),
                        subtitle: campaignId === 'clean-daraya' ? 'Clean Daraya Initiative' : (campaignId === 'traffic-safety' ? 'Traffic Safety' : ''),
                        icon: first.icon || '🌱',
                        color: first.color || 'emerald',
                        description: first.summary || '',
                    });
                    setArticles(fetchedArticles);
                }
            } catch (error) {
                console.error('Error fetching campaign detail:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaignDetail();
    }, [campaignId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-5 space-y-4 transition-colors duration-300" dir="rtl">
                <SkeletonLoader type="card" />
                <SkeletonLoader type="card" />
                <SkeletonLoader type="card" />
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4" dir="rtl">
                <div className="text-center">
                    <div className="text-4xl mb-4">❌</div>
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">حملة غير موجودة</h3>
                    <button onClick={() => navigate(-1)} className="text-sm text-indigo-600 dark:text-indigo-400 font-bold">
                        العودة
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl">
            <header className={`bg-gradient-to-br ${colorClasses[campaign.color] || colorClasses.emerald} h-64 relative overflow-hidden shadow-xl`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 z-10 active:scale-90 transition-transform"
                >
                    <ArrowRight size={20} className="rotate-180" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white relative z-10">
                    <div className="text-6xl mb-3 animate-float">{campaign.icon}</div>
                    <h1 className="text-3xl font-black mb-1 leading-tight">{campaign.title}</h1>
                    <p className="text-sm text-white/80 font-medium tracking-wide uppercase">{campaign.subtitle}</p>
                </div>
            </header>

            <main className="px-5 -mt-6 relative z-10">
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-premium border border-slate-100 dark:border-slate-700/50 mb-6 group">
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-loose text-center font-medium">
                        {campaign.description}
                    </p>
                </div>

                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">مقالات الوعي</h2>
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{articles.length} مقالات</span>
                </div>

                <div className="space-y-3">
                    {articles.map((article) => (
                        <div
                            key={article.id}
                            onClick={() => navigate(`/awareness/campaign/${campaign.id}/${article.id}`)}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-premium border border-slate-100 dark:border-slate-700/50 active:scale-[0.98] transition-all flex items-center gap-4 group"
                        >
                            <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[campaign.color] || colorClasses.emerald} rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform`}>
                                <FileText size={22} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight leading-snug">
                                    {article.title}
                                </h3>
                            </div>
                            <ArrowRight size={18} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                        </div>
                    ))}
                </div>

                <div className="mt-8 py-4 border-t border-slate-200 dark:border-slate-800 text-center">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em]">نهاية قائمة المقالات</p>
                </div>
            </main>
        </div>
    );
}
