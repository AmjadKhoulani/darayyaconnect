import { Link } from '@inertiajs/react';
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

    return (
        <div
            className="min-h-screen bg-slate-100 font-sans text-slate-900 selection:bg-emerald-500 selection:text-white"
            dir="rtl"
        >
            <EmergencyModal
                open={emergencyModalOpen}
                setOpen={setEmergencyModalOpen}
            />

            {/* Top Navigation - Official Portal Style (Light) */}
            <nav className="fixed top-0 z-50 h-16 w-full border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-md">
                <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 text-xl font-black text-white shadow-lg shadow-emerald-900/10">
                                D
                            </div>
                            <div className="hidden md:block">
                                <h1 className="text-lg font-bold leading-tight text-slate-900">
                                    داريا{' '}
                                    <span className="text-emerald-600">
                                        الرقمية
                                    </span>
                                </h1>
                                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                                    منصة إدارة المدينة الموحدة
                                </p>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden items-center gap-6 md:flex">
                        <NavLink
                            href={route('infrastructure.index')}
                            label="الخريطة"
                            active={route().current('infrastructure.index')}
                        />
                        <NavLink
                            href={route('initiatives.public')}
                            label="المبادرات"
                            active={route().current('initiatives.public')}
                        />
                        <NavLink
                            href={route('ai-studies')}
                            label="الدراسات"
                            active={route().current('ai-studies')}
                        />
                        <NavLink
                            href={route('community.index')}
                            label="المجتمع"
                            active={route().current('community.index')}
                        />
                        <NavLink
                            href={route('volunteer.index')}
                            label="التطوع"
                            active={route().current('volunteer.index')}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setEmergencyModalOpen(true)}
                            className="group relative flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 transition-all hover:bg-red-500 hover:text-white"
                            title="أرقام الطوارئ"
                        >
                            <span className="animate-pulse absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500 ring-2 ring-white group-hover:bg-red-400"></span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                        </button>

                        {auth?.user ? (
                            <Link
                                href={route('dashboard')}
                                className="group flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-1.5 transition hover:bg-slate-100"
                            >
                                <span className="text-sm font-bold text-emerald-700 group-hover:text-emerald-800">
                                    لوحة التحكم
                                </span>
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-700"
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

            <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-center">
                <p className="text-xs font-medium text-slate-500">
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
            className={`text-sm font-bold transition-colors ${active ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900'}`}
        >
            {label}
        </Link>
    );
}
