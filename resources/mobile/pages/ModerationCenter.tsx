import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, X, Shield, Book, MessageSquare, Heart, Search } from 'lucide-react';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';

type ModType = 'initiative' | 'discussion' | 'book' | 'volunteering' | 'lost_found';

export default function ModerationCenter() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<ModType>('initiative');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/moderation/pending');
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (type: ModType, id: number, action: 'approve' | 'reject') => {
        try {
            await api.post(`/admin/moderation/${type}/${id}/${action}`);
            await fetchPending();
        } catch (err) {
            alert('حدث خطأ أثناء تنفيذ الإجراء');
        }
    };

    const tabs = [
        { id: 'initiative', label: 'مبادرات', icon: <Shield size={16} />, items: data?.initiatives || [] },
        { id: 'discussion', label: 'نقاشات', icon: <MessageSquare size={16} />, items: data?.discussions || [] },
        { id: 'book', label: 'كتب', icon: <Book size={16} />, items: data?.books || [] },
        { id: 'lost_found', label: 'مفقودات', icon: <Search size={16} />, items: data?.lost_found || [] },
        { id: 'volunteering', label: 'تطوع', icon: <Heart size={16} />, items: data?.volunteering || [] },
    ];

    if (loading) return <SkeletonLoader type="list" />;

    const currentItems = (tabs.find(t => t.id === activeTab)?.items || []) as any[];

    return (
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
            <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
                <div className="px-4 py-4 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                        <ArrowRight className="text-slate-600" />
                    </button>
                    <h1 className="text-lg font-black text-slate-800">مركز الرقابة</h1>
                </div>

                <div className="flex overflow-x-auto px-4 gap-2 pb-3 scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as ModType)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                            {tab.items.length > 0 && (
                                <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    {tab.items.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </header>

            <main className="p-4 space-y-4">
                {currentItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-bold text-slate-400">#ID-{item.id}</span>
                            <span className="text-[10px] font-black bg-amber-50 text-amber-600 px-3 py-1 rounded-full">قيد المراجعة</span>
                        </div>

                        <h3 className="font-bold text-slate-800 mb-2">{item.title || item.description || item.name}</h3>
                        {item.user && (
                            <div className="text-xs text-slate-500 mb-4 flex items-center gap-2">
                                <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center font-bold text-[10px]">
                                    {item.user.name.charAt(0)}
                                </div>
                                بواسطة: <span className="font-bold">{item.user.name}</span>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleAction(activeTab, item.id, 'approve')}
                                className="flex-1 bg-emerald-50 text-emerald-600 py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-xs active:scale-95 transition-all"
                            >
                                <Check size={16} />
                                موافقة
                            </button>
                            <button
                                onClick={() => handleAction(activeTab, item.id, 'reject')}
                                className="flex-1 bg-rose-50 text-rose-600 py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-xs active:scale-95 transition-all"
                            >
                                <X size={16} />
                                رفض
                            </button>
                        </div>
                    </div>
                ))}

                {currentItems.length === 0 && (
                    <div className="py-20 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                            <Check size={40} />
                        </div>
                        <p className="text-slate-500 font-bold">كل شيء نظيف! لا توجد طلبات معلقة</p>
                    </div>
                )}
            </main>
        </div>
    );
}
