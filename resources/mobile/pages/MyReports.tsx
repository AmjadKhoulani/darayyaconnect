import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, CheckCircle, AlertTriangle, AlertCircle, MapPin } from 'lucide-react';
import api from '../services/api';

export default function MyReports() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await api.get('/infrastructure/my-reports');
            setReports(response.data);
        } catch (error) {
            console.error('Failed to fetch reports', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending':
                return { color: 'text-amber-500 bg-amber-500/10', icon: Clock, label: 'قيد الانتظار' };
            case 'verified':
                return { color: 'text-blue-500 bg-blue-500/10', icon: CheckCircle, label: 'تم التحقق' };
            case 'in_progress':
                return { color: 'text-purple-500 bg-purple-500/10', icon: AlertCircle, label: 'قيد المعالجة' };
            case 'resolved':
                return { color: 'text-emerald-500 bg-emerald-500/10', icon: CheckCircle, label: 'تم الحل' };
            default:
                return { color: 'text-slate-500 bg-slate-500/10', icon: AlertTriangle, label: status };
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 max-w-7xl mx-auto w-full shadow-2xl shadow-slate-200 dark:shadow-none" dir="rtl">
            <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10 px-4 py-4 flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300"
                >
                    <ArrowRight size={20} />
                </button>
                <h1 className="text-xl font-black text-slate-800 dark:text-white">بلاغاتي</h1>
            </header>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-white"></div>
                    </div>
                ) : reports.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock size={32} />
                        </div>
                        <p className="font-bold">لم تقم بإرسال أي بلاغ بعد</p>
                    </div>
                ) : (
                    reports.map((report) => {
                        const status = getStatusConfig(report.status);
                        const StatusIcon = status.icon;

                        return (
                            <div
                                key={report.id}
                                onClick={() => navigate(`/report-detail/${report.id}`)}
                                className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/50 cursor-pointer active:scale-[0.98] transition-all"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${status.color}`}>
                                        <StatusIcon size={12} />
                                        {status.label}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-bold font-mono">
                                        {new Date(report.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="font-bold text-slate-800 dark:text-white mb-1 line-clamp-1">{report.description}</h3>
                                <div className="flex items-center gap-1 text-slate-400 text-xs mb-3">
                                    <MapPin size={12} />
                                    <span>
                                        {{
                                            'water': 'مياه',
                                            'electricity': 'كهرباء',
                                            'sanitation': 'نظافة',
                                            'infrastructure': 'بنية تحتية',
                                            'lighting': 'إنارة'
                                        }[report.category as string] || report.category}
                                    </span>
                                </div>

                                {report.images && (
                                    <div className="h-24 w-full rounded-xl overflow-hidden bg-slate-100 relative">
                                        <img
                                            src={Array.isArray(JSON.parse(report.images)) ? JSON.parse(report.images)[0] : report.images}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
