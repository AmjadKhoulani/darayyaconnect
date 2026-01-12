import { useState, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
    id: number;
    message: string;
    type: ToastType;
}

let toastId = 0;
const toastListeners: ((toast: ToastMessage) => void)[] = [];

export const showToast = (message: string, type: ToastType = 'info') => {
    const toast: ToastMessage = {
        id: toastId++,
        message,
        type
    };
    toastListeners.forEach(listener => listener(toast));
};

export default function Toast() {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    useEffect(() => {
        const listener = (toast: ToastMessage) => {
            setToasts(prev => [...prev, toast]);
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== toast.id));
            }, 3000);
        };
        toastListeners.push(listener);
        return () => {
            const index = toastListeners.indexOf(listener);
            if (index > -1) toastListeners.splice(index, 1);
        };
    }, []);

    const getToastStyles = (type: ToastType) => {
        switch (type) {
            case 'success':
                return 'bg-emerald-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            default:
                return 'bg-slate-800 text-white';
        }
    };

    const getIcon = (type: ToastType) => {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            default: return 'ℹ️';
        }
    };

    return (
        <div className="fixed top-20 left-4 right-4 z-[9999] pointer-events-none" dir="rtl">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`${getToastStyles(toast.type)} rounded-xl p-4 mb-3 shadow-lg flex items-center gap-3 animate-slide-down pointer-events-auto`}
                >
                    <span className="text-2xl">{getIcon(toast.type)}</span>
                    <span className="font-bold text-sm flex-1">{toast.message}</span>
                </div>
            ))}
        </div>
    );
}
