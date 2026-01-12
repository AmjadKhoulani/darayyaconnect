import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

interface Initiative {
    id: number;
    title: string;
    description: string;
    status: string;
    category: string;
    icon: string;
    image: string | null;
    votes_count: number;
    created_at: string;
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

export default function InitiativesIndex({ auth, initiatives, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Initiative | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.initiatives.index'), { search }, { preserveState: true });
    };

    const deleteItem = (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذه المبادرة؟')) {
            router.delete(route('admin.initiatives.destroy', id));
        }
    };

    const openModal = (item: Initiative | null = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    return (
        <AdminLayout user={auth.user} header={<h2 className="font-bold text-xl text-slate-800">🗳️ إدارة المبادرات</h2>}>
            <Head title="المبادرات" />

            <div className="py-12 px-6 lg:px-8" dir="rtl">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex justify-between items-center">
                    <form onSubmit={handleSearch} className="relative w-96">
                        <input
                            type="text"
                            placeholder="بحث عن مبادرة..."
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
                        <span>+</span> إضافة مبادرة
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">عنوان المبادرة</th>
                                <th className="px-6 py-4">التصنيف</th>
                                <th className="px-6 py-4">الأصوات</th>
                                <th className="px-6 py-4">الحالة</th>
                                <th className="px-6 py-4">تاريخ الإطلاق</th>
                                <th className="px-6 py-4">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {initiatives.data.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{item.icon || '📌'}</span>
                                            <div>
                                                <div className="font-bold text-slate-800">{item.title}</div>
                                                <div className="text-xs text-slate-500">{item.description.substring(0, 30)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{item.category}</td>
                                    <td className="px-6 py-4 font-bold text-blue-600">{item.votes_count} 👍</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                                                item.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-slate-100 text-slate-700'
                                            }`}>
                                            {item.status === 'active' ? 'جارية' : item.status === 'completed' ? 'مكتملة' : item.status}
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

            <InitiativeModal
                show={isModalOpen}
                item={editingItem}
                onClose={() => setIsModalOpen(false)}
            />
        </AdminLayout>
    );
}

function InitiativeModal({ show, item, onClose }: { show: boolean, item: Initiative | null, onClose: () => void }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
        category: '',
        status: 'active',
        icon: '',
        image: null as File | null,
        _method: 'POST' // Make it POST by default, will override for PUT
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
                _method: 'PUT'
            });
        } else {
            setData({
                title: '',
                description: '',
                category: '',
                status: 'active',
                icon: '',
                image: null,
                _method: 'POST'
            });
        }
    }, [item]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Use post for both, but with _method=PUT for updates (Inertia handles this better for file uploads)
        const url = item ? route('admin.initiatives.update', item.id) : route('admin.initiatives.store');

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
                    {item ? 'تعديل المبادرة' : 'إطلاق مبادرة جديدة'}
                </h2>

                <div className="space-y-4">
                    <div>
                        <InputLabel value="عنوان المبادرة" />
                        <TextInput
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            className="w-full mt-1"
                            placeholder="مثال: حملة تشجير الحي"
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <InputLabel value="الوصف" />
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            className="w-full mt-1 border-slate-300 rounded-lg h-24"
                            placeholder="اشرح تفاصيل المبادرة..."
                        ></textarea>
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="التصنيف" />
                            <select
                                value={data.category}
                                onChange={e => setData('category', e.target.value)}
                                className="w-full mt-1 border-slate-300 rounded-lg"
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
                                onChange={e => setData('status', e.target.value)}
                                className="w-full mt-1 border-slate-300 rounded-lg"
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
                                onChange={e => setData('icon', e.target.value)}
                                className="w-full mt-1 text-center text-xl"
                                placeholder="🌱"
                                maxLength={2}
                            />
                        </div>
                        <div>
                            <InputLabel value="صورة الغلاف (اختياري)" />
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
                        {item ? 'حفظ التغييرات' : 'إطلاق المبادرة'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
