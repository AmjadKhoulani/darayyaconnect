import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogIn, AlertCircle, User, FileText } from 'lucide-react';
import { useTheme } from '../../components/ThemeContext';
import EmergencyModal from '../EmergencyModal';
import Avatar from '../Avatar';

interface HomeHeaderProps {
    user: any;
    unreadCount: number;
}

export default function HomeHeader({ user, unreadCount }: HomeHeaderProps) {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

    return (
        <>
            <EmergencyModal isOpen={isEmergencyOpen} onClose={() => setIsEmergencyOpen(false)} />

            {/* Floating Header with Blur */}
            <header className="fixed top-0 left-0 right-0 z-50 px-4 py-2 pt-safe transition-all duration-300">
                <div className="mx-auto max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-sm rounded-full px-4 py-2 mt-2 flex justify-between items-center">
                    {user ? (
                        <Link to="/profile/edit" className="flex items-center gap-3 active:scale-95 transition-transform">
                            <Avatar user={user} size="sm" className="ring-2 ring-white dark:ring-slate-800 shadow-sm" />
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">مرحباً {user.name.split(' ')[0]}</span>
                                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">مجتمع داريا</span>
                            </div>
                        </Link>
                    ) : (
                        <Link to="/" className="flex items-center gap-2 active:scale-95 transition-transform">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                د
                            </div>
                            <span className="text-sm font-black text-slate-800 dark:text-slate-100">داريا</span>
                        </Link>
                    )}

                    <div className="flex items-center gap-2">
                        {/* SOS Button - Compact */}
                        <button
                            onClick={() => setIsEmergencyOpen(true)}
                            className="bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 w-8 h-8 rounded-full flex items-center justify-center border border-rose-100 dark:border-rose-800 active:scale-90 transition-all animate-pulse-slow"
                        >
                            <AlertCircle size={18} />
                        </button>

                        <button
                            onClick={() => navigate('/notifications')}
                            className="relative w-8 h-8 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-700 active:scale-90 transition-all"
                        >
                            <Bell size={18} />
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Spacer for fixed header */}
            <div className="h-24"></div>
        </>
    );
}
