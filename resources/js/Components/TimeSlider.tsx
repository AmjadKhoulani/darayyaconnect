import { useState } from 'react';

interface TimeSliderProps {
    onChange: (hours: number) => void;
}

export default function TimeSlider({ onChange }: TimeSliderProps) {
    const [value, setValue] = useState(24); // Default 24 hours

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        setValue(val);
        onChange(val);
    };

    const getLabel = (val: number) => {
        if (val === 1) return 'الساعة الأخيرة';
        if (val === 24) return 'آخر 24 ساعة';
        if (val === 168) return 'آخر أسبوع';
        if (val === 720) return 'آخر شهر';
        return `آخر ${val} ساعة`;
    };

    // Steps mapping for a non-linear feel using a linear range input is tricky,
    // so we'll just stick to specific meaningful stops or a continuous linear scale.
    // Let's use specific stops for better UX.
    const stops = [1, 6, 12, 24, 48, 168, 720];
    // We will use the index of stops as the actual slider value for smooth stepping.

    const [stepIndex, setStepIndex] = useState(3); // Default to index 3 (24h)

    const handleStepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const idx = parseInt(e.target.value);
        setStepIndex(idx);
        const hours = stops[idx];
        onChange(hours);
    };

    return (
        <div
            className="absolute bottom-24 left-4 right-4 z-30 w-auto rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-lg backdrop-blur md:left-1/2 md:right-auto md:w-96 md:-translate-x-1/2"
            dir="rtl"
        >
            <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                    آلة الزمن ⏳
                </span>
                <span className="rounded-md bg-blue-50 px-2 py-1 text-sm font-bold text-blue-600">
                    {getLabel(stops[stepIndex])}
                </span>
            </div>

            <input
                type="range"
                min="0"
                max={stops.length - 1}
                step="1"
                value={stepIndex}
                onChange={handleStepChange}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
            />

            <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-400">
                <span>الآن</span>
                <span>الماضي</span>
            </div>
        </div>
    );
}
