import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import api from '../services/api';

export default function RateGenerator() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState({
        overall_rating: 0,
        service_quality: 0,
        punctuality: 0,
        power_stability: 0,
        customer_service: 0,
        comment: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating.overall_rating === 0) {
            alert('الرجاء إضافة تقييم');
            return;
        }

        setLoading(true);
        try {
            await api.post(`/generators/${id}/rate`, rating);
            alert('شكراً لتقييمك!');
            navigate(`/generators/${id}`);
        } catch (err: any) {
            alert(err.response?.data?.message || 'حدث خطأ');
        } finally {
            setLoading(false);
        }
    };

    const StarRating = ({ value, onChange, label }: any) => (
        <div className="mb-5">
            <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        className="focus:outline-none active:scale-95 transition-transform"
                    >
                        <Star
                            size={40}
                            className={star <= value ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'}
                        />
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center">
                        <ArrowRight size={20} className="rotate-180" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800">تقييم الشركة</h1>
                        <p className="text-[11px] text-slate-500">ساعد الآخرين باختيار الأفضل</p>
                    </div>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="px-5 py-6 space-y-6">
                {/* Overall Rating */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100">
                    <StarRating
                        label="التقييم العام *"
                        value={rating.overall_rating}
                        onChange={(v: number) => setRating({ ...rating, overall_rating: v })}
                    />
                </div>

                {/* Detailed Ratings */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
                    <h3 className="font-bold text-slate-800 mb-4">تقييمات تفصيلية (اختياري)</h3>

                    <StarRating
                        label="جودة الخدمة"
                        value={rating.service_quality}
                        onChange={(v: number) => setRating({ ...rating, service_quality: v })}
                    />

                    <StarRating
                        label="الالتزام بالمواعيد"
                        value={rating.punctuality}
                        onChange={(v: number) => setRating({ ...rating, punctuality: v })}
                    />

                    <StarRating
                        label="استقرار التيار"
                        value={rating.power_stability}
                        onChange={(v: number) => setRating({ ...rating, power_stability: v })}
                    />

                    <StarRating
                        label="التعامل"
                        value={rating.customer_service}
                        onChange={(v: number) => setRating({ ...rating, customer_service: v })}
                    />
                </div>

                {/* Comment */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">تعليق (اختياري)</label>
                    <textarea
                        value={rating.comment}
                        onChange={(e) => setRating({ ...rating, comment: e.target.value })}
                        placeholder="شاركنا تجربتك..."
                        rows={4}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        maxLength={500}
                    />
                    <p className="text-xs text-slate-500 mt-1">{rating.comment.length}/500</p>
                </div>

                {/* Privacy Notice */}
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex gap-3">
                    <span className="text-2xl">🔒</span>
                    <div>
                        <p className="text-xs font-bold text-green-800 mb-1">تقييمك مجهول</p>
                        <p className="text-xs text-green-700 leading-relaxed">
                            لن يظهر اسمك مع التقييم. فقط التقييم والتعليق سيكونان مرئيين.
                        </p>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>جاري الإرسال...</span>
                        </>
                    ) : (
                        <>
                            <Star size={20} />
                            <span>إرسال التقييم</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
