import { Link, usePage } from '@inertiajs/react';
import React, { PropsWithChildren } from 'react';
import EmergencyModal from '@/Components/EmergencyModal';

interface Props {
    auth?: any;
    title?: string;
    header?: React.ReactNode;
}

export default function PortalLayout({
    auth,
    children,
    header,
}: PropsWithChildren<Props>) {
    const [emergencyModalOpen, setEmergencyModalOpen] = React.useState(false);
    const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
    const { settings } = usePage().props as any;

    const isEnabled = (module: string) => settings[`module_${module}`] === '1';

    // Theme Management
    React.useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const initialTheme = savedTheme || systemTheme;

        setTheme(initialTheme);
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    return (
        <div
            className="min-h-screen bg-slate-50 font-sans text-slate-900 transition-colors duration-300 selection:bg-emerald-500 selection:text-white dark:bg-slate-950 dark:text-slate-100"
            dir="rtl"
        >
            <EmergencyModal
                open={emergencyModalOpen}
                setOpen={setEmergencyModalOpen}
            />

            {/* Top Navigation - Official Portal Style */}
            <nav className="fixed top-0 z-50 h-16 w-full border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/90">
                <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 text-xl font-black text-white shadow-lg shadow-emerald-900/10 dark:from-emerald-600 dark:to-emerald-800">
                                D
                            </div>
                            <div className="hidden md:block">
                                <h1 className="text-lg font-bold leading-tight text-slate-900 dark:text-white">
                                    {settings?.city_name || 'داريا'}{' '}
                                    <span className="text-emerald-600 dark:text-emerald-400">
                                        الرقمية
                                    </span>
                                </h1>
                                <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    {settings?.site_name || 'منصة إدارة المدينة الموحدة'}
                                </p>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden items-center gap-6 md:flex">
                        {isEnabled('infrastructure') && (
                            <NavLink
                                href={route('infrastructure.index')}
                                label="الخريطة"
                                active={route().current('infrastructure.index')}
                            />
                        )}
                        {/* ... other nav links stay same but NavLink needs dark mode support ... */}
                        {isEnabled('initiatives') && <NavLink href={route('initiatives.public')} label="المبادرات" active={route().current('initiatives.public')} />}
                        {isEnabled('knowledge') && <NavLink href={route('ai-studies')} label="الدراسات" active={route().current('ai-studies')} />}
                        {isEnabled('discussions') && <NavLink href={route('community.index')} label="المجتمع" active={route().current('community.index')} />}
                        {isEnabled('volunteering') && <NavLink href={route('volunteer.index')} label="التطوع" active={route().current('volunteer.index')} />}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                            title={theme === 'light' ? 'الوضع الليلي' : 'الوضع النهاري'}
                        >
                            {theme === 'light' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-amber-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                                </svg>
                            )}
                        </button>

                        <button
                            onClick={() => setEmergencyModalOpen(true)}
                            className="group relative flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 transition-all hover:bg-red-500 hover:text-white dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white"
                            title="أرقام الطوارئ"
                        >
                            <span className="animate-pulse absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500 ring-2 ring-white group-hover:bg-red-400 dark:ring-slate-900"></span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                        </button>

                        {auth?.user ? (
                            <Link
                                href={route('dashboard')}
                                className="group flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-1.5 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                            >
                                <span className="text-sm font-bold text-emerald-700 group-hover:text-emerald-800 dark:text-emerald-400 dark:group-hover:text-emerald-300">
                                    لوحة التحكم
                                </span>
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                            >
                                دخول الموظفين
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <main className="pb-12 pt-20">
                {header && (
                    <header className="mx-auto mb-8 max-w-7xl px-4 sm:px-6 lg:px-8">
                        {header}
                    </header>
                )}
                {children}
            </main>

            <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-center transition-colors dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    منصة الإدارة المحلية الذكية &copy; 2026
                </p>
            </footer>
        </div>
    );
}

function NavLink({ href, label, active }: any) {
    return (
        <Link
            href={href}
            className={`text-sm font-bold transition-colors ${active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
        >
            {label}
        </Link>
    );
}

