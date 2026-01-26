import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield } from 'lucide-react';
import { useTheme } from '../components/ThemeContext';

export default function PrivacyPolicyMobile() {
    const navigate = useNavigate();
    const { theme } = useTheme();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300" dir="rtl">
            {/* Header */}
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 py-4 shadow-sm flex items-center gap-3 transition-colors duration-300">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-800"
                >
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">سياسة الخصوصية</h1>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium opacity-80">كيف نحمي بياناتك</p>
                </div>
            </header>

            <main className="px-5 py-6">
                <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 border border-slate-200 dark:border-slate-700 shadow-premium animate-fade-in-up transition-colors duration-300">
                    <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 mx-auto border border-emerald-100 dark:border-emerald-800/50">
                        <Shield size={32} />
                    </div>

                    <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                        <section>
                            <h2 className="mb-3 text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                مقدمة
                            </h2>
                            <p className="opacity-90">
                                مرحبًا بكم في تطبيق "داريا الرقمية". نحن نولي أهمية قصوى لخصوصية مستخدمينا. توضح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك الشخصية.
                            </p>
                        </section>

                        <div className="w-full h-px bg-slate-100 dark:bg-slate-700 my-4"></div>

                        <section>
                            <h2 className="mb-3 text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                المعلومات التي نجمعها
                            </h2>
                            <ul className="space-y-3 opacity-90">
                                <li className="flex gap-2 items-start">
                                    <span className="text-emerald-500 mt-1.5 text-[10px]">●</span>
                                    <span><strong>المعلومات الشخصية:</strong> مثل الاسم ورقم الهاتف للتحقق من الهوية.</span>
                                </li>
                                <li className="flex gap-2 items-start">
                                    <span className="text-emerald-500 mt-1.5 text-[10px]">●</span>
                                    <span><strong>الموقع الجغرافي:</strong> لتقديم خدمات تعتمد على الموقع مثل البلاغات.</span>
                                </li>
                                <li className="flex gap-2 items-start">
                                    <span className="text-emerald-500 mt-1.5 text-[10px]">●</span>
                                    <span><strong>بيانات الاستخدام:</strong> لتحسين تجربة المستخدم وأداء التطبيق.</span>
                                </li>
                            </ul>
                        </section>

                        <div className="w-full h-px bg-slate-100 dark:bg-slate-700 my-4"></div>

                        <section>
                            <h2 className="mb-3 text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                كيف نستخدم معلوماتك
                            </h2>
                            <ul className="space-y-3 opacity-90">
                                <li className="flex gap-2 items-start">
                                    <span className="text-emerald-500 mt-1.5 text-[10px]">●</span>
                                    <span>تقديم الخدمات الأساسية وصيانتها.</span>
                                </li>
                                <li className="flex gap-2 items-start">
                                    <span className="text-emerald-500 mt-1.5 text-[10px]">●</span>
                                    <span>تحسين وتخصيص تجربتك.</span>
                                </li>
                                <li className="flex gap-2 items-start">
                                    <span className="text-emerald-500 mt-1.5 text-[10px]">●</span>
                                    <span>ضمان أمان وسلامة المنصة.</span>
                                </li>
                            </ul>
                        </section>

                        <div className="w-full h-px bg-slate-100 dark:bg-slate-700 my-4"></div>

                        <section>
                            <h2 className="mb-3 text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                مشاركة المعلومات
                            </h2>
                            <p className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/30 text-amber-800 dark:text-amber-200 font-medium text-xs mb-2">
                                نحن لا نقوم ببيع بياناتك الشخصية لأطراف ثالثة.
                            </p>
                            <p className="opacity-90">
                                قد نشارك المعلومات فقط مع الجهات الرسمية لمعالجة طلبات الخدمة أو الامتثال للقوانين.
                            </p>
                        </section>

                        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700 text-center">
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                                آخر تحديث: 24 يناير 2026
                            </p>
                            <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-1">
                                منصة الإدارة المحلية الذكية &copy; 2026
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
