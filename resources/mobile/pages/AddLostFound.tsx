import { useState } from 'react';
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.location) {
            alert('الرجاء ملء جميع الحقول المطلوبة');
            return;
        }

        setLoading(true);
        try {
            await api.post('/lost-found', formData);
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
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center">
                        <ArrowRight size={20} className="rotate-180" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800">إضافة إعلان</h1>
                        <p className="text-[11px] text-slate-500">ساعد في إعادة الأغراض</p>
                    </div>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="px-5 py-6 space-y-6">
                {/* Type Selection */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">نوع الإعلان *</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'lost' })}
                            className={`p-4 rounded-2xl border-2 transition-all ${formData.type === 'lost'
                                    ? 'border-rose-500 bg-rose-50'
                                    : 'border-slate-200 bg-white'
                                }`}
                        >
                            <div className="text-3xl mb-2">🔴</div>
                            <p className={`font-bold text-sm ${formData.type === 'lost' ? 'text-rose-700' : 'text-slate-600'}`}>
                                مفقود
                            </p>
                            <p className="text-[10px] text-slate-500 mt-1">فقدت غرض وتبحث عنه</p>
                        </button>

                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'found' })}
                            className={`p-4 rounded-2xl border-2 transition-all ${formData.type === 'found'
                                    ? 'border-emerald-500 bg-emerald-50'
                                    : 'border-slate-200 bg-white'
                                }`}
                        >
                            <div className="text-3xl mb-2">🟢</div>
                            <p className={`font-bold text-sm ${formData.type === 'found' ? 'text-emerald-700' : 'text-slate-600'}`}>
                                موجود
                            </p>
                            <p className="text-[10px] text-slate-500 mt-1">وجدت غرض وتريد إعادته</p>
                        </button>
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">الفئة *</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                    >
                        {Object.entries(categories).map(([key, cat]) => (
                            <option key={key} value={key}>
                                {cat.icon} {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">العنوان *</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="مثال: محفظة جلدية سوداء"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">الوصف التفصيلي *</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="اكتب وصفاً دقيقاً للغرض (اللون، الحجم، علامات مميزة...)"
                        rows={4}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        required
                    />
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                        <MapPin size={16} className="inline mr-1" />
                        الموقع (الحي) *
                    </label>
                    <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="مثال: الكسور، المعضمية، داريا القديمة..."
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                    />
                </div>

                {/* Date */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                        <Calendar size={16} className="inline mr-1" />
                        {formData.type === 'lost' ? 'تاريخ الفقدان' : 'تاريخ الإيجاد'} *
                    </label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                    />
                </div>

                {/* Contact Info */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">معلومات تواصل إضافية (اختياري)</label>
                    <input
                        type="text"
                        value={formData.contact_info}
                        onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                        placeholder="مثال: متاح من الساعة 5 مساءً، واتساب فقط..."
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                {/* Warning */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
                    <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs font-bold text-blue-800 mb-1">نصيحة مهمة</p>
                        <p className="text-xs text-blue-700 leading-relaxed">
                            معلومات الاتصال (رقم الهاتف والبريد) من حسابك ستكون مرئية للمستخدمين المهتمين
                        </p>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''
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
