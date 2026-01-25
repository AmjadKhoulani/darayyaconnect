import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface DirectoryItem {
    id: number;
    name: string;
    phone: string;
    type: string;
    category: string;
    icon: string;
    is_active: boolean;
    latitude?: number;
    longitude?: number;
}

export default function DirectoryIndex({
    auth,
    items,
}: PageProps<{ items: DirectoryItem[] }>) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<DirectoryItem | null>(null);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        name: '',
        phone: '',
        type: '',
        category: 'official',
        icon: 'Building2',
        description: '',
        latitude: '' as string | number,
        longitude: '' as string | number,
    });

    const openModal = (item: DirectoryItem | null = null) => {
        setEditingItem(item);
        if (item) {
            setData({
                name: item.name,
                phone: item.phone,
                type: item.type,
                category: item.category,
                icon: item.icon || 'Building2',
                description: '', // Description assumed to be fetched or optional
                latitude: item.latitude || '',
                longitude: item.longitude || '',
            });
        } else {
            reset();
            setData('category', 'official');
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            put(route('admin.directory.update', editingItem.id), {
                onSuccess: closeModal,
            });
        } else {
            post(route('admin.directory.store'), {
                onSuccess: closeModal,
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذه الجهة؟')) {
            destroy(route('admin.directory.destroy', id));
        }
    };

    return (
        <AdminLayout user={auth.user} header="دليل المدينة">
            <Head title="دليل المدينة" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-white p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">
                                    قائمة الجهات والخدمات
                                </h3>
                                <PrimaryButton onClick={() => openModal()}>
                                    إضافة جهة جديدة +
                                </PrimaryButton>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                الاسم
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                الهاتف
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                النوع
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                التصنيف
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                الإجراءات
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.name}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div
                                                        className="text-sm text-gray-500"
                                                        dir="ltr"
                                                    >
                                                        {item.phone}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">
                                                        {item.type}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {item.category ===
                                                        'official'
                                                        ? 'رسمي'
                                                        : 'شركة/خاص'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                                    <button
                                                        onClick={() =>
                                                            openModal(item)
                                                        }
                                                        className="ml-4 text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        تعديل
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id,
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        حذف
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="mb-4 text-lg font-medium text-gray-900">
                        {editingItem ? 'تعديل جهة' : 'إضافة جهة جديدة'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="الاسم" />
                            <TextInput
                                id="name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                required
                            />
                            {errors.name && (
                                <div className="mt-1 text-sm text-red-500">
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        <div>
                            <InputLabel htmlFor="phone" value="رقم الهاتف" />
                            <TextInput
                                id="phone"
                                type="text"
                                className="mt-1 block w-full text-right"
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                                dir="ltr"
                            />
                            {errors.phone && (
                                <div className="mt-1 text-sm text-red-500">
                                    {errors.phone}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel
                                    htmlFor="type"
                                    value="النوع (مثل: خدمي، أمني، انترنت)"
                                />
                                <TextInput
                                    id="type"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.type}
                                    onChange={(e) =>
                                        setData('type', e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="category"
                                    value="التصنيف العام"
                                />
                                <select
                                    id="category"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.category}
                                    onChange={(e) =>
                                        setData('category', e.target.value)
                                    }
                                >
                                    <option value="official">جهات رسمية</option>
                                    <option value="company">شركات خاصة</option>
                                    <option value="emergency">طوارئ</option>
                                    <option value="health">صحة</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="latitude" value="خط العرض (Latitude)" />
                                <TextInput
                                    id="latitude"
                                    type="text"
                                    className="mt-1 block w-full text-left"
                                    value={data.latitude}
                                    onChange={(e) => setData('latitude', e.target.value)}
                                    placeholder="e.g. 33.456"
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="longitude" value="خط الطول (Longitude)" />
                                <TextInput
                                    id="longitude"
                                    type="text"
                                    className="mt-1 block w-full text-left"
                                    value={data.longitude}
                                    onChange={(e) => setData('longitude', e.target.value)}
                                    placeholder="e.g. 36.234"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <SecondaryButton onClick={closeModal}>
                                إلغاء
                            </SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                {editingItem ? 'حفظ التعديلات' : 'إضافة'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}
