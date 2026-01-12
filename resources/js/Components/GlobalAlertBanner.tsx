import { useState, useEffect } from 'react';

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
            .then(res => res.json())
            .then(data => setAlerts(data))
            .catch(err => console.error(err));
    }, []);

    if (alerts.length === 0) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] space-y-2 pt-2 px-2 pointer-events-none">
            {alerts.map((alert) => (
                <div
                    key={alert.id}
                    className={`max-w-4xl mx-auto rounded-xl shadow-lg border pointer-events-auto transform transition-all animate-in slide-in-from-top-4 duration-500
                        ${alert.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' :
                            alert.type === 'warning' ? 'bg-amber-500 border-amber-400 text-white' :
                                alert.type === 'danger' ? 'bg-rose-600 border-rose-500 text-white' :
                                    'bg-slate-800 border-slate-700 text-white'
                        }
                    `}
                >
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-2xl bg-white/20 w-10 h-10 rounded-full flex items-center justify-center">
                                {alert.type === 'success' ? '✅' :
                                    alert.type === 'warning' ? '⚠️' :
                                        alert.type === 'danger' ? '🚨' : 'ℹ️'}
                            </span>
                            <div className="text-right">
                                <h4 className="font-bold text-lg leading-tight">{alert.title}</h4>
                                <p className="text-sm opacity-90">{alert.body}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setAlerts(alerts.filter(a => a.id !== alert.id))}
                            className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition"
                        >
                            ✖
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
