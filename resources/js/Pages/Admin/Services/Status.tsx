import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

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

export default function ServiceStatus({ auth, services }: PageProps<{ services: ServiceState[] }>) {

    const updateService = (key: string, data: Partial<ServiceState>) => {
        router.put(route('admin.service-states.update', key), data, {
            preserveScroll: true,
        });
    };

    const statusOptions = [
        { label: 'مستقر (أخضر)', value: 'stable', color: 'emerald', text: 'مستقر' },
        { label: 'متوفر (أخضر)', value: 'available', color: 'emerald', text: 'متوفر' },
        { label: 'يعمل (أزرق)', value: 'working', color: 'blue', text: 'يعمل' },
        { label: 'ضخ (أزرق)', value: 'pumping', color: 'blue', text: 'ضخ' },
        { label: 'تحذير (برتقالي)', value: 'warning', color: 'amber', text: 'تحذير' },
        { label: 'مقطوع (أحمر)', value: 'offline', color: 'red', text: 'لا يوجد' },
        { label: 'عطل (أحمر)', value: 'error', color: 'red', text: 'عطل فني' },
    ];

    return (
        <AdminLayout user={auth.user} header="حالة الخدمات (Live Status)">
            <Head title="حالة الخدمات" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {services.map((service) => (
                            <div key={service.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                                <div className={`h-2 w-full bg-${service.status_color}-500`}></div>
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold bg-${service.status_color}-100 text-${service.status_color}-800`}>
                                            الحالة الحالية: {service.status_text}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">تحديث الحالة السريع</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {statusOptions.map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => updateService(service.service_key, {
                                                            status_text: opt.text,
                                                            status_color: opt.color,
                                                            is_active: true
                                                        })}
                                                        className={`text-xs p-2 rounded border transition-all ${service.status_text === opt.text
                                                                ? `bg-${opt.color}-50 border-${opt.color}-500 text-${opt.color}-700 font-bold ring-2 ring-${opt.color}-200`
                                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="border-t pt-4 mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">تخصيص نص الحالة</label>
                                            <div className="flex gap-2">
                                                <TextInput
                                                    className="w-full text-sm"
                                                    placeholder="مثال: متوفر لمدة ساعتين"
                                                    defaultValue={service.status_text}
                                                    onBlur={(e) => updateService(service.service_key, { status_text: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <span className="text-xs text-gray-400">
                                                آخر تحديث: {new Date(service.last_updated_at).toLocaleString('ar-SY')}
                                            </span>
                                            <label className="flex items-center cursor-pointer">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only"
                                                        checked={service.is_active}
                                                        onChange={(e) => updateService(service.service_key, { is_active: e.target.checked })}
                                                    />
                                                    <div className={`block w-10 h-6 rounded-full transition-colors ${service.is_active ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                                                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${service.is_active ? 'transform translate-x-4' : ''}`}></div>
                                                </div>
                                                <span className="mr-3 text-sm font-medium text-gray-700">تفعيل الخدمة</span>
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
