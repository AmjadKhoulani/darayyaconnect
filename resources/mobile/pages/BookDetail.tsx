import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, User, MapPin } from 'lucide-react';
import api from '../services/api';

const categories: any = {
    novel: { icon: "📖", label: "روايات" },
    science: { icon: "🔬", label: "علمية" },
    religious: { icon: "📿", label: "دينية" },
    history: { icon: "🏛️", label: "تاريخ" },
    children: { icon: "🧸", label: "أطفال" },
    cooking: { icon: "🍳", label: "طبخ" },
    self_development: { icon: "💪", label: "تطوير ذات" },
    other: { icon: "📚", label: "أخرى" }
};

export default function BookDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await api.get(`/books/${id}`);
                setBook(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    const handleRequest = async () => {
        try {
            await api.post(`/books/${id}/request`);
            alert('تم إرسال طلب الاستعارة!');
            navigate('/books/my-library');
        } catch (err: any) {
            alert(err.response?.data?.message || 'حدث خطأ');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-300">
                <div className="animate-spin w-8 h-8 border-2 border-teal-600 dark:border-teal-400 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!book) return null;

    const cat = categories[book.category];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl">
            <header className="bg-gradient-to-br from-teal-600 to-emerald-700 h-64 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                <button onClick={() => navigate(-1)} className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 z-10 active:scale-90 transition-transform">
                    <ArrowRight size={20} className="rotate-180" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white relative z-10">
                    <div className="text-6xl mb-3 text-center animate-float">{cat?.icon || '📚'}</div>
                    <h1 className="text-2xl font-black text-center leading-tight">{book.title}</h1>
                    <p className="text-sm text-teal-100 text-center mt-1 font-medium">{book.author}</p>
                </div>
            </header>

            <main className="px-5 -mt-6 relative z-10 space-y-4">
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-premium border border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100 dark:border-slate-700/50">
                        <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                            {cat?.icon}
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">الفئة</p>
                            <p className="font-bold text-slate-800 dark:text-slate-100">{cat?.label}</p>
                        </div>
                    </div>

                    {book.description && (
                        <>
                            <h3 className="font-black text-slate-800 dark:text-slate-100 mb-2 text-sm">الوصف</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-loose mb-4 font-medium opacity-90">
                                {book.description}
                            </p>
                        </>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/30">
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase mb-1">اللغة</p>
                            <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                                {book.language === 'arabic' ? 'عربي' :
                                    book.language === 'english' ? 'إنجليزي' :
                                        book.language === 'french' ? 'فرنسي' : 'أخرى'}
                            </p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/30">
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase mb-1">الحالة</p>
                            <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                                {book.condition === 'new' ? 'جديد' :
                                    book.condition === 'good' ? 'جيد' : 'مقبول'}
                            </p>
                        </div>
                    </div>
                </div>

                {book.user && (
                    <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 rounded-3xl p-5 border border-teal-100 dark:border-teal-800/50 shadow-sm relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -mr-16 -mb-16 blur-2xl"></div>
                        <h3 className="font-black text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2 relative z-10">
                            <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center">
                                <User size={16} className="text-teal-600 dark:text-teal-400" />
                            </div>
                            صاحب الكتاب
                        </h3>
                        <p className="text-sm font-black text-slate-800 dark:text-slate-100 mb-2 relative z-10">{book.user.name}</p>
                        {book.user.neighborhood && (
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium relative z-10">
                                <MapPin size={12} />
                                <span>{book.user.neighborhood}</span>
                            </div>
                        )}
                    </div>
                )}

                {book.status === 'available' ? (
                    <button
                        onClick={handleRequest}
                        className="w-full py-5 bg-teal-600 dark:bg-teal-500 text-white rounded-2xl font-black flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-teal-500/20"
                    >
                        <BookOpen size={20} />
                        <span>أريد استعارة هذا الكتاب</span>
                    </button>
                ) : (
                    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/50 rounded-2xl p-5 text-center shadow-sm">
                        <p className="text-sm font-black text-rose-700 dark:text-rose-400 flex items-center justify-center gap-2">
                            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                            الكتاب معار حالياً
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
