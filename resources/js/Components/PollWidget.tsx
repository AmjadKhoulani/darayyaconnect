import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function PollWidget({ poll }: { poll: any }) {
    if (!poll) return null;

    const { post, processing, data, setData } = useForm({
        option_id: ''
    });

    const [voted, setVoted] = useState(poll.user_voted);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('polls.vote', poll.id), {
            preserveScroll: true,
            onSuccess: () => setVoted(true)
        });
    };

    // Calculate Percentages
    const totalVotes = poll.options.reduce((sum: number, opt: any) => sum + opt.votes_count, 0);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">
                        استطلاع رسمي 📊
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{poll.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{poll.description}</p>
                </div>
                <div className="text-xs text-gray-500 text-left bg-gray-50 p-2 rounded">
                    صادر عن: <br /><strong>{poll.department?.name}</strong>
                </div>
            </div>

            {voted ? (
                // Results View
                <div className="space-y-4">
                    {poll.options.map((option: any) => {
                        const percent = totalVotes > 0 ? Math.round((option.votes_count / totalVotes) * 100) : 0;
                        return (
                            <div key={option.id}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{option.label}</span>
                                    <span className="font-bold">{percent}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div
                                        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                    <div className="text-center text-xs text-gray-500 mt-2">
                        شكراً لمشاركتك! صوتك يساعدنا في اتخاذ القرار.
                    </div>
                </div>
            ) : (
                // Voting View
                <form onSubmit={submit} className="space-y-3">
                    {poll.options.map((option: any) => (
                        <label key={option.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                            <input
                                type="radio"
                                name="poll_option"
                                value={option.id}
                                onChange={(e) => setData('option_id', e.target.value)}
                                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <span className="mr-3 text-gray-700 dark:text-gray-300 font-medium">{option.label}</span>
                        </label>
                    ))}

                    <button
                        disabled={processing || !data.option_id}
                        className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 mt-2"
                    >
                        {processing ? 'جاري التصويت...' : 'تصويت 🗳️'}
                    </button>
                </form>
            )}
        </div>
    );
}

