import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';

interface ServiceState {
    id: number;
    key: string;
    service_key: string;
    name: string;
    status_text: string;
    status_color: string;
    is_active: boolean;
    last_updated_at: string;
}

export default function ServiceStatus({
    auth,
    services,
}: PageProps<{ services: ServiceState[] }>) {
    const updateService = (key: string, data: Partial<ServiceState>) => {
        router.put(route('admin.service-states.update', key), data, {
            preserveScroll: true,
        });
    };

    const statusOptions = [
        {
            label: 'مستقر (أخضر)',
            value: 'stable',
            color: 'emerald',
            text: 'مستقر',
        },
        {
            label: 'متوفر (أخضر)',
            value: 'available',
            color: 'emerald',
            text: 'متوفر',
        },
        { label: 'يعمل (أزرق)', value: 'working', color: 'blue', text: 'يعمل' },
        { label: 'ضخ (أزرق)', value: 'pumping', color: 'blue', text: 'ضخ' },
        {
            label: 'تحذير (برتقالي)',
            value: 'warning',
            color: 'amber',
            text: 'تحذير',
        },
        {
            label: 'مقطوع (أحمر)',
            value: 'offline',
            color: 'red',
            text: 'لا يوجد',
        },
        { label: 'عطل (أحمر)', value: 'error', color: 'red', text: 'عطل فني' },
    ];

    return (
        <AdminLayout user={auth.user} header="حالة الخدمات (Live Status)">
            <Head title="حالة الخدمات" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="overflow-hidden border border-gray-100 bg-white shadow-sm sm:rounded-lg"
                            >
                                <div
                                    className={`h-2 w-full bg-${service.status_color}-500`}
                                ></div>
                                <div className="p-6">
                                    <div className="mb-6 flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {service.name}
                                        </h3>
                                        <div
                                            className={`rounded-full px-3 py-1 text-xs font-bold bg-${service.status_color}-100 text-${service.status_color}-800`}
                                        >
                                            الحالة الحالية:{' '}
                                            {service.status_text}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                تحديث الحالة السريع
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {statusOptions.map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() =>
                                                            updateService(
                                                                service.service_key,
                                                                {
                                                                    status_text:
                                                                        opt.text,
                                                                    status_color:
                                                                        opt.color,
                                                                    is_active: true,
                                                                },
                                                            )
                                                        }
                                                        className={`rounded border p-2 text-xs transition-all ${
                                                            service.status_text ===
                                                            opt.text
                                                                ? `bg-${opt.color}-50 border-${opt.color}-500 text-${opt.color}-700 font-bold ring-2 ring-${opt.color}-200`
                                                                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-4 border-t pt-4">
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                تخصيص نص الحالة
                                            </label>
                                            <div className="flex gap-2">
                                                <TextInput
                                                    className="w-full text-sm"
                                                    placeholder="مثال: متوفر لمدة ساعتين"
                                                    defaultValue={
                                                        service.status_text
                                                    }
                                                    onBlur={(e) =>
                                                        updateService(
                                                            service.service_key,
                                                            {
                                                                status_text:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <span className="text-xs text-gray-400">
                                                آخر تحديث:{' '}
                                                {new Date(
                                                    service.last_updated_at,
                                                ).toLocaleString('ar-SY')}
                                            </span>
                                            <label className="flex cursor-pointer items-center">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only"
                                                        checked={
                                                            service.is_active
                                                        }
                                                        onChange={(e) =>
                                                            updateService(
                                                                service.service_key,
                                                                {
                                                                    is_active:
                                                                        e.target
                                                                            .checked,
                                                                },
                                                            )
                                                        }
                                                    />
                                                    <div
                                                        className={`block h-6 w-10 rounded-full transition-colors ${service.is_active ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                                    ></div>
                                                    <div
                                                        className={`dot absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${service.is_active ? 'translate-x-4 transform' : ''}`}
                                                    ></div>
                                                </div>
                                                <span className="mr-3 text-sm font-medium text-gray-700">
                                                    تفعيل الخدمة
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
