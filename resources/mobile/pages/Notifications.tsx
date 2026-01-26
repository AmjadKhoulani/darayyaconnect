import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bell, Calendar } from 'lucide-react';
import api from '../services/api';

export default function Notifications() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notifications');
            // Assuming standard Laravel pagination response or simple array
            const data = response.data.data ? response.data.data : response.data;
            setNotifications(data);

            // Mark all as read
            await api.post('/notifications/read');
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20" dir="rtl">
            <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10 px-4 py-4 flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300"
                >
                    <ArrowRight size={20} />
                </button>
                <h1 className="text-xl font-black text-slate-800 dark:text-white">الإشعارات</h1>
            </header>

            <div className="p-4 space-y-3">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-white"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell size={32} />
                        </div>
                        <p className="font-bold">لا توجد إشعارات حالياً</p>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/50 relative overflow-hidden ${!notif.read_at ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                        >
                            {!notif.read_at && (
                                <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-blue-500"></div>
                            )}
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                                    <Bell size={20} className="text-slate-600 dark:text-slate-300" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1">
                                        {notif.data?.title || 'إشعار جديد'}
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
                                        {notif.data?.message || notif.data?.body || '...'}
                                    </p>
                                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                        <Calendar size={10} />
                                        <span>{new Date(notif.created_at).toLocaleString('ar-SY')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
