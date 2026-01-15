import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Generator {
    id: number;
    name: string;
    neighborhood: string;
    ampere_price: number;
    status: 'active' | 'down' | 'maintenance';
    operating_hours: number;
    latitude: number;
    longitude: number;
}

interface Props {
    auth: any;
    generators: {
        data: Generator[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}

export default function GeneratorsIndex({ auth, generators, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Generator | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('admin.generators.index'),
            { search },
            { preserveState: true },
        );
    };

    const deleteItem = (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذه المولدة؟')) {
            router.delete(route('admin.generators.destroy', id));
        }
    };

    const openModal = (item: Generator | null = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-bold text-slate-800">
                    🔌 إدارة الأمبيرات
                </h2>
            }
        >
            <Head title="الأمبيرات" />

            <div className="px-6 py-12 lg:px-8" dir="rtl">
                <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <form onSubmit={handleSearch} className="relative w-96">
                        <input
                            type="text"
                            placeholder="بحث عن مولدة..."
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
                        <span>+</span> إضافة مولدة
                    </button>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-right">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                            <tr>
                                <th className="px-6 py-4">اسم المولدة</th>
                                <th className="px-6 py-4">الحي</th>
                                <th className="px-6 py-4">سعر الأمبير</th>
                                <th className="px-6 py-4">الحالة</th>
                                <th className="px-6 py-4">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {generators.data.map((item) => (
                                <tr
                                    key={item.id}
                                    className="transition hover:bg-slate-50"
                                >
                                    <td className="px-6 py-4 font-bold text-slate-800">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {item.neighborhood}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-emerald-600">
                                        {item.ampere_price.toLocaleString()} ل.س
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded px-2 py-1 text-xs font-bold ${
                                                item.status === 'active'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : item.status ===
                                                        'maintenance'
                                                      ? 'bg-amber-100 text-amber-700'
                                                      : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {item.status === 'active'
                                                ? 'تعمل ✅'
                                                : item.status === 'maintenance'
                                                  ? 'صيانة 🛠️'
                                                  : 'متوقفة ❌'}
                                        </span>
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

            <GeneratorModal
                show={isModalOpen}
                item={editingItem}
                onClose={() => setIsModalOpen(false)}
            />
        </AdminLayout>
    );
}

function GeneratorModal({
    show,
    item,
    onClose,
}: {
    show: boolean;
    item: Generator | null;
    onClose: () => void;
}) {
    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: item?.name || '',
        neighborhood: item?.neighborhood || '',
        ampere_price: item?.ampere_price || '',
        status: item?.status || 'active',
        latitude: item?.latitude || 33.5,
        longitude: item?.longitude || 36.3,
    });

    // Update form data when item changes
    useState(() => {
        if (item) {
            setData({
                name: item.name,
                neighborhood: item.neighborhood,
                ampere_price: item.ampere_price,
                status: item.status,
                latitude: item.latitude,
                longitude: item.longitude,
            });
        }
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (item) {
            put(route('admin.generators.update', item.id), {
                onSuccess: onClose,
            });
        } else {
            post(route('admin.generators.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={submit} className="p-6">
                <h2 className="mb-6 text-lg font-bold text-slate-900">
                    {item ? 'تعديل مولدة' : 'إضافة مولدة جديدة'}
                </h2>

                <div className="space-y-4">
                    <div>
                        <InputLabel value="اسم المولدة" />
                        <TextInput
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-1 w-full"
                            placeholder="مثال: مولدة الحمد"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="الحي / المنطقة" />
                            <TextInput
                                value={data.neighborhood}
                                onChange={(e) =>
                                    setData('neighborhood', e.target.value)
                                }
                                className="mt-1 w-full"
                                placeholder="مثال: الكورنيش"
                            />
                        </div>
                        <div>
                            <InputLabel value="سعر الأمبير (ل.س)" />
                            <TextInput
                                type="number"
                                value={data.ampere_price}
                                onChange={(e) =>
                                    setData('ampere_price', e.target.value)
                                }
                                className="mt-1 w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <InputLabel value="الحالة التشغيلية" />
                        <select
                            value={data.status}
                            onChange={(e) =>
                                setData('status', e.target.value as any)
                            }
                            className="mt-1 w-full rounded-lg border-slate-300 focus:ring-emerald-500"
                        >
                            <option value="active">تعمل بشكل طبيعي ✅</option>
                            <option value="maintenance">
                                في وضع الصيانة 🛠️
                            </option>
                            <option value="down">متوقفة ❌</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="خط العرض (Latitude)" />
                            <TextInput
                                type="number"
                                step="any"
                                value={data.latitude}
                                onChange={(e) =>
                                    setData(
                                        'latitude',
                                        parseFloat(e.target.value),
                                    )
                                }
                                className="mt-1 w-full"
                            />
                        </div>
                        <div>
                            <InputLabel value="خط الطول (Longitude)" />
                            <TextInput
                                type="number"
                                step="any"
                                value={data.longitude}
                                onChange={(e) =>
                                    setData(
                                        'longitude',
                                        parseFloat(e.target.value),
                                    )
                                }
                                className="mt-1 w-full"
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
                        {item ? 'حفظ التغييرات' : 'إضافة المولدة'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
