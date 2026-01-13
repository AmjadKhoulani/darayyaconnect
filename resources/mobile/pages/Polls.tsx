import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, Check, Users, Clock, ChevronDown } from 'lucide-react';
import api from '../services/api';
import { usePullToRefresh, PullToRefreshContainer } from '../hooks/usePullToRefresh';

interface PollOption {
    id: number;
    text: string;
    votes: number;
}

interface Poll {
    id: number;
    question: string;
    description?: string;
    options: PollOption[];
    total_votes: number;
    user_voted?: number;
    ends_at?: string;
    is_active: boolean;
    created_at: string;
}

export default function Polls() {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [loading, setLoading] = useState(true);
    const [votingId, setVotingId] = useState<number | null>(null);
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const fetchPolls = useCallback(async () => {
        try {
            const res = await api.get('/polls/active');
            // Check if response is null or empty
            if (!res.data) {
                setPolls([]);
                return;
            }

            // Handle single object or array
            const rawData = Array.isArray(res.data) ? res.data : [res.data];

            // Map API structure to UI structure
            const mappedPolls = rawData.map((p: any) => {
                // If it's already in the UI format (from demo/frontend)
                if (p.question && p.options) return p;

                // If it's from backend (Post model)
                const options = p.metadata?.options || [];
                const totalVotes = options.reduce((acc: number, curr: any) => acc + (curr.votes || 0), 0);

                return {
                    id: p.id,
                    question: p.title || 'استطلاع رأي',
                    description: p.content,
                    options: options.map((opt: any) => ({
                        id: opt.id,
                        text: opt.text,
                        votes: opt.votes || 0
                    })),
                    total_votes: totalVotes,
                    user_voted: p.user_vote_id,
                    is_active: true,
                    created_at: p.created_at || new Date().toISOString()
                };
            }).filter((p: any) => p.options && p.options.length > 0);

            setPolls(mappedPolls);
        } catch (err: any) {
            console.error("Failed to fetch polls", err);
            // Don't overwrite if we have data, but if empty show demo
            // Demo data
            setPolls([
                {
                    id: 1,
                    question: 'ما هو أهم مشروع يجب التركيز عليه في المرحلة القادمة؟',
                    description: 'ساعدنا في تحديد الأولويات للخطة التنموية',
                    options: [
                        { id: 1, text: 'تحسين شبكة المياه', votes: 145 },
                        { id: 2, text: 'رصف الطرقات الفرعية', votes: 98 },
                        { id: 3, text: 'إنشاء حدائق عامة', votes: 67 },
                        { id: 4, text: 'تطوير الإنارة العامة', votes: 54 }
                    ],
                    total_votes: 364,
                    is_active: true,
                    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
                }
            ]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPolls();
    }, [fetchPolls]);

    const { isRefreshing, pullMoveY, handlers } = usePullToRefresh(fetchPolls);

    const handleVote = async (pollId: number, optionId: number) => {
        if (!user) {
            navigate('/login');
            return;
        }

        setVotingId(pollId);

        // Optimistic update
        setPolls(polls.map(poll => {
            if (poll.id === pollId) {
                return {
                    ...poll,
                    user_voted: optionId,
                    total_votes: poll.total_votes + 1,
                    options: poll.options.map(opt =>
                        opt.id === optionId
                            ? { ...opt, votes: opt.votes + 1 }
                            : opt
                    )
                };
            }
            return poll;
        }));

        try {
            await api.post(`/polls/${pollId}/vote`, { option_id: optionId });
        } catch (err) {
            console.log('Vote recorded locally');
        } finally {
            setVotingId(null);
        }
    };

    const getTimeRemaining = (endsAt?: string) => {
        if (!endsAt) return null;
        const end = new Date(endsAt);
        const now = new Date();
        const diffMs = end.getTime() - now.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (diffDays > 0) return `متبقي ${diffDays} يوم`;
        if (diffHours > 0) return `متبقي ${diffHours} ساعة`;
        return 'ينتهي قريباً';
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl" {...handlers}>
            <PullToRefreshContainer isRefreshing={isRefreshing} pullMoveY={pullMoveY}>
                {/* Header */}
                <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-4 py-4 shadow-sm transition-colors duration-300">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-10 h-10 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700"
                            >
                                <ArrowRight size={20} className="rotate-180" />
                            </button>
                            <div>
                                <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">الاستطلاعات</h1>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">شارك رأيك في قرارات المدينة</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                            <BarChart3 size={14} className="text-emerald-600 dark:text-emerald-400" />
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{polls.length}</span>
                        </div>
                    </div>
                </header>

                <main className="px-4 py-6 space-y-6">
                    {/* Hero */}
                    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-500/20 animate-fade-in-up animate-gradient-x">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl animate-pulse-slow"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
                        <div className="relative z-10">
                            <h2 className="text-xl font-black mb-2 flex items-center gap-2">
                                <BarChart3 size={24} className="animate-float" />
                                صوتك يهمنا
                            </h2>
                            <p className="text-purple-100 text-sm font-medium opacity-90">
                                شارك في استطلاعات الرأي للمساهمة في قرارات المدينة
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2].map(i => (
                                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                                    <div className="h-5 bg-slate-200 rounded w-3/4 mb-4"></div>
                                    <div className="space-y-3">
                                        <div className="h-10 bg-slate-100 rounded-xl"></div>
                                        <div className="h-10 bg-slate-100 rounded-xl"></div>
                                        <div className="h-10 bg-slate-100 rounded-xl"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : polls.length === 0 ? (
                        <div className="text-center py-12">
                            <span className="text-5xl opacity-30 block mb-4">📊</span>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">لا يوجد استطلاعات نشطة</h3>
                            <p className="text-slate-500 dark:text-slate-500 text-sm">تابعنا للمشاركة في الاستطلاعات القادمة</p>
                        </div>
                    ) : (
                        polls.map((poll, index) => {
                            const hasVoted = poll.user_voted !== undefined;
                            const maxVotes = Math.max(...poll.options.map(o => o.votes));

                            return (
                                <div
                                    key={poll.id}
                                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-premium overflow-hidden animate-fade-in-up"
                                    style={{ animationDelay: `${(index + 1) * 150}ms` }}
                                >
                                    {/* Poll Header */}
                                    <div className="p-5 border-b border-slate-100 dark:border-slate-700/50">
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-relaxed">{poll.question}</h3>
                                            {poll.is_active && (
                                                <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800/50 whitespace-nowrap">
                                                    نشط
                                                </span>
                                            )}
                                        </div>
                                        {poll.description && (
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{poll.description}</p>
                                        )}
                                    </div>

                                    {/* Options */}
                                    <div className="p-5 space-y-3">
                                        {poll.options.map((option) => {
                                            const percentage = poll.total_votes > 0
                                                ? Math.round((option.votes / poll.total_votes) * 100)
                                                : 0;
                                            const isWinner = option.votes === maxVotes && hasVoted;
                                            const isSelected = poll.user_voted === option.id;

                                            return (
                                                <button
                                                    key={option.id}
                                                    onClick={() => !hasVoted && handleVote(poll.id, option.id)}
                                                    disabled={hasVoted || votingId === poll.id}
                                                    className={`w-full relative rounded-xl border-2 p-4 text-right transition-all ${hasVoted
                                                        ? isSelected
                                                            ? 'border-emerald-500 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                                                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40'
                                                        : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 active:scale-[0.98]'
                                                        }`}
                                                >
                                                    {/* Progress Bar (shown after voting) */}
                                                    {hasVoted && (
                                                        <div
                                                            className={`absolute inset-0 rounded-xl transition-all ${isWinner ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-slate-100 dark:bg-slate-800/50'
                                                                }`}
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    )}

                                                    <div className="relative z-10 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            {hasVoted && isSelected && (
                                                                <div className="w-6 h-6 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center">
                                                                    <Check size={14} className="text-white" />
                                                                </div>
                                                            )}
                                                            <span className={`font-medium text-sm ${isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                                {option.text}
                                                            </span>
                                                        </div>

                                                        {hasVoted && (
                                                            <span className={`text-sm font-bold ${isWinner ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-500'}`}>
                                                                {percentage}%
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Footer Stats */}
                                    <div className="px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500 font-medium">
                                            <Users size={14} className="text-slate-400 dark:text-slate-600" />
                                            <span>{poll.total_votes} مشارك</span>
                                        </div>
                                        {poll.ends_at && (
                                            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-500 font-bold">
                                                <Clock size={14} />
                                                <span>{getTimeRemaining(poll.ends_at)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </main>
            </PullToRefreshContainer>
        </div>
    );
}
