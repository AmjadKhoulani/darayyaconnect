import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Globe, Lightbulb, ArrowRight, Search, TrendingUp, Users, DollarSign, Leaf, Zap, Smartphone, ArrowUpRight, Clock } from 'lucide-react';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';
import { usePullToRefresh, PullToRefreshContainer } from '../hooks/usePullToRefresh';

export default function Studies() {
    const [studies, setStudies] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'local' | 'global' | 'awareness'>('global');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Enhanced Mock Data for Global Experiments
    const globalExperiments = [
        {
            id: 1,
            title: "سنغافورة: ثورة النقل الذكي",
            category: "نقل ومواصلات",
            readTime: "8 دقائق",
            summary: "كيف قضت سنغافورة على الازدحام نهائياً باستخدام الذكاء الاصطناعي وتسعير الطرق الديناميكي 🚗",
            image: "https://images.unsplash.com/photo-1525625293386-3f8f99389da2?w=800&q=80",
            color: "blue",
            stats: { label: "توفير وقت", value: "30%" }
        },
        {
            id: 2,
            title: "أوسلو: مدينة بلا نفايات",
            category: "بيئة واستدامة",
            readTime: "6 دقائق",
            summary: "نظام أوسلو السحري لتحويل 99% من نفايات المدينة إلى طاقة كهربائية وتدفئة للمنازل ♻️",
            image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80",
            color: "emerald",
            stats: { label: "إعادة تدوير", value: "99%" }
        },
        {
            id: 3,
            title: "إستونيا: الدولة الرقمية",
            category: "حكومة ذكية",
            readTime: "10 دقائق",
            summary: "كيف بنكدولة كاملة على الإنترنت؟ تجربة إستونيا في رقمنة الهوية، التصويت، وحتى تأسيس الشركات 📱",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
            color: "indigo",
            stats: { label: "خدمات أونلاين", value: "99.9%" }
        },
        {
            id: 4,
            title: "ميديلين: من الخوف للأمل",
            category: "تخطيط عمراني",
            readTime: "7 دقائق",
            summary: "قصة التحول الاسطوري لمدينة ميديلين، كيف ساهم التلفريك والمكتبات العامة في تغيير وجه المدينة 🚠",
            image: "https://images.unsplash.com/photo-1599388147926-3d23450d992f?w=800&q=80",
            color: "rose",
            stats: { label: "انخفاض جريمة", value: "80%" }
        },
        {
            id: 5,
            title: "كورتيبا: ثورة الحافلات السريعة",
            category: "نقل عام",
            readTime: "6 دقائق",
            summary: "كيف ابتكرت البرازيل نظام المترو السطحي (BRT) بتكلفة أقل بـ 100 مرة من المترو العادي وغيرت شكل النقل في العالم 🚌",
            image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80",
            color: "amber",
            stats: { label: "استخدام النقل", value: "75%" }
        },
        {
            id: 6,
            title: "أمستردام: المدينة الذكية",
            category: "طاقة واقتصاد",
            readTime: "9 دقائق",
            summary: "من أعمدة الإنارة الذكية التي توفر الطاقة إلى المنازل التي تبيع الكهرباء.. كيف تدار المدينة كشبكة متكاملة ⚡",
            image: "https://images.unsplash.com/photo-1512470876302-687da745313d?w=800&q=80",
            color: "cyan",
            stats: { label: "توفير طاقة", value: "40%" }
        },
        {
            id: 7,
            title: "كيغالي: أنظف مدينة في أفريقيا",
            category: "مشاركة مجتمعية",
            readTime: "5 دقائق",
            summary: "تجربة 'أوموجاندا': كيف ساهم العمل المجتمعي الإلزامي (يوم واحد شهرياً) في تحويل عاصمة رواندا إلى أيقونة للنظافة 🧹",
            image: "https://images.unsplash.com/photo-1576023363380-4f30cd252549?w=800&q=80",
            color: "emerald",
            stats: { label: "مشاركة سكان", value: "90%" }
        },
        {
            id: 8,
            title: "كوبنهاغن: عاصمة الدراجات",
            category: "بنية تحتية",
            readTime: "7 دقائق",
            summary: "عندما يكون عدد الدراجات أكثر من عدد السيارات.. كيف صممت كوبنهاغن شوارعها لتعطي الأولوية للبشر وليس للآلات 🚲",
            image: "https://images.unsplash.com/photo-1583009653303-12e08cb0a221?w=800&q=80",
            color: "sky",
            stats: { label: "سكان يركبون", value: "62%" }
        }
    ];

    const awarenessContent = [
        {
            id: 1,
            title: "فرز النفايات: دليلك العملي",
            type: "دليل منزلي",
            icon: <Leaf size={24} />,
            color: "bg-emerald-100 text-emerald-700 border-emerald-200"
        },
        {
            id: 2,
            title: "كيف تقدم شكوى فعالة؟",
            type: "خدمات",
            icon: <Smartphone size={24} />,
            color: "bg-blue-100 text-blue-700 border-blue-200"
        },
        {
            id: 3,
            title: "ترشيد الطاقة في الشتاء",
            type: "نصائح",
            icon: <Zap size={24} />,
            color: "bg-amber-100 text-amber-700 border-amber-200"
        }
    ];

    const fetchStudies = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/ai-studies');
            const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
            const enrichedData = data.map((item: any) => ({
                ...item,
                color: item.color || 'indigo'
            }));
            setStudies(enrichedData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const { isRefreshing, pullMoveY, handlers } = usePullToRefresh(fetchStudies);

    useEffect(() => {
        fetchStudies();
    }, [fetchStudies]);

    return (
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl" {...handlers}>
            <PullToRefreshContainer isRefreshing={isRefreshing} pullMoveY={pullMoveY}>
                {/* Header with Search */}
                <header className="bg-white border-b border-slate-100 sticky top-0 z-30 pt-4 pb-2 shadow-sm/50 backdrop-blur-md bg-white/90">
                    <div className="px-5 flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight">مركز المعرفة 💡</h1>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">رؤى ملهمة لمستقبل مدينتنا</p>
                        </div>
                        <button className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition active:scale-95">
                            <Search size={20} />
                        </button>
                    </div>

                    {/* Custom Tab Switcher */}
                    <div className="px-5 pb-2">
                        <div className="bg-slate-100 p-1.5 rounded-2xl flex relative">
                            {/* Sliding Background (Simplified logic for now) */}
                            <button
                                onClick={() => setActiveTab('global')}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all relative z-10 ${activeTab === 'global' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                🌍 تجارب عالمية
                            </button>
                            <button
                                onClick={() => setActiveTab('local')}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all relative z-10 ${activeTab === 'local' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                📊 دراسات محلية
                            </button>
                            <button
                                onClick={() => setActiveTab('awareness')}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all relative z-10 ${activeTab === 'awareness' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                📢 توعية
                            </button>
                        </div>
                    </div>
                </header>

                <main className="px-5 py-6 space-y-8">

                    {activeTab === 'global' && (
                        <div className="space-y-6 animate-slide-up">
                            {/* Featured Hero Card */}
                            <div
                                onClick={() => navigate('/study/1')} // Demo navigate
                                className="relative h-[420px] rounded-[32px] overflow-hidden shadow-2xl group cursor-pointer"
                            >
                                <img src={globalExperiments[0].image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

                                <div className="absolute top-5 right-5 left-5 flex justify-between items-start">
                                    <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg backdrop-blur-md border border-white/20">
                                        تجربة مميزة ✨
                                    </span>
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-black transition-all">
                                        <ArrowUpRight size={20} className="text-white group-hover:text-black" />
                                    </div>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 text-white">
                                    <h2 className="text-3xl font-black mb-3 leading-tight">{globalExperiments[0].title}</h2>
                                    <p className="text-blue-100 text-sm opacity-90 line-clamp-2 mb-4 font-medium leading-relaxed">
                                        {globalExperiments[0].summary}
                                    </p>

                                    <div className="flex gap-3">
                                        <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-2">
                                            <TrendingUp size={16} className="text-blue-400" />
                                            <div className="flex flex-col">
                                                <span className="text-[9px] text-blue-200 uppercase font-bold">{globalExperiments[0].stats.label}</span>
                                                <span className="text-sm font-black text-white">{globalExperiments[0].stats.value}</span>
                                            </div>
                                        </div>
                                        <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-2">
                                            <Clock size={16} className="text-white/60" />
                                            <span className="text-xs font-bold">{globalExperiments[0].readTime} قراءة</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    أحدث التجارب
                                    <div className="h-px flex-1 bg-slate-200 mx-2"></div>
                                </h3>
                                {globalExperiments.slice(1).map(exp => (
                                    <div
                                        key={exp.id}
                                        onClick={() => navigate(`/study/${exp.id}`)}
                                        className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex gap-4 hover:border-blue-200 transition-colors cursor-pointer group"
                                    >
                                        <div className="w-24 h-24 rounded-2xl bg-slate-100 overflow-hidden shrink-0 relative">
                                            <img src={exp.image} className="w-full h-full object-cover" alt="" />
                                            <div className={`absolute inset-0 bg-${exp.color}-500/10 mix-blend-overlay`}></div>
                                        </div>
                                        <div className="flex-1 py-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-[10px] font-bold text-${exp.color}-600 uppercase tracking-wide bg-${exp.color}-50 px-2 py-0.5 rounded-lg`}>
                                                    {exp.category}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                                    <Clock size={10} /> {exp.readTime}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-slate-800 text-base mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{exp.title}</h3>
                                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{exp.summary}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'local' && (
                        <div className="space-y-4 animate-slide-up">
                            <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                                <div className="relative z-10">
                                    <h2 className="text-2xl font-black mb-2">دراسات داريا 📊</h2>
                                    <p className="text-emerald-50 text-sm opacity-90 leading-relaxed font-medium max-w-[80%]">
                                        دراسات جدوى وتخطيط عمراني مبنية على بيانات حقيقية من مدينتنا.
                                    </p>
                                </div>
                            </div>

                            {loading ? [1, 2].map(i => <SkeletonLoader key={i} type="card" />) : (
                                studies.map(study => (
                                    <div key={study.id} onClick={() => navigate(`/study/${study.id}`)} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm active:scale-[0.98] transition-all">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl border border-orange-100">
                                                {study.icon || '📈'}
                                            </div>
                                            <div className="bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                                <span className="text-[10px] font-bold text-slate-500">{study.category}</span>
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-slate-900 text-lg mb-2">{study.title}</h3>
                                        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-4">{study.summary}</p>
                                        <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                                            <div className="flex items-center gap-1.5">
                                                <DollarSign size={14} className="text-slate-400" />
                                                <span className="text-xs font-bold text-slate-700">{study.economics?.investment || 'غير محدد'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Users size={14} className="text-slate-400" />
                                                <span className="text-xs font-bold text-slate-700">{study.economics?.jobs || 'غير محدد'} وظيفة</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'awareness' && (
                        <div className="space-y-4 animate-slide-up">
                            {/* Intro Card */}
                            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                <div className="relative z-10">
                                    <h2 className="text-2xl font-black mb-2">مركز التوعية 📢</h2>
                                    <p className="text-amber-50 text-sm opacity-90 leading-relaxed font-medium">
                                        أدلة عملية ونصائح مفيدة لحياة يومية أفضل وأكثر أماناً
                                    </p>
                                </div>
                            </div>

                            {/* Awareness Topics Grid */}
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { id: 1, title: "فرز النفايات: دليلك العملي", type: "دليل منزلي", icon: "🌱", color: "emerald", desc: "تعلم كيف تفرز نفاياتك بشكل صحيح" },
                                    { id: 2, title: "كيف تقدم شكوى فعالة؟", type: "خدمات", icon: "📱", color: "blue", desc: "خطوات تقديم البلاغات بطريقة فعالة" },
                                    { id: 3, title: "ترشيد الطاقة الكهربائية", type: "نصائح", icon: "⚡", color: "amber", desc: "وفر حتى 30% من فاتورتك الشهرية" },
                                    { id: 4, title: "إدارة المياه المنزلية", type: "نصائح", icon: "💧", color: "cyan", desc: "طرق ذكية لتوفير الماء والتخزين الآمن" },
                                    { id: 5, title: "السلامة في الشارع", type: "أمان", icon: "🚸", color: "rose", desc: "قواعد المرور وحماية أطفالك" },
                                    { id: 6, title: "البنية التحتية والصيانة", type: "مشاركة", icon: "🔧", color: "slate", desc: "ساهم في الحفاظ على المرافق العامة" },
                                    { id: 7, title: "النظافة والصحة العامة", type: "صحة", icon: "🧼", color: "pink", desc: "عادات صحية تحميك من الأمراض" },
                                    { id: 8, title: "المشاركة المجتمعية", type: "مجتمع", icon: "🤝", color: "purple", desc: "كيف تشارك في بناء مجتمع أفضل" }
                                ].map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => navigate(`/awareness/${item.id}`)}
                                        className="w-full bg-white rounded-3xl border border-slate-200 p-4 flex items-center gap-4 text-right active:scale-[0.98] transition-transform shadow-sm hover:shadow-md hover:border-slate-300"
                                    >
                                        <div className={`w-16 h-16 rounded-2xl bg-${item.color}-50 border border-${item.color}-100 flex items-center justify-center text-3xl shrink-0`}>
                                            {item.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className={`text-[10px] font-black uppercase text-${item.color}-600 mb-0.5 tracking-wide`}>{item.type}</div>
                                            <h3 className="font-bold text-slate-800 text-base mb-1 leading-tight">{item.title}</h3>
                                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-1">{item.desc}</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                            <ArrowRight size={16} className="text-slate-400 rotate-180" />
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Call to Action */}
                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-3xl p-6 text-center">
                                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                    لديك اقتراح لموضوع توعوي جديد؟<br />
                                    <button className="text-indigo-600 font-bold underline mt-2">شاركنا فكرتك</button>
                                </p>
                            </div>
                        </div>
                    )}

                </main>
            </PullToRefreshContainer>
        </div>
    );
}
