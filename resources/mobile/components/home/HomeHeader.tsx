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

            <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-40 px-4 py-3 shadow-md transition-colors duration-300">
                <div className="flex justify-between items-center">
                    {user ? (
                        <Link to="/profile/edit" className="flex items-center gap-3 active:scale-95 transition-transform">
                            <Avatar user={user} size="md" className="shadow-premium" />
                            <div>
                                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block leading-tight">مرحباً, {user.name.split(' ')[0]}</span>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full inline-block border border-emerald-100 dark:border-emerald-800/50">مجتمع داريا</span>
                            </div>
                        </Link>
                    ) : (
                        <Link to="/" className="flex items-center gap-3 active:scale-95 transition-transform">
                            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-premium">
                                د
                            </div>
                            <div>
                                <span className="text-lg font-bold text-slate-900 dark:text-slate-100 block leading-tight">مجتمع داريا</span>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full inline-block border border-emerald-100 dark:border-emerald-800/50">نسخة تجريبية beta</span>
                            </div>
                        </Link>
                    )}

                    <div className="flex items-center gap-2">
                        {/* Emergency Button - Distinctive Style */}
                        <button
                            onClick={() => setIsEmergencyOpen(true)}
                            className="bg-rose-600 dark:bg-rose-600 text-white flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg shadow-rose-500/30 active:scale-95 transition-all text-sm font-bold border border-rose-400 group relative overflow-hidden"
                            title="طوارئ"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                            <AlertCircle size={20} className="animate-pulse" />
                            <span>طوارئ SOS</span>
                        </button>

                        <button
                            onClick={() => navigate('/my-reports')}
                            className="w-10 h-10 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 active:scale-95 transition-all border border-slate-200 dark:border-slate-800 shadow-card"
                            title="بلاغاتي"
                        >
                            <FileText size={20} />
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
                    </div>
                </div>
            </header>
        </>
    );
}
