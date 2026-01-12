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
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
            <header className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white sticky top-0 z-30 shadow-xl">
                <div className="px-5 py-6">
                    <div className="text-center">
                        <div className="text-4xl mb-3">🎓</div>
                        <h1 className="text-2xl font-black mb-1">التوعية المجتمعية</h1>
                        <p className="text-xs text-indigo-100 font-medium">وعي يحمي الأرواح</p>
                    </div>
                </div>
            </header>

            <main className="px-5 py-6">
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
                                className={`bg-gradient-to-br ${colorClasses[campaign.color] || colorClasses.emerald} p-5 rounded-3xl active:scale-95 transition-all cursor-pointer shadow-lg relative overflow-hidden`}
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>

                                <div className="relative z-10">
                                    <div className="text-5xl mb-3">{campaign.icon}</div>
                                    <h3 className="font-black text-white text-base mb-1 leading-tight">
                                        {campaign.title}
                                    </h3>
                                    <p className="text-xs text-white/80 font-medium mb-2">
                                        {campaign.subtitle}
                                    </p>
                                    <p className="text-[10px] text-white/70 leading-relaxed line-clamp-2">
                                        {campaign.description}
                                    </p>
                                    <div className="mt-3 flex items-center gap-1 text-xs text-white/90">
                                        <Book size={12} />
                                        <span>{campaign.articles.length} مقالة</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-4">
                    <p className="text-xs text-indigo-700 font-medium text-center leading-relaxed">
                        💡 محتوى توعوي مجاني لبناء مجتمع واعٍ ومسؤول
                    </p>
                </div>
            </main>
        </div>
    );
}
