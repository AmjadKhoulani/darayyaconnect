import React from 'react';

export default function AwarenessWidget() {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-amber-50 px-4 py-3 border-b border-amber-100 flex justify-between items-center">
                <h2 className="font-bold text-amber-800 text-sm flex items-center gap-2">
                    <span>💡</span> وعي وتنمية
                </h2>
            </div>

            <div className="p-3 space-y-3">
                <div className="flex gap-3 items-start p-2 rounded-lg hover:bg-slate-50 transition cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 text-sm group-hover:scale-110 transition-transform">
                        🗑️
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-slate-800 mb-0.5">نظافة الحي</h3>
                        <p className="text-[10px] text-slate-500 leading-snug">
                            التزامك بموعد الرمي (6-9 مساءً) يمنع تراكم القمامة وانتشار الحشرات.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 items-start p-2 rounded-lg hover:bg-slate-50 transition cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-lime-100 text-lime-600 flex items-center justify-center shrink-0 text-sm group-hover:scale-110 transition-transform">
                        🌳
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-slate-800 mb-0.5">شجرة أمام كل بيت</h3>
                        <p className="text-[10px] text-slate-500 leading-snug">
                            ساهم في تلطيف الجو وزراعة شجرة أمام منزلك.
                        </p>
                    </div>
                </div>

                <button className="w-full py-2 text-xs font-bold text-slate-500 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition border border-dashed border-slate-200">
                    عرض دليـل المواطنة الكامل
                </button>
            </div>
        </div>
    );
}
