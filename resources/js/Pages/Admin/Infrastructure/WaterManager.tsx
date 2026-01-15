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

export default function WaterManager({
    auth,
    zones,
}: {
    auth: any;
    zones: Zone[];
}) {
    const toggleStatus = (zone: Zone) => {
        const newStatus = zone.status === 'active' ? 'stopped' : 'active';
        router.patch(
            route('admin.infrastructure.update-status', zone.id),
            {
                status: newStatus,
            },
            { preserveScroll: true },
        );
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-bold text-slate-800">
                    💧 إدارة شبكة المياه
                </h2>
            }
        >
            <Head title="إدارة المياه" />

            <div className="px-6 py-12 lg:px-8" dir="rtl">
                <div className="mb-8">
                    <h3 className="mb-2 text-lg font-bold text-slate-700">
                        حالة المناطق والضخ
                    </h3>
                    <p className="text-sm text-slate-500">
                        تحكم بضخ المياه للمناطق المختلفة حسب الجدول الزمني.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {zones.map((zone) => (
                        <div
                            key={zone.id}
                            className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                                zone.status === 'active'
                                    ? 'border-blue-200 bg-blue-50 shadow-blue-100'
                                    : 'border-slate-200 bg-white shadow-sm'
                            }`}
                        >
                            {/* Status Stripe */}
                            <div
                                className={`absolute left-0 right-0 top-0 h-1.5 ${
                                    zone.status === 'active'
                                        ? 'bg-blue-500'
                                        : 'bg-slate-300'
                                }`}
                            />

                            <div className="p-6">
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-100 bg-white text-2xl shadow-sm">
                                        💧
                                    </div>
                                    <div
                                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                                            zone.status === 'active'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-slate-100 text-slate-500'
                                        }`}
                                    >
                                        <span
                                            className={`h-2 w-2 rounded-full ${
                                                zone.status === 'active'
                                                    ? 'animate-pulse bg-blue-500'
                                                    : 'bg-slate-400'
                                            }`}
                                        />
                                        {zone.status === 'active'
                                            ? 'الضخ جاري'
                                            : 'متوقف'}
                                    </div>
                                </div>

                                <h3 className="mb-1 text-lg font-black text-slate-900">
                                    {zone.name}
                                </h3>
                                {zone.metadata.schedule && (
                                    <p className="mb-4 text-xs text-slate-500">
                                        🕒 الجدول: {zone.metadata.schedule}
                                    </p>
                                )}

                                {zone.metadata.streets && (
                                    <div className="mb-6">
                                        <div className="mb-1 text-[10px] font-bold uppercase text-slate-400">
                                            الشوارع المغطاة
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {zone.metadata.streets.map(
                                                (street, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="rounded border border-slate-100 bg-white px-2 py-0.5 text-xs text-slate-600"
                                                    >
                                                        {street}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => toggleStatus(zone)}
                                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold transition-all ${
                                        zone.status === 'active'
                                            ? 'border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                            : 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700'
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
