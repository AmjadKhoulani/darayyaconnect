import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';

interface DirectoryItem {
    id: number;
    name: string;
    phone: string;
    type: string;
    category: string;
    icon: string;
    is_active: boolean;
}

export default function DirectoryIndex({ auth, items }: PageProps<{ items: DirectoryItem[] }>) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<DirectoryItem | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        phone: '',
        type: '',
        category: 'official',
        icon: 'Building2',
        description: '',
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
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">قائمة الجهات والخدمات</h3>
                                <PrimaryButton onClick={() => openModal()}>
                                    إضافة جهة جديدة +
                                </PrimaryButton>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الهاتف</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">النوع</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التصنيف</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500" dir="ltr">{item.phone}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {item.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.category === 'official' ? 'رسمي' : 'شركة/خاص'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => openModal(item)}
                                                        className="text-indigo-600 hover:text-indigo-900 ml-4"
                                                    >
                                                        تعديل
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
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
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
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
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                        </div>

                        <div>
                            <InputLabel htmlFor="phone" value="رقم الهاتف" />
                            <TextInput
                                id="phone"
                                type="text"
                                className="mt-1 block w-full text-right"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                dir="ltr"
                            />
                            {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="type" value="النوع (مثل: خدمي، أمني، انترنت)" />
                                <TextInput
                                    id="type"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="category" value="التصنيف العام" />
                                <select
                                    id="category"
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                >
                                    <option value="official">جهات رسمية</option>
                                    <option value="company">شركات خاصة</option>
                                    <option value="emergency">طوارئ</option>
                                    <option value="health">صحة</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <SecondaryButton onClick={closeModal}>إلغاء</SecondaryButton>
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
