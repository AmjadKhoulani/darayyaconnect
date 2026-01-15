export default function AwarenessWidget() {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-amber-100 bg-amber-50 px-4 py-3">
                <h2 className="flex items-center gap-2 text-sm font-bold text-amber-800">
                    <span>💡</span> وعي وتنمية
                </h2>
            </div>

            <div className="space-y-3 p-3">
                <div className="group flex cursor-pointer items-start gap-3 rounded-lg p-2 transition hover:bg-slate-50">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-600 transition-transform group-hover:scale-110">
                        🗑️
                    </div>
                    <div>
                        <h3 className="mb-0.5 text-xs font-bold text-slate-800">
                            نظافة الحي
                        </h3>
                        <p className="text-[10px] leading-snug text-slate-500">
                            التزامك بموعد الرمي (6-9 مساءً) يمنع تراكم القمامة
                            وانتشار الحشرات.
                        </p>
                    </div>
                </div>

                <div className="group flex cursor-pointer items-start gap-3 rounded-lg p-2 transition hover:bg-slate-50">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-100 text-sm text-lime-600 transition-transform group-hover:scale-110">
                        🌳
                    </div>
                    <div>
                        <h3 className="mb-0.5 text-xs font-bold text-slate-800">
                            شجرة أمام كل بيت
                        </h3>
                        <p className="text-[10px] leading-snug text-slate-500">
                            ساهم في تلطيف الجو وزراعة شجرة أمام منزلك.
                        </p>
                    </div>
                </div>

                <button className="w-full rounded-lg border border-dashed border-slate-200 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-emerald-600">
                    عرض دليـل المواطنة الكامل
                </button>
            </div>
        </div>
    );
}
