import axios from 'axios';
import { useState } from 'react';

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
    const [selectedOption, setSelectedOption] = useState<number | null>(
        poll.user_vote_id || null,
    );
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
                value: 1,
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
        <div className="relative mb-6 overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="absolute right-0 top-0 h-full w-2 bg-indigo-500"></div>

            <div className="mb-4 flex items-start justify-between">
                <div>
                    <span className="mb-2 inline-block rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-600">
                        🗳️ استطلاع رأي
                    </span>
                    <h3 className="text-lg font-bold leading-snug text-slate-800">
                        {poll.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
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
                        className={`group relative w-full overflow-hidden rounded-xl border px-4 py-3 text-right transition-all ${
                            selectedOption === option.id
                                ? 'border-indigo-200 bg-indigo-50 font-bold text-indigo-700'
                                : 'border-transparent bg-slate-50 text-slate-700 hover:bg-slate-100'
                        } `}
                    >
                        <div className="relative z-10 flex items-center justify-between">
                            <span>{option.text}</span>
                            {selectedOption === option.id && <span>✅</span>}
                        </div>

                        {/* Progress Bar Simulation (Visual only for now) */}
                        {showResults && (
                            <div
                                className="absolute bottom-0 left-0 top-0 bg-indigo-100 opacity-50 transition-all duration-1000"
                                style={{
                                    width:
                                        selectedOption === option.id
                                            ? '60%'
                                            : '20%',
                                }}
                            ></div>
                        )}
                    </button>
                ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>شارك بصوتك لتحديد أولويات المدينة</span>
                {hasVoted && (
                    <span className="font-bold text-emerald-500">
                        تم احتساب صوتك
                    </span>
                )}
            </div>
        </div>
    );
}
