import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Send, X, Image as ImageIcon, MessageSquare, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { showToast } from '../components/Toast';

export default function AddDiscussion() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('general');
    const [submitting, setSubmitting] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isDirty, setIsDirty] = useState(false);
    const navigate = useNavigate();

    // Track changes
    useEffect(() => {
        if (title || content || image) {
            setIsDirty(true);
        } else {
            setIsDirty(false);
        }
    }, [title, content, image]);

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

    const categories = [
        { id: 'general', name: 'عام', icon: '💬', color: 'slate' },
        { id: 'services', name: 'خدمات', icon: '🛠️', color: 'blue' },
        { id: 'suggestions', name: 'اقتراحات', icon: '💡', color: 'amber' },
        { id: 'complaints', name: 'شكاوى', icon: '⚠️', color: 'red' },
        { id: 'help', name: 'مساعدة', icon: '🤝', color: 'emerald' },
    ];

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleImageSelect = (e: any) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setSubmitting(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('body', content);
        formData.append('category', selectedCategory);
        if (image) {
            formData.append('image', image);
        }

        try {
            await api.post('/portal/discussions', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsDirty(false);
            showToast('تم إرسال الموضوع بنجاح، سيظهر بعد المراجعة 🎉', 'success');
            navigate('/discussions');
        } catch (err: any) {
            console.error(err);
            const serverMsg = err.response?.data?.message;
            const validationErrors = err.response?.data?.errors;

            let errorText = 'حدث خطأ أثناء النشر. ';

            if (serverMsg) {
                errorText += `\nالسبب: ${serverMsg}`;
            }

            if (validationErrors) {
                const firstError = Object.values(validationErrors)[0] as string[];
                if (Array.isArray(firstError)) {
                    errorText += `\n(${firstError[0]})`;
                }
            }

            alert(errorText);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-4 py-4 shadow-sm transition-colors duration-300">
                <div className="flex items-center gap-4 px-1">
                    <button
                        onClick={handleBack}
                        className="w-12 h-12 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-400 transition-all border border-slate-200 dark:border-slate-800 active:scale-90 shadow-sm"
                    >
                        <ArrowRight size={22} className="" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">موضوع جديد ✨</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">شارك أفكارك مع مجتمع داريا</p>
                    </div>
                </div>
            </header>

            <main className="px-5 py-6 space-y-6">
                {/* Info Widget */}
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-3xl p-5 flex gap-4">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-emerald-800 dark:text-emerald-100 mb-1">صوتك يهمنا</h3>
                        <p className="text-emerald-700/70 dark:text-emerald-400/70 text-xs leading-relaxed font-medium">
                            تأكد من اختيار القسم المناسب لموضوعك لضمان وصوله للجمهور الصحيح.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="bg-white dark:bg-slate-800 rounded-[32px] p-2 border border-slate-200 dark:border-slate-700 shadow-premium transition-colors duration-300">
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 px-1">عنوان الموضوع</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="اكتب عنواناً مختصراً وواضحاً..."
                                    className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder:text-slate-500 text-sm font-bold"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 px-1">التفاصيل</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="اشرح موضوعك بالتفصيل، ما هي الفكرة أو السؤال؟"
                                    rows={6}
                                    className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder:text-slate-500 text-sm min-h-[160px] resize-none leading-relaxed font-medium"
                                    required
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all border-2 border-dashed ${image ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-emerald-400'}`}>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${image ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
                                        <ImageIcon size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <span className={`text-sm font-bold block ${image ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-100'}`}>{image ? 'تم اختيار الصورة' : 'إضافة صورة توضيحية'}</span>
                                        <span className={`text-xs block ${image ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}>{image ? image.name : 'اختياري - تدعم الفكرة'}</span>
                                    </div>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                                    {image && (
                                        <button
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); setImage(null) }}
                                            className="w-8 h-8 bg-white dark:bg-slate-800 text-red-500 flex items-center justify-center rounded-full shadow-sm hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-100 mb-4 px-1">
                            <div className="w-1.5 h-4 bg-emerald-600 rounded-full"></div>
                            اختر القسم المناسب
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 relative overflow-hidden group ${selectedCategory === cat.id
                                        ? 'bg-slate-900 dark:bg-emerald-600 border-slate-900 dark:border-emerald-600 text-white shadow-lg shadow-slate-900/20 dark:shadow-emerald-600/20'
                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                                        }`}
                                >
                                    <div className={`text-2xl mb-1 p-2 rounded-xl transition-colors ${selectedCategory === cat.id ? 'bg-white/10' : 'bg-slate-50 dark:bg-slate-900'}`}>
                                        {cat.icon}
                                    </div>
                                    <span className="text-xs font-black">{cat.name}</span>
                                    {selectedCategory === cat.id && (
                                        <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Warning Widget */}
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-3xl p-4 flex gap-3">
                        <AlertCircle size={20} className="text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-amber-800 dark:text-amber-200 font-medium leading-relaxed">
                            يرجى الالتزام بمعايير المجتمع وعدم نشر محتوى مسيء أو غير لائق. يتم مراجعة كافة المواضيع من قبل المشرفين.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitting || !title.trim() || !content.trim()}
                        className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[24px] font-black text-lg shadow-xl shadow-emerald-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {submitting ? (
                            <>
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>جاري النشر...</span>
                            </>
                        ) : (
                            <>
                                <Send size={22} className="rotate-180" />
                                <span>نشر الموضوع الآن</span>
                            </>
                        )}
                    </button>
                    <div className="h-6"></div>
                </form>
            </main>
        </div>
    );
}
