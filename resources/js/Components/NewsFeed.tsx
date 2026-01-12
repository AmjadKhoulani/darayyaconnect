import { useState, useEffect } from 'react';

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
            .then(res => res.json())
            .then((data: Post[]) => {
                // Simple formatting for demo purposes
                const formatted = data.map(p => ({
                    ...p,
                    time: 'منذ ' + Math.floor((Date.now() - new Date(p.created_at).getTime()) / 3600000) + ' ساعة'
                }));
                setPosts(formatted);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    if (loading) return <div className="text-center py-10 text-slate-400">جاري تحميل الأخبار...</div>;

    return (
        <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto pb-20">
            {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                    {/* Header */}
                    <div className="p-4 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg border border-slate-200">
                            {post.author_name[0]}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-900 text-base">{post.author_name}</h3>
                                {post.type === 'announcement' && (
                                    <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-medium border border-blue-100">
                                        {post.role}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">{post.time}</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-4 pb-3">
                        <p className="text-gray-700 leading-7 text-[15px] whitespace-pre-line">
                            {post.content}
                        </p>
                    </div>

                    {/* Image */}
                    {post.image_url && (
                        <div className="w-full h-72 bg-gray-50 overflow-hidden">
                            <img src={post.image_url} alt="Post content" className="w-full h-full object-cover" />
                        </div>
                    )}

                    {/* Poll */}
                    {post.type === 'poll' && post.metadata?.options && (
                        <div className="px-4 pb-4 flex flex-col gap-2.5">
                            {post.metadata.options.map((option) => (
                                <div key={option.id} className="relative h-11 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden cursor-pointer hover:bg-slate-100 transition-colors group">
                                    <div className="absolute top-0 right-0 h-full bg-emerald-100/50 transition-all duration-1000 ease-out" style={{ width: option.votes }}></div>
                                    <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
                                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{option.text}</span>
                                        <span className="text-sm font-bold text-emerald-600">{option.votes}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-between text-gray-500 text-sm">
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors">
                            <span className="text-lg">🤍</span>
                            <span className="font-medium">{post.likes_count}</span>
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <span className="text-lg">💬</span>
                            <span className="font-medium">{post.comments_count} تعليق</span>
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                            <span className="text-lg">📤</span>
                            <span className="font-medium">مشاركة</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
