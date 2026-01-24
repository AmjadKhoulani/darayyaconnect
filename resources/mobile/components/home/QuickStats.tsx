
interface QuickStatsProps {
    stats: {
        population: number;
        activeUsers: number;
        reports: number;
    };
}

export default function QuickStats({ stats }: QuickStatsProps) {
    return (
        <div className="w-full">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700/50 flex items-center justify-between transition-all duration-200 active:scale-[0.98]">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100">{stats.population.toLocaleString()}</h3>
                    <p className="text-slate-500 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">نسمة في داريا</p>
                </div>
                <div className="h-14 w-14 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center text-3xl">
                    👥
                </div>
            </div>
        </div>
    );
}
