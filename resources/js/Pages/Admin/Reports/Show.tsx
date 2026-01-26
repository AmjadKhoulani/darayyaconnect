import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';

export default function Show({ auth, report }: any) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);

    const { data, setData, put, processing } = useForm({
        status: report.status || 'pending',
        official_notes: report.official_notes || '',
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.reports.update', report.id));
    };

    const handleDelete = () => {
        if (confirm('هل أنت متأكد من حذف هذا البلاغ؟')) {
            // Implement delete if needed
        }
    };

    useEffect(() => {
        if (!mapContainer.current || !report.latitude || !report.longitude) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                version: 8,
                sources: {
                    osm: {
                        type: 'raster',
                        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                        tileSize: 256,
                        attribution: '&copy; OpenStreetMap',
                    },
                },
                layers: [
                    {
                        id: 'osm',
                        type: 'raster',
                        source: 'osm',
                    },
                ],
            },
            center: [report.longitude, report.latitude],
            zoom: 16,
        });

        // Add marker
        new maplibregl.Marker({ color: '#ff0000' })
            .setLngLat([report.longitude, report.latitude])
            .addTo(map.current);

        return () => {
            map.current?.remove();
        };
    }, [report.latitude, report.longitude]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">قيد الانتظار</span>;
            case 'in_progress': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">جاري المعالجة</span>;
            case 'resolved': return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">تم الحل</span>;
            default: return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold leading-tight text-slate-800">
                        تفاصيل البلاغ #{report.id.substring(0, 8)}
                    </h2>
                    <Link
                        href={route('admin.reports.index')}
                        className="text-sm text-slate-500 hover:text-slate-800 font-bold"
                    >
                        &larr; عودة للقائمة
                    </Link>
                </div>
            }
        >
            <Head title={`بلاغ #${report.id.substring(0, 8)}`} />

            <div className="py-12" dir="rtl">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Right Column: Details */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-2">حالة البلاغ</label>
                                {getStatusBadge(report.status)}
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-2">الوصف</label>
                                <p className="text-slate-800 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    {report.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 block mb-2">الجهة المسؤولة</label>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${report.department ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {report.department ? report.department.name : 'غير محدد'}
                                    </span>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 block mb-2">الفئة</label>
                                    <span className="font-bold text-slate-700">
                                        {{
                                            'water': 'مياه',
                                            'electricity': 'كهرباء',
                                            'sanitation': 'نظافة / صرف صحي',
                                            'infrastructure': 'بنية تحتية',
                                            'lighting': 'إنارة',
                                            'communication': 'اتصالات',
                                            'other': 'أخرى'
                                        }[report.category as string] || report.category}
                                    </span>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 block mb-2">تاريخ البلاغ</label>
                                    <span className="font-bold text-slate-700 ltr:text-right" dir="ltr">
                                        {new Date(report.created_at).toLocaleString('ar-SY')}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-2">المواطن المبلغ</label>
                                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
                                        {report.user?.name ? report.user.name.substring(0, 1) : '?'}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800">{report.user?.name || 'مجهول'}</div>
                                        <div className="text-xs text-slate-500">{report.user?.mobile || 'لا يوجد رقم'}</div>
                                    </div>
                                </div>
                            </div>

                            {report.official_notes && (
                                <div>
                                    <label className="text-xs font-bold text-emerald-600 block mb-2">الملاحظات المسجلة</label>
                                    <p className="text-slate-700 font-bold bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                        {report.official_notes}
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons & Management */}
                            <div className="pt-6 border-t border-slate-100">
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 block mb-2">تحديث الحالة</label>
                                        <select
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                            className="w-full rounded-xl border-slate-200 font-bold text-slate-700 focus:ring-emerald-500 focus:border-emerald-500"
                                        >
                                            <option value="pending">قيد الانتظار</option>
                                            <option value="in_progress">جاري المعالجة</option>
                                            <option value="resolved">تم الحل</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-400 block mb-2">ملاحظات الجهة المسؤولة</label>
                                        <textarea
                                            value={data.official_notes}
                                            onChange={e => setData('official_notes', e.target.value)}
                                            rows={3}
                                            placeholder="أضف ملاحظات التنفيذ هنا..."
                                            className="w-full rounded-xl border-slate-200 font-bold text-slate-700 focus:ring-emerald-500 focus:border-emerald-500"
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition disabled:opacity-50"
                                        >
                                            {processing ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                                        </button>
                                        {auth.user.role === 'admin' && (
                                            <button
                                                type="button"
                                                onClick={handleDelete}
                                                className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition border border-red-100"
                                            >
                                                حذف
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Left Column: Map & Image */}
                        <div className="space-y-6">
                            {/* Map */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-64 relative">
                                <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
                                <div className="absolute bottom-2 right-2 bg-white/90 px-3 py-1 rounded text-xs font-bold shadow text-slate-600">
                                    موقع البلاغ
                                </div>
                            </div>

                            {/* Image */}
                            {report.images ? (
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2">
                                    <img
                                        src={Array.isArray(JSON.parse(report.images)) ? JSON.parse(report.images)[0] : report.images}
                                        alt="صورة البلاغ"
                                        className="w-full h-64 object-cover rounded-xl"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                    <p className="text-center text-xs text-slate-400 mt-2 font-bold">صورة مرفقة</p>
                                </div>
                            ) : (
                                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl h-32 flex items-center justify-center text-slate-400 font-bold text-sm">
                                    لا توجد صورة مرفقة
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
