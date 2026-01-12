import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowRight, MapPin, Calendar, Clock, Users, CheckCircle2,
    Share2, Heart, Shield, Award, ChevronLeft, Phone, User
} from 'lucide-react';
import api from '../services/api';
import { usePullToRefresh, PullToRefreshContainer } from '../hooks/usePullToRefresh';

export default function VolunteeringDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [opp, setOpp] = useState<any>(null);

    // Mock Fetch
    const fetchData = async () => {
        setLoading(true);
        // Simulate API
        await new Promise(r => setTimeout(r, 800));

        // Demo Data matching the list
        const demoData = {
            id: Number(id),
            title: "حملة تشجير الأحياء الجنوبية",
            org: "جمعية داريا الخضراء",
            date: "الجمعة القادم, 9:00 ص",
            duration: "4 ساعات",
            location: "ساحة البلدية - الحي الجنوبي",
            description: "ندعوكم للمشاركة في أكبر حملة تشجير هذا الموسم. سنقوم بزراعة 500 شجرة في المناطق الجنوبية للمدينة لتحسين الغطاء النباتي وتجميل شوارعنا. سيتم توفير الأدوات والشتلات للمتطوعين.",
            requirements: [
                "العمر فوق 18 سنة",
                "القدرة على العمل الميداني",
                "إحضار قبعة شمسية"
            ],
            benefits: [
                "شهادة مشاركة",
                "وجبة غداء خفيفة",
                "نقاط تطوع في التطبيق"
            ],
            spots: 15,
            filled: 8,
            tags: ["بيئة", "ميداني", "زراعة"],
            image: "https://images.unsplash.com/photo-1542601906990-24ccd08d7455?w=800&q=80",
            coordinator: {
                name: "أحمد العلي",
                phone: "09xx xxx xxx"
            }
        };
        setOpp(demoData);
        setLoading(false);
    };

    const { isRefreshing, pullMoveY, handlers } = usePullToRefresh(fetchData);

    useEffect(() => {
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!opp) return null;

    return (
        <div className="min-h-screen bg-slate-50 pb-24" dir="rtl" {...handlers}>
            <PullToRefreshContainer isRefreshing={isRefreshing} pullMoveY={pullMoveY}>

                {/* Hero Image */}
                <div className="relative h-72 w-full">
                    <img
                        src={opp.image}
                        alt={opp.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>

                    {/* Header Actions */}
                    <div className="absolute top-0 w-full p-4 flex items-center justify-between z-10">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10 hover:bg-black/30 transition shadow-lg"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div className="flex gap-2">
                            <button className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10 hover:bg-black/30 transition shadow-lg">
                                <Share2 size={20} />
                            </button>
                            <button className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10 hover:bg-black/30 transition shadow-lg">
                                <Heart size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 w-full p-6 text-white animate-slide-up">
                        <div className="flex items-center gap-2 mb-3">
                            {opp.tags.map((tag: string) => (
                                <span key={tag} className="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-100 px-3 py-1 rounded-lg text-[10px] font-bold">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-2xl font-black leading-tight mb-2 drop-shadow-md">{opp.title}</h1>
                        <p className="text-sm text-slate-300 font-medium flex items-center gap-2">
                            <Shield size={14} className="text-emerald-400" />
                            تنظيم: {opp.org}
                        </p>
                    </div>
                </div>

                <main className="px-4 -mt-6 relative z-10 space-y-6">
                    {/* Quick Stats Card */}
                    <div className="bg-white rounded-2xl p-4 shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center justify-between animate-fade-in-up">
                        <div className="text-center flex-1 border-l border-slate-100 px-2">
                            <Calendar size={20} className="text-blue-500 mx-auto mb-1" />
                            <p className="text-[10px] text-slate-400 font-bold mb-0.5">الموعد</p>
                            <p className="text-xs font-bold text-slate-800">{opp.date}</p>
                        </div>
                        <div className="text-center flex-1 border-l border-slate-100 px-2">
                            <Clock size={20} className="text-amber-500 mx-auto mb-1" />
                            <p className="text-[10px] text-slate-400 font-bold mb-0.5">المدة</p>
                            <p className="text-xs font-bold text-slate-800">{opp.duration}</p>
                        </div>
                        <div className="text-center flex-1 px-2">
                            <Users size={20} className="text-emerald-500 mx-auto mb-1" />
                            <p className="text-[10px] text-slate-400 font-bold mb-0.5">المقاعد</p>
                            <p className="text-xs font-bold text-slate-800">{opp.filled}/{opp.spots}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <h3 className="font-bold text-slate-900 mb-3 text-sm flex items-center gap-2">
                            <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
                            حول الفرصة
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed text-justify opacity-90">
                            {opp.description}
                        </p>

                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800">{opp.location}</p>
                                    <p className="text-[10px] text-slate-500">انقر للعرض على الخريطة</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Two Col Info */}
                    <div className="grid grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        {/* Requirements */}
                        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-3 text-sm flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-blue-500" />
                                الشروط
                            </h3>
                            <ul className="space-y-2">
                                {opp.requirements.map((req: string, i: number) => (
                                    <li key={i} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                                        {req}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Benefits */}
                        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-3 text-sm flex items-center gap-2">
                                <Award size={16} className="text-amber-500" />
                                المزايا
                            </h3>
                            <ul className="space-y-2">
                                {opp.benefits.map((ben: string, i: number) => (
                                    <li key={i} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></div>
                                        {ben}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Coordinator */}
                    <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100 flex items-center justify-between mb-20 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-500 shadow-sm">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-indigo-400 font-bold mb-0.5">منسق الحملة</p>
                                <p className="text-xs font-bold text-indigo-900">{opp.coordinator.name}</p>
                            </div>
                        </div>
                        <button className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center hover:bg-indigo-200 transition">
                            <Phone size={16} />
                        </button>
                    </div>

                </main>

                {/* Fixed Bottom Action */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-8 z-20 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] animate-slide-up">
                    <div className="flex gap-3">
                        <button className="flex-1 bg-emerald-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-transform">
                            <img src="/icons/volunteer-icon.svg" className="w-5 h-5 hidden" alt="" />
                            <span className="text-lg">👋</span>
                            تطوع الآن
                        </button>
                        <div className="flex flex-col items-center justify-center px-4 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 font-bold">المقاعد</span>
                            <span className="text-sm font-black text-slate-800">{opp.spots - opp.filled}</span>
                        </div>
                    </div>
                </div>

            </PullToRefreshContainer>
        </div>
    );
}
