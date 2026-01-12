import { NavLink, useLocation } from 'react-router-dom';
import { Home, Globe, MessageCircle, Users, User } from 'lucide-react';

export default function BottomNav() {
    const location = useLocation();

    const navItems = [
        { path: '/', icon: <Home size={22} />, label: 'الرئيسية' },
        { path: '/studies', icon: <Globe size={22} />, label: 'الدراسات' },
        { path: '/discussions', icon: <MessageCircle size={22} />, label: 'المنتدى' },
        { path: '/initiatives', icon: <Users size={22} />, label: 'مبادرات' },
        { path: '/profile', icon: <User size={22} />, label: 'حسابي' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200/60 flex justify-around items-center z-50 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)] safe-bottom">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center justify-center w-full h-16 transition-colors relative ${isActive ? 'text-emerald-600' : 'text-slate-400'
                            }`}
                    >
                        <span className={`mb-1 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                            {item.icon}
                        </span>
                        <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                            {item.label}
                        </span>

                        {/* Active Indicator */}
                        {isActive && (
                            <div className="absolute bottom-0 w-12 h-1 bg-emerald-600 rounded-t-full shadow-[0_-2px_6px_rgba(5,150,105,0.3)]"></div>
                        )}
                    </NavLink>
                );
            })}
        </div>
    );
}
