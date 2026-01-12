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
            header={<h2 className="text-xl font-black leading-tight text-slate-900">🏳️ سجل الفجوات المعلوماتية</h2>}
        >
            <Head title="ما لا نعرفه - مجتمع داريا" />

            <div className="py-12 bg-slate-50 min-h-screen font-sans" dir="rtl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Premium Intro Banner */}
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 px-8 py-12 text-white shadow-2xl mb-12">
                        {/* Abstract Background Shapes */}
                        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-600/20 blur-[100px]"></div>
                        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-teal-500/10 blur-[120px]"></div>

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-6">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    تقرير الشفافية الرقمية
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                                    الاعتراف بالنقص.. <br />
                                    <span className="text-emerald-400">أول خطوة للبناء.</span>
                                </h1>
                                <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                                    لكي نبني داريا المستقبل بدقة، يجب أن نحدد بوضوح ما ينقصنا اليوم من بيانات.
                                    هذه المساحة مخصصة لرصد "المناطق العمياء" التي نعمل على ملئها بالتعاون مع المجتمع والخبراء.
                                </p>
                            </div>
                            <div className="hidden lg:flex justify-end">
                                <div className="p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-inner">
                                    <div className="text-5xl font-black text-white mb-2">{items.length}</div>
                                    <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">نقطة بيانات مفقودة أو غير دقيقة</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {[
                            { label: 'بيانات غائبة تماماً', count: items.filter(i => i.status === 'unknown').length, color: 'emerald', icon: '🔴', desc: 'تتطلب مسحاً ميدانياً فورياً' },
                            { label: 'بيانات قديمة جداً', count: items.filter(i => i.status === 'outdated').length, color: 'teal', icon: '🟠', desc: 'تحتاج لتحديث السجلات الحالية' },
                            { label: 'تقديرات تقريبية', count: items.filter(i => i.status === 'estimate').length, color: 'slate', icon: '🟡', desc: 'بانتظار التوثيق الرسمي النهائي' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-4 group hover:shadow-md transition-all">
                                <div className="flex justify-between items-center">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl drop-shadow-sm group-hover:scale-110 transition-transform">
                                        {stat.icon}
                                    </div>
                                    <span className={`text-3xl font-black text-slate-900`}>{stat.count}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{stat.label}</h3>
                                    <p className="text-xs text-slate-400 mt-1">{stat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {items.map(item => (
                            <div
                                key={item.id}
                                className="group bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:border-emerald-200 transition-all hover:shadow-xl hover:-translate-y-1"
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.status === 'unknown' ? 'bg-slate-900 text-white' :
                                                    item.status === 'outdated' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-700'
                                                }`}>
                                                {item.status === 'unknown' && 'مفقود كلياً'}
                                                {item.status === 'outdated' && 'سجل قديم'}
                                                {item.status === 'estimate' && 'تقدير حالي'}
                                            </span>
                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-[10px] text-slate-400 font-bold border border-slate-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                                {item.last_updated ? `آخر تحديث: ${item.last_updated}` : 'لم يتم التحديث'}
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                                            {item.title}
                                        </h3>
                                    </div>
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl shadow-sm group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
                                        {item.category === 'demographics' && '👥'}
                                        {item.category === 'water' && '💧'}
                                        {item.category === 'infrastructure' && '🏗️'}
                                        {item.category === 'housing' && '🏠'}
                                        {item.category === 'electricity' && '⚡'}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50 text-slate-600 text-sm leading-loose italic">
                                        "{item.description}"
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">مستوى الموثوقية المعلوماتية</span>
                                            <span className={`text-sm font-black ${item.confidence < 30 ? 'text-slate-900' :
                                                    item.confidence < 70 ? 'text-emerald-600' : 'text-emerald-700'
                                                }`}>{item.confidence}%</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${item.confidence < 30 ? 'bg-slate-900' :
                                                        item.confidence < 70 ? 'bg-emerald-500' : 'bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                                                    }`}
                                                style={{ width: `${item.confidence}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                        <span className="text-xl">🛑</span>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-amber-800 uppercase tracking-wider">أثر نقص البيانات</p>
                                            <p className="text-xs text-amber-900/80 leading-relaxed font-bold">{item.impact}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Collaboration CTA */}
                    <div className="mt-20 text-center bg-emerald-50 rounded-[3rem] p-12 border border-emerald-100">
                        <h2 className="text-2xl font-black text-emerald-900 mb-4">هل تمتلك معلومات أدق؟</h2>
                        <p className="text-emerald-700/70 mb-8 max-w-xl mx-auto font-medium">
                            إذا كنت تمتلك وثائق تاريخية، مسودات مخططات، أو دراسات علمية تخص هذه الفجوات، يرجى المساهمة معنا في توثيق الحقيقة.
                        </p>
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-emerald-200 transition-all hover:scale-105">
                            شاركنا بياناتك الموثقة
                        </button>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
