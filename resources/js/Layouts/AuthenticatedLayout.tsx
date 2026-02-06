import Dropdown from '@/Components/Dropdown';
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
        <div
            className="min-h-screen bg-slate-100 text-right font-sans text-slate-800"
            dir="rtl"
        >
            <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 transition hover:opacity-80"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-lg font-bold text-white shadow-sm">
                                د
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">
                                مجتمع داريا
                            </span>
                        </Link>

                        {/* Search Bar Placeholder (Social Style) */}
                        <div className="group hidden w-64 items-center rounded-full border border-transparent bg-slate-100 px-4 py-2 transition-all focus-within:border-emerald-500 focus-within:bg-white md:flex">
                            <span className="text-slate-400 transition-colors group-focus-within:text-emerald-500">
                                🔍
                            </span>
                            <input
                                type="text"
                                placeholder="بحث في المدينة..."
                                className="w-full border-none bg-transparent p-0 text-sm text-slate-700 placeholder-slate-400 focus:ring-0"
                            />
                        </div>

                        {/* Desktop Nav Links */}
                        <nav className="mr-6 hidden items-center gap-6 border-r border-slate-200 pr-6 lg:flex">
                            <Link
                                href={route('dashboard')}
                                className={`text-sm font-bold transition ${route().current('dashboard') ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}
                            >
                                المركز الرقمي
                            </Link>
                            <Link
                                href={route('ai-studies')}
                                className={`text-sm font-bold transition ${route().current('ai-studies') ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}
                            >
                                دراسات AI 🤖
                            </Link>
                            <Link
                                href={route('volunteer.index')}
                                className={`text-sm font-bold transition ${route().current('volunteer.index') ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}
                            >
                                التطوع 🤝
                            </Link>
                            <Link
                                href={route('community.index')}
                                className={`text-sm font-bold transition ${route().current('community.index') ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}
                            >
                                النقاشات 💬
                            </Link>
                            {user.role === 'admin' && (
                                <Link
                                    href={route('admin.missing-data')}
                                    className={`text-sm font-bold transition ${route().current('admin.missing-data') ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}
                                >
                                    بيانات 🏳️
                                </Link>
                            )}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden h-6 w-px bg-slate-200 sm:block"></div>

                        <div className="relative hidden sm:block">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-2 rounded-full border border-transparent p-1 pr-3 transition-all hover:border-slate-200 hover:bg-slate-50">
                                        <span className="text-sm font-bold text-slate-700">
                                            {user.name}
                                        </span>
                                        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-200 font-bold text-slate-600">
                                            {user.profile_photo_url ? (
                                                <img
                                                    src={user.profile_photo_url}
                                                    alt={user.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                user.name.charAt(0)
                                            )}
                                        </div>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>
                                        الإعدادات
                                    </Dropdown.Link>
                                    <div className="my-1 border-t border-slate-100"></div>
                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="text-red-600"
                                    >
                                        تسجيل الخروج
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Burger for Mobile */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        !showingNavigationDropdown,
                                    )
                                }
                                className="rounded-md p-2 text-slate-400 transition hover:bg-slate-100"
                            >
                                ☰
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`${showingNavigationDropdown ? 'block' : 'hidden'} space-y-2 border-t border-slate-100 bg-white p-4 lg:hidden`}
                >
                    <ResponsiveNavLink
                        href={route('dashboard')}
                        active={route().current('dashboard')}
                    >
                        المركز الرقمي
                    </ResponsiveNavLink>
                    <ResponsiveNavLink
                        href={route('ai-studies')}
                        active={route().current('ai-studies')}
                    >
                        دراسات AI 🤖
                    </ResponsiveNavLink>
                    <ResponsiveNavLink
                        href={route('volunteer.index')}
                        active={route().current('volunteer.index')}
                    >
                        التطوع 🤝
                    </ResponsiveNavLink>
                    <ResponsiveNavLink
                        href={route('community.index')}
                        active={route().current('community.index')}
                    >
                        النقاشات 💬
                    </ResponsiveNavLink>
                    {user.role === 'admin' && (
                        <ResponsiveNavLink
                            href={route('admin.missing-data')}
                            active={route().current('admin.missing-data')}
                        >
                            بيانات 🏳️
                        </ResponsiveNavLink>
                    )}
                </div>
            </nav>

            {header && (
                <header className="border-b border-slate-100 bg-white shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>

            {/* Mobile Bottom Navigation Bar 📱 */}
            <div className="pb-safe fixed bottom-0 left-0 z-50 w-full border-t border-slate-200 bg-white md:hidden">
                <div className="flex h-16 items-center justify-around">
                    <Link
                        href={route('dashboard')}
                        className={`flex h-full w-full flex-col items-center justify-center text-xs font-bold ${route().current('dashboard') ? 'text-emerald-600' : 'text-slate-400'}`}
                    >
                        <span className="mb-1 text-xl">🏠</span>
                        الرئيسية
                    </Link>

                    <div className="relative -top-5">
                        <Link
                            href={route('infrastructure.index')}
                            className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-2xl shadow-lg shadow-slate-400"
                        >
                            🗺️
                        </Link>
                    </div>

                    <Link
                        href={route('volunteer.index')}
                        className={`flex h-full w-full flex-col items-center justify-center text-xs font-bold ${route().current('volunteer.index') ? 'text-emerald-600' : 'text-slate-400'}`}
                    >
                        التطوع
                    </Link>

                    <Link
                        href={route('community.index')}
                        className={`flex h-full w-full flex-col items-center justify-center text-xs font-bold ${route().current('community.index') ? 'text-emerald-600' : 'text-slate-400'}`}
                    >
                        <span className="mb-1 text-xl">💬</span>
                        النقاشات
                    </Link>
                </div>
            </div>
        </div>
    );
}
