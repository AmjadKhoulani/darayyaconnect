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
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
            {/* Immersive Header */}
            <div className="bg-slate-900 pb-12 pt-6 px-4 rounded-b-[40px] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full -ml-12 -mb-12 blur-3xl"></div>

                <header className="relative z-10 flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all">
                            <span className="text-xl transform rotate-180">➜</span>
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-white">دليل المدينة</h1>
                            <p className="text-slate-400 text-xs font-medium">أرقام التواصل والخدمات</p>
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 text-white">
                        <Phone size={24} />
                    </div>
                </header>

                {/* Search Bar */}
                <div className="relative z-10">
                    <div className="relative">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="ابحث عن جهة أو خدمة..."
                            className="w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white placeholder-slate-400 focus:bg-white/20 transition-colors focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            <main className="px-5 -mt-8 relative z-20 space-y-6">
                {/* Emergency Section */}
                <div className="bg-white rounded-3xl p-5 shadow-xl shadow-red-500/10 border border-red-50 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-20 h-full bg-red-50/50 skew-x-[-20deg] mr-[-20px] group-hover:mr-[-10px] transition-all"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shadow-inner">
                                <AlertCircle size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800">الطوارئ الموحد</h3>
                                <p className="text-slate-500 text-xs font-bold">إسعاف • إطفاء • شرطة</p>
                            </div>
                        </div>
                        <button className="bg-red-600 text-white px-6 py-3 rounded-xl font-black text-xl shadow-lg shadow-red-500/30 active:scale-95 transition-transform flex items-center gap-2">
                            <span>112</span>
                            <Phone size={18} className="fill-current" />
                        </button>
                    </div>
                </div>

                {/* Quick Categories */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                            <ShieldAlert size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-700 text-sm">الشرطة</div>
                            <div className="text-[10px] text-blue-600 font-bold">115</div>
                        </div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-amber-600 shadow-sm">
                            <HeartPulse size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-700 text-sm">الإسعاف</div>
                            <div className="text-[10px] text-amber-600 font-bold">110</div>
                        </div>
                    </div>
                </div>

                {/* Directory List */}
                <h3 className="text-lg font-black text-slate-800 px-2 flex items-center gap-2">
                    <Building2 size={20} className="text-emerald-500" />
                    الدوائر الخدمية
                </h3>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-24 bg-white rounded-3xl border border-slate-100 shadow-sm animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredContacts.length > 0 ? filteredContacts.map((contact, index) => (
                            <div key={index} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:border-emerald-200 transition-all group flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                                        <Building2 size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-800 mb-1">{contact.name}</h4>
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-500 text-[10px] font-bold border border-slate-100">
                                            <MapPin size={10} />
                                            {contact.department || 'خدمات عامة'}
                                        </span>
                                    </div>
                                </div>
                                <a
                                    href={`tel:${contact.phone}`}
                                    className="w-12 h-12 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center border border-slate-200 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all shadow-sm active:scale-95"
                                >
                                    <Phone size={20} />
                                </a>
                            </div>
                        )) : (
                            <div className="text-center py-10 opacity-50">
                                <div className="text-4xl mb-2">🔍</div>
                                <p className="text-sm font-bold text-slate-900">لا توجد نتائج</p>
                            </div>
                        )}

                        {contacts.length === 0 && !loading && (
                            <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-8 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                    <Phone size={32} />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1">القائمة فارغة</h3>
                                <p className="text-slate-400 text-xs">لم يتم إضافة جهات اتصال بعد</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
