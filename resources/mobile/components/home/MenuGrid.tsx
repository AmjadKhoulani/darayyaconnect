import { Link } from 'react-router-dom';
import { Map, Phone, Search, AlertTriangle, Calendar, Hash, Lightbulb } from 'lucide-react';

interface MenuGridProps {
    serviceStates: any[];
}

export default function MenuGrid({ serviceStates }: MenuGridProps) {
    return (
        <div className="grid grid-cols-2 gap-3">
            {/* Map Card - Main Feature */}
            <div className="col-span-2">
                <Link
                    to="/map"
                    className="group relative bg-indigo-50 dark:bg-indigo-900/20 rounded-[28px] p-6 active:scale-[0.99] transition-all h-32 flex items-center overflow-hidden border border-indigo-100 dark:border-indigo-800/30"
                >
                    <div className="absolute right-[-10%] bottom-[-50%] w-32 h-32 bg-indigo-200/50 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>

                    <div className="relative z-10 flex flex-row items-center gap-5 w-full">
                        <div className="w-14 h-14 bg-white dark:bg-indigo-800 rounded-2xl flex items-center justify-center shadow-sm text-indigo-600 dark:text-indigo-300 group-hover:rotate-6 transition-transform">
                            <Map size={28} />
                        </div>
                        <div>
                            <h4 className="font-black text-indigo-900 dark:text-indigo-100 text-lg mb-1">الخريطة التفاعلية</h4>
                            <p className="text-indigo-600/80 dark:text-indigo-300/80 text-xs font-bold">بوابة خدمات المدينة</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* City Reports - Replaces old Status Link */}
            <div className="col-span-2">
                <Link to="/city-reports" className="bg-white dark:bg-slate-800 p-4 rounded-[24px] border border-slate-100 dark:border-slate-700/50 shadow-sm active:scale-[0.98] transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-xl flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                            <AlertTriangle size={20} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">بلاغات المدينة</h4>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">استعرض المشاكل والبلاغات في داريا</p>
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/40 group-hover:text-rose-500 transition-colors">
                        <span className="text-xl rotate-180">➜</span>
                    </div>
                </Link>
            </div>

            {/* Directory */}
            <div>
                <Link to="/directory" className="bg-emerald-50 dark:bg-emerald-900/20 p-4 h-full rounded-[24px] flex flex-col items-center justify-center text-center gap-3 active:scale-95 transition-all border border-emerald-100 dark:border-emerald-800/30">
                    <div className="w-10 h-10 bg-white dark:bg-emerald-800 rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
                        <Phone size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-emerald-900 dark:text-emerald-100 text-sm">الدليل</h4>
                    </div>
                </Link>
            </div>

            {/* Lost & Found */}
            <div>
                <Link to="/lost-found" className="bg-amber-50 dark:bg-amber-900/20 p-4 h-full rounded-[24px] flex flex-col items-center justify-center text-center gap-3 active:scale-95 transition-all border border-amber-100 dark:border-amber-800/30">
                    <div className="w-10 h-10 bg-white dark:bg-amber-800 rounded-full flex items-center justify-center text-amber-600 shadow-sm">
                        <Search size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-amber-900 dark:text-amber-100 text-sm">المفقودات</h4>
                    </div>
                </Link>
            </div>

            {/* Library */}
            <div>
                <Link to="/books" className="bg-cyan-50 dark:bg-cyan-900/20 p-4 h-full rounded-[24px] flex flex-col items-center justify-center text-center gap-3 active:scale-95 transition-all border border-cyan-100 dark:border-cyan-800/30">
                    <div className="w-10 h-10 bg-white dark:bg-cyan-800 rounded-full flex items-center justify-center text-cyan-600 shadow-sm">
                        <span className="text-lg">📚</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-cyan-900 dark:text-cyan-100 text-sm">المكتبة</h4>
                    </div>
                </Link>
            </div>

            {/* Events */}
            <div>
                <Link to="/events" className="bg-pink-50 dark:bg-pink-900/20 p-4 h-full rounded-[24px] flex flex-col items-center justify-center text-center gap-3 active:scale-95 transition-all border border-pink-100 dark:border-pink-800/30">
                    <div className="w-10 h-10 bg-white dark:bg-pink-800 rounded-full flex items-center justify-center text-pink-600 shadow-sm">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-pink-900 dark:text-pink-100 text-sm">الفعاليات</h4>
                    </div>
                </Link>
            </div>

            {/* Hashtag */}
            <div className="col-span-2">
                <Link to="/hashtag" className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-[24px] flex items-center gap-4 active:scale-[0.98] transition-all border border-violet-100 dark:border-violet-800/30">
                    <div className="w-12 h-12 bg-white dark:bg-violet-800 rounded-2xl flex items-center justify-center text-violet-600 shadow-sm">
                        <Hash size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-violet-900 dark:text-violet-100 text-sm">#الدردشة_العامة</h4>
                        <p className="text-[10px] text-violet-600/70 dark:text-violet-300/70">شارك في نقاشات المدينة</p>
                    </div>
                </Link>
            </div>

            {/* Skills */}
            <div className="col-span-2">
                <Link to="/skills" className="bg-sky-50 dark:bg-sky-900/20 p-4 rounded-[24px] flex items-center gap-4 active:scale-[0.98] transition-all border border-sky-100 dark:border-sky-800/30">
                    <div className="w-12 h-12 bg-white dark:bg-sky-800 rounded-2xl flex items-center justify-center text-sky-600 shadow-sm">
                        <Lightbulb size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-sky-900 dark:text-sky-100 text-sm">دليل النجاح</h4>
                        <p className="text-[10px] text-sky-600/70 dark:text-sky-300/70">طور مهاراتك</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
