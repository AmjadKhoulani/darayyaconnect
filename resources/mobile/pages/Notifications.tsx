import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bell, Trash2, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import api from '../services/api';
import { usePullToRefresh, PullToRefreshContainer } from '../hooks/usePullToRefresh';

interface Notification {
    id: string;
    type: string;
    data: {
        title: string;
        body: string;
        type?: 'success' | 'warning' | 'info' | 'error';
        entity_id?: string;
        entity_type?: string;
    };
    read_at: string | null;
    created_at: string;
}

export default function Notifications() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            // Mark all as read when opening? Maybe better to have a button or mark individually.
            // For now, let's just fetch.
            const response = await api.get('/api/notifications');
            // Check if response.data.data exists (pagination) or just response.data
            const items = response.data.data || response.data;
            setNotifications(items);

            // Mark as read after fetching (simple approach for now)
            await api.post('/api/notifications/read/all');
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setLoading(false);
        }
    };

    const { isRefreshing, containerRef, indicatorRef, handlers } = usePullToRefresh(fetchNotifications);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle size={20} className="text-emerald-500" />;
            case 'warning': return <AlertTriangle size={20} className="text-amber-500" />;
            case 'error': return <AlertTriangle size={20} className="text-red-500" />;
            default: return <Info size={20} className="text-blue-500" />;
        }
    };

    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'الآن';
        if (seconds < 3600) return `منذ ${Math.floor(seconds / 60)} دقيقة`;
        if (seconds < 86400) return `منذ ${Math.floor(seconds / 3600)} ساعة`;
        return date.toLocaleDateString('ar-SY');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20" dir="rtl" {...handlers}>
            <PullToRefreshContainer isRefreshing={isRefreshing} containerRef={containerRef} indicatorRef={indicatorRef}>
                <header className="bg-white dark:bg-slate-900 sticky top-0 z-10 px-4 py-4 shadow-sm flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400"
                    >
                        <ArrowRight size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">الإشعارات</h1>
                </header>

                <div className="p-4 space-y-3">
                    {loading && notifications.length === 0 ? (
                        <div className="text-center py-10 text-slate-500">جاري التحميل...</div>
                    ) : notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex gap-4 ${!notif.read_at ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800' : ''}`}
                            >
                                <div className="shrink-0 pt-1">
                                    {getIcon(notif.data.type || 'info')}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{notif.data.title}</h3>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">{timeAgo(notif.created_at)}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {notif.data.body}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <Bell size={32} />
                            </div>
                            <h3 className="font-bold text-slate-700 dark:text-slate-300">لا يوجد إشعارات</h3>
                            <p className="text-xs text-slate-500 mt-1">سنخبرك بأي مستجدات تهمك هنا</p>
                        </div>
                    )}
                </div>
            </PullToRefreshContainer>
        </div>
    );
}
