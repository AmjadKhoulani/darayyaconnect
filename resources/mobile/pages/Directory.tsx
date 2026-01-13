import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Phone, Search, AlertCircle, Building2, MapPin, ChevronRight, Ambulance, ShieldAlert, HeartPulse } from 'lucide-react';

export default function Directory() {
    const [contacts, setContacts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/portal/directory')
            .then(res => setContacts(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const filteredContacts = contacts.filter(c =>
        c.name.includes(searchTerm) || (c.department && c.department.includes(searchTerm))
    );

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
                            <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">أرقام التواصل والخدمات</p>
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-white/10 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 dark:border-white/5 text-white">
                        <Phone size={24} />
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
                            placeholder="ابحث عن جهة أو خدمة..."
                            className="w-full bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/10 dark:border-white/5 rounded-2xl py-4 pr-12 pl-4 text-white placeholder-slate-400 focus:bg-white/20 transition-colors focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            <main className="px-5 -mt-8 relative z-20 space-y-6">
                {/* Emergency Section */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-premium border border-red-50 dark:border-red-900/30 relative overflow-hidden group transition-colors duration-300">
                    <div className="absolute right-0 top-0 w-20 h-full bg-red-50/50 dark:bg-red-900/10 skew-x-[-20deg] mr-[-20px] group-hover:mr-[-10px] transition-all"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center shadow-inner">
                                <AlertCircle size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">الطوارئ الموحد</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold">إسعاف • إطفاء • شرطة</p>
                            </div>
                        </div>
                        <button className="bg-red-600 dark:bg-red-700 text-white px-6 py-3 rounded-xl font-black text-xl shadow-lg shadow-red-500/30 active:scale-95 transition-transform flex items-center gap-2">
                            <span>112</span>
                            <Phone size={18} className="fill-current text-white" />
                        </button>
                    </div>
                </div>

                {/* Quick Categories */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex items-center gap-3">
                        <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
                            <ShieldAlert size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-700 dark:text-slate-200 text-sm">الشرطة</div>
                            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">115</div>
                        </div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30 flex items-center gap-3">
                        <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm">
                            <HeartPulse size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-700 dark:text-slate-200 text-sm">الإسعاف</div>
                            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">110</div>
                        </div>
                    </div>
                    {/* Add Ampere Link */}
                    <button onClick={() => navigate('/generators')} className="col-span-2 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-2xl border border-yellow-100 dark:border-yellow-900/30 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400 shadow-sm">
                                <span className="text-xl">⚡</span>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-slate-700 dark:text-slate-200 text-sm">شركات الأمبير</div>
                                <div className="text-[10px] text-yellow-600 dark:text-yellow-400 font-bold">دليل المولدات والاشتراكات</div>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-slate-400 rotate-180 group-hover:text-yellow-600 transition-colors" />
                    </button>

                    {/* Police Station Special Entry */}
                    <div className="col-span-2 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-sm">
                                <ShieldAlert size={20} />
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">مخفر داريا</div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold" dir="ltr">+963 935 738 430</div>
                            </div>
                        </div>
                        <a href="tel:+963935738430" className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-95 transition-transform">
                            <Phone size={18} />
                        </a>
                    </div>
                </div>

                {/* Directory List */}
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 px-2 flex items-center gap-2">
                    <Building2 size={20} className="text-emerald-500 dark:text-emerald-400" />
                    الدوائر الخدمية
                </h3>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-24 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredContacts.length > 0 ? filteredContacts.map((contact, index) => (
                            <div key={index} className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-premium hover:border-emerald-200 dark:hover:border-emerald-700 transition-all group flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-700 group-hover:bg-emerald-500 dark:group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                                        <Building2 size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-800 dark:text-slate-100 mb-1">{contact.name}</h4>
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-[10px] font-bold border border-slate-100 dark:border-slate-700">
                                            <MapPin size={10} />
                                            {contact.department || 'خدمات عامة'}
                                        </span>
                                    </div>
                                </div>
                                <a
                                    href={`tel:${contact.phone}`}
                                    className="w-12 h-12 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700 group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-slate-900 group-hover:border-slate-900 dark:group-hover:border-white transition-all shadow-sm active:scale-95"
                                >
                                    <Phone size={20} />
                                </a>
                            </div>
                        )) : (
                            <div className="text-center py-10 opacity-50">
                                <div className="text-4xl mb-2">🔍</div>
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">لا توجد نتائج</p>
                            </div>
                        )}

                        {contacts.length === 0 && !loading && (
                            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 p-8 text-center">
                                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
                                    <Phone size={32} />
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">القائمة فارغة</h3>
                                <p className="text-slate-400 dark:text-slate-500 text-xs">لم يتم إضافة جهات اتصال بعد</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
