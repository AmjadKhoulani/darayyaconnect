export default function CityCalendar() {
    return (
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                <span>📅</span> دليل اليوم
            </h3>

            <div className="space-y-4">
                {/* Electricity Schedule */}
                <div className="flex items-start gap-3 rounded-xl border border-amber-100/50 bg-amber-50 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-lg text-amber-600">
                        ⚡
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">
                            الكهرباء (المتوقعة)
                        </h4>
                        <div className="mt-1 flex gap-2 text-xs text-slate-600">
                            <span className="rounded border border-amber-100 bg-white px-2 py-0.5 font-bold text-green-600">
                                وصل: 2 - 4
                            </span>
                            <span className="rounded border border-amber-100 bg-white px-2 py-0.5 font-bold text-red-600">
                                قطع: 4 - 10
                            </span>
                        </div>
                    </div>
                </div>

                {/* Pharmacy on Duty */}
                <div className="flex items-start gap-3 rounded-xl border border-emerald-100/50 bg-emerald-50 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-lg text-emerald-600">
                        💊
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">
                            صيدليات مناوبة
                        </h4>
                        <p className="mt-1 text-xs text-slate-600">
                            صيدلية الشفاء (الكورنيش)
                            <br />
                            صيدلية الأمل (دوار الباسل)
                        </p>
                    </div>
                </div>

                {/* Water Schedule */}
                <div className="flex items-start gap-3 rounded-xl border border-blue-100/50 bg-blue-50 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-lg text-blue-600">
                        💧
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">
                            ضخ المياه
                        </h4>
                        <p className="mt-1 text-xs text-slate-600">
                            المنطقة الشمالية (اليوم)
                            <br />
                            المنطقة القبلية (غداً)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
