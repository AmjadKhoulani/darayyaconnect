import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Zap, Droplets, Wifi, Phone, ShieldCheck,
    AlertTriangle, RefreshCcw, ChevronLeft, MapPin
} from 'lucide-react';
import api from '../services/api';

export default function ServicesStatus() {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalReports: 0, criticalZones: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [servicesRes, heatmapRes] = await Promise.all([
                    api.get('/infrastructure/status-summary'),
                    api.get('/infrastructure/status-heatmap')
                ]);

                setServices(servicesRes.data);

                // Calculate some stats from heatmap
                const heatmap = heatmapRes.data.features || [];
                const critical = heatmap.filter((f: any) => f.properties.status === 'cutoff').length;
                setStats({
                    totalReports: heatmap.reduce((acc: number, f: any) => acc + f.properties.total_reports, 0),
                    criticalZones: critical
                });
            } catch (error) {
                console.error("Failed to fetch services data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'stable':
                return {
                    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
                    border: 'border-emerald-100 dark:border-emerald-800/50',
                    text: 'text-emerald-700 dark:text-emerald-400',
                    icon: 'bg-emerald-500',
                    pulse: 'bg-emerald-400'
                };
            case 'unstable':
                return {
                    bg: 'bg-amber-50 dark:bg-amber-900/20',
                    border: 'border-amber-100 dark:border-amber-800/50',
                    text: 'text-amber-700 dark:text-amber-400',
                    icon: 'bg-amber-500',
                    pulse: 'bg-amber-400'
                };
            default:
                return {
                    bg: 'bg-rose-50 dark:bg-rose-900/20',
                    border: 'border-rose-100 dark:border-rose-800/50',
                    text: 'text-rose-700 dark:text-rose-400',
                    icon: 'bg-rose-500',
                    pulse: 'bg-rose-400'
                };
        }
    };

    const getServiceIcon = (id: string) => {
        switch (id) {
            case 'electricity': return <Zap size={20} />;
            case 'water': return <Droplets size={20} />;
            case 'internet': return <Wifi size={20} />;
            case 'phone': return <Phone size={20} />;
            default: return <ShieldCheck size={20} />;
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl">
            {/* Premium Header */}
            <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 sticky top-0 z-40 px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition-transform active:scale-90"
                    >
                        <ChevronLeft size={20} className="transform rotate-180" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 dark:text-slate-100">غرفة العمليات</h1>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Live Services Health</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-full border border-emerald-100 dark:border-emerald-800/50">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400">نظام نشط</span>
                </div>
            </header>

            <main className="px-6 py-8 space-y-8 max-w-5xl mx-auto w-full">
                {/* Status Dashboard */}
                <section>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900 dark:bg-slate-800 rounded-[32px] p-5 text-white shadow-xl shadow-slate-200/50 dark:shadow-none">
                            <div className="text-[10px] font-black opacity-60 uppercase mb-3 text-emerald-400">البلاغات اليومية</div>
                            <div className="text-3xl font-black mb-1">{stats.totalReports}</div>
                            <div className="text-[10px] font-bold opacity-80">بلاغ من المواطنين</div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
                            <div className="text-[10px] font-black text-rose-500 uppercase mb-3">مناطق متعثرة</div>
                            <div className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-1">{stats.criticalZones}</div>
                            <div className="text-[10px] font-bold text-slate-500">تحت الصيانة / عطل</div>
                        </div>
                    </div>
                </section>

                {/* Main Services List */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">الحالة الرسمية للخدمات</h2>
                        <button onClick={() => window.location.reload()} className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
                            <RefreshCcw size={18} />
                        </button>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-24 bg-slate-50 dark:bg-slate-800 rounded-[28px] animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {services.map((service) => {
                                const styles = getStatusStyles(service.status);
                                return (
                                    <div
                                        key={service.id}
                                        className={`p-5 rounded-[32px] border ${styles.border} ${styles.bg} transition-all active:scale-[0.98] relative overflow-hidden group`}
                                    >
                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-white/50 dark:border-slate-700 bg-white dark:bg-slate-900 ${styles.text}`}>
                                                    {getServiceIcon(service.id)}
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-slate-900 dark:text-slate-100 text-base">{service.name}</h3>
                                                    <p className={`text-[10px] font-bold mt-1 ${styles.text}`}>{service.label}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <div className={`px-3 py-1.5 rounded-xl border ${styles.border} bg-white dark:bg-slate-900 flex items-center gap-2`}>
                                                    <div className={`w-2 h-2 rounded-full ${styles.icon} shadow-[0_0_8px_rgba(16,185,129,0.5)]`}></div>
                                                    <span className={`text-[10px] font-black ${styles.text}`}>نشط الآن</span>
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-400 opacity-60">
                                                    تحديث: {new Date(service.updated_at).toLocaleTimeString('ar-SY', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Report Action */}
                <section className="bg-slate-50 dark:bg-slate-800/50 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-blue-200 dark:border-blue-800/50">
                        <MapPin size={28} />
                    </div>
                    <h3 className="font-black text-slate-900 dark:text-slate-100 mb-2">هل تلاحظ عطلاً في منطقتك؟</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6 px-4">
                        بلاغاتكم تساعدنا في تحسين دقة البيانات وتسريع عمليات الإصلاح.
                    </p>
                    <Link
                        to="/add-report"
                        className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-black text-sm transition-transform active:scale-95 shadow-xl shadow-slate-200 dark:shadow-none"
                    >
                        <span>📢</span> إرسال بلاغ فني
                    </Link>
                </section>
            </main>
        </div>
    );
}
