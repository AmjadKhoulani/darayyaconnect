import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import api from '../services/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await api.post('/login', {
                email,
                password,
                device_name: 'android_mobile'
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            navigate('/profile');
        } catch (err: any) {
            setError(err.response?.data?.message || 'فشل تسجيل الدخول. يرجى التأكد من البيانات.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-10 transition-colors duration-300" dir="rtl">
            <div className="w-full max-w-md mx-auto px-6">
                <button
                    onClick={() => navigate('/')}
                    className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100 transition-all shadow-sm mb-6"
                >
                    <ArrowRight size={20} className="rotate-180" />
                </button>

                {/* Clean Logo & Branding */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl mx-auto flex items-center justify-center border border-emerald-100 dark:border-emerald-800 mb-6 rotate-3">
                        <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">د</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">مرحباً بعودتك! 👋</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">سجل دخولك للمتابعة في مجتمع داريا</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 p-8 rounded-3xl shadow-premium space-y-6">
                    {/* Email Field */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-1">البريد الإلكتروني</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-4 pr-12 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 text-sm font-medium"
                                placeholder="name@example.com"
                                required
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Mail size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-1">كلمة المرور</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-4 pr-12 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 text-sm font-medium"
                                placeholder="••••••••"
                                required
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Lock size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span>تسجيل الدخول</span>
                                <LogIn size={18} />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="text-center mt-8 space-y-4">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        ليس لديك حساب؟ <span onClick={() => navigate('/register')} className="text-emerald-600 dark:text-emerald-400 font-bold cursor-pointer hover:underline transition-colors">إنشاء حساب جديد</span>
                    </p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs">
                        نسيت كلمة المرور؟ <span className="text-slate-600 dark:text-slate-300 font-semibold cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">استعادة الحساب</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
