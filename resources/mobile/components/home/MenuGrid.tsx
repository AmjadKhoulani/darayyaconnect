import { Link } from 'react-router-dom';
import { Map, Phone, Search, AlertTriangle, Calendar, Hash, Lightbulb } from 'lucide-react';

interface MenuGridProps {
    serviceStates: any[];
}

export default function MenuGrid({ serviceStates }: MenuGridProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
                <Link
                    to="/map"
                    className="group relative bg-blue-600 dark:bg-blue-700 rounded-[32px] p-6 shadow-premium active:scale-[0.98] transition-all h-36 flex items-center overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700"></div>
                    <div className="absolute right-[-20%] bottom-[-50%] w-[200px] h-[200px] bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>

                    <div className="relative z-10 flex flex-row items-center gap-5 w-full">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner group-hover:rotate-6 transition-transform">
                            <Map size={32} className="text-white drop-shadow-md" />
                        </div>
                        <div>
                            <h4 className="font-black text-white text-xl mb-1 drop-shadow-sm">الخريطة التفاعلية</h4>
                            <p className="text-blue-100/90 text-sm font-medium">استكشف الخدمات من حولك</p>
                        </div>
                    </div>
                </Link>
            </div>

            <div>
                <Link to="/directory" className="premium-card p-5 h-full flex flex-col items-start hover:shadow-premium transition-all active:scale-95 group relative overflow-hidden">
                    <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-4 border border-amber-100 dark:border-amber-800/50 group-hover:scale-110 transition-transform">
                        <Phone size={24} />
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">دليل المدينة</h4>
                </Link>
            </div>

            <div>
                <Link to="/lost-found" className="bg-indigo-600 dark:bg-indigo-700 p-5 rounded-[20px] hover:shadow-premium transition-all active:scale-95 group block h-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 opacity-90"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-4 border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
                            <Search size={24} />
                        </div>
                        <h4 className="font-bold text-white text-sm">المفقودات 🔍</h4>
                    </div>
                </Link>
            </div>

            <div className="col-span-2">
                <Link to="/services-status" className="premium-card p-5 hover:shadow-premium transition-all active:scale-[0.98] group flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 rounded-2xl flex items-center justify-center border border-rose-100 dark:border-rose-800/50 shadow-inner-soft group-hover:animate-pulse">
                            <AlertTriangle size={28} />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-800 dark:text-slate-100 text-base mb-1">حالة الخدمات</h4>
                            <div className="flex gap-2 flex-wrap">
                                {serviceStates.length > 0 ? (
                                    serviceStates.map((service) => (
                                        <span
                                            key={service.id}
                                            className={`text-[10px] bg-${service.status_color}-100 dark:bg-${service.status_color}-900/30 text-${service.status_color}-700 dark:text-${service.status_color}-400 px-2.5 py-1 rounded-full font-bold shadow-sm border border-${service.status_color}-200 dark:border-${service.status_color}-800/50`}
                                        >
                                            {service.name}: {service.status_text}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-[10px] text-slate-400">جاري التحميل...</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/40 group-hover:text-rose-500 transition-colors">
                        <span className="text-xl rotate-180">➜</span>
                    </div>
                </Link>
            </div>

            <div>
                <Link to="/books" className="bg-teal-600 dark:bg-teal-700 p-5 rounded-[20px] hover:shadow-premium transition-all active:scale-95 group block h-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-600 opacity-90"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-4 border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
                            <span className="text-2xl">📚</span>
                        </div>
                        <h4 className="font-bold text-white text-sm">مكتبة الكتب</h4>
                    </div>
                </Link>
            </div>

            <div>
                <Link to="/events" className="bg-orange-500 dark:bg-orange-600 p-5 rounded-[20px] hover:shadow-premium transition-all active:scale-95 group block h-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 opacity-90"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-4 border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
                            <Calendar size={24} />
                        </div>
                        <h4 className="font-bold text-white text-sm">فعاليات المدينة 🗓️</h4>
                    </div>
                </Link>
            </div>

            <div className="col-span-2">
                <Link to="/hashtag" className="premium-card p-5 hover:shadow-premium transition-all active:scale-95 group relative overflow-hidden block">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-800/50 shadow-inner-soft group-hover:rotate-12 transition-transform">
                            <Hash size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">هاشتاغ #الدردشة 💬</h4>
                            <p className="text-[10px] text-slate-500">انضم للنقاشات المباشرة</p>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="col-span-2">
                <Link to="/skills" className="premium-card p-5 hover:shadow-premium transition-all active:scale-95 group relative overflow-hidden block">
                    <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/0 rounded-full blur-2xl -ml-6 -mt-6"></div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center border border-purple-100 dark:border-purple-800/50 shadow-inner-soft group-hover:scale-110 transition-transform">
                            <Lightbulb size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">دليل النجاح والربح 🚀</h4>
                            <p className="text-[10px] text-slate-500">نصائح للعمل الحر والذكاء الاصطناعي</p>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="col-span-2">
                <Link to="/awareness" className="bg-purple-600 dark:bg-purple-700 rounded-[32px] p-6 shadow-premium active:scale-[0.98] transition-all h-32 flex items-center block relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-fuchsia-600 dark:from-purple-700 dark:to-fuchsia-700"></div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex flex-row items-center gap-4 w-full">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
                            <span className="text-3xl">🎓</span>
                        </div>
                        <div>
                            <h4 className="font-black text-white text-lg mb-1 drop-shadow-sm">التوعية المجتمعية</h4>
                            <p className="text-purple-100/90 text-xs font-medium">مقالات، نصائح، وإرشادات تهمك</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
