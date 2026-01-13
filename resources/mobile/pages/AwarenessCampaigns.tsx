import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from 'lucide-react';
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

interface Campaign {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    color: string;
    description: string;
    articles: AwarenessArticle[];
}

export default function AwarenessCampaigns() {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                setLoading(true);
                const response = await api.get('/ai-studies?category=awareness');
                const articles: AwarenessArticle[] = response.data.data || response.data;

                // Group by tags
                const groups: Record<string, AwarenessArticle[]> = {};
                articles.forEach(article => {
                    const tag = article.tags || 'other';
                    if (!groups[tag]) groups[tag] = [];
                    groups[tag].push(article);
                });

                // Map to campaigns
                const mappedCampaigns: Campaign[] = Object.entries(groups).map(([tag, groupArticles]) => {
                    const first = groupArticles[0];
                    return {
                        id: tag,
                        title: tag === 'clean-daraya' ? 'ثقافة النظافة' : (tag === 'traffic-safety' ? 'السلامة المرورية' : first.title),
                        subtitle: tag === 'clean-daraya' ? 'Clean Daraya Initiative' : (tag === 'traffic-safety' ? 'Traffic Safety' : ''),
                        icon: first.icon || '🌱',
                        color: first.color || 'emerald',
                        description: first.summary || '',
                        articles: groupArticles
                    };
                });

                setCampaigns(mappedCampaigns);
            } catch (error) {
                console.error('Error fetching awareness campaigns:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl">
            <header className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white pb-14 pt-8 z-30 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>
                <div className="px-5 relative z-10">
                    <div className="text-center">
                        <div className="text-4xl mb-3 animate-float">🎓</div>
                        <h1 className="text-2xl font-black mb-1 leading-tight tracking-tight">التوعية المجتمعية</h1>
                        <p className="text-xs text-indigo-100 font-medium">وعي يحمي الأرواح، يبني داريا</p>
                    </div>
                </div>
            </header>

            <main className="px-5 -mt-10 relative z-40 bg-slate-50 dark:bg-slate-900 rounded-t-[40px] pt-8 min-h-[calc(100vh-200px)] transition-colors duration-300">
                {loading ? (
                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => <SkeletonLoader key={i} type="card" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {campaigns.map((campaign) => (
                            <div
                                key={campaign.id}
                                onClick={() => navigate(`/awareness/campaign/${campaign.id}`)}
                                className={`bg-gradient-to-br ${colorClasses[campaign.color] || colorClasses.emerald} p-5 rounded-3xl active:scale-95 transition-all cursor-pointer shadow-lg relative overflow-hidden group`}
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-white/20 transition-colors"></div>

                                <div className="relative z-10">
                                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform origin-right">{campaign.icon}</div>
                                    <h3 className="font-black text-white text-base mb-1 leading-tight">
                                        {campaign.title}
                                    </h3>
                                    <p className="text-[10px] text-white/80 font-bold mb-2 uppercase tracking-wide">
                                        {campaign.subtitle}
                                    </p>
                                    <p className="text-[10px] text-white/70 leading-relaxed line-clamp-2 font-medium">
                                        {campaign.description}
                                    </p>
                                    <div className="mt-4 flex items-center gap-1.5 text-[10px] text-white/90 bg-white/10 w-fit px-2 py-1 rounded-lg border border-white/10 font-black">
                                        <Book size={10} />
                                        <span>{campaign.articles.length} مقالة</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl p-4 text-center">
                    <p className="text-xs text-indigo-700 dark:text-indigo-400 font-black leading-relaxed">
                        💡 محتوى توعوي مجاني متوفر لجميع أهل داريا لبناء مجتمع واعٍ، آمن ومسؤول
                    </p>
                </div>
            </main>
        </div>
    );
}
