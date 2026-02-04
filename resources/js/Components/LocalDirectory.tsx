import {
    Building2,
    HeartPulse,
    MapPin,
    Phone,
    Search,
    Wrench,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const categories = [
    { id: 'all', name: 'الكل' },
    { id: 'health', name: 'طب وصحة' },
    { id: 'maintenance', name: 'صيانة' },
    { id: 'transport', name: 'نقل' },
];

interface Contact {
    id: number;
    name: string;
    role: string;
    category: string;
    rating: number;
    location: string;
    status: string;
    phone: string;
}

export default function LocalDirectory() {
    const [activeCat, setActiveCat] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [services, setServices] = useState<Contact[]>([]);

    useEffect(() => {
        fetch('/api/portal/directory')
            .then((res) => res.json())
            .then((data) => setServices(data))
            .catch((err) => console.error(err));
    }, []);

    const filteredServices = services.filter((s) => {
        const matchesCategory = activeCat === 'all' || s.category === activeCat;
        const matchesSearch =
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.role.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="relative mt-6 overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/50 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            {/* Background Decoration */}
            <div className="absolute left-0 top-0 -ml-16 -mt-16 h-32 w-32 rounded-full bg-emerald-50 opacity-50 blur-3xl"></div>

            <div className="relative z-10">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h3 className="flex items-center gap-2 text-lg font-black text-slate-800 dark:text-slate-100">
                            <Building2 className="text-emerald-500" size={24} />
                            دليل الخدمات
                        </h3>
                        <p className="mt-1 text-xs font-bold text-slate-400 dark:text-slate-500">
                            أرقام التواصل الهامة في داريا
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="group relative mb-4">
                    <Search
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-500"
                        size={18}
                    />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-10 text-sm font-medium placeholder-slate-400 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-emerald-500"
                        placeholder="ابحث عن طبيب، صيدلية، ورشة..."
                    />
                </div>

                {/* Categories */}
                <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCat(cat.id)}
                            className={`whitespace-nowrap rounded-xl border px-4 py-2 text-xs font-bold transition-all ${activeCat === cat.id
                                    ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/20 dark:border-emerald-600 dark:bg-emerald-600 dark:shadow-emerald-900/40'
                                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-700'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="custom-scrollbar max-h-[400px] space-y-3 overflow-y-auto pr-1">
                    {filteredServices.length > 0 ? (
                        filteredServices.map((service) => (
                            <div
                                key={service.id}
                                className="group flex cursor-default items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:border-emerald-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-emerald-500/30"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl shadow-sm transition-colors ${service.category === 'health'
                                                ? 'bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white dark:bg-rose-900/20'
                                                : service.category ===
                                                    'maintenance'
                                                    ? 'bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white dark:bg-blue-900/20'
                                                    : 'bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white dark:bg-amber-900/20'
                                            }`}
                                    >
                                        {service.category === 'health' ? (
                                            <HeartPulse size={20} />
                                        ) : service.category ===
                                            'maintenance' ? (
                                            <Wrench size={20} />
                                        ) : (
                                            <Phone size={20} />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="mb-1 text-sm font-bold text-slate-800 transition-colors group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-400">
                                            {service.name}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <span className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                                                {service.role}
                                            </span>
                                            <span className="flex items-center gap-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                                                <MapPin size={10} />{' '}
                                                {service.location || 'داريا'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <a
                                    href={`tel:${service.phone}`}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all hover:border-emerald-500 hover:bg-emerald-500 hover:text-white active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-emerald-500 dark:hover:bg-emerald-500 dark:hover:text-white"
                                >
                                    <Phone size={18} />
                                </a>
                            </div>
                        ))
                    ) : (
                        <div className="py-8 text-center text-slate-400">
                            <Search className="mx-auto mb-2 h-12 w-12 opacity-20" />
                            <p className="text-sm font-bold">لا توجد نتائج</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
