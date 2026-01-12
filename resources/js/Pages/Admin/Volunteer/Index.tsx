import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircle, XCircle, Clock, User, Phone, Briefcase, FileText } from 'lucide-react';
import { useState } from 'react';

export default function VolunteerIndex({ auth, applications }: { auth: any, applications: any[] }) {
    const [selectedApp, setSelectedApp] = useState<any>(null);

    // Filter apps by status
    const pendingApps = applications.filter(app => app.status === 'pending');
    const approvedApps = applications.filter(app => app.status === 'approved');

    return (
        <AdminLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">إدارة المتطوعين</h2>}>
            <Head title="إدارة المتطوعين" />

            <div className="py-12 px-4 max-w-7xl mx-auto">

                {/* Pending Applications */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Clock className="text-amber-500" />
                        طلبات الانتظار ({pendingApps.length})
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pendingApps.length > 0 ? pendingApps.map(app => (
                            <ApplicationCard key={app.id} app={app} />
                        )) : (
                            <div className="col-span-full py-8 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
                                لا يوجد طلبات معلقة
                            </div>
                        )}
                    </div>
                </div>

                {/* Approved Volunteers */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <CheckCircle className="text-emerald-500" />
                        المتطوعين النشطين ({approvedApps.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {approvedApps.map(app => (
                            <ApplicationCard key={app.id} app={app} approved />
                        ))}
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}

function ApplicationCard({ app, approved = false }: { app: any, approved?: boolean }) {
    const { transform } = useForm({});

    // Status update handlers would go here (using Inertia router)

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 relative group hover:border-emerald-500 transition-colors">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                        {app.full_name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800">{app.full_name}</h4>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Phone size={12} />
                            <span dir="ltr">{app.phone_number}</span>
                        </div>
                    </div>
                </div>
                {!approved && (
                    <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-100">
                        جديد
                    </span>
                )}
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg">
                    <Briefcase size={14} className="text-slate-400 mt-0.5" />
                    <p className="text-sm text-slate-600 line-clamp-2">{app.skills || 'لا يوجد مهارات مسجلة'}</p>
                </div>
                <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg">
                    <FileText size={14} className="text-slate-400 mt-0.5" />
                    <p className="text-sm text-slate-600 line-clamp-2">{app.motivation}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                {!approved ? (
                    <>
                        <button className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition flex items-center justify-center gap-2">
                            <CheckCircle size={16} /> قبول
                        </button>
                        <button className="flex-1 py-2 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2">
                            <XCircle size={16} /> رفض
                        </button>
                    </>
                ) : (
                    <button className="w-full py-2 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold cursor-not-allowed">
                        تم القبول
                    </button>
                )}
            </div>
        </div>
    )
}
