import { useState, useEffect } from 'react';

export default function OfflineIndicator() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (isOnline) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-red-500 text-white py-3 px-4 flex items-center justify-center gap-3 shadow-lg animate-slide-down" dir="rtl">
            <span className="text-xl">📡</span>
            <div className="flex-1 text-center">
                <p className="font-bold text-sm">أنت غير متصل بالإنترنت</p>
                <p className="text-xs opacity-90">سيتم تحديث البيانات عند عودة الاتصال</p>
            </div>
        </div>
    );
}
