import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';

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
        router.get(route('admin.users.index'), { search, role: filters.role, status: filters.status }, { preserveState: true });
    };

    // Filter Handler
    const handleFilterChange = (key: string, value: string) => {
        router.get(route('admin.users.index'), { ...filters, search, [key]: value }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذا المستخدم نهائياً؟')) {
            router.delete(route('admin.users.destroy', id), { preserveScroll: true });
        }
    };

    const toggleVerification = (user: User) => {
        router.put(route('admin.users.update', user.id), {
            role: user.role,
            is_verified_official: !user.is_verified_official
        }, { preserveScroll: true });
    };

    return (
        <AdminLayout user={auth.user} header={<h2 className="font-bold text-xl text-slate-800">👥 إدارة المستخدمين</h2>}>
            <Head title="المستخدمين" />

            <div className="py-12 px-6 lg:px-8" dir="rtl">

                {/* Filters & Actions */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <form onSubmit={handleSearch} className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="بحث بالاسم أو البريد..."
                            className="w-full pl-10 pr-4 py-2 border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <button type="submit" className="absolute left-2 top-2 text-slate-400">🔍</button>
                    </form>

                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto items-center">
                        <Link
                            href={route('admin.users.map')}
                            className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-100 transition whitespace-nowrap flex items-center gap-2 border border-indigo-200"
                        >
                            <span>🗺️</span> الخريطة الحرارية
                        </Link>
                        <select
                            className="border-slate-300 rounded-lg text-sm"
                            value={filters.role || 'all'}
                            onChange={e => handleFilterChange('role', e.target.value)}
                        >
                            <option value="all">كل الأدوار</option>
                            <option value="user">مواطن</option>
                            <option value="official">مسؤول</option>
                            <option value="institution">مؤسسة</option>
                            <option value="admin">مدير</option>
                        </select>

                        <select
                            className="border-slate-300 rounded-lg text-sm"
                            value={filters.status || ''}
                            onChange={e => handleFilterChange('status', e.target.value)}
                        >
                            <option value="">كل الحالات</option>
                            <option value="verified">موثق ✅</option>
                            <option value="pending">بانتظار التوثيق ⏳</option>
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">المستخدم</th>
                                    <th className="px-6 py-4">الدور</th>
                                    <th className="px-6 py-4">التوثيق</th>
                                    <th className="px-6 py-4">تاريخ التسجيل</th>
                                    <th className="px-6 py-4">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.data.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{user.name}</div>
                                                    <div className="text-xs text-slate-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold
                                                ${user.role === 'admin' ? 'bg-rose-100 text-rose-700' :
                                                    user.role === 'official' ? 'bg-blue-100 text-blue-700' :
                                                        user.role === 'institution' ? 'bg-purple-100 text-purple-700' :
                                                            'bg-slate-100 text-slate-700'}
                                            `}>
                                                {user.role === 'admin' ? 'مدير عام' :
                                                    user.role === 'official' ? 'مسؤول' :
                                                        user.role === 'institution' ? 'مؤسسة' : 'مواطن'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleVerification(user)}
                                                className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded transition border
                                                    ${user.is_verified_official
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                                                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'}
                                                `}
                                                title={user.is_verified_official ? 'انقر لإلغاء التوثيق' : 'انقر للتوثيق'}
                                            >
                                                {user.is_verified_official ? '✅ موثق' : '⬜ غير موثق'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 flex items-center gap-2">
                                            <button
                                                onClick={() => setEditingUser(user)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="تعديل الصلاحيات"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
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
                    <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-center">
                        <div className="flex gap-1">
                            {users.links.map((link: any, i: number) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 rounded text-sm ${link.active ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-200'} ${!link.url ? 'opacity-50 pointer-events-none' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <UserEditModal user={editingUser} onClose={() => setEditingUser(null)} />
        </AdminLayout>
    );
}

function UserEditModal({ user, onClose }: { user: User | null, onClose: () => void }) {
    if (!user) return null;

    const { data, setData, put, processing, reset } = useForm({
        role: user.role,
        department_id: user.department_id || '',
        is_verified_official: user.is_verified_official
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.users.update', user.id), {
            onSuccess: () => {
                onClose();
                reset();
            }
        });
    };

    return (
        <Modal show={!!user} onClose={onClose}>
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">تعديل بيانات: {user.name}</h2>

                <div className="space-y-4">
                    <div>
                        <InputLabel value="الدور (Role)" />
                        <select
                            className="w-full border-slate-300 rounded-lg"
                            value={data.role}
                            onChange={e => setData('role', e.target.value as any)}
                        >
                            <option value="user">مواطن (User)</option>
                            <option value="official">مسؤول حكومي (Official)</option>
                            <option value="institution">مؤسسة (Institution)</option>
                            <option value="admin">مدير (Admin)</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="verified"
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            checked={data.is_verified_official}
                            onChange={e => setData('is_verified_official', e.target.checked)}
                        />
                        <label htmlFor="verified" className="text-sm font-bold text-slate-700">حساب موثق رسمياً</label>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose}>إلغاء</SecondaryButton>
                    <PrimaryButton disabled={processing} className="bg-emerald-600 hover:bg-emerald-700">
                        حفظ التعديلات
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
