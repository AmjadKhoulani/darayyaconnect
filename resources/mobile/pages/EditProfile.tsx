import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Camera, User, Mail, Phone, Lock, Save } from 'lucide-react';

export default function EditProfile() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: 'مستخدم داريا',
        email: 'user@darayya.net',
        phone: '0912345678',
        bio: 'محب لمدينتي وأسعى لخدمتها.',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            navigate(-1);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl">
            <header className="px-4 py-5 flex items-center gap-3 sticky top-0 z-30 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md">
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
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg">
                                <img src="https://i.pravatar.cc/150?u=me" alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <button type="button" className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors">
                                <Camera size={16} />
                            </button>
                        </div>
                        <p className="mt-3 text-xs text-slate-500 font-medium">تغيير الصورة الشخصية</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 px-1">الاسم الكامل</label>
                            <div className="relative">
                                <User className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pr-10 pl-4 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 px-1">نبذة تعريفية</label>
                            <textarea
                                rows={3}
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 px-1">البريد الإلكتروني</label>
                            <div className="relative">
                                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pr-10 pl-4 text-sm font-bold text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                    disabled
                                />
                            </div>
                            <p className="text-[10px] text-amber-500 px-1">لا يمكن تغيير البريد الإلكتروني</p>
                        </div>
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
