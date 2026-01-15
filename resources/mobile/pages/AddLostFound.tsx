import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Upload, MapPin, Calendar, AlertCircle } from 'lucide-react';
import api from '../services/api';

const categories = {
    documents: { icon: "📄", label: "مستندات" },
    phone: { icon: "📱", label: "هاتف" },
    keys: { icon: "🔑", label: "مفاتيح" },
    bag: { icon: "👜", label: "حقيبة" },
    wallet: { icon: "💳", label: "محفظة" },
    jewelry: { icon: "💍", label: "مجوهرات" },
    pet: { icon: "🐾", label: "حيوان أليف" },
    other: { icon: "📦", label: "أخرى" }
};

export default function AddLostFound() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: 'lost',
        category: 'other',
        title: '',
        description: '',
        location: '',
        date: new Date().toISOString().split('T')[0],
        contact_info: ''
    });
    const [isDirty, setIsDirty] = useState(false);

    // Track changes
    useEffect(() => {
        if (formData.title || formData.description || formData.location) {
            setIsDirty(true);
        } else {
            setIsDirty(false);
        }
    }, [formData]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.location) {
            alert('الرجاء ملء جميع الحقول المطلوبة');
            return;
        }

        setLoading(true);
        try {
            await api.post('/lost-found', formData);
            setIsDirty(false);
            alert('تم إضافة الإعلان بنجاح!');
            navigate('/lost-found');
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'حدث خطأ، حاول مرة أخرى');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl">
            {/* Header */}
            <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 px-4 py-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={handleBack} className="w-10 h-10 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-xl flex items-center justify-center text-slate-800 dark:text-slate-100 transition-colors">
                        <ArrowRight size={20} className="" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">إضافة إعلان</h1>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">ساعد في إعادة الأغراض</p>
                    </div>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="px-5 py-6 space-y-6">
                {/* Type Selection */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">نوع الإعلان *</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'lost' })}
                            className={`p-4 rounded-2xl border-2 transition-all active:scale-95 ${formData.type === 'lost'
                                ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/30'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                                }`}
                        >
                            <div className="text-3xl mb-2">🔴</div>
                            <p className={`font-bold text-sm ${formData.type === 'lost' ? 'text-rose-700 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                مفقود
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">فقدت غرض وتبحث عنه</p>
                        </button>

                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'found' })}
                            className={`p-4 rounded-2xl border-2 transition-all active:scale-95 ${formData.type === 'found'
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                                }`}
                        >
                            <div className="text-3xl mb-2">🟢</div>
                            <p className={`font-bold text-sm ${formData.type === 'found' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                موجود
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">وجدت غرض وتريد إعادته</p>
                        </button>
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">الفئة *</label>
                    <div className="relative">
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 appearance-none transition-all"
                            required
                        >
                            {Object.entries(categories).map(([key, cat]) => (
                                <option key={key} value={key}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-xl">
                            {categories[formData.category as keyof typeof categories].icon}
                        </div>
                    </div>
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">العنوان *</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="مثال: محفظة جلدية سوداء"
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">الوصف التفصيلي *</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="اكتب وصفاً دقيقاً للغرض (اللون، الحجم، علامات مميزة...)"
                        rows={4}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        required
                    />
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                        <MapPin size={16} className="inline mr-1" />
                        الموقع (الحي) *
                    </label>
                    <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="مثال: الكسور، المعضمية، داريا القديمة..."
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        required
                    />
                </div>

                {/* Date */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                        <Calendar size={16} className="inline mr-1" />
                        {formData.type === 'lost' ? 'تاريخ الفقدان' : 'تاريخ الإيجاد'} *
                    </label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-all"
                        required
                    />
                </div>

                {/* Contact Info */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">معلومات تواصل إضافية (اختياري)</label>
                    <input
                        type="text"
                        value={formData.contact_info}
                        onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                        placeholder="مثال: متاح من الساعة 5 مساءً، واتساب فقط..."
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                </div>

                {/* Warning */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-2xl p-4 flex gap-3">
                    <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-1">نصيحة مهمة</p>
                        <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed opacity-90">
                            معلومات الاتصال (رقم الهاتف والبريد) من حسابك ستكون مرئية للمستخدمين المهتمين
                        </p>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-indigo-600/20 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>جاري النشر...</span>
                        </>
                    ) : (
                        <>
                            <Upload size={20} />
                            <span>نشر الإعلان</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
