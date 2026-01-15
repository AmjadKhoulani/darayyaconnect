import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Book {
    id: number;
    title: string;
    author: string;
    category: string;
    condition: string;
    status: 'available' | 'exchanged';
    cover_image: string | null;
    contact_info: string;
    created_at: string;
}

interface Props {
    auth: any;
    books: {
        data: Book[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}

export default function BooksIndex({ auth, books, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Book | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('admin.books.index'),
            { search },
            { preserveState: true },
        );
    };

    const deleteItem = (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذا الكتاب؟')) {
            router.delete(route('admin.books.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const openModal = (item: Book | null = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-bold text-slate-800">
                    📚 مكتبة داريا التبادلية
                </h2>
            }
        >
            <Head title="المكتبة" />

            <div className="px-6 py-12 lg:px-8" dir="rtl">
                <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <form onSubmit={handleSearch} className="relative w-96">
                        <input
                            type="text"
                            placeholder="بحث عن كتاب..."
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
                        <span>+</span> إضافة كتاب
                    </button>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-right">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                            <tr>
                                <th className="px-6 py-4">عنوان الكتاب</th>
                                <th className="px-6 py-4">المؤلف</th>
                                <th className="px-6 py-4">التصنيف</th>
                                <th className="px-6 py-4">الحالة</th>
                                <th className="px-6 py-4">تاريخ الإضافة</th>
                                <th className="px-6 py-4">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {books.data.map((item) => (
                                <tr
                                    key={item.id}
                                    className="transition hover:bg-slate-50"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {item.cover_image ? (
                                                <img
                                                    src={item.cover_image}
                                                    alt=""
                                                    className="h-10 w-10 rounded object-cover shadow-sm"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-100 text-xl">
                                                    📘
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-bold text-slate-800">
                                                    {item.title}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {item.condition}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-600">
                                        {item.author}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {item.category}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded px-2 py-1 text-xs font-bold ${
                                                item.status === 'available'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-slate-100 text-slate-500'
                                            }`}
                                        >
                                            {item.status === 'available'
                                                ? 'متاح للتبادل'
                                                : 'تم التبادل'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(
                                            item.created_at,
                                        ).toLocaleDateString()}
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

            <BookModal
                show={isModalOpen}
                item={editingItem}
                onClose={() => setIsModalOpen(false)}
            />
        </AdminLayout>
    );
}

function BookModal({
    show,
    item,
    onClose,
}: {
    show: boolean;
    item: Book | null;
    onClose: () => void;
}) {
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        author: '',
        category: '',
        condition: 'جيدة',
        status: 'available',
        contact_info: '',
        cover_image: null as File | null,
        _method: 'POST',
    });

    useEffect(() => {
        if (item) {
            setData({
                title: item.title,
                author: item.author,
                category: item.category,
                condition: item.condition,
                status: item.status,
                contact_info: item.contact_info,
                cover_image: null,
                _method: 'PUT',
            });
        } else {
            setData({
                title: '',
                author: '',
                category: '',
                condition: 'جيدة',
                status: 'available',
                contact_info: '',
                cover_image: null,
                _method: 'POST',
            });
        }
    }, [item]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = item
            ? route('admin.books.update', item.id)
            : route('admin.books.store');

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
                    {item ? 'تعديل بيانات الكتاب' : 'إضافة كتاب جديد'}
                </h2>

                <div className="space-y-4">
                    <div>
                        <InputLabel value="عنوان الكتاب" />
                        <TextInput
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="mt-1 w-full"
                            placeholder="اسم الكتاب..."
                        />
                        {errors.title && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="المؤلف" />
                            <TextInput
                                value={data.author}
                                onChange={(e) =>
                                    setData('author', e.target.value)
                                }
                                className="mt-1 w-full"
                            />
                            {errors.author && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.author}
                                </p>
                            )}
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
                                <option value="">اختر..</option>
                                <option value="روايات">روايات</option>
                                <option value="علمي">علمي</option>
                                <option value="ديني">ديني</option>
                                <option value="تاريخ">تاريخ</option>
                                <option value="أطفال">أطفال</option>
                                <option value="أخرى">أخرى</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="حالة الكتاب" />
                            <select
                                value={data.condition}
                                onChange={(e) =>
                                    setData('condition', e.target.value)
                                }
                                className="mt-1 w-full rounded-lg border-slate-300"
                            >
                                <option value="جديدة">جديدة</option>
                                <option value="جيدة جداً">جيدة جداً</option>
                                <option value="جيدة">جيدة</option>
                                <option value="مقبولة">مقبولة</option>
                            </select>
                        </div>
                        <div>
                            <InputLabel value="حالة التوفر" />
                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData('status', e.target.value)
                                }
                                className="mt-1 w-full rounded-lg border-slate-300"
                            >
                                <option value="available">
                                    متاح للتبادل ✅
                                </option>
                                <option value="exchanged">تم التبادل 🤝</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="معلومات التواصل" />
                            <TextInput
                                value={data.contact_info}
                                onChange={(e) =>
                                    setData('contact_info', e.target.value)
                                }
                                className="mt-1 w-full"
                                placeholder="رقم هاتف أو حساب..."
                            />
                        </div>
                        <div>
                            <InputLabel value="صورة الغلاف (اختياري)" />
                            <input
                                type="file"
                                onChange={(e) =>
                                    setData(
                                        'cover_image',
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
                        {item ? 'حفظ التغييرات' : 'إضافة الكتاب'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
