import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Filter, Search, MapPin, CheckCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

export default function InfrastructureInventory() {
    const navigate = useNavigate();
    const [items, setItems] = useState<any[]>([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/infrastructure');
            // Combine nodes and lines into one list
            const nodes = res.data.nodes.map((n: any) => ({ ...n, category: 'node', label: n.type }));
            const lines = res.data.lines.map((l: any) => ({ ...l, category: 'line', label: l.type }));
            setItems([...nodes, ...lines]);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const getTypeLabel = (type: string) => {
        const labels: any = {
            'water_tank': 'خزان مياه',
            'pump': 'مضخة',
            'valve': 'صمام',
            'water_pipe_main': 'أنبوب رئيسي',
            'water_pipe_distribution': 'أنبوب توزيع',
            'transformer': 'محولة كهرباء',
            'pole': 'عامود',
            'generator': 'مولدة',
            'power_cable_underground': 'كبل أرضي',
            'power_line_overhead': 'كبل هوائي',
            'manhole': 'ريغار',
            'sewage_pipe': 'قسطل صرف',
            'exchange': 'مقسم',
            'cabinet': 'علبة هاتف',
            'telecom_cable': 'كبل هاتف'
        };
        return labels[type] || type;
    };

    const getStatusColor = (status: string) => {
        if (status === 'active' || status === 'good') return 'text-emerald-500 bg-emerald-50 border-emerald-100';
        if (status === 'maintenance' || status === 'warning') return 'text-amber-500 bg-amber-50 border-amber-100';
        if (status === 'inactive' || status === 'bad') return 'text-rose-500 bg-rose-50 border-rose-100';
        return 'text-slate-500 bg-slate-50 border-slate-100';
    };

    const filteredItems = items.filter(item => {
        const matchesSearch =
            item.id.toString().includes(search) ||
            (item.serial_number && item.serial_number.includes(search)) ||
            getTypeLabel(item.type).includes(search);

        if (filter === 'all') return matchesSearch;
        // Add more filters if needed
        return matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-safe">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10 px-4 py-4">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <ArrowRight size={20} className="text-slate-600 dark:text-slate-300 rotate-180" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">سجل البنية التحتية</h1>
                        <p className="text-xs text-slate-500">كافة العناصر المضافة والموثقة</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="بحث بالمعرف، الرقم التسلسلي، أو النوع..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl py-3 pr-10 pl-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
            </div>

            {/* List */}
            <div className="p-4 space-y-3">
                {loading ? (
                    <div className="text-center py-10 text-slate-400">جاري التحميل...</div>
                ) : filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <div key={`${item.category}-${item.id}`} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between group active:scale-[0.99] transition-transform">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${getStatusColor(item.status)}`}>
                                    {item.category === 'line' ? '〰' : '📍'}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                                            {getTypeLabel(item.type)}
                                        </h3>
                                        <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-500 font-mono">
                                            #{item.id}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusColor(item.status)} bg-transparent border-current bg-opacity-0`}>
                                            {item.status || 'غير محدد'}
                                        </span>
                                        {item.serial_number && (
                                            <span className="text-[10px] text-slate-400 font-mono">
                                                SN: {item.serial_number}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                {item.is_published ? (
                                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                        <Eye size={12} />
                                        <span>منشور</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                                        <EyeOff size={12} />
                                        <span>مسودة</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-slate-400">لا توجد عناصر مطابقة</div>
                )}
            </div>
        </div>
    );
}
