import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Initiative {
    id: number;
    title: string;
    description: string;
    status: string;
    category: string;
    icon: string;
    image: string | null;
    votes_count: number;
    moderation_status: string;
    rejection_reason: string | null;
    created_at: string;
    user?: {
        name: string;
    };
}

interface Props {
    auth: any;
    initiatives: {
        data: Initiative[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}

export default function InitiativesIndex({
    auth,
    initiatives,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [editingItem, setEditingItem] = useState<Initiative | null>(null);
    const [itemToReject, setItemToReject] = useState<Initiative | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('admin.initiatives.index'),
            { search },
            { preserveState: true },
        );
    };

    const deleteItem = (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذه المبادرة؟')) {
            router.delete(route('admin.initiatives.destroy', id));
        }
    };

    const approveItem = (id: number) => {
        if (confirm('هل أنت متأكد من الموافقة على هذه المبادرة؟')) {
            router.post(route('admin.initiatives.approve', id));
        }
    };

    const openRejectModal = (item: Initiative) => {
        setItemToReject(item);
        setRejectionReason('');
        setIsRejectModalOpen(true);
    };

    const submitRejection = () => {
        if (!rejectionReason.trim()) return;
        router.post(route('admin.initiatives.reject', itemToReject!.id), {
            reason: rejectionReason
        }, {
            onSuccess: () => setIsRejectModalOpen(false)
        });
    };

    const openModal = (item: Initiative | null = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-bold text-slate-800">
                    🗳️ إدارة المبادرات
                </h2>
            }
        >
            <Head title="المبادرات" />

            <div className="px-6 py-12 lg:px-8" dir="rtl">
                <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <form onSubmit={handleSearch} className="relative w-96">
                        <input
                            type="text"
                            placeholder="بحث عن مبادرة..."
                            className="w-full rounded-lg border-slate-300 py-2 pl-10 pr-4 focus:ring-emerald-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="absolute left-2 top-2 text-slate-400"
                        >
                            🔍
                        </button>
                    </form>

                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white transition hover:bg-emerald-700"
                    >
                        <span>+</span> إضافة مبادرة
                    </button>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-right">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                            <tr>
                                <th className="px-6 py-4">عنوان المبادرة / المعلن</th>
                                <th className="px-6 py-4">التصنيف</th>
                                <th className="px-6 py-4">الأصوات</th>
                                <th className="px-6 py-4">الحالة</th>
                                <th className="px-6 py-4">التدقيق</th>
                                <th className="px-6 py-4">تاريخ الإطلاق</th>
                                <th className="px-6 py-4">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {initiatives.data.map((item) => (
                                <tr
                                    key={item.id}
                                    className="transition hover:bg-slate-50"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">
                                                {item.icon || '📌'}
                                            </span>
                                            <div>
                                                <div className="font-bold text-slate-800">
                                                    {item.title}
                                                </div>
                                                <div className="text-[10px] text-emerald-600 font-bold">
                                                    بواسطة: {item.user?.name || 'مستخدم مجهول'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {item.category}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-blue-600">
                                        {item.votes_count} 👍
                                    </td>
                                    <td className="px-6 py-4 font-medium">
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${item.moderation_status === 'approved'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : item.moderation_status === 'rejected'
                                                        ? 'bg-rose-100 text-rose-700'
                                                        : 'bg-amber-100 text-amber-700'
                                                }`}
                                        >
                                            {item.moderation_status === 'approved'
                                                ? 'تمت الموافقة'
                                                : item.moderation_status === 'rejected'
                                                    ? 'مرفوضة'
                                                    : 'قيد المراجعة'}
                                        </span>
                                        {item.rejection_reason && (
                                            <div className="mt-1 text-[10px] text-rose-500 max-w-[150px] truncate" title={item.rejection_reason}>
                                                السبب: {item.rejection_reason}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(
                                            item.created_at,
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {item.moderation_status !== 'approved' && (
                                                <button
                                                    onClick={() => approveItem(item.id)}
                                                    className="rounded-lg bg-emerald-50 p-2 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                    title="موافقة"
                                                >
                                                    ✅
                                                </button>
                                            )}
                                            {item.moderation_status !== 'rejected' && (
                                                <button
                                                    onClick={() => openRejectModal(item)}
                                                    className="rounded-lg bg-rose-50 p-2 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                    title="رفض"
                                                >
                                                    ❌
                                                </button>
                                            )}
                                            <div className="w-px h-8 bg-slate-100 mx-1"></div>
                                            <button
                                                onClick={() => openModal(item)}
                                                className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => deleteItem(item.id)}
                                                className="rounded-lg bg-slate-50 p-2 text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <InitiativeModal
                show={isModalOpen}
                item={editingItem}
                onClose={() => setIsModalOpen(false)}
            />

            <Modal show={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">🚫 رفض المبادرة</h2>
                    <p className="text-sm text-slate-600 mb-4">يرجى كتابة سبب الرفض لتوضيحه لصاحب المبادرة:</p>

                    <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full h-32 rounded-xl border-slate-300 focus:ring-rose-500 focus:border-rose-500 text-sm p-4"
                        placeholder="مثلاً: المحتوى غير لائق، أو المعلومات غير كافية..."
                    />

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsRejectModalOpen(false)}>إلغاء</SecondaryButton>
                        <button
                            onClick={submitRejection}
                            disabled={!rejectionReason.trim()}
                            className="bg-rose-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-rose-700 disabled:opacity-50 transition-all"
                        >
                            تأكيد الرفض
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}

function InitiativeModal({
    show,
    item,
    onClose,
}: {
    show: boolean;
    item: Initiative | null;
    onClose: () => void;
}) {
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
        category: '',
        status: 'active',
        icon: '',
        image: null as File | null,
        _method: 'POST', // Make it POST by default, will override for PUT
    });

    useEffect(() => {
        if (item) {
            setData({
                title: item.title,
                description: item.description,
                category: item.category || '',
                status: item.status,
                icon: item.icon || '',
                image: null,
                _method: 'PUT',
            });
        } else {
            setData({
                title: '',
                description: '',
                category: '',
                status: 'active',
                icon: '',
                image: null,
                _method: 'POST',
            });
        }
    }, [item]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Use post for both, but with _method=PUT for updates (Inertia handles this better for file uploads)
        const url = item
            ? route('admin.initiatives.update', item.id)
            : route('admin.initiatives.store');

        post(url, {
            onSuccess: () => {
                reset();
                onClose();
            },
            forceFormData: true,
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={submit} className="p-6">
                <h2 className="mb-6 text-lg font-bold text-slate-900">
                    {item ? 'تعديل المبادرة' : 'إطلاق مبادرة جديدة'}
                </h2>

                <div className="space-y-4">
                    <div>
                        <InputLabel value="عنوان المبادرة" />
                        <TextInput
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="mt-1 w-full"
                            placeholder="مثال: حملة تشجير الحي"
                        />
                        {errors.title && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div>
                        <InputLabel value="الوصف" />
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            className="mt-1 h-24 w-full rounded-lg border-slate-300"
                            placeholder="اشرح تفاصيل المبادرة..."
                        ></textarea>
                        {errors.description && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="التصنيف" />
                            <select
                                value={data.category}
                                onChange={(e) =>
                                    setData('category', e.target.value)
                                }
                                className="mt-1 w-full rounded-lg border-slate-300"
                            >
                                <option value="">اختر..</option>
                                <option value="بيئة">بيئة</option>
                                <option value="تعليم">تعليم</option>
                                <option value="صحة">صحة</option>
                                <option value="اجتماعي">اجتماعي</option>
                                <option value="إغاثة">إغاثة</option>
                            </select>
                        </div>
                        <div>
                            <InputLabel value="الحالة" />
                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData('status', e.target.value)
                                }
                                className="mt-1 w-full rounded-lg border-slate-300"
                            >
                                <option value="active">جارية (نشطة)</option>
                                <option value="completed">مكتملة</option>
                                <option value="pending">قيد المراجعة</option>
                                <option value="cancelled">ملغاة</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="الأيقونة (رمز تعبيري)" />
                            <TextInput
                                value={data.icon}
                                onChange={(e) =>
                                    setData('icon', e.target.value)
                                }
                                className="mt-1 w-full text-center text-xl"
                                placeholder="🌱"
                                maxLength={2}
                            />
                        </div>
                        <div>
                            <InputLabel value="صورة الغلاف (اختياري)" />
                            <input
                                type="file"
                                onChange={(e) =>
                                    setData(
                                        'image',
                                        e.target.files
                                            ? e.target.files[0]
                                            : null,
                                    )
                                }
                                className="mt-1 w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose}>إلغاء</SecondaryButton>
                    <PrimaryButton
                        disabled={processing}
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        {item ? 'حفظ التغييرات' : 'إطلاق المبادرة'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
