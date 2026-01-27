import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, User, Mail, Phone, Lock, Save, MapPin, AlertCircle, Camera } from 'lucide-react';
import api from '../services/api';

export default function EditProfile() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const [showPasswordSection, setShowPasswordSection] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            // Try getting from local storage first for speed
            const stored = localStorage.getItem('user');
            if (stored) {
                const u = JSON.parse(stored);
                setUser(u);
                setFormData(prev => ({
                    ...prev,
                    name: u.name || '',
                    email: u.email || '',
                    mobile: u.mobile || u.phone || '', // Handle varied naming
                }));
            }

            // Refresh from API
            try {
                const res = await api.get('/user');
                setUser(res.data);
                setFormData(prev => ({
                    ...prev,
                    name: res.data.name || '',
                    email: res.data.email || '',
                    mobile: res.data.mobile || res.data.phone || '',
                }));
            } catch (e) {
                console.error(e);
            }
        };

        fetchUser();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            if (formData.mobile) data.append('mobile', formData.mobile);

            // @ts-ignore
            if (formData.photo) {
                // @ts-ignore
                data.append('photo', formData.photo);
            }

            if (showPasswordSection && formData.new_password) {
                data.append('current_password', formData.current_password);
                data.append('new_password', formData.new_password);
                data.append('new_password_confirmation', formData.new_password_confirmation);
            }

            const res = await api.post('/user/profile', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Update local storage
            const updatedUser = { ...user, ...res.data.user };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            setSuccess('تم حفظ التغييرات بنجاح');

            // Clear sensitive fields
            setFormData(prev => ({ ...prev, current_password: '', new_password: '', new_password_confirmation: '', photo: undefined }));
            setShowPasswordSection(false);

            setTimeout(() => navigate(-1), 1500);

        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.message || 'فشل التعديل حاول مرة أخرى';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="min-h-screen bg-slate-50 dark:bg-slate-900" />;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl">
            <header className="px-4 py-5 flex items-center gap-3 sticky top-0 z-30 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                    <ArrowRight size={20} />
                </button>
                <h1 className="text-xl font-black text-slate-800 dark:text-slate-100">تعديل الملف الشخصي</h1>
            </header>

            <main className="px-4 py-6">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Status Messages */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold flex items-center gap-2">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-xl text-sm font-bold flex items-center gap-2">
                            <Save size={18} />
                            {success}
                        </div>
                    )}

                    {/* Profile Picture */}
                    <div className="flex flex-col items-center justify-center gap-3 py-4">
                        <div className="relative group cursor-pointer" onClick={() => document.getElementById('photo-upload')?.click()}>
                            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center relative">
                                {user.profile_photo_url ? (
                                    <img src={user.profile_photo_url} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-black text-slate-400">{user.name?.charAt(0)}</span>
                                )}
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full border-2 border-white dark:border-slate-800 shadow-md">
                                <Camera size={16} />
                            </div>
                        </div>
                        <p className="text-xs font-bold text-slate-400">اضغط لتغيير الصورة</p>
                        <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    // Handle preview immediately (optional)
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                        setUser(prev => ({ ...prev, profile_photo_url: ev.target?.result }));
                                    };
                                    reader.readAsDataURL(file);

                                    // Add to formData for upload (we'll need to change handleSubmit logic)
                                    setFormData(prev => ({ ...prev, photo: file }));
                                }
                            }}
                        />
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-2 px-1">المعلومات الشخصية</h3>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 px-1">الاسم الكامل</label>
                            <div className="relative">
                                <User className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pr-10 pl-4 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 px-1">البريد الإلكتروني</label>
                            <div className="relative">
                                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pr-10 pl-4 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 px-1">رقم الهاتف</label>
                            <div className="relative">
                                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="tel"
                                    value={formData.mobile}
                                    placeholder="مثلاً 0912345678"
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pr-10 pl-4 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address & Residency Section */}
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-5 rounded-3xl border border-emerald-100 dark:border-emerald-800/50 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <MapPin size={18} className="text-emerald-600" />
                                العنوان والإقامة
                            </h3>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${user.is_resident ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                {user.is_resident ? 'مقيم حالياً' : 'غير مقيم'}
                            </span>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                    <MapPin size={20} className="text-slate-500 dark:text-slate-300" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">الموقع الحالي على الخريطة</p>
                                    <p className="text-sm font-black text-slate-800 dark:text-slate-100 mb-3" dir="ltr">
                                        {user.latitude && user.longitude ? `${Number(user.latitude).toFixed(4)}, ${Number(user.longitude).toFixed(4)}` : 'لم يتم التحديد بعد'}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/setup-location')}
                                        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1 w-fit"
                                    >
                                        <MapPin size={14} />
                                        تعديل العنوان / حالة الإقامة
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed px-1">
                            لتغيير حالة الإقامة بين "مقيم" و "غير مقيم" أو تعديل موقع منزلك، اضغط على الزر أعلاه.
                        </p>
                    </div>

                    {/* Password Section */}
                    <div className="space-y-4 pt-2">
                        <button
                            type="button"
                            onClick={() => setShowPasswordSection(!showPasswordSection)}
                            className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
                        >
                            <Lock size={16} />
                            {showPasswordSection ? 'إلغاء تغيير كلمة المرور' : 'تغيير كلمة المرور'}
                        </button>

                        {showPasswordSection && (
                            <div className="space-y-4 animate-fade-in-up bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 px-1">كلمة المرور الحالية</label>
                                    <input
                                        type="password"
                                        value={formData.current_password}
                                        onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 px-1">كلمة المرور الجديدة</label>
                                    <input
                                        type="password"
                                        value={formData.new_password}
                                        onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 px-1">تأكيد كلمة المرور الجديدة</label>
                                    <input
                                        type="password"
                                        value={formData.new_password_confirmation}
                                        onChange={(e) => setFormData({ ...formData, new_password_confirmation: e.target.value })}
                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save size={20} />
                                    <span>حفظ التغييرات</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
