import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Search,
    Filter,
    Plus,
    Map as MapIcon,
    AlertCircle,
    CheckCircle2,
    Clock,
    ArrowRightLeft,
    MoreHorizontal
} from 'lucide-react';
import { useState } from 'react';

interface Asset {
    id: number;
    type: 'node' | 'line';
    category: string;
    serial_number: string | null;
    status: string;
    meta: any;
    is_published: boolean;
    created_at: string;
    location: string;
}

interface Props {
    auth: any;
    lines: any[];
    nodes: any[];
}

export default function Inventory({ auth, lines, nodes }: Props) {
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    const assets = [
        ...(Array.isArray(nodes) ? nodes : []).map((n: any) => ({ ...n, category: n.type, type: 'node' })),
        ...(Array.isArray(lines) ? lines : []).map((l: any) => ({ ...l, category: l.type, type: 'line' }))
    ].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

    const filteredAssets = assets.filter(asset => {
        const matchesSearch = asset.serial_number?.toLowerCase().includes(search.toLowerCase()) ||
            asset.category.toLowerCase().includes(search.toLowerCase()) ||
            asset.id.toString().includes(search);
        const matchesCategory = filterCategory === 'all' || asset.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                    <CheckCircle2 size={12} /> يعمل
                </span>;
            case 'maintenance':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                    <Clock size={12} /> صيانة
                </span>;
            case 'broken':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                    <AlertCircle size={12} /> معطل
                </span>;
            default:
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                    {status}
                </span>;
        }
    };


    const getTypeLabel = (type: string) => {
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
        return labels[type] || type;
    };

    const getSector = (type: string) => {
        if (['water_tank', 'pump', 'valve', 'water_pipe_main', 'water_pipe_distribution'].includes(type)) return 'water';
        if (['transformer', 'pole', 'generator', 'power_cable_underground', 'power_line_overhead'].includes(type)) return 'electricity';
        if (['manhole', 'sewage_pipe'].includes(type)) return 'sewage';
        return 'phone';
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="جرد البنية التحتية" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-screen" dir="rtl">
                <div className="max-w-7xl mx-auto">
                    {/* ... (Header omitted for brevity, keeping existing) ... */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-black text-slate-800">جرد الأصول والشبكات</h2>
                            <p className="mt-2 text-slate-500 font-bold">إدارة وتحليل كافة عناصر البنية التحتية المضافة.</p>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href={route('admin.infrastructure.water.editor')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all"
                            >
                                <MapIcon size={20} /> الخريطة التفاعلية
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        {/* ... Filters ... */}
                        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="بحث برقم التسلسل، النوع، أو المعرف..."
                                    className="w-full pr-12 pl-4 py-3 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-medium"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3">
                                <select
                                    className="px-4 py-3 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-slate-900 transition-all font-bold min-w-[150px]"
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                >
                                    <option value="all">كافة الأنواع</option>
                                    <option value="transformer">محولات</option>
                                    <option value="pole">أعمدة إنارة</option>
                                    <option value="water_tank">خزانات مياه</option>
                                    <option value="pump">مضخات</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead>
                                    <tr className="bg-slate-50/50 text-slate-500 text-xs font-black uppercase tracking-wider">
                                        <th className="px-6 py-4">العنصر / النوع</th>
                                        <th className="px-6 py-4">الرقم التسلسلي</th>
                                        <th className="px-6 py-4">الحارة المستفيدة</th>
                                        <th className="px-6 py-4">الحالة</th>
                                        <th className="px-6 py-4 text-left">إجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredAssets.map((asset) => (
                                        <tr key={`${asset.type}-${asset.id}`} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm ${asset.type === 'node' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                                                        {asset.type === 'node' ? '📍' : '🛤️'}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-slate-800">{getTypeLabel(asset.category)}</div>
                                                        <div className="text-[10px] font-bold text-slate-400">ID: {asset.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="font-mono text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                                    {asset.serial_number || '---'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                                    <ArrowRightLeft size={14} className="text-slate-300" />
                                                    {asset.meta?.assigned_neighborhood || 'غير محدد'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                {getStatusBadge(asset.status)}
                                            </td>
                                            <td className="px-6 py-5 text-left">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route('admin.infrastructure.show', { type: asset.type, id: asset.id })}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
                                                    >
                                                        <MoreHorizontal size={14} /> التفاصيل
                                                    </Link>
                                                    <a
                                                        href={route('admin.infrastructure.sector.editor', { sector: getSector(asset.category), focus: asset.id, type: asset.type })}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-sm"
                                                    >
                                                        <MapIcon size={14} /> الخريطة
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredAssets.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                                        <Search size={32} className="text-slate-300" />
                                                    </div>
                                                    <h3 className="text-lg font-black text-slate-800">لا يوجد نتائج</h3>
                                                    <p className="text-slate-500 font-bold max-w-xs mx-auto">لم نعثر على أي عناصر تطابق معايير البحث الحالية.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-6 bg-slate-50/30 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-bold text-slate-500">
                                    عرض <span className="text-slate-900">{filteredAssets.length}</span> من أصل <span className="text-slate-900">{assets.length}</span> عنصر.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
