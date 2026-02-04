import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';

// Enhanced icons
const Icons = {
    Email: () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
    ),
    Lock: () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
    ),
    Eye: () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
    ),
    EyeSlash: () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
    ),
};

export default function Login({ status, canResetPassword }: { status?: string, canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const { settings } = usePage().props as any;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen w-full bg-slate-50 font-sans selection:bg-emerald-500 selection:text-white dark:bg-slate-950" dir="rtl">
            <Head title="تسجيل الدخول" />

            {/* Left Side - Form Area */}
            <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    {/* Header */}
                    <div className="text-center lg:text-right">
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-2xl font-black text-white shadow-xl shadow-emerald-900/10 transition-transform group-hover:scale-110">
                                D
                            </div>
                            <div className="text-right">
                                <h1 className="text-xl font-bold leading-tight text-slate-900 dark:text-white">
                                    {settings?.city_name || 'داريا'} <span className="text-emerald-600 dark:text-emerald-400">الرقمية</span>
                                </h1>
                                <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Smart City Portal</p>
                            </div>
                        </Link>

                        <h2 className="mt-8 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                            مرحباً بعودتك! 👋
                        </h2>
                        <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                            يرجى تسجيل الدخول للمتابعة إلى حسابك
                        </p>
                    </div>

                    {status && (
                        <div className="mt-6 rounded-lg bg-emerald-50 p-4 text-sm font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                            {status}
                        </div>
                    )}

                    {/* Form */}
                    <div className="mt-10">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                                    البريد الإلكتروني
                                </label>
                                <div className="mt-2 relative rounded-xl shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                                        <Icons.Email />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="block w-full rounded-xl border-slate-200 pr-10 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 sm:text-sm"
                                        placeholder="name@example.com"
                                        autoComplete="username"
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Password Field */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                                        كلمة المرور
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-xs font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
                                        >
                                            نسيت كلمة المرور؟
                                        </Link>
                                    )}
                                </div>
                                <div className="mt-2 relative rounded-xl shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                                        <Icons.Lock />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="block w-full rounded-xl border-slate-200 pr-10 pl-10 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 sm:text-sm"
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 hover:text-slate-600 focus:outline-none dark:hover:text-slate-300"
                                    >
                                        {showPassword ? <Icons.EyeSlash /> : <Icons.Eye />}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Remember Me & Submit */}
                            <div className="flex items-center justify-between gap-4">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <span className="mr-2 text-sm font-medium text-slate-600 dark:text-slate-400">تذكرني</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full justify-center rounded-xl bg-emerald-600 px-3 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-900/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'جاري التحقق...' : 'تسجيل الدخول'}
                            </button>

                            {/* Register Link */}
                            <div className="text-center text-sm">
                                <span className="text-slate-500 dark:text-slate-400">ليس لديك حساب؟ </span>
                                <Link
                                    href={route('register')}
                                    className="font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
                                >
                                    انشئ حساب جديد
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Right Side - Visual Area (Desktop Only) */}
            <div className="hidden lg:relative lg:block lg:w-1/2">
                <div className="absolute inset-0 bg-slate-900 h-full w-full object-cover">
                    {/* Abstract Shapes/Gradient */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 to-slate-900/90"></div>

                    {/* Decorative Blobs */}
                    <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl filter"></div>
                    <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl filter"></div>

                    {/* Content */}
                    <div className="relative flex h-full flex-col items-center justify-center px-12 text-center text-white">
                        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-10 w-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                            </svg>
                        </div>
                        <h2 className="mb-6 text-4xl font-black leading-tight">
                            بوابتك الرقمية لإدارة<br />
                            <span className="text-emerald-400">المدينة الذكية</span>
                        </h2>
                        <p className="max-w-md text-lg text-slate-300">
                            منصة موحدة لخدمات المواطنين، المشاركة المجتمعية، والوصول إلى كافة المعلومات والخدمات بسهولة.
                        </p>

                        {/* Highlights */}
                        <div className="mt-12 grid grid-cols-2 gap-6 w-full max-w-md">
                            <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-sm border border-white/10">
                                <div className="text-2xl mb-2">⚡</div>
                                <div className="font-bold text-sm">خدمات سريعة</div>
                            </div>
                            <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-sm border border-white/10">
                                <div className="text-2xl mb-2">🔒</div>
                                <div className="font-bold text-sm">بيانات آمنة</div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-8 w-full text-center text-xs text-slate-500">
                        &copy; 2026 {settings?.city_name || 'داريا'} الرقمية. جميع الحقوق محفوظة.
                    </div>
                </div>
            </div>
        </div>
    );
}
