import { Head, Link } from '@inertiajs/react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900" dir="rtl">
            <Head title="سياسة الخصوصية" />

            {/* Navbar */}
            <nav className="fixed top-0 z-50 h-16 w-full border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-md">
                <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 text-xl font-black text-white shadow-lg shadow-emerald-900/10">
                                D
                            </div>
                            <div className="hidden md:block">
                                <h1 className="text-lg font-bold leading-tight text-slate-900">
                                    داريا{' '}
                                    <span className="text-emerald-600">الرقمية</span>
                                </h1>
                            </div>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-4xl px-4 py-24">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
                    <h1 className="mb-8 text-3xl font-black text-slate-900">سياسة الخصوصية</h1>
                    
                    <div className="space-y-8 text-slate-700 leading-relaxed">
                        <section>
                            <h2 className="mb-3 text-xl font-bold text-slate-900">مقدمة</h2>
                            <p>
                                مرحبًا بكم في تطبيق وموقع "داريا الرقمية - Darayya Connect". نحن نولي أهمية قصوى لخصوصية مستخدمينا. توضح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك الشخصية عند استخدامك لخدماتنا.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-xl font-bold text-slate-900">المعلومات التي نجمعها</h2>
                            <ul className="list-disc pr-5 space-y-2">
                                <li><strong>المعلومات الشخصية:</strong> عند التسجيل، قد نطلب معلومات مثل الاسم، رقم الهاتف، والبريد الإلكتروني للتحقق من الهوية وتمكين الوصول للخدمات.</li>
                                <li><strong>معلومات الموقع الجغرافي:</strong> قد يطلب التطبيق الوصول إلى موقعك الحالي لتقديم خدمات تعتمد على الموقع، مثل الإبلاغ عن مشاكل البنية التحتية أو تحديد أقرب صيدلية مناوبة.</li>
                                <li><strong>بيانات الاستخدام:</strong> نقوم بجمع بيانات حول كيفية استخدامك للتطبيق لتحسين خدماتنا وتجربة المستخدم.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-3 text-xl font-bold text-slate-900">كيف نستخدم معلوماتك</h2>
                            <p>نستخدم المعلومات التي نجمعها للأغراض التالية:</p>
                            <ul className="list-disc pr-5 space-y-2 mt-2">
                                <li>تقديم الخدمات الأساسية للتطبيق وصيانتها.</li>
                                <li>تحسين وتخصيص تجربتك كمستخدم.</li>
                                <li>التواصل معك بخصوص التحديثات، التنبيهات، أو الرد على استفساراتك.</li>
                                <li>ضمان أمان وسلامة المنصة والمستخدمين.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-3 text-xl font-bold text-slate-900">مشاركة المعلومات</h2>
                            <p>
                                نحن لا نقوم ببيع أو تأجير بياناتك الشخصية لأطراف ثالثة. قد نشارك المعلومات فقط في الحالات التالية:
                            </p>
                            <ul className="list-disc pr-5 space-y-2 mt-2">
                                <li>مع الجهات الرسمية أو الخدمية عندما يكون ذلك ضروريًا لمعالجة طلب خدمة قمت بتقديمه (مثل شكاوى الخدمات).</li>
                                <li>الامتثال للقوانين واللوائح المعمول بها.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-3 text-xl font-bold text-slate-900">أمن البيانات</h2>
                            <p>
                                نحن نتخذ إجراءات أمنية تقنية وتنظيمية مناسبة لحماية بياناتك من الوصول غير المصرح به أو التغيير أو الإفصاح أو الإتلاف.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-xl font-bold text-slate-900">تعديلات على سياسة الخصوصية</h2>
                            <p>
                                قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإعلامك بأي تغييرات جوهرية عبر التطبيق أو البريد الإلكتروني.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-xl font-bold text-slate-900">اتصل بنا</h2>
                            <p>
                                إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى التواصل معنا عبر القنوات الرسمية المتاحة في التطبيق.
                            </p>
                        </section>

                        <div className="mt-8 border-t border-slate-100 pt-8 text-sm text-slate-500">
                            آخر تحديث: 24 يناير 2026
                        </div>
                    </div>
                </div>
            </main>

            <footer className="mt-12 border-t border-slate-200 bg-white py-8 text-center">
                <p className="text-xs font-medium text-slate-500">
                    منصة الإدارة المحلية الذكية &copy; 2026
                </p>
            </footer>
        </div>
    );
}
