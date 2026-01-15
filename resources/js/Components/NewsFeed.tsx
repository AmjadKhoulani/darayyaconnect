import { useEffect, useState } from 'react';

interface Post {
    id: number;
    title?: string;
    content: string;
    type: string;
    author_name: string;
    role?: string;
    time: string; // Will handle formatting logic
    image_url?: string;
    likes_count: number;
    comments_count: number;
    metadata?: {
        options?: { id: number; text: string; votes: string }[];
    };
    created_at: string;
}

export default function NewsFeed() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/portal/posts')
            .then((res) => res.json())
            .then((data: Post[]) => {
                // Simple formatting for demo purposes
                const formatted = data.map((p) => ({
                    ...p,
                    time:
                        'منذ ' +
                        Math.floor(
                            (Date.now() - new Date(p.created_at).getTime()) /
                                3600000,
                        ) +
                        ' ساعة',
                }));
                setPosts(formatted);
                setLoading(false);
            })
            .catch((err) => console.error(err));
    }, []);

    if (loading)
        return (
            <div className="py-10 text-center text-slate-400">
                جاري تحميل الأخبار...
            </div>
        );

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 pb-20">
            {posts.map((post) => (
                <div
                    key={post.id}
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-lg font-bold text-slate-600">
                            {post.author_name[0]}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-gray-900">
                                    {post.author_name}
                                </h3>
                                {post.type === 'announcement' && (
                                    <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                                        {post.role}
                                    </span>
                                )}
                            </div>
                            <p className="mt-0.5 text-xs text-gray-400">
                                {post.time}
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-4 pb-3">
                        <p className="whitespace-pre-line text-[15px] leading-7 text-gray-700">
                            {post.content}
                        </p>
                    </div>

                    {/* Image */}
                    {post.image_url && (
                        <div className="h-72 w-full overflow-hidden bg-gray-50">
                            <img
                                src={post.image_url}
                                alt="Post content"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    )}

                    {/* Poll */}
                    {post.type === 'poll' && post.metadata?.options && (
                        <div className="flex flex-col gap-2.5 px-4 pb-4">
                            {post.metadata.options.map((option) => (
                                <div
                                    key={option.id}
                                    className="group relative h-11 cursor-pointer overflow-hidden rounded-xl border border-slate-100 bg-slate-50 transition-colors hover:bg-slate-100"
                                >
                                    <div
                                        className="absolute right-0 top-0 h-full bg-emerald-100/50 transition-all duration-1000 ease-out"
                                        style={{ width: option.votes }}
                                    ></div>
                                    <div className="absolute inset-0 z-10 flex items-center justify-between px-4">
                                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                                            {option.text}
                                        </span>
                                        <span className="text-sm font-bold text-emerald-600">
                                            {option.votes}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between border-t border-gray-50 px-4 py-3 text-sm text-gray-500">
                        <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:bg-rose-50 hover:text-rose-600">
                            <span className="text-lg">🤍</span>
                            <span className="font-medium">
                                {post.likes_count}
                            </span>
                        </button>
                        <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:bg-blue-50 hover:text-blue-600">
                            <span className="text-lg">💬</span>
                            <span className="font-medium">
                                {post.comments_count} تعليق
                            </span>
                        </button>
                        <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:bg-emerald-50 hover:text-emerald-600">
                            <span className="text-lg">📤</span>
                            <span className="font-medium">مشاركة</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
