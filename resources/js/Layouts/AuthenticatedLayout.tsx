import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth } = usePage().props as any;
    const user = auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-right text-slate-800" dir="rtl">
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
                            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                د
                            </div>
                            <span className="text-xl font-bold text-slate-900 tracking-tight">مجتمع داريا</span>
                        </Link>

                        {/* Search Bar Placeholder (Social Style) */}
                        <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 w-64 border border-transparent focus-within:border-emerald-500 focus-within:bg-white transition-all group">
                            <span className="text-slate-400 group-focus-within:text-emerald-500 transition-colors">🔍</span>
                            <input
                                type="text"
                                placeholder="بحث في المدينة..."
                                className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 text-slate-700 placeholder-slate-400"
                            />
                        </div>

                        {/* Desktop Nav Links */}
                        <nav className="hidden lg:flex items-center gap-6 mr-6 border-r border-slate-200 pr-6">
                            <Link href={route('dashboard')} className={`text-sm font-bold transition ${route().current('dashboard') ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}>المركز الرقمي</Link>
                            <Link href={route('ai-studies')} className={`text-sm font-bold transition ${route().current('ai-studies') ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}>دراسات AI 🤖</Link>
                            <Link href={route('volunteer.index')} className={`text-sm font-bold transition ${route().current('volunteer.index') ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}>التطوع 🤝</Link>
                            <Link href={route('community.index')} className={`text-sm font-bold transition ${route().current('community.index') ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}>النقاشات 💬</Link>
                            <Link href={route('admin.missing-data')} className={`text-sm font-bold transition ${route().current('admin.missing-data') ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}>بيانات 🏳️</Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

                        <div className="relative hidden sm:block">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-2 hover:bg-slate-50 p-1 pr-3 rounded-full border border-transparent hover:border-slate-200 transition-all">
                                        <span className="text-sm font-bold text-slate-700">{user.name}</span>
                                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold overflow-hidden">
                                            {user.profile_photo_url ? (
                                                <img src={user.profile_photo_url} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                user.name.charAt(0)
                                            )}
                                        </div>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>الإعدادات</Dropdown.Link>
                                    <div className="border-t border-slate-100 my-1"></div>
                                    <Dropdown.Link href={route('logout')} method="post" as="button" className="text-red-600">تسجيل الخروج</Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Burger for Mobile */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="p-2 rounded-md text-slate-400 hover:bg-slate-100 transition"
                            >
                                ☰
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} lg:hidden bg-white border-t border-slate-100 p-4 space-y-2`}>
                    <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>المركز الرقمي</ResponsiveNavLink>
                    <ResponsiveNavLink href={route('ai-studies')} active={route().current('ai-studies')}>دراسات AI 🤖</ResponsiveNavLink>
                    <ResponsiveNavLink href={route('volunteer.index')} active={route().current('volunteer.index')}>التطوع 🤝</ResponsiveNavLink>
                    <ResponsiveNavLink href={route('community.index')} active={route().current('community.index')}>النقاشات 💬</ResponsiveNavLink>
                    <ResponsiveNavLink href={route('admin.missing-data')} active={route().current('admin.missing-data')}>بيانات 🏳️</ResponsiveNavLink>
                </div>
            </nav>

            {header && (
                <header className="bg-white border-b border-slate-100 shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>

            {/* Mobile Bottom Navigation Bar 📱 */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-50 md:hidden pb-safe">
                <div className="flex justify-around items-center h-16">
                    <Link
                        href={route('dashboard')}
                        className={`flex flex-col items-center justify-center w-full h-full text-xs font-bold ${route().current('dashboard') ? 'text-emerald-600' : 'text-slate-400'}`}
                    >
                        <span className="text-xl mb-1">🏠</span>
                        الرئيسية
                    </Link>

                    <div className="relative -top-5">
                        <Link
                            href={route('infrastructure.index')}
                            className="flex items-center justify-center w-14 h-14 bg-slate-900 rounded-full shadow-lg shadow-slate-400 text-2xl border-4 border-white"
                        >
                            🗺️
                        </Link>
                    </div>

                    <Link
                        href={route('volunteer.index')}
                        className={`flex flex-col items-center justify-center w-full h-full text-xs font-bold ${route().current('volunteer.index') ? 'text-emerald-600' : 'text-slate-400'}`}
                    >
                        التطوع
                    </Link>

                    <Link
                        href={route('community.index')}
                        className={`flex flex-col items-center justify-center w-full h-full text-xs font-bold ${route().current('community.index') ? 'text-emerald-600' : 'text-slate-400'}`}
                    >
                        <span className="text-xl mb-1">💬</span>
                        النقاشات
                    </Link>
                </div>
            </div>
        </div>
    );
}
