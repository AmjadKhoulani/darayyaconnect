import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, Search, ArrowRight } from 'lucide-react';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';
import { usePullToRefresh, PullToRefreshContainer } from '../hooks/usePullToRefresh';

const categories = {
    novel: { icon: "📖", label: "روايات" },
    science: { icon: "🔬", label: "علمية" },
    religious: { icon: "📿", label: "دينية" },
    history: { icon: "🏛️", label: "تاريخ" },
    children: { icon: "🧸", label: "أطفال" },
    cooking: { icon: "🍳", label: "طبخ" },
    self_development: { icon: "💪", label: "تطوير ذات" },
    other: { icon: "📚", label: "أخرى" }
};

export default function BookLibrary() {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ category: '', language: '', search: '' });
    const navigate = useNavigate();

    const fetchBooks = useCallback(async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (filters.category) params.category = filters.category;
            if (filters.language) params.language = filters.language;
            if (filters.search) params.search = filters.search;

            const res = await api.get('/books', { params });
            setBooks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const { isRefreshing, containerRef, indicatorRef, handlers } = usePullToRefresh(fetchBooks);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl" {...handlers}>
            <PullToRefreshContainer isRefreshing={isRefreshing} containerRef={containerRef} indicatorRef={indicatorRef}>
                <header className="bg-gradient-to-br from-teal-600 to-emerald-700 text-white sticky top-0 z-30 shadow-xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="px-5 py-6 relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all text-white"
                                >
                                    <ArrowRight size={24} />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-black flex items-center gap-2">
                                        <BookOpen size={28} />
                                        مكتبة تبادل الكتب
                                    </h1>
                                    <p className="text-xs text-teal-100 font-medium mt-1">شارك واستعير مجاناً</p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/books/add')}
                                className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 active:scale-95 transition-transform"
                            >
                                <Plus size={24} />
                            </button>
                        </div>

                        <div className="relative mb-3">
                            <Search size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60" />
                            <input
                                type="text"
                                placeholder="ابحث عن كتاب..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full pr-11 pl-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-sm text-white placeholder:text-white/60 focus:bg-white/30 transition-all outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                className="px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-xs text-white appearance-none outline-none"
                            >
                                <option value="" className="text-slate-800">كل الفئات</option>
                                {Object.entries(categories).map(([key, cat]) => (
                                    <option key={key} value={key} className="text-slate-800">
                                        {cat.icon} {cat.label}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={filters.language}
                                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                                className="px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-xs text-white appearance-none outline-none"
                            >
                                <option value="" className="text-slate-800">كل اللغات</option>
                                <option value="arabic" className="text-slate-800">عربي</option>
                                <option value="english" className="text-slate-800">إنجليزي</option>
                                <option value="french" className="text-slate-800">فرنسي</option>
                                <option value="other" className="text-slate-800">أخرى</option>
                            </select>
                        </div>
                    </div>
                </header>

                <main className="px-5 py-6">
                    {loading ? (
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(i => <SkeletonLoader key={i} type="card" />)}
                        </div>
                    ) : books.length === 0 ? (
                        <div className="text-center py-16">
                            <BookOpen size={64} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">لا توجد كتب</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-500">كن أول من يضيف كتاباً!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {books.map((book) => {
                                const cat = categories[book.category as keyof typeof categories];
                                return (
                                    <div
                                        key={book.id}
                                        onClick={() => navigate(`/books/${book.id}`)}
                                        className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-premium border border-slate-100 dark:border-slate-700 active:scale-95 transition-all"
                                    >
                                        <div className="aspect-[3/4] bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/40 dark:to-emerald-900/40 rounded-2xl mb-3 flex items-center justify-center text-5xl">
                                            {cat?.icon || '📚'}
                                        </div>
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm line-clamp-2 leading-tight mb-1">
                                            {book.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2 font-medium">{book.author}</p>
                                        <div className="flex flex-col gap-2">
                                            <span className="px-2 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-lg font-bold text-[10px] w-fit">
                                                {cat?.label}
                                            </span>
                                            <span className={`px-2 py-1 rounded-lg font-bold text-[10px] w-fit ${book.status === 'available'
                                                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                                : 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                                                }`}>
                                                {book.status === 'available' ? '🟢 متاح' : '🔴 معار'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="mt-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 rounded-2xl p-4 text-center">
                        <p className="text-xs text-teal-700 dark:text-teal-400 font-medium">
                            💡 جميع الكتب للاستعارة المجانية فقط - لا بيع ولا شراء
                        </p>
                    </div>
                </main>
            </PullToRefreshContainer>
        </div>
    );
}
