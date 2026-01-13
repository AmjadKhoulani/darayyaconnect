import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

export default function Splash() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300" dir="rtl">

            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -ml-32 -mb-32 blur-3xl animate-pulse-slow delay-1000"></div>

            <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center">
                {/* Logo */}
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-emerald-500/30 mb-8 animate-float rotate-3">
                    د
                </div>

                <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2">مجتمع داريا</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-12 text-lg">منصتك الذكية للمشاركة وبناء المجتمع</p>

                {/* Buttons */}
                <div className="w-full space-y-4 animate-fade-in-up">
                    <Link
                        to="/login"
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                        <LogIn size={20} />
                        تسجيل الدخول
                    </Link>

                    <Link
                        to="/register"
                        className="w-full py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                        <UserPlus size={20} />
                        إنشاء حساب جديد
                    </Link>
                </div>

                <p className="mt-8 text-xs text-slate-400 dark:text-slate-500">
                    الإصدار التجريبي Beta 1.0.0
                </p>
            </div>
        </div>
    );
}
