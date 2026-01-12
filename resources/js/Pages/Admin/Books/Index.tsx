import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

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
        router.get(route('admin.books.index'), { search }, { preserveState: true });
    };

    const deleteItem = (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذا الكتاب؟')) {
            router.delete(route('admin.books.destroy', id), { preserveScroll: true });
        }
    };

    const openModal = (item: Book | null = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    return (
        <AdminLayout user={auth.user} header={<h2 className="font-bold text-xl text-slate-800">📚 مكتبة داريا التبادلية</h2>}>
            <Head title="المكتبة" />

            <div className="py-12 px-6 lg:px-8" dir="rtl">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex justify-between items-center">
                    <form onSubmit={handleSearch} className="relative w-96">
                        <input
                            type="text"
                            placeholder="بحث عن كتاب..."
                            className="w-full pl-10 pr-4 py-2 border-slate-300 rounded-lg focus:ring-emerald-500"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <button type="submit" className="absolute left-2 top-2 text-slate-400">🔍</button>
                    </form>

                    <button
                        onClick={() => openModal()}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 transition flex items-center gap-2"
                    >
                        <span>+</span> إضافة كتاب
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
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
                                <tr key={item.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {item.cover_image ? (
                                                <img src={item.cover_image} alt="" className="w-10 h-10 rounded shadow-sm object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-xl">📘</div>
                                            )}
                                            <div>
                                                <div className="font-bold text-slate-800">{item.title}</div>
                                                <div className="text-xs text-slate-500">{item.condition}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">{item.author}</td>
                                    <td className="px-6 py-4 text-slate-600">{item.category}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {item.status === 'available' ? 'متاح للتبادل' : 'تم التبادل'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button onClick={() => openModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">✏️</button>
                                        <button onClick={() => deleteItem(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">🗑️</button>
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

function BookModal({ show, item, onClose }: { show: boolean, item: Book | null, onClose: () => void }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        author: '',
        category: '',
        condition: 'جيدة',
        status: 'available',
        contact_info: '',
        cover_image: null as File | null,
        _method: 'POST'
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
                _method: 'PUT'
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
                _method: 'POST'
            });
        }
    }, [item]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = item ? route('admin.books.update', item.id) : route('admin.books.store');

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
                <h2 className="text-lg font-bold text-slate-900 mb-6">
                    {item ? 'تعديل بيانات الكتاب' : 'إضافة كتاب جديد'}
                </h2>

                <div className="space-y-4">
                    <div>
                        <InputLabel value="عنوان الكتاب" />
                        <TextInput
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            className="w-full mt-1"
                            placeholder="اسم الكتاب..."
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="المؤلف" />
                            <TextInput
                                value={data.author}
                                onChange={e => setData('author', e.target.value)}
                                className="w-full mt-1"
                            />
                            {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author}</p>}
                        </div>
                        <div>
                            <InputLabel value="التصنيف" />
                            <select
                                value={data.category}
                                onChange={e => setData('category', e.target.value)}
                                className="w-full mt-1 border-slate-300 rounded-lg"
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
                                onChange={e => setData('condition', e.target.value)}
                                className="w-full mt-1 border-slate-300 rounded-lg"
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
                                onChange={e => setData('status', e.target.value)}
                                className="w-full mt-1 border-slate-300 rounded-lg"
                            >
                                <option value="available">متاح للتبادل ✅</option>
                                <option value="exchanged">تم التبادل 🤝</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="معلومات التواصل" />
                            <TextInput
                                value={data.contact_info}
                                onChange={e => setData('contact_info', e.target.value)}
                                className="w-full mt-1"
                                placeholder="رقم هاتف أو حساب..."
                            />
                        </div>
                        <div>
                            <InputLabel value="صورة الغلاف (اختياري)" />
                            <input
                                type="file"
                                onChange={e => setData('cover_image', e.target.files ? e.target.files[0] : null)}
                                className="w-full mt-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose}>إلغاء</SecondaryButton>
                    <PrimaryButton disabled={processing} className="bg-emerald-600 hover:bg-emerald-700">
                        {item ? 'حفظ التغييرات' : 'إضافة الكتاب'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
