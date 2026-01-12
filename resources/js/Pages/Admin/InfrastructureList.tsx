import { useState, useEffect } from 'react';

interface Point {
    id: number;
    name: string;
    type: string;
    status: string;
    last_updated_at: string;
}

export default function InfrastructureList({ initialPoints }: { initialPoints: Point[] }) {
    const [points, setPoints] = useState<Point[]>(initialPoints || []);
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingId, setLoadingId] = useState<number | null>(null);

    // Removed useEffect fetch as data is now passed via props

    const updateStatus = (id: number, newStatus: string) => {
        setLoadingId(id);
        // Optimistic update
        setPoints(points.map(p => p.id === id ? { ...p, status: newStatus } : p));

        fetch(`/admin/infrastructure/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
            },
            body: JSON.stringify({ status: newStatus })
        })
            .then(() => setLoadingId(null))
            .catch(() => {
                alert('Error updating status');
                setLoadingId(null);
                // Revert changes if needed (omitted for brevity)
            });
    };

    const filtered = points.filter(p =>
        (p.name && p.name.includes(searchTerm)) ||
        (p.type && p.type.includes(searchTerm))
    );

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <span>🎛️</span> التحكم بالبنية التحتية
                </h3>
                <input
                    type="text"
                    placeholder="بحث عن نقطة (محولة، بئر)..."
                    className="border border-slate-200 rounded-lg px-4 py-2 text-sm w-64 focus:border-emerald-500 focus:ring-emerald-500"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 text-slate-500">
                            <th className="pb-3 pr-2">النوع</th>
                            <th className="pb-3">الاسم / الموقع</th>
                            <th className="pb-3">الحالة الحالية</th>
                            <th className="pb-3 text-left pl-2">تحكم سريع</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filtered.map(point => (
                            <tr key={point.id} className="group hover:bg-slate-50 transition">
                                <td className="py-3 pr-2">
                                    <span className="text-xl">
                                        {point.type === 'transformer' ? '⚡' : point.type === 'well' ? '💧' : '📍'}
                                    </span>
                                </td>
                                <td className="py-3 font-bold text-slate-700">
                                    {point.name || 'بدون اسم'}
                                    <div className="text-[10px] text-slate-400 font-normal">
                                        ID: #{point.id}
                                    </div>
                                </td>
                                <td className="py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${point.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                                        point.status === 'maintenance' ? 'bg-amber-100 text-amber-700' :
                                            'bg-rose-100 text-rose-700'
                                        }`}>
                                        {point.status === 'active' ? 'تعمل' :
                                            point.status === 'maintenance' ? 'صيانة' :
                                                point.status === 'stopped' ? 'متوقفة' : 'خطر'}
                                    </span>
                                </td>
                                <td className="py-3 pl-2 text-left">
                                    <select
                                        value={point.status}
                                        onChange={(e) => updateStatus(point.id, e.target.value)}
                                        disabled={loadingId === point.id}
                                        className="text-sm border-slate-200 rounded-lg py-1 pr-8 pl-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm cursor-pointer hover:border-slate-300 transition"
                                    >
                                        <option value="active">🟢 تشغيل</option>
                                        <option value="maintenance">🟡 صيانة</option>
                                        <option value="stopped">🔴 إيقاف</option>
                                    </select>
                                    {loadingId === point.id && <span className="ml-2 text-xs text-slate-400 animate-pulse">...</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
