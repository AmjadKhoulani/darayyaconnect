import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Building2, MapPin, Plus, UserPlus, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export default function Index({ auth, governorates }: any) {
    const [selectedGov, setSelectedGov] = useState<number | null>(null);
    const [showAddCity, setShowAddCity] = useState(false);
    const [showAddAdmin, setShowAddAdmin] = useState<number | null>(null); // City ID

    const cityForm = useForm({
        governorate_id: '',
        name_ar: '',
        name_en: '',
        code: ''
    });

    const adminForm = useForm({
        city_id: '',
        name: '',
        email: '',
        password: ''
    });

    const submitCity = (e: any) => {
        e.preventDefault();
        cityForm.post(route('admin.locations.city.store'), {
            onSuccess: () => {
                setShowAddCity(false);
                cityForm.reset();
            }
        });
    };

    const submitAdmin = (e: any) => {
        e.preventDefault();
        adminForm.post(route('admin.locations.account.create'), {
            onSuccess: () => {
                setShowAddAdmin(null);
                adminForm.reset();
            }
        });
    };

    return (
        <AdminLayout user={auth.user} header="إدارة المدن والمحافظات">
            <Head title="المواقع الجغرافية" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* Header Actions */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">هيكل الدولة</h2>
                            <p className="text-sm text-slate-500">إدارة المحافظات والمدن وحسابات المسؤولين</p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {governorates.map((gov: any) => (
                            <div key={gov.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                                <div className="border-b border-slate-100 bg-slate-50 p-4 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="text-emerald-600" size={20} />
                                        <h3 className="font-bold text-slate-800">{gov.name_ar}</h3>
                                        <span className="text-xs font-mono text-slate-400">({gov.code})</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (selectedGov === gov.id) {
                                                setSelectedGov(null);
                                                setShowAddCity(false);
                                            } else {
                                                setSelectedGov(gov.id);
                                                cityForm.setData('governorate_id', gov.id);
                                                setShowAddCity(true);
                                            }
                                        }}
                                        className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded hover:bg-emerald-200"
                                    >
                                        + مدينة
                                    </button>
                                </div>

                                <div className="p-4 space-y-3">
                                    {gov.cities.length === 0 ? (
                                        <p className="text-center text-xs text-slate-400 py-2">لا يوجد مدن مضافة</p>
                                    ) : (
                                        gov.cities.map((city: any) => (
                                            <div key={city.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50">
                                                <div className="flex items-center gap-3">
                                                    <Building2 size={16} className="text-slate-400" />
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-700">{city.name_ar}</div>
                                                        <div className="text-xs text-slate-400">{city.code}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {city.admins_count > 0 ? (
                                                        <span className="flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-600">
                                                            <ShieldCheck size={12} />
                                                            {city.admins_count} مشرف
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setShowAddAdmin(city.id);
                                                                adminForm.setData('city_id', city.id);
                                                            }}
                                                            className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-[10px] text-slate-600 hover:bg-slate-200"
                                                        >
                                                            <UserPlus size={12} />
                                                            إضافة مسؤول
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}

                                    {/* Add City Form for this Governorate */}
                                    {showAddCity && selectedGov === gov.id && (
                                        <form onSubmit={submitCity} className="mt-4 border-t border-dashed border-slate-200 pt-4 animate-in fade-in slide-in-from-top-2">
                                            <h4 className="mb-2 text-xs font-bold text-emerald-600">إضافة مدينة جديدة في {gov.name_ar}</h4>
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    placeholder="الاسم بالعربية"
                                                    className="w-full rounded-lg border-slate-200 text-xs"
                                                    value={cityForm.data.name_ar}
                                                    onChange={e => cityForm.setData('name_ar', e.target.value)}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Name (English)"
                                                    dir="ltr"
                                                    className="w-full rounded-lg border-slate-200 text-xs"
                                                    value={cityForm.data.name_en}
                                                    onChange={e => cityForm.setData('name_en', e.target.value)}
                                                />
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="CODE"
                                                        dir="ltr"
                                                        className="w-full rounded-lg border-slate-200 text-xs uppercase"
                                                        value={cityForm.data.code}
                                                        onChange={e => cityForm.setData('code', e.target.value)}
                                                    />
                                                    <button
                                                        disabled={cityForm.processing}
                                                        className="whitespace-nowrap rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700"
                                                    >
                                                        حفظ
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Admin Modal Overlay */}
                    {showAddAdmin && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
                                <h3 className="mb-4 text-lg font-bold text-slate-800">تعيين مسؤول جديد للمدينة</h3>
                                <form onSubmit={submitAdmin} className="space-y-4">
                                    <div>
                                        <label className="mb-1 block text-sm text-slate-500">اسم المسؤول</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl border-slate-300"
                                            value={adminForm.data.name}
                                            onChange={e => adminForm.setData('name', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm text-slate-500">البريد الإلكتروني</label>
                                        <input
                                            type="email"
                                            className="w-full rounded-xl border-slate-300"
                                            value={adminForm.data.email}
                                            onChange={e => adminForm.setData('email', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm text-slate-500">كلمة المرور</label>
                                        <input
                                            type="password"
                                            className="w-full rounded-xl border-slate-300"
                                            value={adminForm.data.password}
                                            onChange={e => adminForm.setData('password', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => { setShowAddAdmin(null); adminForm.reset(); }}
                                            className="flex-1 rounded-xl bg-slate-100 py-2 font-bold text-slate-600 hover:bg-slate-200"
                                        >
                                            إلغاء
                                        </button>
                                        <button
                                            disabled={adminForm.processing}
                                            className="flex-1 rounded-xl bg-blue-600 py-2 font-bold text-white hover:bg-blue-700"
                                        >
                                            إنشاء الحساب
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AdminLayout>
    );
}
