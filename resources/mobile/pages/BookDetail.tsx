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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!book) return null;

    const cat = categories[book.category];

    return (
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
            <header className="bg-gradient-to-br from-teal-600 to-emerald-700 h-64 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>

                <button onClick={() => navigate(-1)} className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 z-10">
                    <ArrowRight size={20} className="rotate-180" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="text-6xl mb-3 text-center">{cat?.icon || '📚'}</div>
                    <h1 className="text-2xl font-black text-center">{book.title}</h1>
                    <p className="text-sm text-teal-100 text-center mt-1">{book.author}</p>
                </div>
            </header>

            <main className="px-5 -mt-4 relative z-10 space-y-4">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                        <span className="text-2xl">{cat?.icon}</span>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase">الفئة</p>
                            <p className="font-bold text-slate-800">{cat?.label}</p>
                        </div>
                    </div>

                    {book.description && (
                        <>
                            <h3 className="font-bold text-slate-800 mb-2">الوصف</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">{book.description}</p>
                        </>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 rounded-xl p-3">
                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">اللغة</p>
                            <p className="font-bold text-slate-800 text-sm">
                                {book.language === 'arabic' ? 'عربي' :
                                    book.language === 'english' ? 'إنجليزي' :
                                        book.language === 'french' ? 'فرنسي' : 'أخرى'}
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3">
                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">الحالة</p>
                            <p className="font-bold text-slate-800 text-sm">
                                {book.condition === 'new' ? 'جديد' :
                                    book.condition === 'good' ? 'جيد' : 'مقبول'}
                            </p>
                        </div>
                    </div>
                </div>

                {book.user && (
                    <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl p-5 border border-teal-100">
                        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <User size={18} className="text-teal-600" />
                            صاحب الكتاب
                        </h3>
                        <p className="text-sm font-bold text-slate-800 mb-2">{book.user.name}</p>
                        {book.user.neighborhood && (
                            <div className="flex items-center gap-1 text-xs text-slate-600">
                                <MapPin size={12} />
                                <span>{book.user.neighborhood}</span>
                            </div>
                        )}
                    </div>
                )}

                {book.status === 'available' ? (
                    <button
                        onClick={handleRequest}
                        className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg"
                    >
                        <BookOpen size={20} />
                        <span>أريد استعارة هذا الكتاب</span>
                    </button>
                ) : (
                    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center">
                        <p className="text-sm font-bold text-rose-700">🔴 الكتاب معار حالياً</p>
                    </div>
                )}
            </main>
        </div>
    );
}
