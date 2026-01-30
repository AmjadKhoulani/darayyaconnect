import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Search, Building2, MapPin, Globe, Star, ShieldCheck, Zap, Droplets, Gavel, Landmark, Loader2 } from 'lucide-react';
import api from '../services/api';

interface DirectoryItem {
    id: number;
    name: string;
    phone: string;
    icon: string;
    type: string;
    category: string;
    rating?: number;
    metadata?: any;
}

export default function Directory() {
    const [searchTerm, setSearchTerm] = useState('');
    const [items, setItems] = useState<DirectoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDirectory();
    }, []);

    const fetchDirectory = async () => {
        try {
            const response = await api.get('/directory');
            setItems(response.data);
        } catch (error) {
            console.error('Failed to fetch directory', error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (iconName: string) => {
        const icons: any = { Landmark, ShieldCheck, Gavel, Droplets, Zap, Globe, Building2 };
        return icons[iconName] || Building2;
    };

    const officialEntities = items.filter(i => i.category === 'official' || i.category === 'emergency');
    const internetCompanies = items.filter(i => i.category === 'company');



    const filteredEntities = officialEntities.filter(c => c.name.includes(searchTerm));
    const filteredCompanies = internetCompanies.filter(c => c.name.includes(searchTerm));

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl">
            {/* Immersive Header */}
            <div className="bg-slate-900 dark:bg-slate-950 pb-12 pt-6 px-4 rounded-b-[40px] relative overflow-hidden shadow-2xl transition-colors duration-300">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full -ml-12 -mb-12 blur-3xl"></div>

                <header className="relative z-10 flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/10 dark:bg-slate-800/40 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20 dark:border-white/5 hover:bg-white/20 transition-all">
                            <span className="text-xl transform rotate-180 text-white">➜</span>
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-white">دليل المدينة</h1>
                            <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">الجهات الرسمية والخدمات</p>
                        </div>
                    </div>
                </header>

                {/* Search Bar */}
                <div className="relative z-10">
                    <div className="relative">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="ابحث عن جهة أو شركة..."
                            className="w-full bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/10 dark:border-white/5 rounded-2xl py-4 pr-12 pl-4 text-white placeholder-slate-400 focus:bg-white/20 transition-colors focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            <main className="px-5 -mt-8 relative z-20 space-y-8 max-w-5xl mx-auto w-full">

                {/* Official Entities Section */}
                <section className="space-y-4">
                    <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Building2 size={20} className="text-emerald-500" />
                        الجهات الرسمية
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredEntities.map((entity, index) => {
                            const Icon = getIcon(entity.icon);
                            return (
                                <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                            <Icon size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-slate-100">{entity.name}</h4>
                                            <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded-full mt-1 inline-block">
                                                {entity.type}
                                            </span>
                                        </div>
                                    </div>
                                    <a href={`tel:${entity.phone}`} className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors">
                                        <Phone size={20} />
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Internet Companies Section */}
                <section className="space-y-4">
                    <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Globe size={20} className="text-blue-500" />
                        شركات الإنترنت
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredCompanies.map((company, index) => (
                            <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                                            <Globe size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-slate-100">{company.name}</h4>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={10}
                                                        className={i < Math.floor(company.rating || 0) ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"}
                                                    />
                                                ))}
                                                <span className="text-[10px] text-slate-400 mr-1">({company.rating})</span>
                                            </div>
                                        </div>
                                    </div>
                                    <a href={`tel:${company.phone}`} className="w-9 h-9 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                                        <Phone size={16} />
                                    </a>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl text-xs">
                                    <span className="text-slate-500 dark:text-slate-400">سرعة الاتصال: <span className="font-bold text-slate-700 dark:text-slate-200">{company.metadata?.speed || 'غير محدد'}</span></span>
                                    <button className="text-blue-600 dark:text-blue-400 font-bold hover:underline">تقييم الأداء</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="h-4"></div>
            </main>
        </div>
    );
}
