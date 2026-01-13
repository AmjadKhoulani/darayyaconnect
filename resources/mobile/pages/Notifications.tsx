import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Bell, Calendar, MessageCircle, AlertTriangle, CheckCircle2, ChevronLeft } from 'lucide-react';
import api from '../services/api';
import { usePullToRefresh, PullToRefreshContainer } from '../hooks/usePullToRefresh';

export default function Notifications() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    const fetchNotifications = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1000));

        // Demo Data
        setNotifications([
            {
                id: 1,
                type: 'alert',
                title: 'تنبيه انقطاع مياه',
                body: 'سيتم قطع المياه عن حي الشاميات غداً للصيانة من اساعة 9 صباحاً.',
                date: 'منذ ساعة',
                read: false
            },
            {
                id: 2,
                type: 'success',
                title: 'تم قبول اقتراحك',
                body: 'وافق المجلس على اقتراحك بخصوص "إنارة الحديقة العامة". شكراً لمساهمتك!',
                date: 'منذ يوم',
                read: true
            },
            {
                id: 3,
                type: 'info',
                title: 'تذكير: موعد التصويت',
                body: 'سينتهي التصويت على مشروع "تعبيد الطرق" خلال 24 ساعة.',
                date: 'منذ يومين',
                read: true
            },
            {
                id: 4,
                type: 'community',
                title: 'رد جديد على موضوعك',
                body: 'قام "أحمد" بالرد على موضوعك في المنتدى.',
                date: 'منذ 3 أيام',
                read: true
            }
        ]);
        setLoading(false);
    };

    const { isRefreshing, pullMoveY, handlers } = usePullToRefresh(fetchNotifications);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'alert': return <AlertTriangle size={20} />;
            case 'success': return <CheckCircle2 size={20} />;
            case 'community': return <MessageCircle size={20} />;
            default: return <Bell size={20} />;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'alert': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30';
            case 'success': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30';
            case 'community': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30';
            default: return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl" {...handlers}>
            <PullToRefreshContainer isRefreshing={isRefreshing} pullMoveY={pullMoveY}>

                {/* Header */}
                <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 py-4 shadow-sm flex items-center justify-between transition-colors duration-300">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700">
                            <ChevronLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">الإشعارات</h1>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">آخر التنبيهات والمستجدات</p>
                        </div>
                    </div>
                </header>

                <main className="px-4 py-6 space-y-4">
                    {notifications.map((notif, index) => (
                        <div
                            key={notif.id}
                            className={`bg-white dark:bg-slate-800 p-4 rounded-2xl border ${notif.read ? 'border-slate-100 dark:border-slate-700/50' : 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/10 dark:bg-emerald-900/10'} shadow-premium flex gap-4 transition-all animate-fade-in-up hover:scale-[1.01] active:scale-[0.99]`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${getColor(notif.type)} shrink-0 shadow-sm`}>
                                {getIcon(notif.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`text-sm font-bold ${notif.read ? 'text-slate-800' : 'text-emerald-800'}`}>{notif.title}</h3>
                                    <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">{notif.date}</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium line-clamp-2 opacity-90">
                                    {notif.body}
                                </p>
                            </div>
                        </div>
                    ))}

                    {notifications.length === 0 && !loading && (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
                                <Bell size={32} />
                            </div>
                            <h3 className="text-slate-500 dark:text-slate-400 font-bold">لا توجد إشعارات جديدة</h3>
                        </div>
                    )}
                </main>
            </PullToRefreshContainer>
        </div>
    );
}
