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
            color: 'emerald',
        },
        {
            id: 2,
            title: 'إنارة الشارع الرئيسي',
            desc: 'تركيب 50 جهاز إنارة بالطاقة الشمسية.',
            progress: 65,
            volunteers: 12,
            icon: '💡',
            status: 'جمع تبرعات',
            color: 'blue',
        },
        {
            id: 3,
            title: 'صندوق القرطاسية',
            desc: 'توزيع 200 حقيبة مدرسية للطلاب.',
            progress: 100,
            volunteers: 40,
            icon: '📚',
            status: 'مكتملة',
            color: 'amber',
        },
    ];

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
                <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <span className="text-emerald-600">❤️</span> مبادرات أهلية
                </h2>
                <button className="text-[10px] font-bold text-emerald-600 hover:underline">
                    طرح فكرة +
                </button>
            </div>

            <div className="divide-y divide-slate-50">
                {initiatives.map((init) => (
                    <div
                        key={init.id}
                        className="group p-3 transition-colors hover:bg-slate-50/50"
                    >
                        <div className="mb-2 flex items-start gap-3 text-right">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg transition-transform group-hover:scale-110">
                                {init.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between">
                                    <h3 className="truncate text-xs font-bold text-slate-800 transition-colors group-hover:text-emerald-600">
                                        {init.title}
                                    </h3>
                                    <span
                                        className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold ${
                                            init.color === 'emerald'
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : init.color === 'blue'
                                                  ? 'bg-blue-50 text-blue-600'
                                                  : 'bg-slate-100 text-slate-500'
                                        }`}
                                    >
                                        {init.status}
                                    </span>
                                </div>
                                <p className="mt-0.5 line-clamp-1 text-[10px] text-slate-500">
                                    {init.desc}
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-[9px] font-medium text-slate-400">
                                <span>{init.volunteers} متطوع/مساهم</span>
                                <span
                                    className={
                                        init.progress === 100
                                            ? 'text-emerald-500'
                                            : ''
                                    }
                                >
                                    {init.progress}%
                                </span>
                            </div>
                            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className={`h-full transition-all duration-1000 ${
                                        init.progress === 100
                                            ? 'bg-emerald-500'
                                            : init.color === 'blue'
                                              ? 'bg-blue-500'
                                              : 'bg-emerald-400'
                                    }`}
                                    style={{ width: `${init.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="mt-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <button className="flex-1 rounded bg-slate-100 py-1 text-[9px] font-bold text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700">
                                دعم المبادرة
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-slate-50 bg-slate-50/30 p-2 text-center">
                <button className="text-[10px] font-bold text-slate-500 transition-colors hover:text-slate-800">
                    عرض جميع المبادرات (12)
                </button>
            </div>
        </div>
    );
}
