import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'official' | 'institution' | 'user';
    is_verified_official: boolean;
    department_id: number | null;
    created_at: string;
}

interface Props {
    auth: any;
    users: {
        data: User[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search?: string;
        role?: string;
        status?: string;
    };
}

export default function UsersIndex({ auth, users, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Search Handler
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('admin.users.index'),
            { search, role: filters.role, status: filters.status },
            { preserveState: true },
        );
    };

    // Filter Handler
    const handleFilterChange = (key: string, value: string) => {
        router.get(
            route('admin.users.index'),
            { ...filters, search, [key]: value },
            { preserveState: true },
        );
    };

    const handleDelete = (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذا المستخدم نهائياً؟')) {
            router.delete(route('admin.users.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const toggleVerification = (user: User) => {
        router.put(
            route('admin.users.update', user.id),
            {
                role: user.role,
                is_verified_official: !user.is_verified_official,
            },
            { preserveScroll: true },
        );
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-bold text-slate-800">
                    👥 إدارة المستخدمين
                </h2>
            }
        >
            <Head title="المستخدمين" />

            <div className="px-6 py-12 lg:px-8" dir="rtl">
                {/* Filters & Actions */}
                <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
                    <form
                        onSubmit={handleSearch}
                        className="relative w-full md:w-96"
                    >
                        <input
                            type="text"
                            placeholder="بحث بالاسم أو البريد..."
                            className="w-full rounded-lg border-slate-300 py-2 pl-10 pr-4 focus:border-emerald-500 focus:ring-emerald-500"
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

                    <div className="flex w-full items-center gap-2 overflow-x-auto md:w-auto">
                        <Link
                            href={route('admin.users.map')}
                            className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100"
                        >
                            <span>🗺️</span> الخريطة الحرارية
                        </Link>
                        <select
                            className="rounded-lg border-slate-300 text-sm"
                            value={filters.role || 'all'}
                            onChange={(e) =>
                                handleFilterChange('role', e.target.value)
                            }
                        >
                            <option value="all">كل الأدوار</option>
                            <option value="user">مواطن</option>
                            <option value="official">مسؤول</option>
                            <option value="institution">مؤسسة</option>
                            <option value="admin">مدير</option>
                        </select>

                        <select
                            className="rounded-lg border-slate-300 text-sm"
                            value={filters.status || ''}
                            onChange={(e) =>
                                handleFilterChange('status', e.target.value)
                            }
                        >
                            <option value="">كل الحالات</option>
                            <option value="verified">موثق ✅</option>
                            <option value="pending">بانتظار التوثيق ⏳</option>
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">المستخدم</th>
                                    <th className="px-6 py-4">الدور</th>
                                    <th className="px-6 py-4">التوثيق</th>
                                    <th className="px-6 py-4">تاريخ التسجيل</th>
                                    <th className="px-6 py-4">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.data.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="transition hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-600">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`rounded px-2 py-1 text-xs font-bold ${
                                                    user.role === 'admin'
                                                        ? 'bg-rose-100 text-rose-700'
                                                        : user.role ===
                                                            'official'
                                                          ? 'bg-blue-100 text-blue-700'
                                                          : user.role ===
                                                              'institution'
                                                            ? 'bg-purple-100 text-purple-700'
                                                            : 'bg-slate-100 text-slate-700'
                                                } `}
                                            >
                                                {user.role === 'admin'
                                                    ? 'مدير عام'
                                                    : user.role === 'official'
                                                      ? 'مسؤول'
                                                      : user.role ===
                                                          'institution'
                                                        ? 'مؤسسة'
                                                        : 'مواطن'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() =>
                                                    toggleVerification(user)
                                                }
                                                className={`flex items-center gap-1 rounded border px-2 py-1 text-xs font-bold transition ${
                                                    user.is_verified_official
                                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600'
                                                        : 'border-slate-200 bg-slate-50 text-slate-400 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700'
                                                } `}
                                                title={
                                                    user.is_verified_official
                                                        ? 'انقر لإلغاء التوثيق'
                                                        : 'انقر للتوثيق'
                                                }
                                            >
                                                {user.is_verified_official
                                                    ? '✅ موثق'
                                                    : '⬜ غير موثق'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(
                                                user.created_at,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="flex items-center gap-2 px-6 py-4">
                                            <button
                                                onClick={() =>
                                                    setEditingUser(user)
                                                }
                                                className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                                                title="تعديل الصلاحيات"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(user.id)
                                                }
                                                className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50"
                                                title="حذف المستخدم"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Simplified Pagination */}
                    <div className="flex justify-center border-t border-slate-200 bg-slate-50 p-4">
                        <div className="flex gap-1">
                            {users.links.map((link: any, i: number) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`rounded px-3 py-1 text-sm ${link.active ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-200'} ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <UserEditModal
                user={editingUser}
                onClose={() => setEditingUser(null)}
            />
        </AdminLayout>
    );
}

function UserEditModal({
    user,
    onClose,
}: {
    user: User | null;
    onClose: () => void;
}) {
    if (!user) return null;

    const { data, setData, put, processing, reset } = useForm({
        role: user.role,
        department_id: user.department_id || '',
        is_verified_official: user.is_verified_official,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.users.update', user.id), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <Modal show={!!user} onClose={onClose}>
            <form onSubmit={submit} className="p-6">
                <h2 className="mb-4 text-lg font-bold text-slate-900">
                    تعديل بيانات: {user.name}
                </h2>

                <div className="space-y-4">
                    <div>
                        <InputLabel value="الدور (Role)" />
                        <select
                            className="w-full rounded-lg border-slate-300"
                            value={data.role}
                            onChange={(e) =>
                                setData('role', e.target.value as any)
                            }
                        >
                            <option value="user">مواطن (User)</option>
                            <option value="official">
                                مسؤول حكومي (Official)
                            </option>
                            <option value="institution">
                                مؤسسة (Institution)
                            </option>
                            <option value="admin">مدير (Admin)</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="verified"
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            checked={data.is_verified_official}
                            onChange={(e) =>
                                setData(
                                    'is_verified_official',
                                    e.target.checked,
                                )
                            }
                        />
                        <label
                            htmlFor="verified"
                            className="text-sm font-bold text-slate-700"
                        >
                            حساب موثق رسمياً
                        </label>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose}>إلغاء</SecondaryButton>
                    <PrimaryButton
                        disabled={processing}
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        حفظ التعديلات
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
