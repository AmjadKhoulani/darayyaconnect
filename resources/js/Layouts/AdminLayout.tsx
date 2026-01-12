import { useState, PropsWithChildren, ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { User } from '@/types';

export default function AdminLayout({ user, header, children }: PropsWithChildren<{ user: User, header?: ReactNode }>) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-slate-100 flex" dir="rtl">

            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white hidden lg:flex flex-col fixed h-full z-20 overflow-y-auto">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center font-bold text-white text-lg">D</div>
                    <span className="font-bold text-lg tracking-wider">DARAYYA <span className="text-emerald-500 text-xs block">ADMIN PANEL</span></span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <p className="px-3 text-xs font-bold text-slate-500 uppercase mb-2 mt-2">الرئيسية</p>
                    <SidebarLink href={route('admin.dashboard')} active={route().current('admin.dashboard')} icon="📊">لوحة التحكم</SidebarLink>

                    <p className="px-3 text-xs font-bold text-slate-500 uppercase mb-2 mt-6">الإدارة</p>
                    <SidebarLink href={route('admin.users.index')} active={route().current('admin.users.*')} icon="👥">المستخدمين</SidebarLink>
                    <SidebarLink href="#" active={false} icon="📨">البلاغات</SidebarLink>
                    <SidebarLink href={route('admin.volunteers.index')} active={route().current('admin.volunteers.*')} icon="🤝">المتطوعين</SidebarLink>
                    <SidebarLink href={route('admin.infrastructure.water')} active={route().current('admin.infrastructure.water')} icon="💧">إدارة المياه</SidebarLink>
                    <SidebarLink href={route('admin.infrastructure.editor')} active={route().current('admin.infrastructure.editor')} icon="🏗️">محرر الخريطة</SidebarLink>

                    <p className="px-3 text-xs font-bold text-slate-500 uppercase mb-2 mt-6">الخدمات المجتمعية</p>
                    <SidebarLink href={route('admin.generators.index')} active={route().current('admin.generators.*')} icon="🔌">الأمبيرات</SidebarLink>
                    <SidebarLink href={route('admin.initiatives.index')} active={route().current('admin.initiatives.*')} icon="🗳️">المبادرات</SidebarLink>
                    <SidebarLink href={route('admin.lost-found.index')} active={route().current('admin.lost-found.*')} icon="🔍">المفقودات</SidebarLink>
                    <SidebarLink href={route('admin.books.index')} active={route().current('admin.books.*')} icon="📚">المكتبة</SidebarLink>

                    <p className="px-3 text-xs font-bold text-slate-500 uppercase mb-2 mt-6">الذكاء الاصطناعي</p>
                    <SidebarLink href={route('admin.ai-studies.index')} active={route().current('admin.ai-studies.*')} icon="🤖">إدارة الدراسات</SidebarLink>

                    <p className="px-3 text-xs font-bold text-slate-500 uppercase mb-2 mt-6">الإعدادات</p>
                    <SidebarLink href={route('profile.edit')} active={route().current('profile.edit')} icon="⚙️">الملف الشخصي</SidebarLink>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs">{user.name.charAt(0)}</div>
                        <div>
                            <div className="text-sm font-bold">{user.name}</div>
                            <div className="text-xs text-slate-500">مشرف النظام</div>
                        </div>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full text-center py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold transition"
                    >
                        تسجيل الخروج
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:mr-64 min-h-screen flex flex-col">
                {/* Top Header */}
                <header className="bg-white shadow h-16 flex items-center justify-between px-6 lg:px-8 z-10 sticky top-0">
                    <div className="font-bold text-xl text-slate-800">
                        {header}
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-sm text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1">
                            <span>🏠</span> العودة للموقع
                        </Link>
                    </div>
                </header>

                <div className="flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}

function SidebarLink({ href, active, icon, children }: { href: string, active: boolean, icon: string, children: ReactNode }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-bold ${active
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
        >
            <span className="text-lg">{icon}</span>
            <span>{children}</span>
        </Link>
    );
}
