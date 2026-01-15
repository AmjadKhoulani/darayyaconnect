import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

interface TabContentProps {
    activeTab: 'news' | 'community' | 'polls';
    newsItems: any[];
}

export default function TabContent({ activeTab, newsItems }: TabContentProps) {
    const navigate = useNavigate();

    return (
        <div className="min-h-[200px]">
            {activeTab === 'news' && (
                <div className="space-y-4">
                    {/* Placeholder content until api/dashboard/news is fully populated with real dynamic content */}
                    {[
                        { title: 'اجتماع دوري لمناقشة خطة الكهرباء', body: 'يدعو المجلس كافة المواطنين لحضور اللقاء المفتوح اليوم مساءً...', color: 'bg-blue-500', icon: 'م', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', time: 'منذ ساعتين', source: 'مجلس المدينة' },
                        { title: 'تعديل ساعات التقنين', body: 'تم اعتماد برنامج 3 وصل مقابل 3 قطع اعتباراً من الغد...', color: 'bg-amber-500', icon: '⚡', iconBg: 'bg-amber-50', iconColor: 'text-amber-600', time: 'أمس', source: 'الكهرباء' }
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/60 dark:border-slate-700/50 shadow-sm relative overflow-hidden group active:scale-[0.99] transition-transform [contain:layout_style]"
                        >
                            <div className={`absolute top-0 right-0 w-1.5 h-full ${item.color}`}></div>
                            <div className="flex gap-4">
                                <div className={`w-11 h-11 ${item.iconBg} dark:bg-slate-900 rounded-xl flex items-center justify-center ${item.iconColor} font-bold text-sm shrink-0 border border-slate-100 dark:border-slate-800 shadow-inner-soft`}>
                                    {item.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.source}</span>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500">• {item.time}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2 leading-tight">{item.title}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                                        {item.body}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'community' && (
                <div className="text-center py-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 shadow-inner-soft">
                    <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400 shadow-md">
                        <MessageCircle size={32} />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">نقاشات الجيران</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">شارك في الحوارات المحلية</p>
                    <button
                        onClick={() => navigate('/discussions')}
                        className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-premium active:scale-95 transition-transform hover:bg-emerald-700"
                    >
                        دخول المنتدى
                    </button>
                </div>
            )}

            {activeTab === 'polls' && (
                <div className="text-center py-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 shadow-inner-soft">
                    <p className="text-sm text-slate-500">لا يوجد استطلاعات رأي نشطة حالياً</p>
                </div>
            )}
        </div>
    );
}
