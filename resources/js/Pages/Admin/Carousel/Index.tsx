import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ auth, items }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors, transform } = useForm({
        title: '',
        description: '',
        image: null as File | null,
        button_text: '',
        button_link: '',
        type: 'general',
        order: 0,
        is_active: true,
    });

    const openModal = (item: any = null) => {
        if (item) {
            setEditingItem(item);
            setData({
                title: item.title,
                description: item.description || '',
                image: null,
                button_text: item.button_text || '',
                button_link: item.button_link || '',
                type: item.type,
                order: item.order,
                is_active: item.is_active,
            });
        } else {
            setEditingItem(null);
            reset();
        }
        clearErrors();
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
            transform((data) => ({
                ...data,
                _method: 'PUT',
            }));
            post(route('admin.carousel.update', editingItem.id), {
                forceFormData: true,
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.carousel.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
            destroy(route('admin.carousel.destroy', id));
        }
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-bold text-slate-800">
                    إدارة سلايدر الصفحة الرئيسية (Carousel)
                </h2>
            }
        >
            <Head title="إدارة الكاروسيل" />

            <div className="px-6 py-12 lg:px-8" dir="rtl">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-700">
                        قائمة العناصر ({items.length})
                    </h3>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
                    >
                        <span>+</span> إضافة عنصر جديد
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item: any) => (
                        <div key={item.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                            <div className="relative h-40 bg-slate-100">
                                {item.image_path ? (
                                    <img
                                        src={`/storage/${item.image_path}`}
                                        className="h-full w-full object-cover"
                                        alt={item.title}
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-slate-300 text-4xl">
                                        🖼️
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {item.is_active ? 'نشط' : 'معطل'}
                                    </span>
                                    <span className="rounded-full bg-slate-900/50 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                                        ترتيب: {item.order}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="mb-1 text-[10px] font-black uppercase tracking-wider text-emerald-600">
                                    {item.type === 'global' ? 'تجارب عالمية' : item.type === 'awareness' ? 'توعية' : 'عام'}
                                </div>
                                <h4 className="mb-2 line-clamp-1 font-bold text-slate-800">{item.title}</h4>
                                <p className="mb-4 line-clamp-2 text-xs text-slate-500">{item.description}</p>

                                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openModal(item)}
                                            className="rounded-lg bg-slate-100 p-2 text-sm text-slate-600 hover:bg-slate-200"
                                            title="تعديل"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="rounded-lg bg-rose-50 p-2 text-sm text-rose-600 hover:bg-rose-100"
                                            title="حذف"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                    {item.button_link && (
                                        <a href={item.button_link} target="_blank" className="text-[10px] font-bold text-indigo-600 hover:underline">
                                            معاينة الرابط
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="col-span-full rounded-xl border-2 border-dashed border-slate-200 py-20 text-center text-slate-400">
                            لا توجد عناصر حالياً.
                        </div>
                    )}
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
                        {editingItem ? 'تعديل عنصر' : 'إضافة عنصر جديد'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <InputLabel htmlFor="title" value="العنوان" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="الوصف" />
                                <textarea
                                    id="description"
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                    rows={4}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                ></textarea>
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="type" value="النوع" />
                                    <select
                                        id="type"
                                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                    >
                                        <option value="general">عام</option>
                                        <option value="global">تجارب عالمية</option>
                                        <option value="awareness">توعية</option>
                                    </select>
                                    <InputError message={errors.type} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="order" value="الترتيب" />
                                    <TextInput
                                        id="order"
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={data.order}
                                        onChange={(e) => setData('order', parseInt(e.target.value))}
                                        required
                                    />
                                    <InputError message={errors.order} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <InputLabel value="الصورة" />
                                <div className="mt-1 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 p-6 transition hover:border-emerald-500">
                                    {editingItem?.image_path && !data.image && (
                                        <img src={`/storage/${editingItem.image_path}`} className="mb-4 h-32 w-full object-cover rounded-lg" />
                                    )}
                                    <input
                                        type="file"
                                        className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                        onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                                    />
                                    <p className="mt-2 text-[10px] text-slate-400">يفضل صورة بقياس 1200×600 بكسل</p>
                                </div>
                                <InputError message={errors.image} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="button_text" value="نص الزر (اختياري)" />
                                <TextInput
                                    id="button_text"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.button_text}
                                    onChange={(e) => setData('button_text', e.target.value)}
                                />
                                <InputError message={errors.button_text} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="button_link" value="رابط الزر (اختياري)" />
                                <TextInput
                                    id="button_link"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.button_link}
                                    onChange={(e) => setData('button_link', e.target.value)}
                                />
                                <InputError message={errors.button_link} className="mt-2" />
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    className="rounded border-slate-300 text-emerald-600 shadow-sm focus:ring-emerald-500"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                />
                                <InputLabel htmlFor="is_active" value="نشط (يظهر في الصفحة الرئيسية)" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                        <SecondaryButton onClick={closeModal} type="button">
                            إلغاء
                        </SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            {editingItem ? 'حفظ التعديلات' : 'إضافة العنصر'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
