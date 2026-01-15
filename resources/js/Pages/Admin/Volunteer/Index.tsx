import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Briefcase,
    CheckCircle,
    Clock,
    Edit,
    FileText,
    MapPin,
    Phone,
    Plus,
    Trash2,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

export default function VolunteerIndex({
    auth,
    opportunities,
    applications,
}: {
    auth: any;
    opportunities: any[];
    applications: any[];
}) {
    const [activeTab, setActiveTab] = useState<
        'opportunities' | 'applications'
    >('opportunities');

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    إدارة التطوع
                </h2>
            }
        >
            <Head title="إدارة التطوع" />

            <div className="mx-auto max-w-7xl px-4 py-12">
                {/* Tabs */}
                <div className="mb-8 flex gap-4 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('opportunities')}
                        className={`relative px-4 pb-4 text-sm font-bold transition-colors ${activeTab === 'opportunities' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        فرص التطوع
                        {activeTab === 'opportunities' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-emerald-600" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`relative px-4 pb-4 text-sm font-bold transition-colors ${activeTab === 'applications' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        طلبات المتقدمين
                        {activeTab === 'applications' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-emerald-600" />
                        )}
                    </button>
                </div>

                {activeTab === 'opportunities' ? (
                    <OpportunitiesTab opportunities={opportunities} />
                ) : (
                    <ApplicationsTab applications={applications} />
                )}
            </div>
        </AdminLayout>
    );
}

// --- Opportunities Tab ---
function OpportunitiesTab({ opportunities }: { opportunities: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

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
        title: '',
        organization: '',
        description: '',
        location: '',
        spots_total: 10,
        start_date: '',
        end_date: '',
        status: 'open',
        role_type: 'field',
        tags: [] as string[],
        image: '',
    });

    const openModal = (item: any = null) => {
        setEditingItem(item);
        if (item) {
            setData({
                title: item.title,
                organization: item.organization || '',
                description: item.description,
                location: item.location || '',
                spots_total: item.spots_total || 10,
                start_date: item.start_date
                    ? item.start_date.substring(0, 16)
                    : '',
                end_date: item.end_date ? item.end_date.substring(0, 16) : '',
                status: item.status,
                role_type: item.role_type || 'field',
                tags: item.tags || [],
                image: item.image || '',
            });
        } else {
            reset();
            // Default future date
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(9, 0, 0, 0);
            setData('start_date', tomorrow.toISOString().substring(0, 16));
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
            put(route('admin.volunteering.update', editingItem.id), {
                onSuccess: closeModal,
            });
        } else {
            post(route('admin.volunteering.store'), { onSuccess: closeModal });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذه الفرصة؟')) {
            destroy(route('admin.volunteering.destroy', id));
        }
    };

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">
                    قائمة الفرص المتاحة ({opportunities.length})
                </h3>
                <PrimaryButton onClick={() => openModal()}>
                    <Plus size={16} className="ml-2" />
                    إضافة فرصة جديدة
                </PrimaryButton>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
                                العنوان
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
                                التنظيم
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
                                الموعد
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
                                المقاعد
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
                                الحالة
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
                                الإجراءات
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {opportunities.map((opp) => (
                            <tr key={opp.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-gray-900">
                                        {opp.title}
                                    </div>
                                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                        <MapPin size={10} /> {opp.location}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {opp.organization}
                                </td>
                                <td
                                    className="px-6 py-4 text-sm text-gray-600"
                                    dir="ltr"
                                >
                                    {opp.start_date
                                        ? new Date(
                                              opp.start_date,
                                          ).toLocaleDateString()
                                        : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-full max-w-[60px] overflow-hidden rounded-full bg-gray-200">
                                            <div
                                                className="h-full bg-emerald-500"
                                                style={{
                                                    width: `${Math.min(100, (opp.spots_filled / opp.spots_total) * 100)}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium">
                                            {opp.spots_filled}/{opp.spots_total}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${opp.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                    >
                                        {opp.status === 'open'
                                            ? 'مفتوح'
                                            : 'مغلق'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">
                                    <button
                                        onClick={() => openModal(opp)}
                                        className="ml-3 text-indigo-600 hover:text-indigo-900"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(opp.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="mb-4 text-lg font-medium text-gray-900">
                        {editingItem ? 'تعديل فرصة' : 'إضافة فرصة جديدة'}
                    </h2>
                    <form
                        onSubmit={handleSubmit}
                        className="max-h-[70vh] space-y-4 overflow-y-auto px-1"
                    >
                        <div>
                            <InputLabel value="عنوان الفرصة" />
                            <TextInput
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                className="mt-1 w-full"
                                required
                            />
                            {errors.title && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.title}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="الجهة المنظمة" />
                                <TextInput
                                    value={data.organization}
                                    onChange={(e) =>
                                        setData('organization', e.target.value)
                                    }
                                    className="mt-1 w-full"
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel value="الموقع" />
                                <TextInput
                                    value={data.location}
                                    onChange={(e) =>
                                        setData('location', e.target.value)
                                    }
                                    className="mt-1 w-full"
                                />
                            </div>
                        </div>
                        <div>
                            <InputLabel value="الوصف والتفاصيل" />
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                rows={4}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="تاريخ البدء" />
                                <TextInput
                                    type="datetime-local"
                                    value={data.start_date}
                                    onChange={(e) =>
                                        setData('start_date', e.target.value)
                                    }
                                    className="mt-1 w-full"
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel value="تاريخ الانتهاء" />
                                <TextInput
                                    type="datetime-local"
                                    value={data.end_date}
                                    onChange={(e) =>
                                        setData('end_date', e.target.value)
                                    }
                                    className="mt-1 w-full"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="عدد المقاعد الكلي" />
                                <TextInput
                                    type="number"
                                    value={data.spots_total}
                                    onChange={(e) =>
                                        setData(
                                            'spots_total',
                                            parseInt(e.target.value),
                                        )
                                    }
                                    className="mt-1 w-full"
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel value="الحالة" />
                                <select
                                    value={data.status}
                                    onChange={(e) =>
                                        setData('status', e.target.value)
                                    }
                                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="open">مفتوح</option>
                                    <option value="closed">مغلق</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
                            <SecondaryButton onClick={closeModal} type="button">
                                إلغاء
                            </SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                {editingItem ? 'حفظ التعديلات' : 'نشر الفرصة'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}

// --- Applications Tab ---
function ApplicationsTab({ applications }: { applications: any[] }) {
    // Filter apps by status
    const pendingApps = applications.filter((app) => app.status === 'pending');
    const approvedApps = applications.filter(
        (app) => app.status === 'approved',
    );

    return (
        <div>
            {/* Pending Applications */}
            <div className="mb-8">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                    <Clock className="text-amber-500" />
                    طلبات الانتظار ({pendingApps.length})
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {pendingApps.length > 0 ? (
                        pendingApps.map((app) => (
                            <ApplicationCard key={app.id} app={app} />
                        ))
                    ) : (
                        <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white py-8 text-center text-slate-400">
                            لا يوجد طلبات معلقة
                        </div>
                    )}
                </div>
            </div>

            {/* Approved Volunteers */}
            <div className="mb-8">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                    <CheckCircle className="text-emerald-500" />
                    المتطوعين النشطين ({approvedApps.length})
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {approvedApps.map((app) => (
                        <ApplicationCard key={app.id} app={app} approved />
                    ))}
                </div>
            </div>
        </div>
    );
}

function ApplicationCard({
    app,
    approved = false,
}: {
    app: any;
    approved?: boolean;
}) {
    const handleStatus = (status: 'approved' | 'rejected') => {
        if (
            confirm(
                `هل أنت متأكد من ${status === 'approved' ? 'قبول' : 'رفض'} هذا الطلب؟`,
            )
        ) {
            router.put(route('admin.volunteering.application.update', app.id), {
                status,
            });
        }
    };

    return (
        <div className="group relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-emerald-500">
            <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-100 font-bold text-slate-500">
                        {/* Fallback avatar */}
                        {app.full_name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800">
                            {app.full_name}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Phone size={12} />
                            <span dir="ltr">{app.phone_number}</span>
                        </div>
                    </div>
                </div>
                {!approved && (
                    <span className="rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                        جديد
                    </span>
                )}
            </div>

            <div className="mb-4 space-y-2">
                <div className="mb-1 text-xs font-bold text-gray-500">
                    متقدم لـ:{' '}
                    <span className="text-emerald-600">
                        {app.opportunity?.title || 'فرصة محذوفة'}
                    </span>
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-2">
                    <Briefcase size={14} className="mt-0.5 text-slate-400" />
                    <p className="line-clamp-2 text-sm text-slate-600">
                        {app.skills || 'لا يوجد مهارات مسجلة'}
                    </p>
                </div>
                {app.motivation && (
                    <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-2">
                        <FileText size={14} className="mt-0.5 text-slate-400" />
                        <p className="line-clamp-2 text-sm text-slate-600">
                            {app.motivation}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 border-t border-slate-100 pt-2">
                {!approved ? (
                    <>
                        <button
                            onClick={() => handleStatus('approved')}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
                        >
                            <CheckCircle size={16} /> قبول
                        </button>
                        <button
                            onClick={() => handleStatus('rejected')}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2 text-sm font-bold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                        >
                            <XCircle size={16} /> رفض
                        </button>
                    </>
                ) : (
                    <button className="w-full cursor-not-allowed rounded-lg bg-slate-100 py-2 text-xs font-bold text-slate-500">
                        تم القبول
                    </button>
                )}
            </div>
        </div>
    );
}
