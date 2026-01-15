
interface QuickStatsProps {
    stats: {
        population: number;
        activeUsers: number;
        reports: number;
    };
}

export default function QuickStats({ stats }: QuickStatsProps) {
    return (
        <div className="grid grid-cols-3 gap-4">
            {[
                { label: 'السكان', value: stats.population.toLocaleString(), icon: '👥', color: 'text-slate-900' },
                { label: 'نشط الآن', value: stats.activeUsers, icon: '✅', color: 'text-emerald-600' },
                { label: 'بلاغات', value: stats.reports, icon: '📨', color: 'text-orange-600' }
            ].map((stat, i) => (
                <div
                    key={i}
                    className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col items-center justify-center text-center transition-all duration-200 active:scale-[0.98] [contain:content]"
                >
                    <span className="text-2xl mb-2 drop-shadow-sm">{stat.icon}</span>
                    <h3 className={`text-xl font-black ${stat.color} dark:text-slate-100`}>{stat.value}</h3>
                    <p className="text-slate-500 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                </div>
            ))}
        </div>
    );
}
