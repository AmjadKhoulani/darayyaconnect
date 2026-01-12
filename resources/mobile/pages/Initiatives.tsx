import { useState, useEffect } from 'react';
import api from '../services/api';
import { showToast } from '../components/Toast';
import { useNavigate } from 'react-router-dom';
import SkeletonLoader from '../components/SkeletonLoader';
import { usePullToRefresh, PullToRefreshContainer } from '../hooks/usePullToRefresh';
import LazyImage from '../components/LazyImage';
import { ThumbsUp, Users, ArrowRight, TrendingUp } from 'lucide-react';

export default function Initiatives() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/portal/projects');
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProjectsRefresh = async () => {
        await fetchProjects();
    }
    const { isRefreshing, pullMoveY, handlers } = usePullToRefresh(fetchProjectsRefresh);

    const handleVote = async (projectId: number) => {
        try {
            await api.post(`/portal/projects/${projectId}/vote`);
            setProjects(projects.map(p =>
                p.id === projectId ? { ...p, votes_count: (p.votes_count || 0) + 1 } : p
            ));
            showToast('تم تسجيل صوتك بنجاح! شكراً لمشاركتك 🎉', 'success');
        } catch (err: any) {
            if (err.response?.status === 401) {
                showToast('يجب تسجيل الدخول للتصويت', 'error');
                navigate('/login');
            } else {
                showToast('فشل التصويت. حاول مرة أخرى', 'error');
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl" {...handlers}>
            <PullToRefreshContainer isRefreshing={isRefreshing} pullMoveY={pullMoveY}>

                {/* Clean Header matching Web Style */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-800">مبادرات أهلية</h1>
                                <p className="text-[11px] text-slate-500 font-medium">مساهمات المجتمع في تطوير المدينة</p>
                            </div>
                        </div>
                        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 transition shadow-sm active:scale-95">
                            + طرح فكرة
                        </button>
                    </div>
                </header>

                <main className="px-4 py-4">
                    {/* Hero Banner */}
                    <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-3xl p-7 text-white relative overflow-hidden shadow-2xl mb-6">
                        <div className="absolute top-0 left-0 w-48 h-48 bg-white/20 rounded-full -ml-24 -mt-24 blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-40 h-40 bg-black/10 rounded-full -mr-20 -mb-20 blur-2xl"></div>

                        <div className="relative z-10">
                            <h2 className="text-2xl font-black mb-2 leading-tight">💡 مبادرات أهلية</h2>
                            <p className="text-orange-50 text-sm font-medium">
                                أفكار مجتمعية لتطوير المدينة • صوّت لدعم المبادرات
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <SkeletonLoader key={i} type="card" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {projects.map(project => (
                                <div key={project.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:border-emerald-200 transition-colors group">
                                    <div className="p-4">
                                        <div className="flex gap-4 items-start mb-3">
                                            {/* Thumbnail Icon/Image */}
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-100">
                                                {project.image ? (
                                                    <LazyImage
                                                        src={project.image}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-xl">🤝</span>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-bold text-sm text-slate-800 truncate leading-tight group-hover:text-emerald-700 transition-colors">
                                                        {project.title}
                                                    </h3>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${project.status === 'مكتملة' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        project.status === 'قيد التنفيذ' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                            'bg-amber-50 text-amber-600 border-amber-100'
                                                        }`}>
                                                        {project.status || 'جاري التصويت'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                    {project.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress Section */}
                                        <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100 mb-3">
                                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-2">
                                                <div className="flex items-center gap-1">
                                                    <Users size={12} className="text-slate-400" />
                                                    <span>{project.votes_count || 12} مساهم</span>
                                                </div>
                                                <span className="text-emerald-600">75% مكتمل</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 w-3/4 rounded-full"></div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            onClick={() => handleVote(project.id)}
                                            className="w-full py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                                        >
                                            <ThumbsUp size={14} />
                                            <span>دعم المبادرة</span>
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {projects.length === 0 && (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto flex items-center justify-center text-slate-400 mb-3">
                                        <Users size={32} />
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium">لا يوجد مبادرات حالياً</p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </PullToRefreshContainer>
        </div>
    );
}
