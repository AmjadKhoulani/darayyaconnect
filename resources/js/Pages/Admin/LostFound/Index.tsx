import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface LostFoundItem {
    id: number;
    title: string;
    description: string;
    type: 'lost' | 'found';
    category: string;
    location: string;
    contact_phone: string;
    image: string | null;
    status: 'active' | 'resolved';
    created_at: string;
}

interface Props {
    auth: any;
    items: {
        data: LostFoundItem[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}

const categoryLabels: Record<string, string> = {
    documents: 'وثائق ومستندات',
    phone: 'هاتف',
    keys: 'مفاتيح',
    bag: 'حقيبة',
    wallet: 'محفظة',
    jewelry: 'مجوهرات',
    pet: 'حيوان أليف',
    other: 'أخرى',
};

export default function LostFoundIndex({ auth, items, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<LostFoundItem | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('admin.lost-found.index'),
            { search },
            { preserveState: true },
        );
    };

    const deleteItem = (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
            router.delete(route('admin.lost-found.destroy', id));
        }
    };

    const openModal = (item: LostFoundItem | null = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-bold text-slate-800">
                    🔍 إدارة المفقودات والموجودات
                </h2>
            }
        >
            <Head title="المفقودات" />

            <div className="px-6 py-12 lg:px-8" dir="rtl">
                <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <form onSubmit={handleSearch} className="relative w-96">
                        <input
                            type="text"
                            placeholder="بحث في المفقودات..."
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
                        <span>+</span> إضافة عنصر
                    </button>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-right">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                            <tr>
                                <th className="px-6 py-4">العنوان</th>
                                <th className="px-6 py-4">النوع</th>
                                <th className="px-6 py-4">التصنيف</th>
                                <th className="px-6 py-4">المكان</th>
                                <th className="px-6 py-4">رقم التواصل</th>
                                <th className="px-6 py-4">الحالة</th>
                                <th className="px-6 py-4">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.data.map((item) => (
                                <tr
                                    key={item.id}
                                    className="transition hover:bg-slate-50"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt=""
                                                    className="h-10 w-10 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-xl">
                                                    📦
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-bold text-slate-800">
                                                    {item.title}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {new Date(
                                                        item.created_at,
                                                    ).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded px-2 py-1 text-xs font-bold ${item.type === 'found'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-amber-100 text-amber-700'
                                                }`}
                                        >
                                            {item.type === 'found'
                                                ? 'موجود (لقطة) ✅'
                                                : 'مفقود ⚠️'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {categoryLabels[item.category] || item.category}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-600">
                                        {item.location}
                                    </td>
                                    <td className="px-6 py-4 font-mono">
                                        {item.contact_phone}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.status === 'resolved' ? (
                                            <span className="font-bold text-emerald-600">
                                                تم الحل 👍
                                            </span>
                                        ) : (
                                            <span className="text-slate-500">
                                                نشط
                                            </span>
                                        )}
                                    </td>
                                    <td className="flex gap-2 px-6 py-4">
                                        <button
                                            onClick={() => openModal(item)}
                                            className="rounded p-2 text-blue-600 hover:bg-blue-50"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => deleteItem(item.id)}
                                            className="rounded p-2 text-red-600 hover:bg-red-50"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <LostFoundModal
                show={isModalOpen}
                item={editingItem}
                onClose={() => setIsModalOpen(false)}
            />
        </AdminLayout>
    );
}

function LostFoundModal({
    show,
    item,
    onClose,
}: {
    show: boolean;
    item: LostFoundItem | null;
    onClose: () => void;
}) {
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
        type: 'lost',
        category: '',
        location: '',
        contact_phone: '',
        status: 'active',
        image: null as File | null,
        _method: 'POST',
    });

    useEffect(() => {
        if (item) {
            setData({
                title: item.title,
                description: item.description,
                type: item.type,
                category: item.category,
                location: item.location || '',
                contact_phone: item.contact_phone,
                status: item.status,
                image: null,
                _method: 'PUT',
            });
        } else {
            setData({
                title: '',
                description: '',
                type: 'lost',
                category: '',
                location: '',
                contact_phone: '',
                status: 'active',
                image: null,
                _method: 'POST',
            });
        }
    }, [item]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = item
            ? route('admin.lost-found.update', item.id)
            : route('admin.lost-found.store');

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
                    {item ? 'تعديل العنصر' : 'إضافة مفقود/موجود جديد'}
                </h2>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="نوع الإعلان" />
                            <select
                                value={data.type}
                                onChange={(e) =>
                                    setData('type', e.target.value)
                                }
                                className="mt-1 w-full rounded-lg border-slate-300"
                            >
                                <option value="lost">مفقود (ضائع) ⚠️</option>
                                <option value="found">موجود (لقطة) ✅</option>
                            </select>
                        </div>
                        <div>
                            <InputLabel value="التصنيف" />
                            <select
                                value={data.category}
                                onChange={(e) =>
                                    setData('category', e.target.value)
                                }
                                className="mt-1 w-full rounded-lg border-slate-300"
                            >
                                <option value="">اختر التصنيف...</option>
                                <option value="documents">وثائق ومستندات</option>
                                <option value="phone">هاتف / جوال</option>
                                <option value="keys">مفاتيح</option>
                                <option value="bag">حقيبة / شتنة</option>
                                <option value="wallet">محفظة / جزدان</option>
                                <option value="jewelry">مجوهرات / ذهب</option>
                                <option value="pet">حيوان أليف</option>
                                <option value="other">أخرى</option>
                            </select>
                            {errors.category && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.category}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <InputLabel value="عنوان الإعلان" />
                        <TextInput
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="mt-1 w-full"
                            placeholder="مثال: هوية شخصية باسم..."
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
                            placeholder="وصف إضافي..."
                        ></textarea>
                        {errors.description && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="المكان (تقريبي)" />
                            <TextInput
                                value={data.location}
                                onChange={(e) =>
                                    setData('location', e.target.value)
                                }
                                className="mt-1 w-full"
                                placeholder="مثال: جانب جامع..."
                            />
                        </div>
                        <div>
                            <InputLabel value="رقم للتواصل" />
                            <TextInput
                                value={data.contact_phone}
                                onChange={(e) =>
                                    setData('contact_phone', e.target.value)
                                }
                                className="mt-1 w-full"
                                placeholder="09..."
                            />
                            {errors.contact_phone && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.contact_phone}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="الحالة" />
                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData('status', e.target.value)
                                }
                                className="mt-1 w-full rounded-lg border-slate-300"
                            >
                                <option value="active">نشط (جاري البحث)</option>
                                <option value="resolved">
                                    تم الحل (تم التسليم)
                                </option>
                            </select>
                        </div>
                        <div>
                            <InputLabel value="صورة (اختياري)" />
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
                        {item ? 'حفظ التغييرات' : 'نشر الإعلان'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
