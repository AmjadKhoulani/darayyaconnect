import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';

interface Zone {
    id: number;
    name: string;
    status: 'active' | 'stopped' | 'maintenance' | 'critical';
    metadata: {
        schedule?: string;
        streets?: string[];
        capacity?: string;
    };
    last_updated_at: string;
}

export default function WaterManager({ auth, zones }: { auth: any, zones: Zone[] }) {
    const toggleStatus = (zone: Zone) => {
        const newStatus = zone.status === 'active' ? 'stopped' : 'active';
        router.patch(route('admin.infrastructure.update-status', zone.id), {
            status: newStatus
        }, { preserveScroll: true });
    };

    return (
        <AdminLayout user={auth.user} header={<h2 className="font-bold text-xl text-slate-800">💧 إدارة شبكة المياه</h2>}>
            <Head title="إدارة المياه" />

            <div className="py-12 px-6 lg:px-8" dir="rtl">

                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-700 mb-2">حالة المناطق والضخ</h3>
                    <p className="text-slate-500 text-sm">تحكم بضخ المياه للمناطق المختلفة حسب الجدول الزمني.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {zones.map(zone => (
                        <div
                            key={zone.id}
                            className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${zone.status === 'active'
                                    ? 'bg-blue-50 border-blue-200 shadow-blue-100'
                                    : 'bg-white border-slate-200 shadow-sm'
                                }`}
                        >
                            {/* Status Stripe */}
                            <div className={`absolute top-0 right-0 left-0 h-1.5 ${zone.status === 'active' ? 'bg-blue-500' : 'bg-slate-300'
                                }`} />

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm border border-slate-100">
                                        💧
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${zone.status === 'active'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        <span className={`w-2 h-2 rounded-full ${zone.status === 'active' ? 'bg-blue-500 animate-pulse' : 'bg-slate-400'
                                            }`} />
                                        {zone.status === 'active' ? 'الضخ جاري' : 'متوقف'}
                                    </div>
                                </div>

                                <h3 className="text-lg font-black text-slate-900 mb-1">{zone.name}</h3>
                                {zone.metadata.schedule && (
                                    <p className="text-xs text-slate-500 mb-4">
                                        🕒 الجدول: {zone.metadata.schedule}
                                    </p>
                                )}

                                {zone.metadata.streets && (
                                    <div className="mb-6">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">الشوارع المغطاة</div>
                                        <div className="flex flex-wrap gap-1">
                                            {zone.metadata.streets.map((street, idx) => (
                                                <span key={idx} className="bg-white px-2 py-0.5 rounded border border-slate-100 text-xs text-slate-600">
                                                    {street}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => toggleStatus(zone)}
                                    className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${zone.status === 'active'
                                            ? 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                                        }`}
                                >
                                    {zone.status === 'active' ? (
                                        <>
                                            <span>⏹️</span> إيقاف الضخ
                                        </>
                                    ) : (
                                        <>
                                            <span>▶️</span> بدء الضخ
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
