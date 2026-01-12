import { useState, useEffect } from 'react';
import { Phone, Building2, Wrench, HeartPulse, Search, MapPin } from 'lucide-react';

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
            .then(res => res.json())
            .then(data => setServices(data))
            .catch(err => console.error(err));
    }, []);

    const filteredServices = services.filter(s => {
        const matchesCategory = activeCat === 'all' || s.category === activeCat;
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.role.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 mt-6 overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -ml-16 -mt-16 opacity-50"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                            <Building2 className="text-emerald-500" size={24} />
                            دليل الخدمات
                        </h3>
                        <p className="text-xs text-slate-400 font-bold mt-1">أرقام التواصل الهامة في داريا</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-4 group">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pr-10 pl-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder-slate-400"
                        placeholder="ابحث عن طبيب، صيدلية، ورشة..."
                    />
                </div>

                {/* Categories */}
                <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCat(cat.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${activeCat === cat.id
                                ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                    {filteredServices.length > 0 ? filteredServices.map(service => (
                        <div key={service.id} className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:border-emerald-200 hover:shadow-md transition-all cursor-default">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-colors ${service.category === 'health' ? 'bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white' :
                                        service.category === 'maintenance' ? 'bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white' :
                                            'bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white'
                                    }`}>
                                    {service.category === 'health' ? <HeartPulse size={20} /> :
                                        service.category === 'maintenance' ? <Wrench size={20} /> :
                                            <Phone size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-emerald-700 transition-colors">{service.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold border border-slate-200">
                                            {service.role}
                                        </span>
                                        <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                            <MapPin size={10} /> {service.location || 'داريا'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <a
                                href={`tel:${service.phone}`}
                                className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center border border-slate-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all shadow-sm active:scale-95"
                            >
                                <Phone size={18} />
                            </a>
                        </div>
                    )) : (
                        <div className="text-center py-8 text-slate-400">
                            <Search className="w-12 h-12 mx-auto mb-2 opacity-20" />
                            <p className="text-sm font-bold">لا توجد نتائج</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
