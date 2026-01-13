import { useNavigate } from 'react-router-dom';
import { ArrowRight, Moon, Sun, Bell, Globe, ChevronLeft, Shield, Smartphone } from 'lucide-react';
import { useTheme } from '../components/ThemeContext';
import { useState } from 'react';

export default function Settings() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [notifications, setNotifications] = useState(true);

    const SettingItem = ({ icon: Icon, title, subtitle, action, value }: any) => (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm active:scale-[0.98] transition-all cursor-pointer" onClick={action}>
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                    <Icon size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{title}</h3>
                    {subtitle && <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
                </div>
            </div>
            <div className="flex items-center gap-2">
                {value}
            </div>
        </div>
    );

    const Toggle = ({ checked, onChange }: any) => (
        <div
            className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 flex items-center ${checked ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}
            onClick={(e) => { e.stopPropagation(); onChange(); }}
        >
            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${checked ? '-translate-x-5' : 'translate-x-0'}`} />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl">
            <header className="px-4 py-5 flex items-center gap-3 sticky top-0 z-30 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                    <ArrowRight size={20} />
                </button>
                <h1 className="text-xl font-black text-slate-800 dark:text-slate-100">الإعدادات</h1>
            </header>

            <main className="px-4 space-y-6">
                <section className="space-y-3">
                    <h2 className="px-1 text-xs font-black text-slate-400 uppercase tracking-wider">التطبيق</h2>
                    <SettingItem
                        icon={theme === 'dark' ? Moon : Sun}
                        title="الوضع الليلي"
                        subtitle={theme === 'dark' ? 'مفعل' : 'معطل'}
                        action={toggleTheme}
                        value={<Toggle checked={theme === 'dark'} onChange={toggleTheme} />}
                    />
                    <SettingItem
                        icon={Globe}
                        title="اللغة"
                        subtitle="العربية (سوريا)"
                        action={() => { }}
                        value={<span className="text-xs font-bold text-slate-500">تغيير</span>}
                    />
                    <SettingItem
                        icon={Bell}
                        title="الإشعارات"
                        subtitle="تنبيهات الأخبار والخدمات"
                        action={() => setNotifications(!notifications)}
                        value={<Toggle checked={notifications} onChange={() => setNotifications(!notifications)} />}
                    />
                </section>

                <section className="space-y-3">
                    <h2 className="px-1 text-xs font-black text-slate-400 uppercase tracking-wider">الحساب والأمان</h2>
                    <SettingItem
                        icon={Shield}
                        title="الخصوصية والأمان"
                        subtitle="كلمة المرور، البيانات"
                        action={() => { }}
                        value={<ChevronLeft size={16} className="text-slate-400" />}
                    />
                    <SettingItem
                        icon={Smartphone}
                        title="الأجهزة المتصلة"
                        subtitle="إدارة الجلسات النشطة"
                        action={() => { }}
                        value={<ChevronLeft size={16} className="text-slate-400" />}
                    />
                </section>

                <div className="pt-6 text-center">
                    <p className="text-xs font-medium text-slate-400">Darayya App v1.0.0</p>
                    <p className="text-[10px] text-slate-300 mt-1">Designed with ❤️ for Darayya</p>
                </div>
            </main>
        </div>
    );
}
