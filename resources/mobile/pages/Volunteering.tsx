import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Heart, Users, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { usePullToRefresh, PullToRefreshContainer } from '../hooks/usePullToRefresh';

export default function Volunteering() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const refreshData = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        setLoading(false);
    };

    const { isRefreshing, pullMoveY, handlers } = usePullToRefresh(refreshData);

    const opportunities = [
        {
            id: 1,
            title: "حملة تشجير الأحياء الجنوبية",
            org: "جمعية داريا الخضراء",
            date: "الجمعة القادم, 9:00 ص",
            location: "ساحة البلدية",
            spots: 15,
            filled: 8,
            tags: ["بيئة", "ميداني"],
            image: "https://images.unsplash.com/photo-1542601906990-24ccd08d7455?w=800&q=80"
        },
        {
            id: 2,
            title: "توزيع السلال الغذائية - رمضان",
            org: "فريق الإخاء",
            date: "يومياً",
            location: "مركز التوزيع",
            spots: 50,
            filled: 42,
            tags: ["إغاثة", "تنظيم"],
            image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80"
        },
        {
            id: 3,
            title: "مساعد إداري لتنظيم الأرشيف",
            org: "المجلس المحلي",
            date: "دوام جزئي",
            location: "مبنى البلدية",
            spots: 2,
            filled: 0,
            tags: ["إداري", "مكتبي"],
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl" {...handlers}>
            <PullToRefreshContainer isRefreshing={isRefreshing} pullMoveY={pullMoveY}>

                {/* Clean Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-4 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 transition-colors border border-slate-200">
                            <ChevronRight size={24} className="rotate-180" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-slate-800">فرص التطوع</h1>
                            <p className="text-[11px] text-slate-500 font-medium">ساهم في بناء مجتمعنا</p>
                        </div>
                    </div>
                </header>

                <main className="px-4 py-4 space-y-6">

                    {/* Hero Banner */}
                    <div className="relative rounded-3xl overflow-hidden shadow-lg animate-fade-in-up">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-800 to-teal-600 mix-blend-multiply opacity-90"></div>
                        <img
                            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80"
                            className="w-full h-48 object-cover"
                            alt="Volunteer Hero"
                        />
                        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-3">
                                <Heart className="text-white fill-white" size={20} />
                            </div>
                            <h2 className="text-2xl font-black mb-1">اصنع فرقاً اليوم</h2>
                            <p className="text-sm text-emerald-100 opacity-90 max-w-[80%]">
                                انضم لأكثر من 1500 متطوع يساهمون في بناء وتطوير مدينتنا الحبيبة.
                            </p>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <div className="text-center flex-1 border-l border-slate-100 last:border-0 px-2">
                            <div className="text-xl font-bold text-slate-800">125</div>
                            <div className="text-[10px] font-medium text-slate-500">متطوع</div>
                        </div>
                        <div className="text-center flex-1 border-l border-slate-100 last:border-0 px-2">
                            <div className="text-xl font-bold text-emerald-600">12</div>
                            <div className="text-[10px] font-medium text-slate-500">فرصة</div>
                        </div>
                        <div className="text-center flex-1 px-2">
                            <div className="text-xl font-bold text-blue-600">850</div>
                            <div className="text-[10px] font-medium text-slate-500">ساعة</div>
                        </div>
                    </div>

                    {/* Opportunities List */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-800 text-sm px-1">فرص متاحة الآن</h3>
                        {opportunities.map((opp, index) => (
                            <button
                                key={opp.id}
                                onClick={() => navigate(`/volunteering/${opp.id}`)}
                                className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-emerald-200 transition-all group animate-fade-in-up active:scale-[0.99] text-right"
                                style={{ animationDelay: `${(index + 2) * 100}ms` }}
                            >
                                <div className="p-4">
                                    <div className="flex gap-4 items-start mb-3">
                                        {/* Thumbnail Icon/Image */}
                                        <div className="w-16 h-16 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-100 relative group-hover:shadow-md transition-all">
                                            {opp.image ? (
                                                <img src={opp.image} alt={opp.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-2xl">🤝</span>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-sm text-slate-800 line-clamp-2 group-hover:text-emerald-700 transition-colors leading-relaxed">
                                                    {opp.title}
                                                </h3>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${opp.filled >= opp.spots ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-emerald-50 text-emerald-500 border-emerald-100'}`}>
                                                    {opp.filled}/{opp.spots}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium mt-1">
                                                <Users size={12} className="text-slate-400" />
                                                <span className="text-slate-600">{opp.org}</span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                <span className="text-emerald-600">{opp.date}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-1">
                                        <div className="flex items-center gap-2">
                                            {opp.tags.map(tag => (
                                                <span key={tag} className="bg-slate-50 text-slate-500 px-2 py-1 rounded-lg text-[10px] font-bold border border-slate-100">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-400 text-[10px] font-medium group-hover:text-emerald-600 transition-colors">
                                            <span>التفاصيل</span>
                                            <ChevronRight size={14} className="rotate-180" />
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="text-center py-8">
                        <button className="text-emerald-600 text-xs font-bold hover:underline bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                            هل تمثل جمعية؟ أضف فرصة جديدة
                        </button>
                    </div>
                </main>
            </PullToRefreshContainer>
        </div>
    );
}
