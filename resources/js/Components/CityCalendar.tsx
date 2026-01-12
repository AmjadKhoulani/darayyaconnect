export default function CityCalendar() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span>📅</span> دليل اليوم
            </h3>

            <div className="space-y-4">
                {/* Electricity Schedule */}
                <div className="flex gap-3 items-start p-3 bg-amber-50 rounded-xl border border-amber-100/50">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-lg">⚡</div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">الكهرباء (المتوقعة)</h4>
                        <div className="text-xs text-slate-600 mt-1 flex gap-2">
                            <span className="bg-white px-2 py-0.5 rounded text-green-600 border border-amber-100 font-bold">وصل: 2 - 4</span>
                            <span className="bg-white px-2 py-0.5 rounded text-red-600 border border-amber-100 font-bold">قطع: 4 - 10</span>
                        </div>
                    </div>
                </div>

                {/* Pharmacy on Duty */}
                <div className="flex gap-3 items-start p-3 bg-emerald-50 rounded-xl border border-emerald-100/50">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg">💊</div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">صيدليات مناوبة</h4>
                        <p className="text-xs text-slate-600 mt-1">صيدلية الشفاء (الكورنيش)<br />صيدلية الأمل (دوار الباسل)</p>
                    </div>
                </div>

                {/* Water Schedule */}
                <div className="flex gap-3 items-start p-3 bg-blue-50 rounded-xl border border-blue-100/50">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-lg">💧</div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">ضخ المياه</h4>
                        <p className="text-xs text-slate-600 mt-1">المنطقة الشمالية (اليوم)<br />المنطقة القبلية (غداً)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
