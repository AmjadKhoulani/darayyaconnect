import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

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

export default function LostFoundIndex({ auth, items, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<LostFoundItem | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.lost-found.index'), { search }, { preserveState: true });
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
        <AdminLayout user={auth.user} header={<h2 className="font-bold text-xl text-slate-800">🔍 إدارة المفقودات والموجودات</h2>}>
            <Head title="المفقودات" />

            <div className="py-12 px-6 lg:px-8" dir="rtl">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex justify-between items-center">
                    <form onSubmit={handleSearch} className="relative w-96">
                        <input
                            type="text"
                            placeholder="بحث في المفقودات..."
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
                        <span>+</span> إضافة عنصر
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
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
                                <tr key={item.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {item.image ? (
                                                <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl">📦</div>
                                            )}
                                            <div>
                                                <div className="font-bold text-slate-800">{item.title}</div>
                                                <div className="text-xs text-slate-500">{new Date(item.created_at).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.type === 'found' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {item.type === 'found' ? 'موجود (لقطة) ✅' : 'مفقود ⚠️'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{item.category}</td>
                                    <td className="px-6 py-4 text-slate-600 font-bold">{item.location}</td>
                                    <td className="px-6 py-4 font-mono">{item.contact_phone}</td>
                                    <td className="px-6 py-4">
                                        {item.status === 'resolved' ? (
                                            <span className="text-emerald-600 font-bold">تم الحل 👍</span>
                                        ) : (
                                            <span className="text-slate-500">نشط</span>
                                        )}
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

            <LostFoundModal
                show={isModalOpen}
                item={editingItem}
                onClose={() => setIsModalOpen(false)}
            />
        </AdminLayout>
    );
}

function LostFoundModal({ show, item, onClose }: { show: boolean, item: LostFoundItem | null, onClose: () => void }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
        type: 'lost',
        category: '',
        location: '',
        contact_phone: '',
        status: 'active',
        image: null as File | null,
        _method: 'POST'
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
                _method: 'PUT'
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
                _method: 'POST'
            });
        }
    }, [item]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = item ? route('admin.lost-found.update', item.id) : route('admin.lost-found.store');

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
                    {item ? 'تعديل العنصر' : 'إضافة مفقود/موجود جديد'}
                </h2>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="نوع الإعلان" />
                            <select
                                value={data.type}
                                onChange={e => setData('type', e.target.value)}
                                className="w-full mt-1 border-slate-300 rounded-lg"
                            >
                                <option value="lost">مفقود (ضائع) ⚠️</option>
                                <option value="found">موجود (لقطة) ✅</option>
                            </select>
                        </div>
                        <div>
                            <InputLabel value="التصنيف" />
                            <select
                                value={data.category}
                                onChange={e => setData('category', e.target.value)}
                                className="w-full mt-1 border-slate-300 rounded-lg"
                            >
                                <option value="">اختر التصنيف...</option>
                                <option value="وثائق">وثائق ومستندات</option>
                                <option value="إلكترونيات">إلكترونيات</option>
                                <option value="مفاتيح">مفاتيح</option>
                                <option value="مال">مال</option>
                                <option value="أخرى">أخرى</option>
                            </select>
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                        </div>
                    </div>

                    <div>
                        <InputLabel value="عنوان الإعلان" />
                        <TextInput
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            className="w-full mt-1"
                            placeholder="مثال: هوية شخصية باسم..."
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <InputLabel value="الوصف" />
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            className="w-full mt-1 border-slate-300 rounded-lg h-24"
                            placeholder="وصف إضافي..."
                        ></textarea>
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="المكان (تقريبي)" />
                            <TextInput
                                value={data.location}
                                onChange={e => setData('location', e.target.value)}
                                className="w-full mt-1"
                                placeholder="مثال: جانب جامع..."
                            />
                        </div>
                        <div>
                            <InputLabel value="رقم للتواصل" />
                            <TextInput
                                value={data.contact_phone}
                                onChange={e => setData('contact_phone', e.target.value)}
                                className="w-full mt-1"
                                placeholder="09..."
                            />
                            {errors.contact_phone && <p className="text-red-500 text-xs mt-1">{errors.contact_phone}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="الحالة" />
                            <select
                                value={data.status}
                                onChange={e => setData('status', e.target.value)}
                                className="w-full mt-1 border-slate-300 rounded-lg"
                            >
                                <option value="active">نشط (جاري البحث)</option>
                                <option value="resolved">تم الحل (تم التسليم)</option>
                            </select>
                        </div>
                        <div>
                            <InputLabel value="صورة (اختياري)" />
                            <input
                                type="file"
                                onChange={e => setData('image', e.target.files ? e.target.files[0] : null)}
                                className="w-full mt-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose}>إلغاء</SecondaryButton>
                    <PrimaryButton disabled={processing} className="bg-emerald-600 hover:bg-emerald-700">
                        {item ? 'حفظ التغييرات' : 'نشر الإعلان'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
