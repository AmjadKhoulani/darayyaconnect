import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

interface Setting {
    key: string;
    value: string;
    group: string;
}

interface Props {
    auth: any;
    settings: Record<string, Setting[]>;
}

export default function Index({ auth, settings }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        settings: Object.values(settings).flat().map(s => ({ key: s.key, value: s.value }))
    });

    const updateSetting = (key: string, value: string) => {
        const newSettings = data.settings.map(s =>
            s.key === key ? { ...s, value } : s
        );
        setData('settings', newSettings);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'));
    };

    const getSettingValue = (key: string) => {
        return data.settings.find(s => s.key === key)?.value || '';
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="إعدادات النظام" />

            <div className="py-12" dir="rtl">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="mb-6 text-2xl font-bold border-b pb-4">إعدادات النظام والمدن</h2>

                            <form onSubmit={submit} className="space-y-8">
                                {/* General Settings */}
                                <section>
                                    <h3 className="mb-4 text-lg font-bold text-gray-700 flex items-center gap-2">
                                        <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">📍</span>
                                        المعلومات العامة والمنطقة
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <div>
                                            <InputLabel value="اسم الموقع" />
                                            <TextInput
                                                className="mt-1 block w-full bg-white"
                                                value={getSettingValue('site_name')}
                                                onChange={e => updateSetting('site_name', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <InputLabel value="اسم المدينة" />
                                            <TextInput
                                                className="mt-1 block w-full bg-white"
                                                value={getSettingValue('city_name')}
                                                onChange={e => updateSetting('city_name', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <InputLabel value="اسم المحافظة / المنطقة الكبرى" />
                                            <TextInput
                                                className="mt-1 block w-full bg-white"
                                                value={getSettingValue('governorate_name')}
                                                onChange={e => updateSetting('governorate_name', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Map Settings */}
                                <section>
                                    <h3 className="mb-4 text-lg font-bold text-gray-700 flex items-center gap-2">
                                        <span className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">🗺️</span>
                                        إعدادات الخريطة (المركز الافتراضي)
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <div>
                                            <InputLabel value="خط العرض (Latitude)" />
                                            <TextInput
                                                className="mt-1 block w-full bg-white"
                                                value={getSettingValue('map_center_lat')}
                                                onChange={e => updateSetting('map_center_lat', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <InputLabel value="خط الطول (Longitude)" />
                                            <TextInput
                                                className="mt-1 block w-full bg-white"
                                                value={getSettingValue('map_center_lng')}
                                                onChange={e => updateSetting('map_center_lng', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <InputLabel value="مستوى التقريب (Zoom)" />
                                            <TextInput
                                                className="mt-1 block w-full bg-white"
                                                value={getSettingValue('map_zoom')}
                                                onChange={e => updateSetting('map_zoom', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Module Toggles */}
                                <section>
                                    <h3 className="mb-4 text-lg font-bold text-gray-700 flex items-center gap-2">
                                        <span className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">⚙️</span>
                                        تفعيل الوحدات والخدمات (Modules)
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        {Object.values(settings).flat().filter(s => s.group === 'modules').map(s => (
                                            <label key={s.key} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                                                <span className="text-sm font-bold text-gray-600">
                                                    {getModuleLabel(s.key)}
                                                </span>
                                                <div className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={getSettingValue(s.key) === '1'}
                                                        onChange={e => updateSetting(s.key, e.target.checked ? '1' : '0')}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </section>

                                <div className="flex justify-end pt-6 border-t">
                                    <PrimaryButton className="px-8 py-3" disabled={processing}>
                                        {processing ? 'جاري الحفظ...' : 'حفظ كافة الإعدادات'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function getModuleLabel(key: string) {
    const labels: Record<string, string> = {
        'module_discussions': 'منتدى النقاشات المجتمعية',
        'module_sos': 'نظام نداء الاستغاثة (SOS)',
        'module_initiatives': 'المبادرات والمشاريع',
        'module_volunteering': 'فرص التطوع',
        'module_library': 'مكتبة المجتمع الرقمية',
        'module_lost_found': 'مركز المفقودات والموجودات',
        'module_chat': 'غرفة المحادثة العامة',
        'module_directory': 'دليل الخدمات الشامل',
        'module_knowledge': 'مركز المعرفة ودراسات AI',
        'module_infrastructure': 'مستكشف المدينة (البنية التحتية)',
    };
    return labels[key] || key;
}
