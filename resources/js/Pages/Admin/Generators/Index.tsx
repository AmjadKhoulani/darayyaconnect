import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

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
        router.get(route('admin.generators.index'), { search }, { preserveState: true });
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
        <AdminLayout user={auth.user} header={<h2 className="font-bold text-xl text-slate-800">🔌 إدارة الأمبيرات</h2>}>
            <Head title="الأمبيرات" />

            <div className="py-12 px-6 lg:px-8" dir="rtl">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex justify-between items-center">
                    <form onSubmit={handleSearch} className="relative w-96">
                        <input
                            type="text"
                            placeholder="بحث عن مولدة..."
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
                        <span>+</span> إضافة مولدة
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
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
                                <tr key={item.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{item.neighborhood}</td>
                                    <td className="px-6 py-4 text-emerald-600 font-bold">{item.ampere_price.toLocaleString()} ل.س</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                                            item.status === 'maintenance' ? 'bg-amber-100 text-amber-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {item.status === 'active' ? 'تعمل ✅' :
                                                item.status === 'maintenance' ? 'صيانة 🛠️' : 'متوقفة ❌'}
                                        </span>
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

            <GeneratorModal
                show={isModalOpen}
                item={editingItem}
                onClose={() => setIsModalOpen(false)}
            />
        </AdminLayout>
    );
}

function GeneratorModal({ show, item, onClose }: { show: boolean, item: Generator | null, onClose: () => void }) {
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
            put(route('admin.generators.update', item.id), { onSuccess: onClose });
        } else {
            post(route('admin.generators.store'), { onSuccess: () => { reset(); onClose(); } });
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-6">
                    {item ? 'تعديل مولدة' : 'إضافة مولدة جديدة'}
                </h2>

                <div className="space-y-4">
                    <div>
                        <InputLabel value="اسم المولدة" />
                        <TextInput
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full mt-1"
                            placeholder="مثال: مولدة الحمد"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="الحي / المنطقة" />
                            <TextInput
                                value={data.neighborhood}
                                onChange={e => setData('neighborhood', e.target.value)}
                                className="w-full mt-1"
                                placeholder="مثال: الكورنيش"
                            />
                        </div>
                        <div>
                            <InputLabel value="سعر الأمبير (ل.س)" />
                            <TextInput
                                type="number"
                                value={data.ampere_price}
                                onChange={e => setData('ampere_price', e.target.value)}
                                className="w-full mt-1"
                            />
                        </div>
                    </div>

                    <div>
                        <InputLabel value="الحالة التشغيلية" />
                        <select
                            value={data.status}
                            onChange={e => setData('status', e.target.value as any)}
                            className="w-full mt-1 border-slate-300 rounded-lg focus:ring-emerald-500"
                        >
                            <option value="active">تعمل بشكل طبيعي ✅</option>
                            <option value="maintenance">في وضع الصيانة 🛠️</option>
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
                                onChange={e => setData('latitude', parseFloat(e.target.value))}
                                className="w-full mt-1"
                            />
                        </div>
                        <div>
                            <InputLabel value="خط الطول (Longitude)" />
                            <TextInput
                                type="number"
                                step="any"
                                value={data.longitude}
                                onChange={e => setData('longitude', parseFloat(e.target.value))}
                                className="w-full mt-1"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose}>إلغاء</SecondaryButton>
                    <PrimaryButton disabled={processing} className="bg-emerald-600 hover:bg-emerald-700">
                        {item ? 'حفظ التغييرات' : 'إضافة المولدة'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
