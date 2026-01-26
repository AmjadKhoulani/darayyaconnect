import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Check, X, Clock, User } from 'lucide-react';
import api from '../services/api';

export default function BookManagement() {
    const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing' | 'my-books'>('incoming');
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchItems = async () => {
        setLoading(true);
        try {
            let res;
            if (activeTab === 'incoming') res = await api.get('/incoming-requests');
            else if (activeTab === 'outgoing') res = await api.get('/my-requests');
            else res = await api.get('/my-books');

            setItems(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [activeTab]);

    const handleAction = async (id: number, action: 'approve' | 'reject' | 'return') => {
        try {
            await api.put(`/book-requests/${id}/${action}`);
            fetchItems(); // Refresh
            alert('تم تنفيذ العملية بنجاح');
        } catch (err) {
            alert('حدث خطأ');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20" dir="rtl">
            <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10 px-4 py-4">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                        <ArrowRight size={20} />
                    </button>
                    <h1 className="text-xl font-black text-slate-800 dark:text-white">إدارة كتبي</h1>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('incoming')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'incoming' ? 'bg-white dark:bg-slate-600 shadow text-teal-600' : 'text-slate-500'}`}
                    >
                        طلبات واردة
                    </button>
                    <button
                        onClick={() => setActiveTab('outgoing')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'outgoing' ? 'bg-white dark:bg-slate-600 shadow text-teal-600' : 'text-slate-500'}`}
                    >
                        طلباتي
                    </button>
                    <button
                        onClick={() => setActiveTab('my-books')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'my-books' ? 'bg-white dark:bg-slate-600 shadow text-teal-600' : 'text-slate-500'}`}
                    >
                        كتبي المعروضة
                    </button>
                </div>
            </header>

            <main className="p-4">
                {loading ? (
                    <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>
                ) : items.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                        <p>لا توجد بيانات هنا</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-white">{item.book?.title || item.title}</h3>
                                        <p className="text-xs text-slate-500">{new Date(item.created_at).toLocaleDateString('ar-SY')}</p>
                                    </div>
                                    <span className={`text-[10px] px-2 py-1 rounded-lg font-bold ${(item.status || item.request_status) === 'pending' ? 'bg-amber-100 text-amber-700' :
                                            (item.status || item.request_status) === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                                (item.status || item.request_status) === 'rejected' ? 'bg-rose-100 text-rose-700' :
                                                    'bg-slate-100 text-slate-700'
                                        }`}>
                                        {(item.status || item.request_status) === 'pending' ? 'قيد الانتظار' :
                                            (item.status || item.request_status) === 'approved' ? 'مقبول' :
                                                (item.status || item.request_status) === 'rejected' ? 'مرفوض' : item.status}
                                    </span>
                                </div>

                                {activeTab === 'incoming' && (
                                    <>
                                        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl mb-3 flex items-center gap-3">
                                            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                                                <User size={16} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold">طالب الاستعارة:</p>
                                                <p className="text-sm">{item.user?.name}</p>
                                            </div>
                                        </div>
                                        {item.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button onClick={() => handleAction(item.id, 'approve')} className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                                                    <Check size={16} /> قبول
                                                </button>
                                                <button onClick={() => handleAction(item.id, 'reject')} className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                                                    <X size={16} /> رفض
                                                </button>
                                            </div>
                                        )}
                                        {item.status === 'approved' && (
                                            <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs">
                                                يجب تسليم الكتاب للطالب. رقم هاتفه: {item.user?.phone}
                                            </div>
                                        )}
                                    </>
                                )}

                                {activeTab === 'outgoing' && (
                                    <div className="text-xs text-slate-500">
                                        {item.status === 'approved' ? (
                                            <p className="text-emerald-600 font-bold">تمت الموافقة! تواصل مع صاحب الكتاب لاستلامه.</p>
                                        ) : (
                                            <p>بانتظار موافقة صاحب الكتاب...</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
