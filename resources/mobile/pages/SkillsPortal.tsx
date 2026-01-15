import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight, Lightbulb, Zap, DollarSign, Globe,
    Smartphone, MessageSquare, Briefcase, Award,
    TrendingUp, Cpu, BatteryCharging, Target, X,
    AlertTriangle, CheckCircle, List, Layers, Star
} from 'lucide-react';

// Categories
const CATEGORIES = [
    { id: 'basics', title: 'بداية عملية', icon: Target, color: 'bg-emerald-600', desc: 'خطوات أولى بدون تعقيد' },
    { id: 'ai', title: 'أدوات المساعدة (AI)', icon: Cpu, color: 'bg-indigo-600', desc: 'استخدام الذكاء الاصطناعي كأداة' },
    { id: 'reality', title: 'إدارة الظروف', icon: BatteryCharging, color: 'bg-amber-600', desc: 'التعامل مع الكهرباء والنت' },
    { id: 'business', title: 'العمل والمال', icon: Briefcase, color: 'bg-slate-600', desc: 'التسعير والتعامل الجدي' },
];

interface ArticleSection {
    type: 'text' | 'list' | 'warning' | 'tip' | 'header';
    content?: string;
    items?: string[];
}

interface Article {
    id: number;
    icon: any;
    title: string;
    sections: ArticleSection[];
}

const CONTENT: Record<string, Article[]> = {
    basics: [
        {
            id: 1,
            icon: Target,
            title: "ابدأ بالمتاح، لا تنتظر الظرف المثالي",
            sections: [
                { type: 'text', content: "الانتظار لن يغير شيئاً. الكثير ينتظر 'لابتوب جديد' أو 'نت سريع' أو 'دورة احترافية'. الحقيقة أنك ستبقى مكانك." },
                { type: 'header', content: "ماذا تفعل الآن؟" },
                {
                    type: 'list', items: [
                        "ابدأ بمهام لا تتطلب خبرة: إدخال بيانات (Data Entry)، تفريغ صوتي، نسخ نصوص.",
                        "ابحث عن أي شخص يحتاج مساعدة في تنظيم ملفات أو جداول إكسل.",
                        "لا تفكر في 'المهنة' الآن، فكر في 'إنجاز مهمة مقابل مال'."
                    ]
                },
                { type: 'warning', content: "إياك أن تدفع مالاً لتبدأ العمل. أي موقع يطلب رسوم تسجيل هو غالباً نصب." }
            ]
        },
        {
            id: 4,
            icon: Globe,
            title: "المنصات العربية أسهل كبداية",
            sections: [
                { type: 'text', content: "المنافسة في Upwork و Freelancer شرسة جداً وتحتاج لغة قوية. لا تحرق نفسك هناك في البداية." },
                { type: 'header', content: "خطوات البدء:" },
                {
                    type: 'list', items: [
                        "سجل في (خمسات) للخدمات المصغرة أو (مستقل) للمشاريع.",
                        "أنشئ حساباً باسم حقيقي وصورة محترمة (مو صورة وردة أو لاعب كرة).",
                        "تصفح الخدمات المطلوبة وشوف شو فيك تعمل منها."
                    ]
                },
                { type: 'tip', content: "ارفع خدمة محددة جداً: 'سأكتب لك 10 تعليقات محفزة على إنستغرام بـ 5$' أفضل من 'أنا مسوق إلكتروني'." }
            ]
        },
        {
            id: 5,
            icon: MessageSquare,
            title: "اللغة أداة وليست عائقاً",
            sections: [
                { type: 'text', content: "لا تحتاج لتكون شكسبير. تحتاج فقط أن تفهم ما يريده العميل." },
                { type: 'header', content: "الحل العملي:" },
                {
                    type: 'list', items: [
                        "استخدم Google Translate لترجمة طلب العميل.",
                        "استخدم ChatGPT لكتابة ردك: قل له 'أعد صياغة هذا الرد ليكون احترافياً بالإنجليزية'.",
                        "تعلم المصطلحات الأساسية في مجالك فقط (مثل: Deadline, Revision, Brief)."
                    ]
                }
            ]
        },
        {
            id: 19,
            icon: Lightbulb,
            title: "تعلم بنفسك، لا أحد سيعلمك",
            sections: [
                { type: 'text', content: "زمن 'الدورات' انتهى. كل شيء موجود مجاناً." },
                { type: 'header', content: "كيف تتعلم مجاناً؟" },
                {
                    type: 'list', items: [
                        "حدد مهارة واحدة (مثلاً: تصميم بوست سوشيال ميديا).",
                        "ادخل يوتيوب واكتب: 'كورس كانفا للمبتدئين' أو 'Canva tutorial for beginners'.",
                        "طبق ما تراه فوراً. المشاهدة وحدها لا تكفي."
                    ]
                },
                { type: 'tip', content: "خصص ساعة واحدة يومياً للتعلم والتطبيق. بعد شهر ستكون سبقت 90% من الناس." }
            ]
        },
    ],
    ai: [
        {
            id: 3,
            icon: Lightbulb,
            title: "الذكاء الاصطناعي مجرد أداة",
            sections: [
                { type: 'text', content: "البعض يخاف أن يأخذ AI مكانه. الحقيقة: الشخص الذي يستخدم AI سيأخذ مكان الشخص الذي لا يستخدمه." },
                { type: 'header', content: "استخدامات عملية:" },
                {
                    type: 'list', items: [
                        "كتابة المسودات: اطلب منه هيكلية مقال أو أفكار إعلان.",
                        "التلخيص: ألصق له نصاً طويلاً واطلب الزبدة.",
                        "التصحيح: اطلب منه مراجعة إيميلك قبل إرساله."
                    ]
                },
                { type: 'warning', content: "لا تنسخ وتلصق مباشرة. نتائج AI تحتاج دائماً لمسة بشرية وتدقيق." }
            ]
        },
        {
            id: 10,
            icon: Cpu,
            title: "كن مُحدداً بطلباتك من AI",
            sections: [
                { type: 'text', content: "الذكاء الاصطناعي يعطيك على قدر سؤالك. السؤال الغبي يعطي إجابة غبية." },
                { type: 'header', content: "كيف تكتب (Prompt) صح؟" },
                {
                    type: 'list', items: [
                        "حدد الدور: 'تصرف كخبير تسويق'.",
                        "حدد المهمة: 'اكتب خطة محتوى لأسبوع'.",
                        "حدد السياق: 'لمحل بيع ملابس في دمشق يستهدف الشباب'.",
                        "حدد الصيغة: 'ضع النتيجة في جدول'."
                    ]
                }
            ]
        },
        {
            id: 15,
            icon: Zap,
            title: "السرعة مطلوبة، وAI بوفر وقت",
            sections: [
                { type: 'text', content: "في العمل الحر، الوقت هو المال. إذا أنجزت 5 تصاميم بساعة بدل يوم، دخلك تضاعف." },
                {
                    type: 'list', items: [
                        "استخدم أدوات إزالة الخلفية بالذكاء الاصطناعي.",
                        "استخدم أدوات تحسين الصوت تلقائياً.",
                        "استخدم التوليد التلقائي للصور (مثل Midjourney أو Bing Image Creator) للإلهام."
                    ]
                }
            ]
        },
        {
            id: 20,
            icon: Globe,
            title: "العالم يسبقنا، حاول اللحاق",
            sections: [
                { type: 'text', content: "التكنولوجيا تتطور بسرعة مرعبة. ما كان مستحيلاً قبل سنة صار متاحاً اليوم بكبسة زر." },
                { type: 'tip', content: "تابع حسابات تقنية على تويتر أو يوتيوب لتعرف جديد الأدوات. لا تكن آخر من يعلم." }
            ]
        },
    ],
    reality: [
        {
            id: 2,
            icon: Zap,
            title: "الكهرباء سيئة، تأقلم مع ذلك",
            sections: [
                { type: 'text', content: "الشكوى لن تولد كهرباء. الحل هو إدارة وقتك حسب الوصل." },
                { type: 'header', content: "استراتيجية العمل المتقطع:" },
                {
                    type: 'list', items: [
                        "وقت القطع: للتفكير، التخطيط على ورق، كتابة المسودات، تصوير المنتجات.",
                        "وقت الوصل: للرفع (Upload)، البحث (Google)، وإرسال الرسائل.",
                        "دائماً حمل موادك التعليمية لتشاهدها أوفلاين."
                    ]
                }
            ]
        },
        {
            id: 7,
            icon: Smartphone,
            title: "موبايلك يكفي للبداية",
            sections: [
                { type: 'text', content: "لا توقف حياتك بانتظار لابتوب. التطبيقات الحالية قوية جداً." },
                { type: 'header', content: "تطبيقات بديلة للكمبيوتر:" },
                {
                    type: 'list', items: [
                        "للكتابة: Google Docs (احترافي وسحابي).",
                        "للتصميم: Canva (يغنيك عن فوتوشوب في البداية).",
                        "للمونتاج: CapCut (أقوى من برامج كمبيوتر كثيرة).",
                        "للماسح الضوئي: CamScanner."
                    ]
                }
            ]
        },
        {
            id: 17,
            icon: Layers,
            title: "خزن شغلك، لا تثق بجهازك",
            sections: [
                { type: 'text', content: "الهارد قد يحترق، الموبايل قد يسرق. الكارثة الحقيقية هي ضياع شغل الزبون." },
                { type: 'tip', content: "استخدم Google Drive. كل ملف تشتغله، ارفعه فوراً. هذا يحميك ويسمح لك بمشاركة الرابط مع الزبون بسهولة." }
            ]
        },
    ],
    business: [
        {
            id: 6,
            icon: DollarSign,
            title: "سعّر بواقعية، لا تحرق السوق",
            sections: [
                { type: 'text', content: "العمل ببلاش يضرك ويضر غيرك. لكن في البداية، أنت بحاجة لتقييمات أكثر من المال." },
                { type: 'header', content: "استراتيجية التسعير:" },
                {
                    type: 'list', items: [
                        "أول 5 عملاء: قدم سعراً مغرياً جداً مقابل (شرط الحصول على تقييم 5 نجوم).",
                        "بعد بناء معرض أعمال: ارفع سعرك لمتوسط السوق.",
                        "لا تقبل أبداً بأقل من جهدك وتعبك بمجرد أن تثبت نفسك."
                    ]
                }
            ]
        },
        {
            id: 8,
            icon: Layers,
            title: "النظام يوفر الوقت",
            sections: [
                { type: 'text', content: "الاحترافية ليست بجودة العمل فقط، بل بسرعة الرد والتنظيم." },
                {
                    type: 'list', items: [
                        "أنشئ ملف نصي فيه ردود جاهزة (أهلاً بك، تفضل عرض السعر، شكراً لتعاملك).",
                        "اعمل قالب لفاتورة بسيطة.",
                        "رتب ملفاتك بمجلدات (زبائن حاليين، منتهي، أرشيف)."
                    ]
                }
            ]
        },
        {
            id: 9,
            icon: Briefcase,
            title: "الفرص حولك، ابحث عنها",
            sections: [
                { type: 'text', content: "الإنترنت ليس المكان الوحيد. السوق المحلي في داريا مليان فرص." },
                { type: 'header', content: "أفكار عملية:" },
                {
                    type: 'list', items: [
                        "محل ملابس: اعرض عليه تصوير بضاعته وتنزيلها فيسبوك مقابل مبلغ أسبوعي.",
                        "مطعم: صمم له منيو جديد ومرتب.",
                        "طالب: نسق له حلقة بحثه واطبعها."
                    ]
                }
            ]
        },
        {
            id: 13,
            icon: MessageSquare,
            title: "اتفاق واضح يحميك",
            sections: [
                { type: 'text', content: "كلمة 'منتحاسب بعدين' هي بداية المشاكل." },
                { type: 'warning', content: "قبل أن تضرب ضربة واحدة، اتفق على: السعر النهائي، مدة التسليم، وعدد التعديلات المسموحة." }
            ]
        },
        {
            id: 16,
            icon: Star,
            title: "الجودة هي ما تبقيك في السوق",
            sections: [
                { type: 'text', content: "يمكنك خداع الزبون مرة، لكنك خسرته للأبد." },
                { type: 'text', content: "في العمل الحر، العميل الراضي هو أفضل مسوق لك. اجعل هدفك أن يقول العميل 'واو' وليس فقط 'شكراً'." }
            ]
        },
        {
            id: 18,
            icon: Briefcase,
            title: "العمل الحر ليس سهلاً",
            sections: [
                { type: 'warning', content: "لا تصدق فيديوهات 'اربح 100$ وأنت نائم'. هذا نصب." },
                { type: 'text', content: "العمل الحر يحتاج انضباطاً أكثر من الوظيفة، لأنك مدير نفسك. إذا نمت، لا يوجد راتب. الاستمرارية والصبر هما المفتاح." }
            ]
        }
    ]
};

export default function SkillsPortal() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [viewingTip, setViewingTip] = useState<Article | null>(null);

    const activeContent = selectedCategory ? CONTENT[selectedCategory as keyof typeof CONTENT] : [];
    const activeCategoryInfo = CATEGORIES.find(c => c.id === selectedCategory);

    const renderSection = (section: ArticleSection, idx: number) => {
        switch (section.type) {
            case 'header':
                return <h3 key={idx} className="text-lg font-black text-slate-800 dark:text-slate-100 mt-6 mb-3">{section.content}</h3>;
            case 'text':
                return <p key={idx} className="text-slate-600 dark:text-slate-300 text-sm leading-7 mb-4 font-medium">{section.content}</p>;
            case 'list':
                return (
                    <ul key={idx} className="space-y-3 mb-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        {section.items?.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2.5 flex-shrink-0" />
                                <span className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                );
            case 'warning':
                return (
                    <div key={idx} className="flex gap-3 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/20 mb-6">
                        <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
                        <p className="text-red-700 dark:text-red-300 text-xs font-bold leading-relaxed">{section.content}</p>
                    </div>
                );
            case 'tip':
                return (
                    <div key={idx} className="flex gap-3 bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/20 mb-6">
                        <Lightbulb className="text-indigo-500 flex-shrink-0" size={20} />
                        <p className="text-indigo-700 dark:text-indigo-300 text-xs font-bold leading-relaxed">{section.content}</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300" dir="rtl">
            {/* Context Header */}
            <div className="bg-slate-900 dark:bg-slate-950 px-6 pt-12 pb-20 rounded-b-[40px] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800/30 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-800/30 rounded-full -ml-12 -mb-12 blur-3xl"></div>

                <div className="relative z-10">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 mb-6 bg-white/10 dark:bg-slate-800/40 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all active:scale-95">
                        <ArrowRight size={20} className="transform rotate-180" />
                    </button>

                    <h1 className="text-3xl font-black text-white mb-2 leading-tight">الواقع والحلول 🛠️</h1>
                    <p className="text-slate-300 text-sm font-medium leading-relaxed opacity-90 max-w-sm">
                        دليل عملي للتعامل مع واقعنا (كهرباء، نت، إمكانيات) والاستفادة مما هو متاح لبناء دخل حقيقي.
                    </p>
                </div>
            </div>

            <main className="px-5 -mt-12 relative z-20">
                {/* Categories Grid */}
                {!selectedCategory && (
                    <div className="grid grid-cols-1 gap-4 animate-slide-up">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all active:scale-95 flex items-center gap-4 text-right group"
                            >
                                <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <cat.icon size={28} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{cat.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{cat.desc}</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                    <ArrowRight size={16} className="rotate-180" />
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Selected Category Content */}
                {selectedCategory && (
                    <div className="animate-fade-in space-y-4">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="flex items-center gap-2 text-slate-500 mb-2 font-bold text-sm hover:text-indigo-600 transition-colors"
                        >
                            <ArrowRight size={16} />
                            عودة للقائمة
                        </button>

                        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 text-center mb-6">
                            <div className={`w-16 h-16 ${activeCategoryInfo?.color} rounded-2xl flex items-center justify-center text-white shadow-xl mx-auto mb-4`}>
                                {activeCategoryInfo && <activeCategoryInfo.icon size={32} />}
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">{activeCategoryInfo?.title}</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">{activeCategoryInfo?.desc}</p>
                        </div>

                        {activeContent.map((article: Article) => (
                            <div
                                key={article.id}
                                onClick={() => setViewingTip(article)}
                                className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition-all active:scale-98"
                            >
                                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-700/50 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300">
                                    <article.icon size={22} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug">{article.title}</h3>
                                </div>
                                <ArrowRight size={16} className="text-slate-300 rotate-180" />
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Detail Modal */}
            {viewingTip && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setViewingTip(null)} />
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl animate-slide-up sm:animate-zoom-in max-h-[85vh] flex flex-col">

                        {/* Modal Header */}
                        <div className={`h-32 ${activeCategoryInfo?.color} relative flex items-center justify-center overflow-hidden flex-shrink-0`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <button
                                onClick={() => setViewingTip(null)}
                                className="absolute top-4 right-4 w-8 h-8 bg-black/10 hover:bg-black/20 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md z-10"
                            >
                                <X size={18} />
                            </button>
                            <viewingTip.icon size={48} className="text-white/90 drop-shadow-md relative z-10" />
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2 leading-tight text-center">
                                {viewingTip.title}
                            </h2>
                            <div className="w-12 h-1 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto mb-6"></div>

                            <div className="pb-8">
                                {viewingTip.sections.map((section, idx) => renderSection(section, idx))}
                            </div>

                            <button
                                onClick={() => setViewingTip(null)}
                                className="w-full py-3.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-lg sticky bottom-0"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
