import { Link } from '@inertiajs/react';
import React, { PropsWithChildren } from 'react';

interface Props {
    auth?: any;
    title?: string;
    header?: React.ReactNode;
}

export default function PortalLayout({ auth, children, header }: PropsWithChildren<Props>) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white" dir="rtl">

            {/* Top Navigation - Official Portal Style (Light) */}
            <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-900/10">
                                D
                            </div>
                            <div className="hidden md:block">
                                <h1 className="font-bold text-lg leading-tight text-slate-900">داريا <span className="text-emerald-600">الرقمية</span></h1>
                                <p className="text-[10px] text-slate-500 tracking-wider uppercase">منصة إدارة المدينة الموحدة</p>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <NavLink href={route('infrastructure.index')} label="الخريطة" active={route().current('infrastructure.index')} />
                        <NavLink href={route('initiatives.public')} label="المبادرات" active={route().current('initiatives.public')} />
                        <NavLink href={route('ai-studies')} label="الدراسات" active={route().current('ai-studies')} />
                        <NavLink href={route('community.index')} label="المجتمع" active={route().current('community.index')} />
                        <NavLink href={route('volunteer.index')} label="التطوع" active={route().current('volunteer.index')} />
                    </div>

                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <Link href={route('dashboard')} className="flex items-center gap-3 px-4 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition group">
                                <span className="text-sm font-bold text-emerald-700 group-hover:text-emerald-800">لوحة التحكم</span>
                            </Link>
                        ) : (
                            <Link href={route('login')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition shadow-lg shadow-emerald-900/10">
                                دخول الموظفين
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <main className="pt-20 pb-12">
                {header && (
                    <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                        {header}
                    </header>
                )}
                {children}
            </main>

            <footer className="border-t border-slate-200 bg-white py-8 text-center mt-auto">
                <p className="text-slate-500 text-xs font-medium">
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
    )
}
