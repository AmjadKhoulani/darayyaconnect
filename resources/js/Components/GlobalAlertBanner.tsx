import { useEffect, useState } from 'react';

interface Alert {
    id: number;
    title: string;
    body: string;
    type: 'info' | 'success' | 'warning' | 'danger';
}

export default function GlobalAlertBanner() {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    useEffect(() => {
        fetch('/api/alerts/active')
            .then((res) => res.json())
            .then((data) => setAlerts(data))
            .catch((err) => console.error(err));
    }, []);

    if (alerts.length === 0) return null;

    return (
        <div className="pointer-events-none fixed left-0 right-0 top-0 z-[100] space-y-2 px-2 pt-2">
            {alerts.map((alert) => (
                <div
                    key={alert.id}
                    className={`animate-in slide-in-from-top-4 pointer-events-auto mx-auto max-w-4xl transform rounded-xl border shadow-lg transition-all duration-500 ${
                        alert.type === 'success'
                            ? 'border-emerald-500 bg-emerald-600 text-white'
                            : alert.type === 'warning'
                              ? 'border-amber-400 bg-amber-500 text-white'
                              : alert.type === 'danger'
                                ? 'border-rose-500 bg-rose-600 text-white'
                                : 'border-slate-700 bg-slate-800 text-white'
                    } `}
                >
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-2xl">
                                {alert.type === 'success'
                                    ? '✅'
                                    : alert.type === 'warning'
                                      ? '⚠️'
                                      : alert.type === 'danger'
                                        ? '🚨'
                                        : 'ℹ️'}
                            </span>
                            <div className="text-right">
                                <h4 className="text-lg font-bold leading-tight">
                                    {alert.title}
                                </h4>
                                <p className="text-sm opacity-90">
                                    {alert.body}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() =>
                                setAlerts(
                                    alerts.filter((a) => a.id !== alert.id),
                                )
                            }
                            className="rounded-lg bg-white/10 p-2 transition hover:bg-white/20"
                        >
                            ✖
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
