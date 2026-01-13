
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Share2, BookOpen, Target, Lightbulb, TrendingUp, Quote, CheckCircle, ChevronRight, DollarSign, Users, Smartphone, Leaf, ArrowUpRight, MapPin } from 'lucide-react';
import api from '../services/api';

export default function StudyDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [study, setStudy] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Rich Data Dictionary for Global Experiences
    const experienceData: Record<string, any> = {
        '1': { // Singapore
            title: "سنغافورة: ثورة النقل الذكي",
            category: "نقل ومواصلات",
            created_at: new Date().toISOString(),
            image: "https://images.unsplash.com/photo-1525625293386-3f8f99389da2?w=800&q=80",
            summary: "كيف تحولت سنغافورة من دولة تعاني من الاختناق المروري إلى صاحبة المركز الأول عالمياً في انسيابية الطرق باستخدام الذكاء الاصطناعي.",
            stats: [
                { label: "كلفة المشروع", value: "$5M", icon: <DollarSign size={16} className="text-emerald-500" /> },
                { label: "مدة التنفيذ", value: "سنتين", icon: <Clock size={16} className="text-blue-500" /> },
                { label: "المستفيدون", value: "2M+", icon: <Users size={16} className="text-purple-500" /> }
            ],
            challenge: "كانت سنغافورة تواجه أزمة مرورية خانقة تكلف الاقتصاد مليارات الدولارات سنوياً، مع معدل امتلاك سيارات ينمو بشكل أسرع من مساحة الطرق المتاحة في الجزيرة الصغيرة.",
            solution: "طورت الحكومة نظام 'ERP' (التسعير الإلكتروني للطرق) والذي يستخدم بوابات ذكية لخصم رسوم المرور تلقائياً حسب الوقت والكثافة المرورية.",
            solutionPoints: ['الوقت من اليوم (الذروة أغلى)', 'نوع المركبة', 'سرعة المرور الحالية في الشارع'],
            impact: { val1: "30%", label1: "زيادة سرعة المرور", val2: "20%", label2: "انخفاض السيارات" },
            quote: "لم نحل المشكلة ببناء المزيد من الطرق، بل ببناء المزيد من الذكاء في الطرق الموجودة.",
            author: "لي كوان يو",
            role: "مؤسس سنغافورة الحديثة",
            color: "blue",
            gallery: [
                "https://images.unsplash.com/photo-1465447142348-e9952c393450?w=800&q=80",
                "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=800&q=80",
                "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80"
            ]
        },
        '2': { // Oslo
            title: "أوسلو: أول مدينة بلا نفايات",
            category: "بيئة واستدامة",
            created_at: new Date().toISOString(),
            image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80",
            summary: "نظام أوسلو السحري لتحويل 99% من نفايات المدينة إلى طاقة كهربائية وتدفئة للمنازل، مما جعلها أنظف مدينة في العالم.",
            stats: [
                { label: "كلفة المصنع", value: "$120M", icon: <DollarSign size={16} className="text-emerald-500" /> },
                { label: "طاقة للمنازل", value: "60k", icon: <Lightbulb size={16} className="text-blue-500" /> },
                { label: "إعادة تدوير", value: "99%", icon: <CheckCircle size={16} className="text-purple-500" /> }
            ],
            challenge: "تراكم النفايات في المطامر كان يسبب انبعاثات غاز الميثان الضارة ويشوه المنظر العام لمدينة تطمح لتكون عاصمة أوروبا الخضراء.",
            solution: "إنشاء محطات متطورة لتحويل النفايات لأطاقة (Waste-to-Energy). القمامة ليست مشكلة، بل هي 'وقود' جديد.",
            solutionPoints: ['أكياس زرقاء للبلاستيك', 'أكياس خضراء للطعام', 'روبوتات بصرية لفرز الألوان'],
            impact: { val1: "99%", label1: "معالجة نفايات", val2: "1%", label2: "بقايا للمكب" },
            quote: "القمامة مورد ثمين، ومن الخطأ دفنها في الأرض.",
            author: "مدير بيئة أوسلو",
            role: "بلدية أوسلو",
            color: "emerald",
            gallery: [
                "https://images.unsplash.com/photo-1542601906990-24ccd08d7455?w=800&q=80",
                "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80",
                "https://images.unsplash.com/photo-1497436072909-60f360e1d4b0?w=800&q=80"
            ]
        },
        '3': { // Estonia
            title: "إستونيا: الدولة الرقمية بالكامل",
            category: "حكومة ذكية",
            created_at: new Date().toISOString(),
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
            summary: "كيف يمكن لمواطن أن يؤسس شركة في 18 دقيقة؟ إستونيا لغت البيروقراطية الورقية تماماً.",
            stats: [
                { label: "توفير وقت", value: "800y", icon: <Clock size={16} className="text-emerald-500" /> },
                { label: "خدمات أونلاين", value: "99%", icon: <Smartphone size={16} className="text-blue-500" /> },
                { label: "توفير ورق", value: "100%", icon: <Leaf size={16} className="text-purple-500" /> }
            ],
            challenge: "دولة صغيرة بموارد محدودة بعد الاستقلال، كانت بحاجة لبناء بنية تحتية حكومية بأقل تكلفة ممكنة وبدون جيش من الموظفين.",
            solution: "مشروع X-Road: منصة تبادل بيانات آمنة تربط جميع قواعد البيانات الحكومية ببعضها البعض لا مركزياً.",
            solutionPoints: ['الهوية الرقمية الموحدة', 'التصويت الإلكتروني i-Voting', 'الصحة الإلكترونية e-Health'],
            impact: { val1: "2%", label1: "توفير من الناتج المحلي", val2: "5d", label2: "وقت مستعاد لكل مواطن" },
            quote: "الانترنت حق من حقوق الإنسان، تماماً كالماء والكهرباء.",
            author: "توتماس هندريك",
            role: "رئيس إستونيا السابق",
            color: "indigo",
            gallery: [
                "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
                "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80",
                "https://images.unsplash.com/photo-1504384308090-c54be3855833?w=800&q=80"
            ]
        },
        '4': { // Medellin
            title: "ميديلين: من الخوف إلى الابتكار",
            category: "تخطيط عمراني",
            created_at: new Date().toISOString(),
            image: "https://images.unsplash.com/photo-1599388147926-3d23450d992f?w=800&q=80",
            summary: "كيف تحولت أخطر مدينة في العالم إلى 'المدينة الأكثر ابتكاراً' بفضل التلفريك والمكتبات العامة.",
            stats: [
                { label: "زوار المكتبات", value: "1.5M", icon: <Users size={16} className="text-emerald-500" /> },
                { label: "خطوط مترو", value: "5", icon: <TrendingUp size={16} className="text-blue-500" /> },
                { label: "حدائق جديدة", value: "30", icon: <Leaf size={16} className="text-purple-500" /> }
            ],
            challenge: "كانت الأحياء الفقيرة (Comunas) معزولة جغرافياً واجتماعياً على التلال، مما جعلها بؤراً للعنف والجريمة.",
            solution: "الابتكار الاجتماعي العمراني: بناء أجمل المباني (مكتبات، مدارس) في أفقر المناطق، وربطها بقلب المدينة عبر 'مترو الكيبل'.",
            solutionPoints: ['تلفريك للأحياء الفقيرة', 'مكتبات إسبانيا العامة', 'السلالم الكهربائية العامة'],
            impact: { val1: "80%", label1: "انخفاض الجريمة", val2: "3x", label2: "زيادة الاستثمار" },
            quote: "مدينتنا يجب أن تكون للجميع، والأجمل يجب أن يكون للأكثر فقراً.",
            author: "سيرخيو فاخاردو",
            role: "عمدة ميديلين",
            color: "rose",
            gallery: [
                "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80",
                "https://images.unsplash.com/photo-1540397106260-e24a594092d4?w=800&q=80",
                "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80"
            ]
        },
        '5': { // Curitiba
            title: "كورتيبا: ثورة الحافلات السريعة",
            category: "نقل عام",
            created_at: new Date().toISOString(),
            image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80",
            summary: "بدلاً من بناء مترو أنفاق مكلف يستغرق عقوداً، ابتكرت كورتيبا نظام 'المترو السطحي': حافلات تسير في مسارات معزولة.",
            stats: [
                { label: "كلفة/كم", value: "$3M", icon: <DollarSign size={16} className="text-emerald-500" /> },
                { label: "راكب يومياً", value: "2.3M", icon: <Users size={16} className="text-blue-500" /> },
                { label: "استبدال سيارات", value: "27M", icon: <TrendingUp size={16} className="text-purple-500" /> }
            ],
            challenge: "كانت المدينة تعاني من نمو سكاني هائل وازدحام مروري، ولم تكن تملك الميزانية الكافية لحفر أنفاق المترو.",
            solution: "نظام BRT: حافلات طويلة ذات مفاصل، تسير في مسارات مخصصة، مع محطات أنبوبية مرتفعة تسمح بالدفع قبل الصعود لتقليل وقت التوقف.",
            solutionPoints: ['مسارات حصرية للحافلات', 'دفع التذاكر قبل الدخول', 'تكامل الخطوط الفرعية والرئيسية'],
            impact: { val1: "75%", label1: "من السكان يستخدمونه", val2: "1/100", label2: "تكلفة مقارنة بالمترو" },
            quote: "الإبداع يبدأ عندما تحذف صفرين من ميزانيتك.",
            author: "جايمي ليرنر",
            role: "عمدة كورتيبا (مهندس معماري)",
            color: "amber",
            gallery: [
                "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80", // Bus
                "https://images.unsplash.com/photo-1494519883701-35282a4bd3eb?w=800&q=80", // Station
                "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80"  // City
            ]
        },
        '6': { // Amsterdam
            title: "أمستردام: المدينة الذكية",
            category: "طاقة واقتصاد",
            created_at: new Date().toISOString(),
            image: "https://images.unsplash.com/photo-1512470876302-687da745313d?w=800&q=80",
            summary: "كيف تستخدم أمستردام إنترنت الأشياء (IoT) لإدارة كل شيء: من أعمدة الإنارة التي تخفت عند عدم وجود مارّة، إلى حاويات القمامة التي تطلب تفريغها.",
            stats: [
                { label: "توفير طاقة", value: "40%", icon: <Leaf size={16} className="text-emerald-500" /> },
                { label: "نقاط ذكية", value: "10k+", icon: <Lightbulb size={16} className="text-blue-500" /> },
                { label: "شركات ناشئة", value: "600+", icon: <TrendingUp size={16} className="text-purple-500" /> }
            ],
            challenge: "تحديات الاستدامة والحاجة لتقليل الانبعاثات الكربونية مع الحفاظ على التراث التاريخي للمدينة.",
            solution: "مشروع Amsterdam Smart City: منصة مفتوحة للابتكار. مثلاً: Climate Street، حيث تم تحويل شارع كامل ليكون مستداماً ومراقباً بذكاء.",
            solutionPoints: ['أعمدة إنارة تتكيف مع الحركة', 'عدادات طاقة ذكية للمنازل', 'تطبيقات لمشاركة القوارب والسيارات'],
            impact: { val1: "15%", label1: "تقليل انبعاثات", val2: "€200", label2: "توفير لكل أسرة سنوياً" },
            quote: "المدينة الذكية ليست تكنولوجيا فقط، بل هي مجتمع ذكي يستخدم التكنولوجيا.",
            author: "إيفا غلين",
            role: "مديرة الابتكار",
            color: "cyan",
            gallery: [
                "https://images.unsplash.com/photo-1468436385273-8abca6dfd8d3?w=800&q=80", // Canals
                "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&q=80", // Bikes
                "https://images.unsplash.com/photo-1584285418504-0062a4e21703?w=800&q=80"  // Smart Lights mood
            ]
        },
        '7': { // Kigali
            title: "كيغالي: أنظف مدينة في أفريقيا",
            category: "مشاركة مجتمعية",
            created_at: new Date().toISOString(),
            image: "https://images.unsplash.com/photo-1576023363380-4f30cd252549?w=800&q=80",
            summary: "تحولت رواندا من دولة مدمرة إلى نموذج عالمي في النظافة بفضل ثقافة 'أوموجاندا': العمل المجتمعي الإلزامي.",
            stats: [
                { label: "مشاركة", value: "90%", icon: <Users size={16} className="text-emerald-500" /> },
                { label: "نفايات بلاستيك", value: "0%", icon: <CheckCircle size={16} className="text-blue-500" /> },
                { label: "نمو سياحي", value: "30%", icon: <TrendingUp size={16} className="text-purple-500" /> }
            ],
            challenge: "بعد الحرب الأهلية، كانت البلاد بحاجة ملحة لإعادة البناء وتوحيد المجتمع وتنظيف الدمار.",
            solution: "إحياء تقليد 'Umuganda': في آخر سبت من كل شهر، يخرج الجميع (بمن فيهم الرئيس) لتنظيف الشوارع وبناء المرافق العامة.",
            solutionPoints: ['منع الأكياس البلاستيكية تماماً (2008)', 'يوم خدمة مجتمعية شهري إلزامي', 'غرامات صارمة على الرمي العشوائي'],
            impact: { val1: "Top 1", label1: "أنظف مدينة بأفريقيا", val2: "$10M", label2: "قيمة عمل تطوعي سنوياً" },
            quote: "النظافة هي مسألة كرامة وطنية، وليست مجرد إزالة ولأوساخ.",
            author: "بول كاغامي",
            role: "رئيس رواندا",
            color: "emerald",
            gallery: [
                "https://images.unsplash.com/photo-1523798724021-f7a8b4b7297e?w=800&q=80", // Nature/Green
                "https://images.unsplash.com/photo-1489743342057-3448cc7d3bb9?w=800&q=80", // Community feeling
                "https://images.unsplash.com/photo-1588556394336-d71e223d6a6a?w=800&q=80"  // Landscape
            ]
        },
        '8': { // Copenhagen
            title: "كوبنهاغن: عاصمة الدراجات",
            category: "بنية تحتية",
            created_at: new Date().toISOString(),
            image: "https://images.unsplash.com/photo-1583009653303-12e08cb0a221?w=800&q=80",
            summary: "عندما تمطر أو تثلج، يظل الدنماركيون يركبون دراجاتهم. كيف صممت المدينة نفسها لتكون الدراجة هي الملك؟",
            stats: [
                { label: "دراجات/سيارات", value: "5:1", icon: <TrendingUp size={16} className="text-emerald-500" /> },
                { label: "מסارات", value: "390km", icon: <MapPin size={16} className="text-blue-500" /> },
                { label: "يذهبون للعمل", value: "62%", icon: <Users size={16} className="text-purple-500" /> }
            ],
            challenge: "أزمة النفط في السبعينات والاختناقات المرورية دفعت المدينة للتفكير ببديل مستدام للسيارات.",
            solution: "بناء شبكة 'طرق سريعة للدراجات' (Super Cycle Highways)، وجعل إشارات المرور تعطي الأولوية للدراجات (الموجة الخضراء).",
            solutionPoints: ['الجسور الخاصة بالدراجات فقط', 'سلة مهملات مائلة لراكبي الدراجات', 'مساند للأرجل عند إشارات المرور'],
            impact: { val1: "1.2M", label1: "كم يقطع يومياً بالدراجة", val2: "$250M", label2: "توفير صحي سنوي" },
            quote: "الحياة في القرن الواحد والعشرين لا يجب أن تكون حول قيادة سيارة معدنية ثقيلة.",
            author: "يان غيل",
            role: "مخطط عمراني",
            color: "sky",
            gallery: [
                "https://images.unsplash.com/photo-1571182126296-6e068c92a99d?w=800&q=80", // Bikes
                "https://images.unsplash.com/photo-1506161869818-45e3f4369766?w=800&q=80", // Bridge
                "https://images.unsplash.com/photo-1571520696924-f7b5329cf566?w=800&q=80"  // City vibes
            ]
        }
    };

    const richContent = experienceData[id || '1'] || experienceData['1'];

    useEffect(() => {
        // If we have local rich data (Global Exp), use it directly
        if (experienceData[id || '']) {
            setStudy(experienceData[id || '']);
            setLoading(false);
            return;
        }

        // Otherwise assume it's a "Local Study" from DB
        api.get(`/ai-studies/${id}`)
            .then(res => setStudy(res.data))
            .catch(err => {
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-300"><div className="animate-spin w-8 h-8 border-2 border-slate-800 dark:border-slate-400 border-t-transparent rounded-full"></div></div>;


    // Use either the API study data OR our rich local data
    // If it's a global experience (has rich content), use that. Else use DB study.
    const displayStudy = experienceData[id || ''] ? richContent : study;
    if (!displayStudy) return null;


    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-10 transition-colors duration-300" dir="rtl">
            {/* Immersive Header */}
            <div className="relative h-[60vh] w-full bg-slate-900 overflow-hidden">
                <img
                    src={displayStudy.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80'}
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                    alt={displayStudy.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                {/* Navbar Overlay */}
                <div className="absolute top-0 left-0 right-0 p-4 pt-12 flex justify-between items-center z-20">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all">
                        <ArrowRight size={20} className="rotate-180" />
                    </button>
                    <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all">
                        <Share2 size={20} />
                    </button>
                </div>

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 pb-12 z-20">
                    <span className={`bg - ${richContent.color || 'blue'} -600 text - white text - [10px] font - black px - 3 py - 1.5 rounded - lg mb - 4 inline - block shadow - lg border border - white / 20 tracking - wider uppercase`}>
                        {displayStudy.category}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4 drop-shadow-sm">
                        {displayStudy.title}
                    </h1>
                    <div className="flex items-center gap-4 text-slate-300 text-xs font-bold">
                        <div className="flex items-center gap-1">
                            <Calendar size={14} className={`text - ${richContent.color || 'blue'} -400`} />
                            <span>{new Date(displayStudy.created_at).toLocaleDateString('ar-SY')}</span>
                        </div>
                        <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                        <div className="flex items-center gap-1">
                            <Clock size={14} className={`text - ${richContent.color || 'blue'} -400`} />
                            <span>{richContent.readTime || '5 دقائق'} قراءة</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="px-5 -mt-8 relative z-30 space-y-6">

                {/* Summary Card */}
                <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-premium border border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-600">
                            <BookOpen size={18} className="text-slate-600 dark:text-slate-400" />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">الملخص</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-loose text-sm font-medium">
                        {displayStudy.summary}
                    </p>
                </div>

                {/* Stats Row - Only show if stats exist */}
                {richContent.stats && (
                    <div className="grid grid-cols-3 gap-3">
                        {richContent.stats.map((stat: any, i: number) => (
                            <div key={i} className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 text-center shadow-sm">
                                <div className="flex justify-center mb-1">{stat.icon}</div>
                                <div className="text-lg font-black text-slate-800 dark:text-slate-100">{stat.value}</div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* The Challenge (Red Theme) */}
                {richContent.challenge && (
                    <div className="bg-rose-50 dark:bg-rose-950/20 rounded-[32px] p-6 border border-rose-100 dark:border-rose-900/30">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
                                <Target size={20} />
                            </div>
                            <h3 className="text-lg font-black text-rose-900 dark:text-rose-100">المشكلة / التحدي</h3>
                        </div>
                        <p className="text-rose-800/80 dark:text-rose-300/80 leading-loose text-sm font-medium">
                            {richContent.challenge}
                        </p>
                    </div>
                )}

                {/* The Solution (Green Theme) */}
                {richContent.solution && (
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-[32px] p-6 border border-emerald-100 dark:border-emerald-900/30">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <Lightbulb size={20} />
                            </div>
                            <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-100">الحل المبتكر</h3>
                        </div>
                        <p className="text-emerald-800/80 dark:text-emerald-300/80 leading-loose text-sm font-medium mb-4">
                            {richContent.solution}
                        </p>
                        {richContent.solutionPoints && (
                            <ul className="space-y-3">
                                {richContent.solutionPoints.map((item: string, i: number) => (
                                    <li key={i} className="flex items-center gap-3 bg-white/60 dark:bg-slate-800/60 p-3 rounded-xl">
                                        <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                                        <span className="text-emerald-900 dark:text-emerald-100 text-xs font-bold">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* Impact (Blue Theme) */}
                {richContent.impact && (
                    <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-[32px] p-6 border border-indigo-100 dark:border-indigo-900/30">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <TrendingUp size={20} />
                            </div>
                            <h3 className="text-lg font-black text-indigo-900 dark:text-indigo-100">الأثر والنتائج</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-premium text-center border border-indigo-100 dark:border-indigo-900/30">
                                <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 block mb-1">{richContent.impact.val1}</span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">{richContent.impact.label1}</span>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-premium text-center border border-indigo-100 dark:border-indigo-900/30">
                                <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 block mb-1">{richContent.impact.val2}</span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">{richContent.impact.label2}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Gallery Section - Added per user request */}
                {richContent.gallery && (
                    <div>
                        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-4 px-2">معرض الصور</h3>
                        <div className="flex gap-4 overflow-x-auto pb-4 px-1 -mx-5 px-5 snap-x scrollbar-hide">
                            {richContent.gallery.map((img: string, i: number) => (
                                <div key={i} className="flex-shrink-0 w-64 h-48 rounded-2xl overflow-hidden shadow-premium snap-center relative border border-slate-200 dark:border-slate-700">
                                    <img src={img} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {/* Quote Block */}
                {richContent.quote && (
                    <div className="relative py-8 px-4 text-center">
                        <Quote size={40} className="text-slate-200 dark:text-slate-800 absolute top-0 left-0" />
                        <p className="font-black text-xl text-slate-800 dark:text-slate-100 leading-relaxed italic relative z-10">
                            "{richContent.quote}"
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-50 dark:text-slate-400 text-lg">
                                {richContent.author?.charAt(0)}
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{richContent.author}</div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400">{richContent.role}</div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Read More Button */}
                <button className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-slate-900/20 dark:shadow-indigo-600/20">
                    <span>قراءة التقرير الفني الكامل (PDF)</span>
                    <ArrowUpRight size={18} />
                </button>
            </main>
        </div>
    );
}

