import { Link } from 'react-router-dom';
import { AlertTriangle, Zap, Droplets } from 'lucide-react';

interface StatusWidgetProps {
    serviceStates: any[];
    loading?: boolean;
}

export default function StatusWidget({ serviceStates, loading = false }: StatusWidgetProps) {
    const getServiceIcon = (name: string) => {
        if (name.includes('كهرباء')) return <Zap size={16} />;
        if (name.includes('مياه')) return <Droplets size={16} />;
        return <AlertTriangle size={16} />;
    };

    return (
        <div className="mb-6">
            <Link to="/services-status" className="block">
                <div className="bg-white dark:bg-slate-800 rounded-[24px] p-4 shadow-sm border border-slate-200 dark:border-slate-700/50 relative overflow-hidden group active:scale-[0.99] transition-all">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                            حالة الخدمات في حيّك
                        </h3>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 group-hover:text-rose-500 transition-colors">
                            التفاصيل <span className="text-sm">👈</span>
                        </span>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {loading ? (
                            <div className="flex gap-2 w-full">
                                {[1, 2].map(i => (
                                    <div key={i} className="flex-1 h-10 bg-slate-100 dark:bg-slate-700/50 rounded-xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : serviceStates.length > 0 ? (
                            serviceStates.map((service) => (
                                <div
                                    key={service.id}
                                    className={`flex-none flex items-center gap-2 px-3 py-2 rounded-xl border border-${service.status_color}-100 dark:border-${service.status_color}-800/30 bg-${service.status_color}-50 dark:bg-${service.status_color}-900/10 min-w-[120px]`}
                                >
                                    <div className={`text-${service.status_color}-500 dark:text-${service.status_color}-400`}>
                                        {getServiceIcon(service.name)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-[10px] font-bold text-${service.status_color}-700 dark:text-${service.status_color}-300`}>{service.name}</span>
                                        <span className={`text-[9px] text-${service.status_color}-600/70 dark:text-${service.status_color}-400/70`}>{service.status_text}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="w-full py-2 flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                                <span className="text-lg">✨</span>
                                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">جميع الخدمات تعمل بشكل جيد</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}
