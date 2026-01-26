import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, UserCheck, Shield, Building2, User, X } from 'lucide-react';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';

export default function AdminUserList() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('all');
    const [departments, setDepartments] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
        fetchDepartments();
    }, [search, role]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/users', { params: { search, role } });
            setUsers(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/admin/departments');
            setDepartments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleVerify = async (user: any) => {
        try {
            await api.post(`/admin/users/${user.id}/update`, {
                role: user.role,
                is_verified_official: !user.is_verified_official,
                department_id: user.department_id
            });
            fetchUsers();
        } catch (err) {
            alert('فشل تحديث حالة المستخدم');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
            <header className="bg-white border-b border-slate-100 sticky top-0 z-10 px-4 pt-4 pb-2">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                        <ArrowRight className="text-slate-600" />
                    </button>
                    <h1 className="text-lg font-black text-slate-800">إدارة المستخدمين</h1>
                </div>

                <div className="relative mb-3">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="ابحث عن اسم أو بريد إلكتروني..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-50 border-slate-100 rounded-2xl py-3 pr-12 pl-4 text-sm font-bold focus:ring-slate-900"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {['all', 'admin', 'official', 'institution', 'user'].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRole(r)}
                            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap ${role === r ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'
                                }`}
                        >
                            {{
                                'all': 'الكل',
                                'admin': 'مدراء',
                                'official': 'مسؤولين',
                                'institution': 'مؤسسات',
                                'user': 'مواطنين'
                            }[r as string] || r}
                        </button>
                    ))}
                </div>
            </header>

            <main className="p-4 space-y-3">
                {loading ? (
                    <SkeletonLoader type="list" />
                ) : (
                    users.map((user) => (
                        <div key={user.id} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{user.name}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold">{user.email}</p>
                                    <div className="flex gap-2 mt-1">
                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-rose-100 text-rose-600' :
                                            user.role === 'official' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {user.role}
                                        </span>
                                        {user.is_verified_official && (
                                            <span className="bg-emerald-100 text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <UserCheck size={10} /> موثق
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {user.role !== 'admin' && (
                                <button
                                    onClick={() => handleVerify(user)}
                                    className={`p-3 rounded-2xl transition-all ${user.is_verified_official ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'
                                        }`}
                                >
                                    {user.is_verified_official ? <X size={20} /> : <UserCheck size={20} />}
                                </button>
                            )}
                        </div>
                    ))
                )}

                {!loading && users.length === 0 && (
                    <div className="py-20 text-center text-slate-400 font-bold">لا يوجد نتائج للبحث</div>
                )}
            </main>
        </div>
    );
}
