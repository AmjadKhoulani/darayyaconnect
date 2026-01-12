import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, User, Phone, Mail, CheckCircle2, Share2, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const categories = {
    documents: { icon: "📄", label: "مستندات", color: "blue" },
    phone: { icon: "📱", label: "هاتف", color: "purple" },
    keys: { icon: "🔑", label: "مفاتيح", color: "amber" },
    bag: { icon: "👜", label: "حقيبة", color: "pink" },
    wallet: { icon: "💳", label: "محفظة", color: "green" },
    jewelry: { icon: "💍", label: "مجوهرات", color: "yellow" },
    pet: { icon: "🐾", label: "حيوان أليف", color: "orange" },
    other: { icon: "📦", label: "أخرى", color: "slate" }
};

export default function LostFoundDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await api.get(`/lost-found/${id}`);
                setItem(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    const handleResolve = async () => {
        if (!confirm('هل تريد وضع علامة على هذا الإعلان كـ "تم الحل"؟')) return;

        try {
            await api.post(`/lost-found/${id}/resolve`);
            alert('تم تحديث الإعلان بنجاح');
            navigate('/lost-found');
        } catch (err) {
            console.error(err);
            alert('حدث خطأ');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-slate-800 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!item) return null;

    const category = categories[item.category as keyof typeof categories];
    const isLost = item.type === 'lost';

    return (
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
            {/* Header */}
            <div className={`relative h-64 ${isLost ? 'bg-gradient-to-br from-rose-500 to-red-600' : 'bg-gradient-to-br from-emerald-500 to-green-600'}`}>
                <div className="absolute inset-0 bg-black/20"></div>

                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 z-10"
                >
                    <ArrowRight size={20} className="rotate-180" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl border border-white/30`}>
                            {category?.icon || '📦'}
                        </div>
                        <div className="flex-1">
                            <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase mb-2 ${isLost ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                {isLost ? 'مفقود' : 'موجود'} • {category?.label}
                            </span>
                            <h1 className="text-2xl font-black">{item.title}</h1>
                        </div>
                    </div>
                </div>
            </div>

            <main className="px-5 -mt-4 relative z-10 space-y-4">
                {/* Main Info Card */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-2">الوصف</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        {item.description}
                    </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-4 border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin size={16} className="text-indigo-600" />
                            <span className="text-xs font-bold text-slate-500 uppercase">الموقع</span>
                        </div>
                        <p className="font-bold text-slate-800">{item.location}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar size={16} className="text-indigo-600" />
                            <span className="text-xs font-bold text-slate-500 uppercase">التاريخ</span>
                        </div>
                        <p className="font-bold text-slate-800">
                            {new Date(item.date).toLocaleDateString('ar-SY')}
                        </p>
                    </div>
                </div>

                {/* Contact Info */}
                {item.user && (
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-6 border border-indigo-100">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <User size={18} className="text-indigo-600" />
                            معلومات التواصل
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">الاسم</span>
                                <span className="font-bold text-slate-800">{item.user.name}</span>
                            </div>
                            {item.user.phone && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">الهاتف</span>
                                    <a href={`tel:${item.user.phone}`} className="font-bold text-indigo-600 flex items-center gap-1">
                                        <Phone size={14} />
                                        {item.user.phone}
                                    </a>
                                </div>
                            )}
                            {item.contact_info && (
                                <div className="pt-3 border-t border-indigo-100">
                                    <p className="text-xs text-slate-600 leading-relaxed">{item.contact_info}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                    {item.status === 'active' && (
                        <button
                            onClick={handleResolve}
                            className={`w-full py-4 ${isLost ? 'bg-emerald-600' : 'bg-indigo-600'} text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg`}
                        >
                            <CheckCircle2 size={20} />
                            <span>{isLost ? 'لقد وجدت هذا الغرض' : 'تم التسليم للمالك'}</span>
                        </button>
                    )}

                    {item.status === 'resolved' && (
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 text-green-700">
                            <CheckCircle2 size={24} className="shrink-0" />
                            <div>
                                <p className="font-bold text-sm">تم الحل ✨</p>
                                <p className="text-xs opacity-75">تم إعادة هذا الغرض لصاحبه</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Warning */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                    <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 leading-relaxed">
                        تحقق دائماً من هوية الغرض قبل تسليمه. اطلب إثباتات الملكية للتأكد.
                    </p>
                </div>
            </main>
        </div>
    );
}
