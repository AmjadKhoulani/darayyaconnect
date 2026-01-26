import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ auth, departments, rules }: any) {
    const { data, setData, post, processing, reset } = useForm({
        category: 'water',
        infrastructure_type: '',
        department_id: departments[0]?.id || ''
    });

    const { data: deptData, setData: setDeptData, post: postDept, processing: processingDept, reset: resetDept } = useForm({
        name: '',
        description: ''
    });

    const submitRule = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.departments.update-rule'));
    };

    const submitDept = (e: React.FormEvent) => {
        e.preventDefault();
        postDept(route('admin.departments.store'), {
            onSuccess: () => resetDept()
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800 leading-tight">إعدادات توجيه البلاغات</h2>}
        >
            <Head title="توجيه البلاغات" />

            <div className="py-12" dir="rtl">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Add Department Form */}
                    <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
                        <h3 className="text-lg font-bold mb-4">🏢 إضافة جهة (منصة) حكومية جديدة</h3>
                        <form onSubmit={submitDept} className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">اسم الجهة</label>
                                <input
                                    type="text"
                                    className="border-gray-300 rounded-md shadow-sm w-full"
                                    value={deptData.name}
                                    onChange={e => setDeptData('name', e.target.value)}
                                    placeholder="مثلاً: قسم الكهرباء، دائرة المياه..."
                                    required
                                />
                            </div>
                            <div className="flex-[2]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">وصف المرفق</label>
                                <input
                                    type="text"
                                    className="border-gray-300 rounded-md shadow-sm w-full"
                                    value={deptData.description}
                                    onChange={e => setDeptData('description', e.target.value)}
                                    placeholder="وصف مختصر للمهام (اختياري)"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processingDept}
                                className="bg-slate-900 text-white px-6 py-2 rounded-md font-bold hover:bg-slate-800"
                            >
                                إضافة الجهة
                            </button>
                        </form>
                    </div>

                    {/* Add Rule Form */}
                    <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
                        <h3 className="text-lg font-bold mb-4">إضافة قاعدة توجيه جديدة</h3>
                        <form onSubmit={submitRule} className="flex gap-4 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">الفئة (مشكلة)</label>
                                <select
                                    className="border-gray-300 rounded-md shadow-sm w-48"
                                    value={data.category}
                                    onChange={e => setData('category', e.target.value)}
                                >
                                    <option value="">-- تخطي --</option>
                                    <option value="water">مياه</option>
                                    <option value="electricity">كهرباء</option>
                                    <option value="lighting">إنارة</option>
                                    <option value="road">طرق</option>
                                    <option value="sanitation">صرف صحي</option>
                                    <option value="trash">نظافة</option>
                                    <option value="communication">اتصالات</option>
                                    <option value="other">أخرى</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">أو نوع عنصر (محدد)</label>
                                <select
                                    className="border-gray-300 rounded-md shadow-sm w-48"
                                    value={data.infrastructure_type}
                                    onChange={e => setData('infrastructure_type', e.target.value)}
                                >
                                    <option value="">-- تخطي --</option>
                                    <option value="transformer">محولة كهرباء</option>
                                    <option value="pole">عمود إنارة</option>
                                    <option value="valve">مححبس مياه</option>
                                    <option value="manhole">ريكار صرف صحي</option>
                                </select>
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">توجيه تلقائي إلى</label>
                                <select
                                    className="border-gray-300 rounded-md shadow-sm w-full"
                                    value={data.department_id}
                                    onChange={e => setData('department_id', e.target.value)}
                                    required
                                >
                                    {departments.map((dept: any) => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-emerald-600 text-white px-6 py-2 rounded-md font-bold hover:bg-emerald-700"
                            >
                                حفظ القاعدة
                            </button>
                        </form>
                    </div>

                    {/* Rules List */}
                    <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
                        <h3 className="text-lg font-bold mb-4">القواعد الحالية</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">شرط الفئة</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">شرط العنصر</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الجهة المحول إليها</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {rules.map((rule: any) => (
                                        <tr key={rule.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{rule.category || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rule.infrastructure_type || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-600 font-bold">{rule.department_name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}
