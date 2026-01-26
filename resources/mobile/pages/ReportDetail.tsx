import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Clock, CheckCircle2, AlertCircle, Save, Shield } from 'lucide-react';
import api from '../services/api';
import Toast from '../components/Toast';

export default function ReportDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [notes, setNotes] = useState('');
    const [updating, setUpdating] = useState(false);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        fetchReport();
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserRole(user.role || '');
    }, [id]);

    const fetchReport = async () => {
        try {
            // Reusing my-reports for now or adding a specific detail API if needed
            // For now, let's assume we can fetch it via a list or specific endpoint
            const res = await api.get(`/reports/${id}`);
            setReport(res.data);
            setStatus(res.data.status);
            setNotes(res.data.official_notes || '');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            await api.post(`/reports/${id}/update`, {
                status,
                official_notes: notes
            });
            alert('تم التحديث بنجاح');
            fetchReport();
        } catch (err) {
            console.error(err);
            alert('فشل التحديث');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-10 text-center font-bold">جاري التحميل...</div>;
    if (!report) return <div className="p-10 text-center font-bold text-rose-500">البلاغ غير موجود</div>;

    const canEdit = userRole === 'admin' || userRole === 'official';

    return (
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
            <header className="bg-white px-4 py-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                    <ArrowRight className="text-slate-600" />
                </button>
                <h1 className="text-lg font-black text-slate-800">تفاصيل البلاغ</h1>
            </header>

            <main className="p-4 space-y-6">
                {/* Header Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${report.status === 'pending' ? 'bg-rose-100 text-rose-700' :
                            report.status === 'in_progress' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                            {{
                                'pending': 'معلق',
                                'in_progress': 'قيد المعالجة',
                                'resolved': 'تم الحل'
                            }[report.status as string] || report.status}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">#{report.id.substring(0, 8)}</span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-800 mb-2">{report.category === 'water' ? 'مشكلة مياه' : 'بلاغ خدمة'}</h2>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{report.description}</p>

                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <Clock size={14} />
                        <span>تم التقديم في: {new Date(report.created_at).toLocaleString('ar-SY')}</span>
                    </div>
                </div>

                {/* Management Section */}
                {canEdit && (
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Shield size={18} className="text-emerald-500" />
                            إدارة البلاغ
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-2">تغيير الحالة</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['pending', 'in_progress', 'resolved'].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setStatus(s)}
                                            className={`py-2 rounded-xl text-[10px] font-black border transition-all ${status === s
                                                ? 'bg-emerald-600 text-white border-emerald-600'
                                                : 'bg-slate-50 text-slate-400 border-slate-100'
                                                }`}
                                        >
                                            {{
                                                'pending': 'معلق',
                                                'in_progress': 'قيد العمل',
                                                'resolved': 'تم الحل'
                                            }[s]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-2">ملاحظات رسمية</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    placeholder="أضف ملاحظات التنفيذ..."
                                    className="w-full bg-slate-50 border-slate-100 rounded-2xl text-sm font-bold p-4 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>

                            <button
                                onClick={handleUpdate}
                                disabled={updating}
                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                <Save size={18} />
                                {updating ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Image if exists */}
                {report.images && (
                    <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100">
                        <img
                            src={Array.isArray(JSON.parse(report.images)) ? JSON.parse(report.images)[0] : report.images}
                            className="w-full h-64 object-cover rounded-2xl"
                            alt="صورة البلاغ"
                        />
                    </div>
                )}
            </main>
        </div>
    );
}
