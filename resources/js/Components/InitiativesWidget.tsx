import React from 'react';

export default function InitiativesWidget() {
    const initiatives = [
        {
            id: 1,
            title: 'حملة "حارتنا نظيفة"',
            desc: 'تنظيف وتجميل الشوارع الفرعية كل يوم جمعة.',
            progress: 40,
            volunteers: 25,
            icon: '🧹',
            status: 'جاري التنفيذ',
            color: 'emerald'
        },
        {
            id: 2,
            title: 'إنارة الشارع الرئيسي',
            desc: 'تركيب 50 جهاز إنارة بالطاقة الشمسية.',
            progress: 65,
            volunteers: 12,
            icon: '💡',
            status: 'جمع تبرعات',
            color: 'blue'
        },
        {
            id: 3,
            title: 'صندوق القرطاسية',
            desc: 'توزيع 200 حقيبة مدرسية للطلاب.',
            progress: 100,
            volunteers: 40,
            icon: '📚',
            status: 'مكتملة',
            color: 'amber'
        }
    ];

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <span className="text-emerald-600">❤️</span> مبادرات أهلية
                </h2>
                <button className="text-[10px] font-bold text-emerald-600 hover:underline">
                    طرح فكرة +
                </button>
            </div>

            <div className="divide-y divide-slate-50">
                {initiatives.map((init) => (
                    <div key={init.id} className="p-3 hover:bg-slate-50/50 transition-colors group">
                        <div className="flex gap-3 items-start mb-2 text-right">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                                {init.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-xs text-slate-800 truncate group-hover:text-emerald-600 transition-colors">
                                        {init.title}
                                    </h3>
                                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${init.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                                            init.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                                                'bg-slate-100 text-slate-500'
                                        }`}>
                                        {init.status}
                                    </span>
                                </div>
                                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{init.desc}</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[9px] font-medium text-slate-400">
                                <span>{init.volunteers} متطوع/مساهم</span>
                                <span className={init.progress === 100 ? 'text-emerald-500' : ''}>
                                    {init.progress}%
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-1000 ${init.progress === 100 ? 'bg-emerald-500' :
                                            init.color === 'blue' ? 'bg-blue-500' : 'bg-emerald-400'
                                        }`}
                                    style={{ width: `${init.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="mt-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="flex-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-[9px] font-bold py-1 rounded transition-colors text-slate-600">
                                دعم المبادرة
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-2 border-t border-slate-50 bg-slate-50/30 text-center">
                <button className="text-[10px] font-bold text-slate-500 hover:text-slate-800 transition-colors">
                    عرض جميع المبادرات (12)
                </button>
            </div>
        </div>
    );
}
