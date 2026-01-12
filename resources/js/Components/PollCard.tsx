import { useState } from 'react';
import axios from 'axios';

interface PollOption {
    id: number;
    text: string;
}

interface PollProps {
    poll: {
        id: number;
        title: string;
        content: string;
        metadata: {
            options: PollOption[];
        };
        votes_count?: number; // Total votes
        user_vote_id?: number; // If user voted
    };
}

export default function PollCard({ poll }: PollProps) {
    const [selectedOption, setSelectedOption] = useState<number | null>(poll.user_vote_id || null);
    const [hasVoted, setHasVoted] = useState(!!poll.user_vote_id);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Simulate Results (In real app, fetch from backend)
    // For now, we will just show a "Thank you" state or updated UI
    const [showResults, setShowResults] = useState(!!poll.user_vote_id);

    const handleVote = async (optionId: number) => {
        if (isSubmitting || hasVoted) return;
        setIsSubmitting(true);

        try {
            await axios.post('/votes', {
                votable_type: 'post',
                votable_id: poll.id,
                option_id: optionId,
                value: 1
            });

            setSelectedOption(optionId);
            setHasVoted(true);
            setShowResults(true);
        } catch (error) {
            console.error('Vote failed', error);
            alert('حدث خطأ أثناء التصويت. ربما صوتت مسبقاً؟');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-indigo-500"></div>

            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-1 rounded-full mb-2 inline-block">
                        🗳️ استطلاع رأي
                    </span>
                    <h3 className="text-lg font-bold text-slate-800 leading-snug">
                        {poll.title}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                        {poll.content}
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {poll.metadata?.options?.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => handleVote(option.id)}
                        disabled={hasVoted || isSubmitting}
                        className={`w-full text-right px-4 py-3 rounded-xl border transition-all relative overflow-hidden group 
                            ${selectedOption === option.id
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold'
                                : 'bg-slate-50 border-transparent hover:bg-slate-100 text-slate-700'
                            }
                        `}
                    >
                        <div className="relative z-10 flex justify-between items-center">
                            <span>{option.text}</span>
                            {selectedOption === option.id && <span>✅</span>}
                        </div>

                        {/* Progress Bar Simulation (Visual only for now) */}
                        {showResults && (
                            <div
                                className="absolute left-0 top-0 bottom-0 bg-indigo-100 opacity-50 transition-all duration-1000"
                                style={{ width: selectedOption === option.id ? '60%' : '20%' }}
                            ></div>
                        )}
                    </button>
                ))}
            </div>

            <div className="mt-4 flex justify-between items-center text-xs text-slate-400">
                <span>شارك بصوتك لتحديد أولويات المدينة</span>
                {hasVoted && <span className="text-emerald-500 font-bold">تم احتساب صوتك</span>}
            </div>
        </div>
    );
}
