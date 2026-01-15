import { useEffect, useState } from 'react';

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
            .then((res) => res.json())
            .then((data) => {
                setStatuses(data);
                setLoading(false);
            })
            .catch((err) => console.error(err));
    }, []);

    if (loading)
        return (
            <div className="flex h-24 w-full items-center justify-center text-xs text-slate-400">
                جاري تحميل الخدمات...
            </div>
        );

    return (
        <div className="no-scrollbar w-full overflow-x-auto py-6">
            <div className="flex min-w-max justify-center gap-4 px-4 md:justify-start">
                {statuses.map((service) => (
                    <div
                        key={service.id}
                        className="group relative flex cursor-pointer flex-col items-center gap-2"
                    >
                        <div
                            className={`flex h-16 w-16 transform items-center justify-center rounded-2xl text-3xl shadow-md transition-all duration-300 group-hover:-translate-y-1 ${
                                service.status === 'on'
                                    ? 'border-2 border-emerald-100 bg-white text-emerald-600 shadow-emerald-100'
                                    : service.status === 'warning'
                                      ? 'border-2 border-amber-100 bg-white text-amber-500 shadow-amber-100'
                                      : 'border-2 border-rose-100 bg-white text-rose-500 shadow-rose-100'
                            }`}
                        >
                            {service.icon}

                            {/* Status Indicator Dot */}
                            <span
                                className={`absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white ${
                                    service.status === 'on'
                                        ? 'bg-emerald-500'
                                        : service.status === 'warning'
                                          ? 'bg-amber-500'
                                          : 'bg-rose-500'
                                }`}
                            ></span>
                        </div>

                        <span className="text-sm font-bold text-gray-700">
                            {service.name}
                        </span>

                        {/* Tooltip */}
                        <div className="pointer-events-none absolute top-full z-20 mt-2 whitespace-nowrap rounded-lg bg-gray-800 px-3 py-1.5 text-xs text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                            {service.details}
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
