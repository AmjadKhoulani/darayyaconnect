import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { showToast } from '../components/Toast';
import { useNavigate } from 'react-router-dom';
import SkeletonLoader from '../components/SkeletonLoader';
import { usePullToRefresh, PullToRefreshContainer } from '../hooks/usePullToRefresh';
import LazyImage from '../components/LazyImage';
import { ThumbsUp, Users, Projector as TrendingUp } from 'lucide-react';

export default function Initiatives() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);
    const fetchProjects = useCallback(async () => {
        try {
            const res = await api.get('/portal/projects');
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const refreshData = useCallback(async () => {
        await fetchProjects();
    }, [fetchProjects]);

    const { isRefreshing: pullRefreshing, containerRef, indicatorRef, handlers } = usePullToRefresh(refreshData);

    const handleVote = async (projectId: number) => {
        const token = localStorage.getItem('token');
        if (!token) {
            showToast('يجب تسجيل الدخول لدعم المبادرة', 'error');
            navigate('/login');
            return;
        }

        try {
            await api.post(`/portal/projects/${projectId}/vote`);
            setProjects(projects.map(p =>
                p.id === projectId ? { ...p, votes_count: (p.votes_count || 0) + 1 } : p
            ));
            showToast('تم تسجيل صوتك بنجاح! شكراً لمشاركتك 🎉', 'success');
        } catch (err: any) {
            if (err.response?.status === 401) {
                showToast('انتهت الجلسة. يرجى تسجيل الدخول مجدداً', 'error');
                navigate('/login');
            } else {
                showToast('فشل التصويت. حاول مرة أخرى', 'error');
            }
        }
    };

    return (
        <div className="min-h-screen bg-page-gradient pb-20 transition-colors duration-300 overflow-x-hidden touch-pan-y" dir="rtl" {...handlers}>
            <PullToRefreshContainer isRefreshing={pullRefreshing} containerRef={containerRef} indicatorRef={indicatorRef}>

                {/* Clean Header matching Web Style */}
                <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-30 px-4 py-4 shadow-md transition-colors duration-300">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 shadow-inner-soft">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">مبادرات أهلية</h1>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">مساهمات المجتمع في تطوير المدينة</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/initiatives/add')}
                            className="bg-emerald-600 dark:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 dark:hover:bg-emerald-600 transition shadow-premium active:scale-95"
                        >
                            + طرح فكرة
                        </button>
                    </div>
                </header>

                <main className="px-4 py-4">
                    {/* Hero Banner */}
                    <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 rounded-[32px] p-7 text-white relative overflow-hidden shadow-premium-xl mb-6">
                        <div className="absolute top-0 left-0 w-48 h-48 bg-white/20 rounded-full -ml-24 -mt-24 blur-3xl opacity-60"></div>
                        <div className="absolute bottom-0 right-0 w-40 h-40 bg-black/10 rounded-full -mr-20 -mb-20 blur-2xl"></div>

                        <div className="relative z-10">
                            <h2 className="text-2xl font-black mb-2 leading-tight">💡 مبادرات أهلية</h2>
                            <p className="text-orange-50/90 text-sm font-medium">
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
                        <div className="space-y-4">
                            {projects.map(project => (
                                <div
                                    key={project.id}
                                    onClick={() => navigate(`/initiatives/${project.id}`)}
                                    className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-premium overflow-hidden hover:border-emerald-200 dark:hover:border-emerald-700 transition-all group cursor-pointer"
                                >
                                    <div className="p-4">
                                        <div className="flex gap-4 items-start mb-3">
                                            {/* Thumbnail Icon/Image */}
                                            <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700 shadow-inner-soft">
                                                {project.image ? (
                                                    <LazyImage
                                                        src={project.image}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-2xl">💡</span>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1 text-right">
                                                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate leading-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                                        {project.title}
                                                    </h3>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm ${project.status === 'مكتملة' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50' :
                                                        project.status === 'قيد التنفيذ' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50' :
                                                            'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/50'
                                                        }`}>
                                                        {project.status || 'جاري التصويت'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed text-right font-medium">
                                                    {project.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress Section */}
                                        <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700/50 mb-4 shadow-inner-soft">
                                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-2">
                                                <div className="flex items-center gap-1">
                                                    <Users size={12} className="text-slate-400 dark:text-slate-600" />
                                                    <span>{project.votes_count || 0} مساهم</span>
                                                </div>
                                                <span className="text-emerald-600 dark:text-emerald-400">75% مكتمل</span>
                                            </div>
                                            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                                                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-sm"></div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleVote(project.id);
                                            }}
                                            className="w-full py-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-700 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                                        >
                                            <ThumbsUp size={16} />
                                            <span>دعم المبادرة</span>
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {projects.length === 0 && (
                                <div className="text-center py-12 bg-white/50 dark:bg-slate-800/50 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800">
                                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full mx-auto flex items-center justify-center text-slate-400 dark:text-slate-600 mb-4 shadow-inner-soft">
                                        <Users size={40} />
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">لا يوجد مبادرات حالياً</p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </PullToRefreshContainer>
        </div>
    );
}
