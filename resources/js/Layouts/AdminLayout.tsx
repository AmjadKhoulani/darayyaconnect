import { User } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutDashboard, Users, FileText, Settings, Menu, X, Map as MapIcon, Layers, Building2 } from 'lucide-react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function AdminLayout({
    user,
    header,
    children,
}: PropsWithChildren<{ user: User; header?: ReactNode }>) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    // Helper: Determine which infrastructure sectors user can access
    const canAccessSector = (sector: 'water' | 'electricity' | 'sewage' | 'phone') => {
        // Super admins can access everything
        if (user.role === 'admin') return true;

        // Department-specific access
        const deptSlug = user.department?.slug;
        if (!deptSlug) return false;

        const accessMap: Record<string, string[]> = {
            'electricity': ['electricity'],
            'water': ['water', 'sewage'],
            'municipality': ['phone'],
        };

        return accessMap[deptSlug]?.includes(sector) || false;
    };

    return (
        <div className="flex min-h-screen bg-slate-100" dir="rtl">
            {/* Sidebar */}
            <aside className="fixed z-20 hidden h-full w-64 flex-col overflow-y-auto bg-slate-900 text-white lg:flex">
                <div className="flex items-center gap-3 border-b border-slate-800 p-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500 text-lg font-bold text-white">
                        D
                    </div>
                    <span className="text-lg font-bold tracking-wider">
                        DARAYYA{' '}
                        <span className="block text-xs text-emerald-500">
                            ADMIN PANEL
                        </span>
                    </span>
                </div>

                <nav className="flex-1 space-y-1 p-4">
                    <p className="mb-2 mt-2 px-3 text-xs font-bold uppercase text-slate-500">
                        الرئيسية
                    </p>
                    <SidebarLink
                        href={route('admin.dashboard')}
                        active={route().current('admin.dashboard')}
                        icon="📊"
                    >
                        لوحة التحكم
                    </SidebarLink>
                    {user.role === 'admin' && (
                        <SidebarLink
                            href={route('admin.carousel.index')}
                            active={route().current('admin.carousel.*')}
                            icon="🖼️"
                        >
                            إدارة السلايدر
                        </SidebarLink>
                    )}

                    {user.role === 'admin' && (
                        <>
                            <p className="mb-2 mt-6 px-3 text-xs font-bold uppercase text-slate-500">
                                الإدارة
                            </p>
                            <SidebarLink
                                href={route('admin.users.index')}
                                active={route().current('admin.users.*')}
                                icon="👥"
                            >
                                المستخدمين
                            </SidebarLink>
                        </>
                    )}

                    <SidebarLink
                        href={route('admin.reports.index')}
                        active={route().current('admin.reports.*')}
                        icon="📨"
                    >
                        البلاغات
                    </SidebarLink>
                    <SidebarLink
                        href={route('admin.infrastructure.inventory')}
                        active={route().current('admin.infrastructure.inventory')}
                        icon="📋"
                    >
                        سجل البنية التحتية
                    </SidebarLink>
                    {user.role === 'admin' && (
                        <>
                            <SidebarLink
                                href={route('admin.moderation.index')}
                                active={route().current('admin.moderation.*')}
                                icon="🛡️"
                            >
                                الرقابة والموافقة
                            </SidebarLink>
                            <SidebarLink
                                href={route('admin.volunteers.index')}
                                active={route().current('admin.volunteers.*')}
                                icon="🤝"
                            >
                                المتطوعين
                            </SidebarLink>

                            {/* Infrastructure Sectors - Filtered by Department */}
                            <p className="mb-2 mt-6 px-3 text-xs font-bold uppercase text-slate-500">
                                البنية التحتية
                            </p>

                            {canAccessSector('water') && (
                                <SidebarLink
                                    href={route('admin.infrastructure.water.editor')}
                                    active={route().current('admin.infrastructure.water.editor')}
                                    icon="💧"
                                >
                                    المياه
                                </SidebarLink>
                            )}

                            {canAccessSector('electricity') && (
                                <SidebarLink
                                    href={route('admin.infrastructure.electricity.editor')}
                                    active={route().current('admin.infrastructure.electricity.editor')}
                                    icon="⚡"
                                >
                                    الكهرباء
                                </SidebarLink>
                            )}

                            {canAccessSector('sewage') && (
                                <SidebarLink
                                    href={route('admin.infrastructure.sewage.editor')}
                                    active={route().current('admin.infrastructure.sewage.editor')}
                                    icon="🚰"
                                >
                                    الصرف الصحي
                                </SidebarLink>
                            )}

                            {canAccessSector('phone') && (
                                <SidebarLink
                                    href={route('admin.infrastructure.phone.editor')}
                                    active={route().current('admin.infrastructure.phone.editor')}
                                    icon="📱"
                                >
                                    الهاتف
                                </SidebarLink>
                            )}

                            {user.role === 'admin' && (
                                <SidebarLink
                                    href={route('admin.departments.index')}
                                    active={route().current('admin.departments.*')}
                                    icon="�"
                                >
                                    الجهات الحكومية
                                </SidebarLink>
                            )}

                            {user.role === 'admin' && (
                                <SidebarLink
                                    href={route('admin.service-states.index')}
                                    active={route().current('admin.service-states.index')}
                                    icon="📊"
                                >
                                    حالة الخدمات
                                </SidebarLink>
                            )}
                        </>
                    )}

                    {user.role === 'admin' && (
                        <>
                            <p className="mb-2 mt-6 px-3 text-xs font-bold uppercase text-slate-500">
                                الخدمات المجتمعية
                            </p>
                            <SidebarLink
                                href={route('admin.directory.index')}
                                active={route().current('admin.directory.*')}
                                icon="📒"
                            >
                                دليل المدينة
                            </SidebarLink>

                            <SidebarLink
                                href={route('admin.initiatives.index')}
                                active={route().current('admin.initiatives.*')}
                                icon="🗳️"
                            >
                                المبادرات
                            </SidebarLink>
                            <SidebarLink
                                href={route('admin.lost-found.index')}
                                active={route().current('admin.lost-found.*')}
                                icon="🔍"
                            >
                                المفقودات
                            </SidebarLink>
                            <SidebarLink
                                href={route('admin.discussions.index')}
                                active={route().current('admin.discussions.*')}
                                icon="💬"
                            >
                                النقاشات
                            </SidebarLink>
                            <SidebarLink
                                href={route('admin.books.index')}
                                active={route().current('admin.books.*')}
                                icon="📚"
                            >
                                المكتبة
                            </SidebarLink>

                            <p className="mb-2 mt-6 px-3 text-xs font-bold uppercase text-slate-500">
                                الذكاء الاصطناعي
                            </p>
                            <SidebarLink
                                href={route('admin.ai-studies.index')}
                                active={route().current('admin.ai-studies.*')}
                                icon="🤖"
                            >
                                إدارة الدراسات
                            </SidebarLink>
                        </>
                    )}

                    <p className="mb-2 mt-6 px-3 text-xs font-bold uppercase text-slate-500">
                        الإعدادات
                    </p>
                    <SidebarLink
                        href={route('profile.edit')}
                        active={route().current('profile.edit')}
                        icon="👤"
                    >
                        الملف الشخصي
                    </SidebarLink>
                    {user.role === 'admin' && (
                        <>
                            <SidebarLink
                                href={route('admin.settings.index')}
                                active={route().current('admin.settings.*')}
                                icon="⚙️"
                            >
                                إعدادات المنصة
                            </SidebarLink>
                            {!user.city_id && (
                                <SidebarLink
                                    href="/admin/locations"
                                    active={window.location.pathname.startsWith('/admin/locations')}
                                    icon="🌍"
                                >
                                    المحافظات والمدن
                                </SidebarLink>
                            )}
                        </>
                    )}
                </nav>

                <div className="border-t border-slate-800 p-4">
                    <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs font-bold">
                            {user?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                            <div className="text-sm font-bold">{user?.name || 'مستخدم'}</div>
                            <div className="text-xs text-slate-500">
                                {user.role === 'admin' ? 'مشرف النظام' : `جهة حكومية: ${user.department?.name || ''}`}
                            </div>
                        </div>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full rounded bg-slate-800 py-2 text-center text-xs font-bold transition hover:bg-slate-700"
                    >
                        تسجيل الخروج
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex min-h-screen flex-1 flex-col lg:mr-64">
                {/* Top Header */}
                <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white px-6 shadow lg:px-8">
                    <div className="text-xl font-bold text-slate-800">
                        {header}
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-800"
                        >
                            <span>🏠</span> العودة للموقع
                        </Link>
                    </div>
                </header>

                <div className="flex-1">{children}</div>
            </main>
        </div>
    );
}

function SidebarLink({
    href,
    active,
    icon,
    children,
}: {
    href: string;
    active: boolean;
    icon: string;
    children: ReactNode;
}) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-all ${active
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                } `}
        >
            <span className="text-lg">{icon}</span>
            <span>{children}</span>
        </Link>
    );
}
