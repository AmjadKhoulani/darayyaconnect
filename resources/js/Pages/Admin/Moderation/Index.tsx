import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface PendingItem {
    id: number;
    title?: string;
    name?: string;
    description?: string;
    body?: string;
    user?: { name: string };
    created_at: string;
}

interface ModerationProps extends PageProps {
    pending_initiatives: PendingItem[];
    pending_discussions: PendingItem[];
    pending_books: PendingItem[];
    pending_volunteering: PendingItem[];
    pending_lost_found: PendingItem[];
    forbidden_words: { id: number; word: string }[];
}

export default function Index({
    auth,
    pending_initiatives,
    pending_discussions,
    pending_books,
    pending_volunteering,
    pending_lost_found,
    forbidden_words
}: ModerationProps) {
    const [activeTab, setActiveTab] = useState<'content' | 'filter'>('content');
    const { data, setData, post, reset } = useForm({
        word: '',
    });

    const approve = (type: string, id: number) => {
        if (confirm('هل أنت متأكد من الموافقة؟')) {
            router.post(route('admin.moderation.approve', { type, id }));
        }
    };

    const reject = (type: string, id: number) => {
        if (confirm('هل أنت متأكد من الرفض؟')) {
            router.post(route('admin.moderation.reject', { type, id }));
        }
    };

    const addWord = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.moderation.forbidden-words.store'), {
            onSuccess: () => reset('word'),
        });
    };

    const deleteWord = (id: number) => {
        if (confirm('حذف الكلمة؟')) {
            router.delete(route('admin.moderation.forbidden-words.destroy', id));
        }
    };

    const renderItems = (items: PendingItem[], type: string, label: string) => {
        if (items.length === 0) return null;

        return (
            <div className="mb-8">
                <h3 className="mb-4 text-lg font-bold text-slate-800 border-r-4 border-emerald-500 pr-3">{label}</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                        <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                            <div className="mb-3 flex items-center justify-between">
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">ID: #{item.id}</span>
                                <span className="text-[10px] text-slate-400">{new Date(item.created_at).toLocaleDateString('ar-SY')}</span>
                            </div>
                            <h4 className="mb-2 font-bold text-slate-900">{item.title || item.name}</h4>
                            <p className="mb-4 line-clamp-2 text-sm text-slate-600">{item.description || item.body}</p>
                            <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
                                <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                                    {item.user?.name.charAt(0) || '?'}
                                </div>
                                <span>بواسطة: {item.user?.name || 'غير معروف'}</span>
                            </div>
                            <div className="flex gap-2 border-t pt-4">
                                <button
                                    onClick={() => approve(type, item.id)}
                                    className="flex-1 rounded-lg bg-emerald-600 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                                >
                                    ✅ موافقة
                                </button>
                                <button
                                    onClick={() => reject(type, item.id)}
                                    className="flex-1 rounded-lg bg-rose-50 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
                                >
                                    ❌ رفض
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const totalPending = pending_initiatives.length + pending_discussions.length + pending_books.length + pending_volunteering.length + pending_lost_found.length;

    return (
        <AdminLayout user={auth.user} header="نظام الرقابة والموافقة">
            <Head title="الرقابة والموافقة" />

            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`pb-4 px-6 text-sm font-bold transition-all ${activeTab === 'content' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        المساهمات المعلقة ({totalPending})
                    </button>
                    <button
                        onClick={() => setActiveTab('filter')}
                        className={`pb-4 px-6 text-sm font-bold transition-all ${activeTab === 'filter' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        فلتر الكلمات ({forbidden_words.length})
                    </button>
                </div>

                {activeTab === 'content' ? (
                    <div>
                        {totalPending === 0 ? (
                            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
                                <div className="mb-4 text-4xl">🎉</div>
                                <h3 className="text-xl font-bold text-slate-800">لا توجد طلبات معلقة</h3>
                                <p className="text-slate-500">تمت مراجعة جميع المساهمات المجتمعية.</p>
                            </div>
                        ) : (
                            <>
                                {renderItems(pending_initiatives, 'initiative', 'المبادرات المجتمعية')}
                                {renderItems(pending_discussions, 'discussion', 'النقاشات العامة')}
                                {renderItems(pending_books, 'book', 'الكتب المعارة')}
                                {renderItems(pending_volunteering, 'volunteering', 'فرص التطوع')}
                                {renderItems(pending_lost_found, 'lost_found', 'المفقودات')}
                            </>
                        )}
                    </div>
                ) : (
                    <div className="max-w-2xl">
                        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                            <h3 className="mb-4 font-bold text-slate-800">إضافة كلمة محظورة</h3>
                            <form onSubmit={addWord} className="flex gap-2">
                                <input
                                    type="text"
                                    value={data.word}
                                    onChange={(e) => setData('word', e.target.value)}
                                    placeholder="اكتب الكلمة هنا..."
                                    className="flex-1 rounded-xl border-slate-200 py-3 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                                >
                                    إضافة +
                                </button>
                            </form>
                            <p className="mt-4 text-xs text-slate-400">أي رسالة في الدردشة تحتوي على هذه الكلمات سيتم استبدال الكلمة بالنجوم (****).</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            {forbidden_words.map((w) => (
                                <div key={w.id} className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-rose-200 hover:bg-rose-50 transition-all">
                                    <span className="text-sm font-bold text-slate-700">{w.word}</span>
                                    <button
                                        onClick={() => deleteWord(w.id)}
                                        className="text-slate-300 hover:text-rose-600 transition-colors"
                                    >
                                        <span className="text-lg">×</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
