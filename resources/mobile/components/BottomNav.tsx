import { NavLink, useLocation } from 'react-router-dom';
import { Home, Globe, MessageCircle, Users, User } from 'lucide-react';
import { HapticService } from '../services/HapticService';

export default function BottomNav() {
    const location = useLocation();

    // Whitelist: Pages where we SHOULD show the Bottom Nav
    const showNavRoutes = [
        '/',
        '/news',
        '/discussions',
        '/notifications',
        '/profile',
        '/initiatives',
        '/awareness',
        '/studies'
    ];

    // Robust path matching: remove trailing slash and check start
    const currentPath = location.pathname.endsWith('/') && location.pathname.length > 1
        ? location.pathname.slice(0, -1)
        : location.pathname;

    const shouldShow = showNavRoutes.some(route =>
        currentPath === route ||
        (route !== '/' && currentPath.startsWith(route + '/'))
    );

    if (!shouldShow) {
        return null;
    }

    const navItems = [
        { path: '/', icon: <Home size={22} />, label: 'الرئيسية' },
        { path: '/studies', icon: <Globe size={22} />, label: 'الدراسات' },
        { path: '/discussions', icon: <MessageCircle size={22} />, label: 'المنتدى' },
        { path: '/initiatives', icon: <Users size={22} />, label: 'مبادرات' },
        { path: '/profile', icon: <User size={22} />, label: 'حسابي' },
    ];

    return (
        <div className="fixed bottom-4 left-4 right-4 h-[72px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-[24px] flex justify-around items-center z-[100] shadow-premium transition-all duration-300 overflow-hidden">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => HapticService.lightImpact()}
                        className={`flex-1 flex flex-col items-center justify-center h-full relative transition-all duration-300 group ${isActive ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                    >
                        {isActive && (
                            <div className="absolute top-0 w-12 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-b-full shadow-[0_4px_12px_rgba(52,211,153,0.4)] animate-in fade-in zoom-in-75 duration-300"></div>
                        )}

                        <div className={`transition-all duration-300 transform ${isActive ? 'scale-110 -translate-y-1' : 'group-active:scale-95'}`}>
                            {item.icon}
                        </div>

                        <span className={`text-[10px] font-bold mt-1 transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 hidden'}`}>
                            {item.label}
                        </span>
                    </NavLink>
                );
            })}
        </div>
    );
}
