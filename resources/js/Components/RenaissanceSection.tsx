import { useState } from 'react';
import GlobalExperienceModal from './GlobalExperienceModal';

interface RenaissanceSectionProps {
    compact?: boolean;
}

export default function RenaissanceSection({
    compact = false,
}: RenaissanceSectionProps) {
    const [selectedModel, setSelectedModel] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'inspire' | 'global'>('inspire');

    // التجارب العالمية
    const globalModels = [
        {
            country: '🇱🇧',
            city: 'زحلة',
            title: 'كهرباء 24/7',
            subtitle: 'إدارة محلية ناجحة',
            tag: 'طاقة',
            color: 'from-indigo-500 to-purple-600',
            accentColor: 'indigo',
            icon: '⚡',
            description:
                'كيف تمكنت مدينة لبنانية من تجاوز أزمة الكهرباء الوطنية وتحقيق اكتفاء ذاتي كامل.',
            details: {
                problem:
                    'انقطاع الكهرباء الحكومية لأكثر من 20 ساعة يومياً، واعتماد السكان على مولدات خاصة بتكلفة باهظة وتلوث عالٍ.',
                solution:
                    'تأسيس "شركة كهرباء زحلة" كامتياز محلي، قامت بجمع المولدات الكبيرة وتنظيم شبكة توزيع موحدة وتركيب عدادات ذكية.',
                impact: 'كهرباء متوفرة 24/24، فاتورة موحدة أقل كلفة بـ 40% من المولدات الفردية، واختفاء الضجيج والدخان من الأحياء.',
            },
        },
        {
            country: '🇷🇼',
            city: 'كيغالي',
            title: 'أنظف مدينة',
            subtitle: 'قوة العمل المجتمعي',
            tag: 'نظافة',
            color: 'from-rose-500 to-pink-600',
            accentColor: 'rose',
            icon: '✨',
            description:
                'عاصمة رواندا التي تحولت من ركام الحرب إلى أنظف مدينة في أفريقيا بفضل تقليد "أوموغاندا".',
            details: {
                problem:
                    'تراكم النفايات والركام بعد سنوات من الحرب الأهلية، ونقص حاد في ميزانية البلدية لتوظيف عمال نظافة.',
                solution:
                    'إحياء تقليد "أوموغاندا": في آخر سبت من كل شهر، يتوقف العمل والنقل لمدة 3 ساعات ليخرج جميع السكان (بمن فيهم الرئيس) لتنظيف حيّهم.',
                impact: 'مدينة خالية تماماً من البلاستيك (ممنوع قانوناً)، مجتمع متماسك، وشعور عالي بالملكية العامة لدى المواطنين.',
            },
        },
        {
            country: '🇯🇵',
            city: 'كاميكاتسو',
            title: 'صفر نفايات',
            subtitle: 'نموذج بيئي مستدام',
            tag: 'بيئة',
            color: 'from-emerald-500 to-teal-600',
            accentColor: 'emerald',
            icon: '♻️',
            description:
                'القرية التي قررت الاستغناء عن "سيارة القمامة" والمحارق تماماً.',
            details: {
                problem:
                    'التكلفة العالية لحرق النفايات وتأثيرها البيئي السيء على الطبيعة الخلابة للقرية.',
                solution:
                    'إلغاء الحاويات العامة. السكان يغسلون ويفرزون نفاياتهم في المنزل إلى 45 فئة (ورق، ألمنيوم، زجاج، إلخ) ويسلمونها لمركز التدوير بأنفسهم.',
                impact: 'نسبة تدوير تجاوزت 80%، توفير ميزانية البلدية واستثمارها في السياحة البيئية التي جذبت آلاف الزوار.',
            },
        },
        {
            country: '🇨🇴',
            city: 'ميديلين',
            title: 'العمران الاجتماعي',
            subtitle: 'من الأخطر للأكثر ابتكاراً',
            tag: 'تنمية',
            color: 'from-amber-500 to-orange-600',
            accentColor: 'amber',
            icon: '🏗️',
            description:
                'كيف تحولت "أخطر مدينة في العالم" إلى أكثر المدن ابتكاراً عبر العمارة.',
            details: {
                problem:
                    'عزلة أحياء الفقراء العشوائية "في الجبال" عن مركز المدينة، مما عزز الجريمة والفقر.',
                solution:
                    'بناء "أجمل المباني لأفقر الناس": مكتبات فخمة، حدائق، وتلفريك (Metrocable) يربط الأحياء الفقيرة بقلب المدينة الاقتصادي.',
                impact: 'كسر العزلة الجغرافية والاجتماعية، انخفاض معدلات الجريمة، وتحول الأحياء الفقيرة إلى وجهات سياحية وثقافية.',
            },
        },
        {
            country: '🇧🇷',
            city: 'كوريتيبا',
            title: 'النقل الذكي',
            subtitle: 'مترو بدون أنفاق',
            tag: 'نقل',
            color: 'from-blue-500 to-cyan-600',
            accentColor: 'blue',
            icon: '🚌',
            description:
                'ابتكار نظام "مترو الأنفاق" لكن باستخدام حافلات رخيصة.',
            details: {
                problem:
                    'ازدحام مروري خانق وعدم قدرة المدينة على تحمل تكلفة حفر أنفاق للمترو.',
                solution:
                    'تخصيص مسارات معزولة للحافلات فقط، وبناء محطات أنبوبية يدفع فيها الراكب التذكرة قبل الدخول (مثل المترو) لتسريع الصعود.',
                impact: 'نقل 2 مليون راكب يومياً بتكلفة 1/50 من تكلفة المترو، وأصبح النموذج المعتمد عالمياً للنقل الذكي.',
            },
        },
        {
            country: '🇳🇿',
            city: 'كرايستشيرش',
            title: 'الإعمار المؤقت',
            subtitle: 'حياة فورية من الركام',
            tag: 'إعمار',
            color: 'from-orange-500 to-red-600',
            accentColor: 'orange',
            icon: '🏛️',
            description: 'تحويل الأماكن المدمرة والركام إلى مساحات حياة فورية.',
            details: {
                problem:
                    'دمار واسع بعد الزلزال، وترك مساحات فارغة وكئيبة في وسط المدينة لسنوات بانتظار إعادة الإعمار الرسمية.',
                solution:
                    'مبادرة "Gap Filler": المواطنون يمولون وينفذون مشاريع مؤقتة (ملاعب، سينما، حدائق) باستخدام مواد معاد تدويرها في الأراضي الفارغة.',
                impact: 'إعادة الحياة للمدينة فوراً دون انتظار الحكومات، وتعزيز الروح المعنوية للسكان والمشاركة المجتمعية.',
            },
        },
    ];

    // محتوى النهضة والإلهام
    const inspirationContent = [
        {
            id: 1,
            icon: '🌟',
            title: 'رحلة النهضة',
            subtitle: 'من التحدي إلى الفرصة',
            gradient: 'from-violet-500 to-purple-600',
            content:
                'كل مدينة عظيمة بدأت بخطوة واحدة. داريا اليوم ليست النهاية، بل البداية. نحن نبني مستقبلنا معاً.',
            stats: { label: 'يوم بعد يوم', value: '📈' },
        },
        {
            id: 2,
            icon: '🤝',
            title: 'قوة المجتمع',
            subtitle: 'معاً أقوى',
            gradient: 'from-emerald-500 to-green-600',
            content:
                'التغيير الحقيقي لا يأتي من الأعلى فقط، بل من كل مواطن يساهم. مشاركتك اليوم هي استثمار في غدنا.',
            stats: { label: 'صوت واحد، تأثير كبير', value: '💪' },
        },
        {
            id: 3,
            icon: '💡',
            title: 'الابتكار المحلي',
            subtitle: 'حلول بسيطة، أثر عظيم',
            gradient: 'from-amber-500 to-yellow-600',
            content:
                'أعظم الحلول تبدأ بأبسط الأفكار. لا نحتاج لتقنيات معقدة، نحتاج لإرادة صادقة وتعاون حقيقي.',
            stats: { label: 'ابتكر وشارك', value: '🚀' },
        },
        {
            id: 4,
            icon: '🏛️',
            title: 'إرث للأجيال',
            subtitle: 'نبني اليوم لأطفالنا',
            gradient: 'from-blue-500 to-indigo-600',
            content:
                'كل إنجاز صغير اليوم هو حجر أساس في صرح المستقبل. نحن لا نعمل لأنفسنا فقط، بل للأبناء والأحفاد.',
            stats: { label: 'للمستقبل', value: '🌱' },
        },
    ];

    if (compact) {
        return (
            <>
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-xl">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 blur-3xl"></div>
                    </div>

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="mb-1 flex items-center gap-2 text-2xl font-black text-white">
                                    <span className="text-3xl">🌍</span> النهضة
                                    والتجارب العالمية
                                </h2>
                                <p className="text-sm text-slate-300">
                                    تعلّم من الأفضل، وكن جزءاً من التغيير
                                </p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="mb-6 flex gap-2">
                            <button
                                onClick={() => setActiveTab('inspire')}
                                className={`flex-1 rounded-xl px-4 py-2.5 font-bold transition-all ${
                                    activeTab === 'inspire'
                                        ? 'bg-white text-slate-900 shadow-lg'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                            >
                                <span className="mr-2">🌟</span>
                                الإلهام والنهضة
                            </button>
                            <button
                                onClick={() => setActiveTab('global')}
                                className={`flex-1 rounded-xl px-4 py-2.5 font-bold transition-all ${
                                    activeTab === 'global'
                                        ? 'bg-white text-slate-900 shadow-lg'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                            >
                                <span className="mr-2">🌏</span>
                                تجارب عالمية
                            </button>
                        </div>

                        {/* Content */}
                        {activeTab === 'inspire' ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {inspirationContent.map((item) => (
                                    <div
                                        key={item.id}
                                        className="group rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm transition-all hover:bg-white/15"
                                    >
                                        <div className="mb-3 flex items-start gap-3">
                                            <div
                                                className={`h-12 w-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-2xl shadow-lg transition-transform group-hover:scale-110`}
                                            >
                                                {item.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-black text-white">
                                                    {item.title}
                                                </h3>
                                                <p className="text-xs text-slate-300">
                                                    {item.subtitle}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="mb-3 text-sm leading-relaxed text-slate-200">
                                            {item.content}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-2xl">
                                                {item.stats.value}
                                            </span>
                                            <span className="font-medium text-slate-300">
                                                {item.stats.label}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {globalModels.map((model, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedModel(model)}
                                        className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-5 text-right backdrop-blur-sm transition-all hover:bg-white/15"
                                    >
                                        {/* Gradient Accent */}
                                        <div
                                            className={`absolute left-0 right-0 top-0 h-1 bg-gradient-to-r ${model.color}`}
                                        ></div>

                                        <div className="relative z-10">
                                            <div className="mb-3 flex items-start gap-3">
                                                <div className="text-3xl transition-transform group-hover:scale-110">
                                                    {model.country}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="mb-0.5 text-base font-black text-white">
                                                        {model.city}
                                                    </h3>
                                                    <p className="text-xs font-medium text-slate-300">
                                                        {model.title}
                                                    </p>
                                                </div>
                                                <div className="text-2xl opacity-50 transition-opacity group-hover:opacity-100">
                                                    {model.icon}
                                                </div>
                                            </div>
                                            <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-slate-300">
                                                {model.subtitle}
                                            </p>
                                            <span
                                                className={`inline-block rounded-lg bg-gradient-to-r px-2 py-1 text-[10px] font-bold ${model.color} text-white`}
                                            >
                                                {model.tag}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <GlobalExperienceModal
                    isOpen={!!selectedModel}
                    onClose={() => setSelectedModel(null)}
                    model={selectedModel}
                />
            </>
        );
    }

    // Full version (for dedicated pages)
    return (
        <div className="space-y-6">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 shadow-2xl">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute left-0 top-0 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-purple-400 to-pink-500 blur-3xl delay-1000"></div>
                </div>

                <div className="relative z-10 mx-auto max-w-3xl text-center">
                    <h1 className="mb-4 text-4xl font-black text-white md:text-5xl">
                        🌟 رحلة النهضة تبدأ من هنا
                    </h1>
                    <p className="text-xl leading-relaxed text-slate-200">
                        استلهم من قصص النجاح العالمية، وكن جزءاً من بناء داريا
                        الجديدة
                    </p>
                </div>
            </div>

            {/* Rest of full content... */}
        </div>
    );
}
