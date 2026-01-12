import { useState, useEffect } from 'react';

interface Service {
    id: number;
    name: string;
    status: string;
    details: string;
    icon: string;
}

export default function ServiceStatus() {
    const [statuses, setStatuses] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/portal/services')
            .then(res => res.json())
            .then(data => {
                setStatuses(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    if (loading) return <div className="h-24 w-full flex items-center justify-center text-slate-400 text-xs">جاري تحميل الخدمات...</div>;

    return (
        <div className="w-full overflow-x-auto py-6 no-scrollbar">
            <div className="flex gap-4 px-4 min-w-max justify-center md:justify-start">
                {statuses.map((service) => (
                    <div key={service.id} className="flex flex-col items-center gap-2 cursor-pointer group relative">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md transition-all duration-300 transform group-hover:-translate-y-1 ${service.status === 'on' ? 'bg-white border-2 border-emerald-100 text-emerald-600 shadow-emerald-100' :
                                service.status === 'warning' ? 'bg-white border-2 border-amber-100 text-amber-500 shadow-amber-100' :
                                    'bg-white border-2 border-rose-100 text-rose-500 shadow-rose-100'
                            }`}>
                            {service.icon}

                            {/* Status Indicator Dot */}
                            <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${service.status === 'on' ? 'bg-emerald-500' :
                                    service.status === 'warning' ? 'bg-amber-500' :
                                        'bg-rose-500'
                                }`}></span>
                        </div>

                        <span className="text-sm font-bold text-gray-700">{service.name}</span>

                        {/* Tooltip */}
                        <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-20 pointer-events-none shadow-xl">
                            {service.details}
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
