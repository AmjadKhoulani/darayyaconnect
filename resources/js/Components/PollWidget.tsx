import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function PollWidget({ poll }: { poll: any }) {
    if (!poll) return null;

    const { post, processing, data, setData } = useForm({
        option_id: '',
    });

    const [voted, setVoted] = useState(poll.user_voted);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('polls.vote', poll.id), {
            preserveScroll: true,
            onSuccess: () => setVoted(true),
        });
    };

    // Calculate Percentages
    const totalVotes = poll.options.reduce(
        (sum: number, opt: any) => sum + opt.votes_count,
        0,
    );

    return (
        <div className="mb-6 rounded-lg border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <span className="mb-2 inline-block rounded bg-indigo-100 px-2 py-1 text-xs font-bold text-indigo-700">
                        استطلاع رسمي 📊
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {poll.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {poll.description}
                    </p>
                </div>
                <div className="rounded bg-gray-50 p-2 text-left text-xs text-gray-500">
                    صادر عن: <br />
                    <strong>{poll.department?.name}</strong>
                </div>
            </div>

            {voted ? (
                // Results View
                <div className="space-y-4">
                    {poll.options.map((option: any) => {
                        const percent =
                            totalVotes > 0
                                ? Math.round(
                                      (option.votes_count / totalVotes) * 100,
                                  )
                                : 0;
                        return (
                            <div key={option.id}>
                                <div className="mb-1 flex justify-between text-sm">
                                    <span>{option.label}</span>
                                    <span className="font-bold">
                                        {percent}%
                                    </span>
                                </div>
                                <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                        className="h-2.5 rounded-full bg-indigo-600 transition-all duration-1000 ease-out"
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                    <div className="mt-2 text-center text-xs text-gray-500">
                        شكراً لمشاركتك! صوتك يساعدنا في اتخاذ القرار.
                    </div>
                </div>
            ) : (
                // Voting View
                <form onSubmit={submit} className="space-y-3">
                    {poll.options.map((option: any) => (
                        <label
                            key={option.id}
                            className="flex cursor-pointer items-center rounded-lg border p-3 transition hover:bg-gray-50"
                        >
                            <input
                                type="radio"
                                name="poll_option"
                                value={option.id}
                                onChange={(e) =>
                                    setData('option_id', e.target.value)
                                }
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="mr-3 font-medium text-gray-700 dark:text-gray-300">
                                {option.label}
                            </span>
                        </label>
                    ))}

                    <button
                        disabled={processing || !data.option_id}
                        className="mt-2 w-full rounded-lg bg-indigo-600 py-2 font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {processing ? 'جاري التصويت...' : 'تصويت 🗳️'}
                    </button>
                </form>
            )}
        </div>
    );
}
