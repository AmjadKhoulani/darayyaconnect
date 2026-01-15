import { useState, useEffect } from 'react';
import { OfflineService } from '../services/OfflineService';

export default function OfflineIndicator() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // check pending count periodically
        const interval = setInterval(async () => {
            const count = await OfflineService.getPendingCount();
            setPendingCount(count);
        }, 5000);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            clearInterval(interval);
        };
    }, []);

    if (isOnline && pendingCount === 0) return null;

    if (!isOnline) {
        return (
            <div className="fixed top-0 left-0 right-0 z-[9999] bg-red-500 text-white py-3 px-4 flex items-center justify-center gap-3 shadow-lg animate-slide-down" dir="rtl">
                <span className="text-xl">📡</span>
                <div className="flex-1 text-center">
                    <p className="font-bold text-sm">أنت غير متصل بالإنترنت</p>
                    <p className="text-xs opacity-90">سيتم حفظ البلاغات وإرسالها لاحقاً</p>
                </div>
            </div>
        );
    }

    // Online but has pending reports
    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-blue-600 text-white py-3 px-4 flex items-center justify-center gap-3 shadow-lg animate-slide-down" dir="rtl">
            <span className="text-xl">🔄</span>
            <div className="flex-1 text-center">
                <p className="font-bold text-sm">جاري مزامنة البيانات...</p>
                <p className="text-xs opacity-90">يوجد {pendingCount} بلاغ قيد الإرسال</p>
            </div>
        </div>
    );
}
