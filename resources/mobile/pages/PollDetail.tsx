import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Users, Clock, BarChart3 } from 'lucide-react';
import api from '../services/api';
import { showToast } from '../components/Toast';

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

export default function PollDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchPollDetail();
    }, [id]);

    const fetchPollDetail = async () => {
        try {
            const res = await api.get(`/polls/${id}`);
            const pollData = res.data;
            setPoll(pollData);
            if (pollData.user_voted) {
                setSelectedOption(pollData.user_voted);
                setHasVoted(true);
            }
        } catch (err) {
            // Fallback demo data
            setPoll({
                id: Number(id),
                question: 'ما هي أولوية التطوير في المدينة؟',
                description: 'صوّت لتحديد المشروع الأهم الذي يجب تنفيذه هذا العام',
                options: [
                    { id: 1, text: 'تحسين شبكة الطرقات', votes: 145 },
                    { id: 2, text: 'زيادة المساحات الخضراء', votes: 89 },
                    { id: 3, text: 'تطوير المرافق الصحية', votes: 203 },
                    { id: 4, text: 'دعم التعليم والمدارس', votes: 167 }
                ],
                total_votes: 604,
                is_active: true,
                created_at: new Date().toISOString()
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async () => {
        if (!selectedOption) {
            showToast('الرجاء اختيار خيار أولاً', 'error');
            return;
        }

        if (!user) {
            showToast('يجب تسجيل الدخول للتصويت', 'error');
            navigate('/login');
            return;
        }

        try {
            await api.post(`/polls/${id}/vote`, { option_id: selectedOption });
            setHasVoted(true);
            showToast('تم تسجيل صوتك بنجاح! 🎉', 'success');
            // Refresh poll data
            await fetchPollDetail();
        } catch (err: any) {
            if (err.response?.status === 400) {
                showToast('لقد صوّت مسبقاً في هذا الاستطلاع', 'error');
                setHasVoted(true);
            } else {
                showToast('حدث خطأ. حاول مرة أخرى', 'error');
            }
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

    if (!poll) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
                <div className="text-center">
                    <p className="text-slate-500 font-bold">الاستطلاع غير موجود</p>
                    <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold">
                        العودة
                    </button>
                </div>
            </div>
        );
    }

    const getPercentage = (votes: number) => {
        return poll.total_votes > 0 ? Math.round((votes / poll.total_votes) * 100) : 0;
    };

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
                    <h1 className="text-base font-bold text-slate-800">استطلاع الرأي</h1>
                    <div className="w-10"></div>
                </div>
            </header>

            {/* Content */}
            <main className="px-4 py-6 space-y-6">
                {/* Poll Header */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-7 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                            <BarChart3 size={20} />
                            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                                {poll.is_active ? 'نشط الآن' : 'مغلق'}
                            </span>
                        </div>
                        <h1 className="text-2xl font-black mb-2 leading-tight">{poll.question}</h1>
                        {poll.description && (
                            <p className="text-indigo-100 text-sm font-medium">{poll.description}</p>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="flex gap-3">
                    <div className="flex-1 bg-white rounded-xl p-4 border border-slate-100 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Users size={16} className="text-indigo-500" />
                            <span className="text-2xl font-black text-slate-800">{poll.total_votes}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-bold">مشارك</p>
                    </div>
                    <div className="flex-1 bg-white rounded-xl p-4 border border-slate-100 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Clock size={16} className="text-emerald-500" />
                            <span className="text-2xl font-black text-slate-800">{poll.options.length}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-bold">خيارات</p>
                    </div>
                </div>

                {/* Options */}
                <div className="space-y-3">
                    {poll.options.map((option) => {
                        const percentage = getPercentage(option.votes);
                        const isSelected = selectedOption === option.id;
                        const isWinning = option.votes === Math.max(...poll.options.map(o => o.votes)) && poll.total_votes > 0;

                        return (
                            <button
                                key={option.id}
                                onClick={() => !hasVoted && setSelectedOption(option.id)}
                                disabled={hasVoted}
                                className={`w-full text-right p-4 rounded-2xl border-2 transition-all ${hasVoted
                                        ? isWinning
                                            ? 'bg-emerald-50 border-emerald-200'
                                            : 'bg-white border-slate-100'
                                        : isSelected
                                            ? 'bg-indigo-50 border-indigo-500 shadow-md'
                                            : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-sm font-bold ${hasVoted && isWinning ? 'text-emerald-700' : 'text-slate-800'}`}>
                                        {option.text}
                                    </span>
                                    {hasVoted && (
                                        <span className="text-lg font-black text-indigo-600">{percentage}%</span>
                                    )}
                                    {isSelected && !hasVoted && (
                                        <Check size={20} className="text-indigo-600" />
                                    )}
                                </div>
                                {hasVoted && (
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${isWinning ? 'bg-emerald-500' : 'bg-indigo-500'
                                                }`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                )}
                                {hasVoted && (
                                    <p className="text-xs text-slate-500 mt-2">{option.votes.toLocaleString()} صوت</p>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Vote Button */}
                {!hasVoted && poll.is_active && (
                    <button
                        onClick={handleVote}
                        disabled={!selectedOption}
                        className={`w-full py-4 rounded-xl font-bold text-base shadow-lg transition ${selectedOption
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 active:scale-[0.98]'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {selectedOption ? 'تأكيد التصويت' : 'اختر خياراً للتصويت'}
                    </button>
                )}

                {hasVoted && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                        <Check size={24} className="text-emerald-600 mx-auto mb-2" />
                        <p className="text-sm font-bold text-emerald-700">شكراً لمشاركتك! تم تسجيل صوتك</p>
                    </div>
                )}
            </main>
        </div>
    );
}
