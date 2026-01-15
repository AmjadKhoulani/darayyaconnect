import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import api from '../services/api';

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

export default function AddBook() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [book, setBook] = useState({
        title: '',
        author: '',
        description: '',
        category: 'novel',
        language: 'arabic',
        condition: 'good'
    });
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDirty, setIsDirty] = useState(false);

    // Track changes
    useEffect(() => {
        if (book.title || book.author || book.description || image) {
            setIsDirty(true);
        } else {
            setIsDirty(false);
        }
    }, [book, image]);

    // Browser close/refresh confirmation
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const handleBack = () => {
        if (isDirty) {
            if (window.confirm('هل أنت متأكد من الخروج؟ ستفقد البيانات المدخلة.')) {
                navigate(-1);
            }
        } else {
            navigate(-1);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreviewUrl(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!book.title || !book.author) {
            alert('الرجاء ملء الحقول الأساسية');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', book.title);
            formData.append('author', book.author);
            formData.append('description', book.description || '');
            formData.append('category', book.category);
            formData.append('language', book.language);
            formData.append('condition', book.condition);

            if (image) {
                formData.append('cover_image', image);
            }

            await api.post('/books', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setIsDirty(false);
            alert('تم إضافة الكتاب بنجاح!');
            navigate('/books');
        } catch (err: any) {
            console.error('Add book error:', err);
            alert(err.response?.data?.message || 'حدث خطأ أثناء إضافة الكتاب');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl">
            <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 px-4 py-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={handleBack} className="w-10 h-10 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-xl flex items-center justify-center text-slate-800 dark:text-slate-100 transition-colors">
                        <ArrowRight size={20} className="" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">إضافة كتاب</h1>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">شارك كتابك مع المجتمع</p>
                    </div>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="px-5 py-6 space-y-5">
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">عنوان الكتاب *</label>
                    <input
                        type="text"
                        value={book.title}
                        onChange={(e) => setBook({ ...book, title: e.target.value })}
                        placeholder="مثال: الأمير الصغير"
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500 dark:focus:border-teal-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">اسم المؤلف *</label>
                    <input
                        type="text"
                        value={book.author}
                        onChange={(e) => setBook({ ...book, author: e.target.value })}
                        placeholder="مثال: أنطوان دو سانت"
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500 dark:focus:border-teal-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الوصف (اختياري)</label>
                    <textarea
                        value={book.description}
                        onChange={(e) => setBook({ ...book, description: e.target.value })}
                        placeholder="نبذة مختصرة عن الكتاب..."
                        rows={3}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500 dark:focus:border-teal-500 transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الفئة</label>
                        <div className="relative">
                            <select
                                value={book.category}
                                onChange={(e) => setBook({ ...book, category: e.target.value })}
                                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500 dark:focus:border-teal-500 appearance-none transition-all"
                            >
                                {Object.entries(categories).map(([key, cat]) => (
                                    <option key={key} value={key}>{cat.label}</option>
                                ))}
                            </select>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-xl">
                                {categories[book.category as keyof typeof categories].icon}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">اللغة</label>
                        <select
                            value={book.language}
                            onChange={(e) => setBook({ ...book, language: e.target.value })}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500 dark:focus:border-teal-500 transition-all"
                        >
                            <option value="arabic">عربي</option>
                            <option value="english">إنجليزي</option>
                            <option value="french">فرنسي</option>
                            <option value="other">أخرى</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">حالة الكتاب</label>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { value: 'new', label: 'جديد', emoji: '✨' },
                            { value: 'good', label: 'جيد', emoji: '👌' },
                            { value: 'acceptable', label: 'مقبول', emoji: '👍' }
                        ].map(cond => (
                            <button
                                key={cond.value}
                                type="button"
                                onClick={() => setBook({ ...book, condition: cond.value })}
                                className={`p-3 rounded-xl border-2 transition-all active:scale-95 ${book.condition === cond.value
                                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 dark:border-teal-400'
                                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                                    }`}
                            >
                                <div className="text-2xl mb-1">{cond.emoji}</div>
                                <p className={`text-xs font-bold ${book.condition === cond.value ? 'text-teal-700 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                    {cond.label}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Image Selection */}
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 px-1">صورة غلاف الكتاب (اختياري)</label>
                    <input
                        type="file"
                        id="book-image-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />

                    {previewUrl ? (
                        <div className="relative group">
                            <img
                                src={previewUrl}
                                alt="Book Preview"
                                className="w-full h-48 object-cover rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-3 right-3 w-10 h-10 bg-black/60 backdrop-blur-md text-white rounded-xl flex items-center justify-center hover:bg-black/80 transition-all border border-white/20"
                            >
                                <ArrowRight className="rotate-45" size={20} />
                            </button>
                        </div>
                    ) : (
                        <label
                            htmlFor="book-image-upload"
                            className="w-full py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl text-slate-400 dark:text-slate-600 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-200 dark:hover:border-teal-700 transition-all flex flex-col items-center gap-3 bg-white dark:bg-slate-800/50 cursor-pointer"
                        >
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <BookOpen size={32} className="text-teal-500" />
                            </div>
                            <div className="text-center">
                                <span className="text-xs font-bold block mb-1">تصوير الكتاب أو اختيار صورة</span>
                                <span className="text-[10px] opacity-60">تساعد الصورة الآخرين في التعرف على الكتاب</span>
                            </div>
                        </label>
                    )}
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-4">
                    <p className="text-xs text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                        💡 جميع الكتب للمشاركة المجانية فقط. بعد إضافة الكتاب، يمكن للآخرين طلب استعارته منك.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 bg-teal-600 dark:bg-teal-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-teal-600/20 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>جاري الإضافة...</span>
                        </>
                    ) : (
                        <>
                            <BookOpen size={20} />
                            <span>إضافة الكتاب</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
