import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

interface MissingItem {
    id: number;
    title: string;
    category: string;
    status: 'unknown' | 'estimate' | 'outdated';
    confidence: number;
    last_updated: string | null;
    description: string;
    impact: string;
}

interface Props {
    items: MissingItem[];
}

export default function MissingData({ items }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-black leading-tight text-slate-900">
                    🏳️ سجل الفجوات المعلوماتية
                </h2>
            }
        >
            <Head title="ما لا نعرفه - مجتمع داريا" />

            <div className="min-h-screen bg-slate-50 py-12 font-sans" dir="rtl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Premium Intro Banner */}
                    <div className="relative mb-12 overflow-hidden rounded-[2.5rem] bg-slate-900 px-8 py-12 text-white shadow-2xl">
                        {/* Abstract Background Shapes */}
                        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-600/20 blur-[100px]"></div>
                        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-teal-500/10 blur-[120px]"></div>

                        <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
                            <div>
                                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                    </span>
                                    تقرير الشفافية الرقمية
                                </div>
                                <h1 className="mb-6 text-4xl font-black leading-tight md:text-5xl">
                                    الاعتراف بالنقص.. <br />
                                    <span className="text-emerald-400">
                                        أول خطوة للبناء.
                                    </span>
                                </h1>
                                <p className="max-w-xl text-lg leading-relaxed text-slate-400">
                                    لكي نبني داريا المستقبل بدقة، يجب أن نحدد
                                    بوضوح ما ينقصنا اليوم من بيانات. هذه المساحة
                                    مخصصة لرصد "المناطق العمياء" التي نعمل على
                                    ملئها بالتعاون مع المجتمع والخبراء.
                                </p>
                            </div>
                            <div className="hidden justify-end lg:flex">
                                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-inner backdrop-blur-xl">
                                    <div className="mb-2 text-5xl font-black text-white">
                                        {items.length}
                                    </div>
                                    <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
                                        نقطة بيانات مفقودة أو غير دقيقة
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Summary */}
                    <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                        {[
                            {
                                label: 'بيانات غائبة تماماً',
                                count: items.filter(
                                    (i) => i.status === 'unknown',
                                ).length,
                                color: 'emerald',
                                icon: '🔴',
                                desc: 'تتطلب مسحاً ميدانياً فورياً',
                            },
                            {
                                label: 'بيانات قديمة جداً',
                                count: items.filter(
                                    (i) => i.status === 'outdated',
                                ).length,
                                color: 'teal',
                                icon: '🟠',
                                desc: 'تحتاج لتحديث السجلات الحالية',
                            },
                            {
                                label: 'تقديرات تقريبية',
                                count: items.filter(
                                    (i) => i.status === 'estimate',
                                ).length,
                                color: 'slate',
                                icon: '🟡',
                                desc: 'بانتظار التوثيق الرسمي النهائي',
                            },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="group flex flex-col gap-4 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-2xl drop-shadow-sm transition-transform group-hover:scale-110">
                                        {stat.icon}
                                    </div>
                                    <span
                                        className={`text-3xl font-black text-slate-900`}
                                    >
                                        {stat.count}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">
                                        {stat.label}
                                    </h3>
                                    <p className="mt-1 text-xs text-slate-400">
                                        {stat.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="group rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
                            >
                                <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row">
                                    <div className="flex-1">
                                        <div className="mb-4 flex flex-wrap items-center gap-2">
                                            <span
                                                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                                    item.status === 'unknown'
                                                        ? 'bg-slate-900 text-white'
                                                        : item.status ===
                                                            'outdated'
                                                          ? 'bg-slate-100 text-slate-600'
                                                          : 'bg-emerald-50 text-emerald-700'
                                                }`}
                                            >
                                                {item.status === 'unknown' &&
                                                    'مفقود كلياً'}
                                                {item.status === 'outdated' &&
                                                    'سجل قديم'}
                                                {item.status === 'estimate' &&
                                                    'تقدير حالي'}
                                            </span>
                                            <div className="flex items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-[10px] font-bold text-slate-400">
                                                <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                                                {item.last_updated
                                                    ? `آخر تحديث: ${item.last_updated}`
                                                    : 'لم يتم التحديث'}
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-black leading-tight text-slate-900 transition-colors group-hover:text-emerald-700">
                                            {item.title}
                                        </h3>
                                    </div>
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-3xl shadow-sm transition-colors group-hover:border-emerald-100 group-hover:bg-emerald-50">
                                        {item.category === 'demographics' &&
                                            '👥'}
                                        {item.category === 'water' && '💧'}
                                        {item.category === 'infrastructure' &&
                                            '🏗️'}
                                        {item.category === 'housing' && '🏠'}
                                        {item.category === 'electricity' &&
                                            '⚡'}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="rounded-2xl border border-slate-100/50 bg-slate-50/50 p-5 text-sm italic leading-loose text-slate-600">
                                        "{item.description}"
                                    </div>

                                    <div>
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                                مستوى الموثوقية المعلوماتية
                                            </span>
                                            <span
                                                className={`text-sm font-black ${
                                                    item.confidence < 30
                                                        ? 'text-slate-900'
                                                        : item.confidence < 70
                                                          ? 'text-emerald-600'
                                                          : 'text-emerald-700'
                                                }`}
                                            >
                                                {item.confidence}%
                                            </span>
                                        </div>
                                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${
                                                    item.confidence < 30
                                                        ? 'bg-slate-900'
                                                        : item.confidence < 70
                                                          ? 'bg-emerald-500'
                                                          : 'bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                                                }`}
                                                style={{
                                                    width: `${item.confidence}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                                        <span className="text-xl">🛑</span>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                                                أثر نقص البيانات
                                            </p>
                                            <p className="text-xs font-bold leading-relaxed text-amber-900/80">
                                                {item.impact}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Collaboration CTA */}
                    <div className="mt-20 rounded-[3rem] border border-emerald-100 bg-emerald-50 p-12 text-center">
                        <h2 className="mb-4 text-2xl font-black text-emerald-900">
                            هل تمتلك معلومات أدق؟
                        </h2>
                        <p className="mx-auto mb-8 max-w-xl font-medium text-emerald-700/70">
                            إذا كنت تمتلك وثائق تاريخية، مسودات مخططات، أو
                            دراسات علمية تخص هذه الفجوات، يرجى المساهمة معنا في
                            توثيق الحقيقة.
                        </p>
                        <button className="rounded-2xl bg-emerald-600 px-10 py-4 font-black text-white shadow-xl shadow-emerald-200 transition-all hover:scale-105 hover:bg-emerald-700">
                            شاركنا بياناتك الموثقة
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
