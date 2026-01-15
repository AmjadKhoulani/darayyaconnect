import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { showToast } from '../components/Toast';
import { ChevronLeft, Camera, Trash2, Lightbulb, PenTool, CheckCircle } from 'lucide-react';

export default function AddInitiative() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDirty, setIsDirty] = useState(false);

    // Track changes
    useEffect(() => {
        if (title || description || image) {
            setIsDirty(true);
        } else {
            setIsDirty(false);
        }
    }, [title, description, image]);

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

        if (!title || !description) {
            showToast('الرجاء ملء كافة الحقول المطلوبة', 'error');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            if (image) {
                formData.append('image', image);
            }

            await api.post('/portal/projects', formData);

            setIsDirty(false); // Reset dirty flag before navigation
            showToast('تم طرح المبادرة بنجاح! سيتم مراجعتها قريباً', 'success');
            navigate('/initiatives');
        } catch (err: any) {
            console.error(err);
            const errorMsg = err.response?.data?.message || 'فشل في إرسال المبادرة';
            if (err.response?.status === 401) {
                showToast('يرجى تسجيل الدخول أولاً', 'error');
                navigate('/login');
            } else {
                showToast(errorMsg, 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl">
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 py-4 shadow-sm flex items-center gap-3">
                <button onClick={handleBack} className="w-10 h-10 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700">
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">طرح فكرة جديدة</h1>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">شاركنا أفكارك لتطوير المدينة</p>
                </div>
            </header>

            <main className="p-4 max-w-lg mx-auto">
                {/* Info Card */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-4 mb-6 flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-200 flex-shrink-0">
                        <Lightbulb size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-blue-800 dark:text-blue-300 text-sm mb-1">اجعل فكرتك واضحة</h3>
                        <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                            اشرح مبادرتك بشكل مختصر ومفيد. الأفكار الواضحة والمدعومة بالصور تحصل على دعم أكبر من المجتمع.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <PenTool size={16} className="text-emerald-500" />
                            عنوان المبادرة
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="مثال: حملة تشجير الحي الجنوبي"
                            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">تفاصيل المبادرة</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="اشرح الفكرة، الأهداف، والفئة المستفيدة..."
                            rows={6}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 resize-none leading-relaxed"
                        ></textarea>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Camera size={16} className="text-purple-500" />
                            صورة المبادرة (اختياري)
                        </label>

                        {!previewUrl ? (
                            <label className="flex flex-col items-center justify-center w-full h-40 bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <Camera size={24} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400">اضغط لرفع صورة</p>
                                    <p className="text-[10px] text-slate-400 mt-1 uppercase">PNG, JPG up to 5MB</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        ) : (
                            <div className="relative rounded-2xl overflow-hidden h-48 border border-slate-200 dark:border-slate-700 shadow-md">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    onClick={removeImage}
                                    type="button"
                                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <CheckCircle size={20} />
                                <span>نشر المبادرة</span>
                            </>
                        )}
                    </button>
                </form>
            </main>
        </div>
    );
}
