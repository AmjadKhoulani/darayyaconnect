import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Map as MapIcon,
    ArrowRight,
    Activity,
    Hash,
    MapPin,
    Settings,
    Zap,
    Droplets,
    Wind,
    Phone,
    Calendar,
    User,
    FileText
} from 'lucide-react';

interface Props {
    auth: any;
    asset: any;
    type: 'node' | 'line';
}

export default function Show({ auth, asset, type }: Props) {
    const meta = typeof asset.meta === 'string' ? JSON.parse(asset.meta || '{}') : (asset.meta || {});

    const getTypeLabel = (t: string) => {
        const labels: Record<string, string> = {
            'water_tank': 'خزان مياه',
            'pump': 'مضخة',
            'valve': 'صمام',
            'water_pipe_main': 'أنبوب رئيسي',
            'water_pipe_distribution': 'أنبوب فرعي',
            'transformer': 'محولة كهرباء',
            'pole': 'عامود',
            'generator': 'مولدة',
            'power_cable_underground': 'كبل أرضي',
            'power_line_overhead': 'كبل هوائي',
            'manhole': 'ريغار',
            'sewage_pipe': 'قسطل صرف',
            'exchange': 'مقسم',
            'cabinet': 'بوابة إنترنت',
            'telecom_cable': 'كبل هاتف'
        };
        return labels[t] || t;
    };

    const getSectorIcon = (t: string) => {
        const sector = getSector(t);
        if (sector === 'water') return <Droplets className="text-blue-500" />;
        if (sector === 'electricity') return <Zap className="text-amber-500" />;
        if (sector === 'sewage') return <Wind className="text-orange-900" />;
        return <Phone className="text-emerald-500" />;
    };

    const getSector = (t: string) => {
        if (['water_tank', 'pump', 'valve', 'water_pipe_main', 'water_pipe_distribution'].includes(t)) return 'water';
        if (['transformer', 'pole', 'generator', 'power_cable_underground', 'power_line_overhead'].includes(t)) return 'electricity';
        if (['manhole', 'sewage_pipe'].includes(t)) return 'sewage';
        return 'phone';
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title={`تفاصيل ${getTypeLabel(asset.type)}`} />

            <div className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-screen" dir="rtl">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={route('admin.infrastructure.inventory')}
                            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold mb-4 transition-colors"
                        >
                            <ArrowRight size={18} /> العودة للقائمة
                        </Link>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 text-3xl">
                                    {getSectorIcon(asset.type)}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black text-slate-800">{getTypeLabel(asset.type)}</h1>
                                    <div className="flex items-center gap-3 mt-1 text-slate-500 font-bold text-sm">
                                        <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-xs font-mono">ID: {asset.id}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {meta.assigned_neighborhood || 'غير محدد'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <a
                                    href={route('admin.infrastructure.sector.editor', {
                                        sector: getSector(asset.type),
                                        focus: asset.id,
                                        type: type
                                    })}
                                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
                                >
                                    <MapIcon size={18} /> موقع العنصر
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Main Info */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                    <Activity className="text-slate-400" /> الحالة والبيانات الأساسية
                                </h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 block mb-1">الحالة الفنية</label>
                                        <div className="font-black text-slate-800 text-lg">
                                            {asset.status === 'active' && 'يعمل بشكل جيد'}
                                            {asset.status === 'maintenance' && 'قيد الصيانة'}
                                            {asset.status === 'broken' && 'معطل'}
                                            {(!['active', 'maintenance', 'broken'].includes(asset.status)) && asset.status}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 block mb-1">الرقم التسلسلي</label>
                                        <div className="font-black text-slate-800 text-lg font-mono">{asset.serial_number || '---'}</div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 block mb-1">تاريخ الإضافة</label>
                                        <div className="font-bold text-slate-700">{new Date(asset.created_at).toLocaleDateString('ar-SY')}</div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 block mb-1">آخر تحديث</label>
                                        <div className="font-bold text-slate-700">{new Date(asset.updated_at).toLocaleDateString('ar-SY')}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Specific Meta Data */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                    <Settings className="text-slate-400" /> مواصفات خاصة
                                </h3>
                                <div className="space-y-4">
                                    {/* Pole Specific */}
                                    {asset.type === 'pole' && (
                                        <>
                                            <MetaField label="مصدر التغذية" value={meta.power_source || 'شبكة عامة'} />
                                            <MetaField label="المحولة المغذية" value={meta.feeding_transformer || 'غير محدد'} />
                                            <MetaField label="نوع الإنارة" value={meta.light_type || 'LED'} />
                                        </>
                                    )}
                                    {/* Transformer Specific */}
                                    {asset.type === 'transformer' && (
                                        <>
                                            <MetaField label="الاستطاعة (KVA)" value={meta.capacity} />
                                            <MetaField label="منطقة الخدمة" value={meta.coverage_area} />
                                            <MetaField label="رقم اللوحة" value={meta.plate_number} />
                                        </>
                                    )}
                                    {/* Generator Specific */}
                                    {asset.type === 'generator' && (
                                        <>
                                            <MetaField label="المالك / المستثمر" value={meta.owner_name} />
                                            <MetaField label="رقم الهاتف" value={meta.contact_phone} />
                                            <MetaField label="ساعات التشغيل" value={meta.operating_hours} />
                                        </>
                                    )}
                                    {/* Generic Meta Rendering for unknown fields */}
                                    {Object.entries(meta).map(([key, val]) => {
                                        if (['assigned_neighborhood', 'notes', 'power_source', 'feeding_transformer', 'light_type', 'capacity', 'coverage_area', 'plate_number', 'owner_name', 'contact_phone', 'operating_hours'].includes(key)) return null;
                                        return <MetaField key={key} label={key} value={val as string} />;
                                    })}

                                    {Object.keys(meta).length === 0 && (
                                        <div className="text-slate-400 italic">لا توجد مواصفات إضافية مسجلة.</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <div className="bg-indigo-900 text-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <FileText size={20} /> ملاحظات
                                </h3>
                                <p className="text-indigo-100 text-sm leading-relaxed whitespace-pre-line">
                                    {meta.notes || 'لا توجد ملاحظات مسجلة على هذا العنصر.'}
                                </p>
                            </div>

                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                                <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">سجل التعديلات</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-3 items-start relative pb-4 border-l-2 border-slate-100 pr-4">
                                        <div className="absolute -right-1.5 top-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-400">{new Date(asset.updated_at).toLocaleDateString('ar-SY')}</div>
                                            <div className="font-bold text-slate-800 text-sm">آخر تحديث</div>
                                            <div className="text-xs text-slate-500">تم بواسطة {auth.user.name}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-start relative border-l-2 border-slate-100 pr-4">
                                        <div className="absolute -right-1.5 top-0 w-3 h-3 rounded-full bg-slate-300 border-2 border-white"></div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-400">{new Date(asset.created_at).toLocaleDateString('ar-SY')}</div>
                                            <div className="font-bold text-slate-800 text-sm">تم الإنشاء</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

const MetaField = ({ label, value }: { label: string, value: any }) => (
    <div className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
        <span className="font-bold text-slate-500 text-sm">{label}</span>
        <span className="font-black text-slate-800">{value || '-'}</span>
    </div>
);
