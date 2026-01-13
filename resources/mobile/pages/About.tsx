import { useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, Github, Twitter, Info } from 'lucide-react';

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl">
            <header className="px-4 py-5 flex items-center gap-3 sticky top-0 z-30 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                    <ArrowRight size={20} />
                </button>
                <h1 className="text-xl font-black text-slate-800 dark:text-slate-100">عن التطبيق</h1>
            </header>

            <main className="px-4 py-8 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-3xl shadow-premium border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-6">
                    <img src="/logo.png" alt="Darayya Logo" className="w-16 h-16 object-contain" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/64'} />
                </div>

                <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">داريا</h2>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
                    منصة مجتمعية متكاملة لخدمة أهالي مدينة داريا، تجمع الخدمات والأخبار والتواصل في مكان واحد.
                </p>

                <div className="w-full max-w-sm space-y-4">
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm text-right">
                        <div className="flex items-center gap-3 mb-2">
                            <Info size={20} className="text-indigo-500" />
                            <h3 className="font-bold text-slate-800 dark:text-slate-200">الإصدار الحالي</h3>
                        </div>
                        <p className="text-slate-500 text-sm">v1.0.0 (Beta)</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm text-right">
                        <div className="flex items-center gap-3 mb-2">
                            <Heart size={20} className="text-red-500" />
                            <h3 className="font-bold text-slate-800 dark:text-slate-200">فريق العمل</h3>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            تم تطوير هذا العمل بجهود تطوعية من أبناء المدينة لخدمة المجتمع المحلي.
                        </p>
                    </div>
                </div>

                <div className="mt-12 flex gap-4">
                    <a href="#" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                        <Github size={20} />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                        <Twitter size={20} />
                    </a>
                </div>

                <div className="mt-8 text-[10px] text-slate-400">
                    &copy; 2026 جميع الحقوق محفوظة
                </div>
            </main>
        </div>
    );
}
