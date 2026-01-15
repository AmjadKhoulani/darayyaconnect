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
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/98 backdrop-blur-xl border-t border-slate-200/60 dark:border-slate-800/60 flex justify-around items-center z-[100] shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] safe-bottom transition-all duration-300">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => HapticService.lightImpact()}
                        className={`flex flex-col items-center justify-center w-full h-16 transition-all relative ${isActive ? 'text-emerald-600' : 'text-slate-400'
                            }`}
                    >
                        <span className={`mb-1 transition-transform ${isActive ? 'scale-110 -translate-y-0.5' : ''}`}>
                            {item.icon}
                        </span>
                        <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                            {item.label}
                        </span>

                        {/* Active Indicator */}
                        {isActive && (
                            <div className="absolute bottom-0 w-12 h-1 bg-emerald-600 rounded-t-full shadow-[0_-2px_6px_rgba(5,150,105,0.3)]" />
                        )}
                    </NavLink>
                );
            })}
        </div>
    );
}
