import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogIn } from 'lucide-react';
import { useTheme } from '../../components/ThemeContext';

interface HomeHeaderProps {
    user: any;
    unreadCount: number;
}

export default function HomeHeader({ user, unreadCount }: HomeHeaderProps) {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-40 px-4 py-3 shadow-md transition-colors duration-300">
            <div className="flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3 active:scale-95 transition-transform">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-premium">
                        د
                    </div>
                    <div>
                        <span className="text-lg font-bold text-slate-900 dark:text-slate-100 block leading-tight">مجتمع داريا</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full inline-block border border-emerald-100 dark:border-emerald-800/50">نسخة تجريبية beta</span>
                    </div>
                </Link>

                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="w-10 h-10 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl flex items-center justify-center shadow-card hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all"
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>

                    {/* Duty Pharmacies */}
                    <button className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center hover:bg-rose-100 dark:hover:bg-rose-900/40 active:scale-95 transition-all border border-rose-100 dark:border-rose-800/50 shadow-card">
                        <span className="text-lg">💊</span>
                    </button>

                    <button
                        onClick={() => navigate('/notifications')}
                        className="w-10 h-10 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 active:scale-95 transition-all border border-slate-200 dark:border-slate-800 relative shadow-card"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"></span>
                        )}
                    </button>

                    {user ? (
                        <button onClick={() => navigate('/profile')} className="w-10 h-10 bg-emerald-100 rounded-xl border-2 border-emerald-200 flex items-center justify-center font-bold text-emerald-700 text-sm active:scale-95 transition-transform shadow-card">
                            {user.name.charAt(0)}
                        </button>
                    ) : (
                        <Link to="/login" className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl shadow-premium active:scale-95 transition-transform flex items-center gap-2">
                            <LogIn size={14} />
                            <span>دخول</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
