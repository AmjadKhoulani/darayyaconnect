export default function CityStatsWidget({
    stats,
    minimal = false,
}: {
    stats: any;
    minimal?: boolean;
}) {
    if (!stats) return null;

    if (minimal) {
        return (
            <div className="flex w-full justify-between divide-x divide-x-reverse divide-slate-100">
                <MinimalStat
                    icon="⚡"
                    label="محولة"
                    value={stats.transformers || 0}
                />
                <MinimalStat icon="💧" label="بئر" value={stats.wells || 0} />
                <MinimalStat
                    icon="🏫"
                    label="مدرسة"
                    value={stats.schools || 0}
                />
                <MinimalStat icon="🏥" label="صحي" value={stats.clinics || 0} />
            </div>
        );
    }

    return (
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard
                icon="⚡"
                label="محولة كهرباء"
                value={stats.transformers || 0}
                color="amber"
            />
            <StatCard
                icon="💧"
                label="بئر مياه"
                value={stats.wells || 0}
                color="blue"
            />
            <StatCard
                icon="🏫"
                label="مدرسة"
                value={stats.schools || 0}
                color="emerald"
            />
            <StatCard
                icon="🏥"
                label="مركز صحي"
                value={stats.clinics || 0}
                color="rose"
            />
        </div>
    );
}

function MinimalStat({ icon, label, value }: any) {
    return (
        <div className="flex flex-1 flex-col items-center px-2 text-center">
            <span className="mb-1 text-sm">{icon}</span>
            <span className="text-lg font-bold leading-none text-slate-800">
                {value}
            </span>
            <span className="mt-1 text-[10px] text-slate-400">{label}</span>
        </div>
    );
}

function StatCard({ icon, label, value, color }: any) {
    const colors: any = {
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        rose: 'bg-rose-50 text-rose-600 border-rose-100',
    };

    return (
        <div
            className={`flex flex-col items-center justify-center rounded-2xl border p-4 transition hover:shadow-md ${colors[color] || 'bg-gray-50'}`}
        >
            <div className="mb-2 text-3xl">{icon}</div>
            <div className="mb-1 text-2xl font-black">{value}</div>
            <div className="text-xs font-bold opacity-80">{label}</div>
        </div>
    );
}
