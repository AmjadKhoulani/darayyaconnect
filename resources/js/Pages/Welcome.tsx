import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Book,
    BookOpen,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Globe,
    Handshake,
    Heart,
    Info,
    LayoutDashboard,
    Library,
    Lightbulb,
    Map as MapIcon,
    MessageCircle,
    Phone,
    Search,
    ShieldAlert,
    Stethoscope,
    Users,
    Zap,
    Droplets,
    Wifi,
    TrafficCone,
    Clock,
    ArrowLeft,
    Share2,
    Lock
} from 'lucide-react';

interface Props {
    auth: any;
    laravelVersion: string;
    phpVersion: string;
    dutyPharmacies: any[];
    cityStats: {
        schools: number;
        clinics: number;
        wells: number;
        transformers: number;
        parks: number;
    };
    liveIndicators: any[];
    feed: any[];
    featuredStudy?: any;
    latestDiscussions?: any[];
    sections: {
        studies: any[];
        awareness: any[];
        global: any[];
        opportunities: any[];
        initiatives: any[];
        lostFound: any[];
        books: any[];
    };
    carouselItems?: any[];
}

export default function Welcome({
    auth,
    dutyPharmacies,
    cityStats,
    liveIndicators,
    feed,
    featuredStudy,
    latestDiscussions,
    sections,
    carouselItems = [],
}: Props) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { settings } = usePage().props as any;
    const [scrolled, setScrolled] = useState(false);

    const isEnabled = (module: string) => settings[`module_${module}`] === '1';

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (carouselItems.length > 1) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
            }, 8000);
            return () => clearInterval(timer);
        }
    }, [carouselItems.length]);

    return (
        <div
            className="min-h-screen bg-[#0f172a] font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden"
            dir="rtl"
        >
            <Head title="بوابة المدينة الذكية" />

            {/* HIGH-END NAVIGATION */}
            <nav className={`fixed top-0 z-[100] h-20 w-full transition-all duration-500 ${scrolled ? 'bg-slate-900/80 backdrop-blur-2xl border-b border-emerald-500/20' : 'bg-transparent'}`}>
                <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-8">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="group flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-2xl font-black text-white shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-110">
                                D
                            </div>
                            <div>
                                <h1 className="text-xl font-black tracking-tight text-white">
                                    {settings?.city_name || 'داريا'} <span className="text-emerald-400">الرقمية</span>
                                </h1>
                                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Smart City Hub</p>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden items-center gap-10 lg:flex">
                        <DesktopNavLink href={route('infrastructure.index')} label="خريطة المدينة" icon={<MapIcon size={16} />} enabled={isEnabled('infrastructure')} />
                        <DesktopNavLink href={route('initiatives.public')} label="المبادرات" icon={<Handshake size={16} />} enabled={isEnabled('initiatives')} />
                        <DesktopNavLink href={route('ai-studies')} label="مركز المعرفة" icon={<Lightbulb size={16} />} enabled={isEnabled('knowledge')} />
                        <DesktopNavLink href={route('community.index')} label="المجتمع" icon={<Users size={16} />} enabled={isEnabled('discussions')} />
                    </div>

                    <div className="flex items-center gap-4">
                        {auth?.user ? (
                            <Link
                                href={route('dashboard')}
                                className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-6 py-2.5 text-sm font-black text-emerald-400 backdrop-blur-md transition-all hover:bg-emerald-500 hover:text-white"
                            >
                                <LayoutDashboard size={18} />
                                <span>لوحة التحكم</span>
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="rounded-2xl bg-white px-8 py-3 text-sm font-black text-slate-900 shadow-xl shadow-white/5 transition-all hover:bg-emerald-400 hover:text-slate-950 hover:-translate-y-1"
                            >
                                دخول الموظفين
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* IMMERSIVE HERO SECTION */}
            <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden py-32 lg:min-h-screen">
                {/* Background Layer */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/branding/hero-darayya.png"
                        className="h-full w-full object-cover scale-105"
                        alt="Darayya Vision"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-[#0f172a]"></div>
                </div>

                <div className="relative z-10 mx-auto max-w-5xl px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-6 py-2 backdrop-blur-xl">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
                                {settings?.site_name || 'منصة الإدارة الذكية المتكاملة'}
                            </span>
                        </div>

                        <h1 className="mb-8 text-5xl font-black leading-[1.1] text-white md:text-7xl lg:text-8xl">
                            مستقبل <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">{settings?.city_name || 'داريا'}</span> <br />
                            يُكتب <span className="underline decoration-emerald-500/50 underline-offset-8">رقمياً</span>
                        </h1>

                        <p className="mx-auto mb-12 max-w-2xl text-lg font-medium leading-relaxed text-slate-300 md:text-2xl">
                            نظام متطور يربط بين البنية التحتية، الخدمات العامة، والمشاركة المجتمعية لخلق مدينة ذكية مستدامة تعيش بطموح أهلها.
                        </p>

                        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                            <Link
                                href={route('infrastructure.index')}
                                className="group flex h-16 items-center gap-4 rounded-[2rem] bg-emerald-500 px-10 text-lg font-black text-slate-950 shadow-2xl shadow-emerald-500/30 transition-all hover:bg-emerald-400 hover:scale-105 active:scale-95"
                            >
                                <Globe className="transition-transform group-hover:rotate-12" />
                                استكشف خريطة المدينة
                            </Link>
                            <Link
                                href={route('community.index')}
                                className="group flex h-16 items-center gap-4 rounded-[2rem] border border-white/20 bg-white/5 px-10 text-lg font-black text-white backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/40"
                            >
                                <MessageCircle />
                                مجلس المجتمع
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Floating Stats Bar */}
                <div className="absolute bottom-12 left-0 right-0 z-20 mx-auto max-w-6xl px-8">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
                        <HeroStat icon={<Zap />} label="محولات الطاقة" value={cityStats.transformers} color="amber" />
                        <HeroStat icon={<Droplets />} label="آبار المياه" value={cityStats.wells} color="blue" />
                        <HeroStat icon={<Stethoscope />} label="مراكز طبية" value={cityStats.clinics} color="rose" />
                        <HeroStat icon={<BookOpen />} label="مدارس المدينة" value={cityStats.schools} color="emerald" />
                        <HeroStat icon={<Heart />} label="مساحات خضراء" value={cityStats.parks} color="teal" className="hidden lg:flex" />
                    </div>
                </div>
            </section>

            {/* CORE SERVICES GRID - PREMIUM CARDS */}
            <section className="relative z-30 -mt-10 bg-[#0f172a] px-8 pb-32">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <ServiceCard
                            icon={<Library className="w-10 h-10" />}
                            title="دليل المدينة"
                            desc="قاعدة بيانات شاملة للمؤسسات، المحلات، وأرقام الطوارئ."
                            link="/directory"
                            color="cyan"
                            enabled={isEnabled('directory')}
                        />
                        <ServiceCard
                            icon={<Search className="w-10 h-10" />}
                            title="المفقودات"
                            desc="منصة ذكية للمساعدة في العثور على المقتنيات المفقودة وإعادتها."
                            link="/lost-found"
                            color="indigo"
                            enabled={isEnabled('lost_found')}
                        />
                        <ServiceCard
                            icon={<BookOpen className="w-10 h-10" />}
                            title="المكتبة التبادلية"
                            desc="تبادل المعرفة والكتب الورقية بين سكان المدينة رقمياً."
                            link="/books"
                            color="emerald"
                            enabled={isEnabled('library')}
                        />
                    </div>
                </div>
            </section>

            {/* LIVE PULSE & SMART INDICATORS */}
            <section className="bg-slate-900/50 py-32">
                <div className="mx-auto max-w-7xl px-8">
                    <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

                        {/* LEFT: CITY FEED / TIMELINE */}
                        <div className="lg:col-span-8 space-y-12">
                            <div className="flex items-center justify-between border-b border-white/5 pb-8">
                                <h2 className="flex items-center gap-4 text-4xl font-black text-white">
                                    <span className="h-10 w-2 rounded-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"></span>
                                    نبض داريا <span className="text-emerald-400 font-medium text-2xl">| التحديثات المباشرة</span>
                                </h2>
                            </div>

                            <div className="space-y-10">
                                {feed.length > 0 ? feed.map((post, idx) => (
                                    <UpdatePost key={idx} post={post} />
                                )) : (
                                    <div className="rounded-[2.5rem] border-2 border-dashed border-white/5 bg-white/[0.02] p-20 text-center">
                                        <Activity className="mx-auto mb-6 h-16 w-16 text-slate-700" />
                                        <h3 className="text-2xl font-black text-slate-400">لا يوجد نشاط معلن حالياً</h3>
                                        <p className="mt-2 text-slate-500">جاري انتظار تحديثات من اللجان المحلية...</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: SMART INDICATORS SIDEBAR */}
                        <div className="lg:col-span-4 space-y-8">

                            {/* LIVE STATUS WIDGET */}
                            <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-2xl">
                                <div className="flex items-center justify-between bg-white/[0.05] px-8 py-6">
                                    <h3 className="flex items-center gap-3 text-sm font-black text-white uppercase tracking-widest">
                                        <Activity size={20} className="text-emerald-400" /> مؤشرات الحياة
                                    </h3>
                                    <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 border border-emerald-500/20">
                                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></span>
                                        <span className="text-[10px] font-black text-emerald-400">بث مباشر</span>
                                    </div>
                                </div>
                                <div className="p-10 space-y-10">
                                    {liveIndicators.map((indicator, i) => (
                                        <IndicatorRow key={i} {...indicator} />
                                    ))}
                                </div>
                            </div>

                            {/* EMERGENCY CONTACTS / PHARMACY */}
                            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-800 to-slate-950 p-10 text-white shadow-2xl">
                                <div className="absolute top-0 right-0 -mr-10 -mt-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-[80px]"></div>
                                <h3 className="relative z-10 mb-8 flex items-center gap-3 text-xs font-black uppercase tracking-widest text-emerald-400">
                                    <Clock size={18} /> الصيدليات المناوبة
                                </h3>
                                <div className="relative z-10 space-y-4">
                                    {dutyPharmacies.length > 0 ? dutyPharmacies.slice(0, 3).map((p, i) => (
                                        <div key={i} className="flex items-center justify-between rounded-2xl bg-white/5 p-5 border border-white/5 transition hover:bg-white/10">
                                            <div>
                                                <p className="text-sm font-black">{p.name}</p>
                                                <p className="text-[10px] text-slate-400 mt-1">{p.address || 'وسط المدينة'}</p>
                                            </div>
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                        </div>
                                    )) : (
                                        <p className="text-xs text-slate-500 italic">جاري جلب جدول المناوبات...</p>
                                    )}
                                </div>
                                <Link href="/directory" className="relative z-10 mt-8 flex items-center justify-center gap-2 rounded-xl bg-white/5 py-4 text-[11px] font-black uppercase tracking-widest text-white transition hover:bg-white/10">
                                    الدليل الصحي الكامل <ChevronLeft size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI KNOWLEDGE CENTER (Studies) */}
            {isEnabled('knowledge') && (
                <section className="py-32 bg-[#0f172a]">
                    <div className="mx-auto max-w-7xl px-8">
                        <div className="mb-20 text-center">
                            <h2 className="mb-6 text-5xl font-black text-white">مركز <span className="text-emerald-400 italic">الدراسات الرقمية</span></h2>
                            <p className="mx-auto max-w-2xl text-lg text-slate-400">أبحاث معمق تعتمد على تحليل البيانات ومقررات الذكاء الاصطناعي لتطوير رؤية مستقبلية للمدينة.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {sections.studies.slice(0, 3).map((study) => (
                                <StudyCard key={study.id} study={study} />
                            ))}
                        </div>

                        <div className="mt-16 text-center">
                            <Link href="/ai-studies" className="inline-flex items-center gap-3 rounded-2xl border border-white/10 px-10 py-4 text-sm font-black text-white transition hover:bg-white/5">
                                تصفح كافة الدراسات <ArrowLeft size={18} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* FOOTER */}
            <footer className="border-t border-white/5 bg-slate-950 py-20">
                <div className="mx-auto max-w-7xl px-8">
                    <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-slate-900 font-black">D</div>
                            <span className="text-lg font-black text-white">داريا الرقمية <span className="text-slate-500 font-medium text-sm">| 2026</span></span>
                        </div>
                        <div className="flex gap-10 text-sm font-bold text-slate-500">
                            <Link href="#" className="hover:text-white">سياسة الخصوصية</Link>
                            <Link href="#" className="hover:text-white">شروط الخدمة</Link>
                            <Link href="#" className="hover:text-white">اتصل بنا</Link>
                        </div>
                        <div className="flex gap-4">
                            <SocialIcon icon={<Globe size={20} />} />
                            <SocialIcon icon={<Share2 size={20} />} />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// PREMIUM COMPONENTS

function DesktopNavLink({ href, label, icon, enabled }: any) {
    if (!enabled) return null;
    return (
        <Link
            href={href}
            className="group flex items-center gap-2.5 text-sm font-black text-slate-300 transition-all hover:text-emerald-400"
        >
            <span className="text-slate-500 group-hover:text-emerald-400 group-hover:scale-110 transition-all">{icon}</span>
            {label}
        </Link>
    );
}

function HeroStat({ icon, label, value, color, className = "" }: any) {
    const colorMap: any = {
        emerald: 'text-emerald-400',
        blue: 'text-blue-400',
        rose: 'text-rose-400',
        amber: 'text-amber-400',
        teal: 'text-teal-400'
    };
    return (
        <div className={`flex flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:bg-white/10 hover:border-white/20 ${className}`}>
            <span className={`mb-2 ${colorMap[color]}`}>{icon}</span>
            <span className="text-2xl font-black text-white">{value.toLocaleString()}</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">{label}</span>
        </div>
    );
}

function ServiceCard({ icon, title, desc, link, color, enabled }: any) {
    if (!enabled) return null;
    const colors: any = {
        cyan: 'from-cyan-500/20 to-blue-500/20 text-cyan-400',
        indigo: 'from-indigo-500/20 to-purple-500/20 text-indigo-400 border-indigo-500/30 shadow-indigo-500/10',
        emerald: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30'
    };
    return (
        <Link
            href={link}
            className={`group relative overflow-hidden rounded-[3rem] border border-white/5 bg-gradient-to-br ${colors[color]} p-12 transition-all hover:-translate-y-2 hover:shadow-2xl`}
        >
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-700">
                {icon}
            </div>
            <div className="relative z-10">
                <div className="mb-8 p-4 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform">{icon}</div>
                <h3 className="text-2xl font-black text-white mb-4">{title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">{desc}</p>
                <div className="mt-8 flex items-center gap-3 font-black text-white text-xs uppercase tracking-widest">
                    اكتشف الآن <ChevronLeft size={16} />
                </div>
            </div>
        </Link>
    );
}

function IndicatorRow({ label, value, status, icon, percentage }: any) {
    const statusColor = status === 'good' ? 'bg-emerald-500' : status === 'warning' ? 'bg-amber-500' : 'bg-rose-500';
    const textColor = status === 'good' ? 'text-emerald-400' : status === 'warning' ? 'text-amber-400' : 'text-rose-400';

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="text-2xl">{icon}</span>
                    <span className="text-sm font-black text-slate-300 uppercase tracking-tighter">{label}</span>
                </div>
                <span className={`text-sm font-black ${textColor}`}>{value}</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${statusColor} shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
                />
            </div>
        </div>
    );
}

function UpdatePost({ post }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="group relative flex gap-8"
        >
            {/* Timeline Line Decor */}
            <div className="flex flex-col items-center">
                <div className="h-4 w-4 rounded-full border-4 border-slate-900 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10"></div>
                <div className="h-full w-px bg-white/5 group-last:bg-transparent"></div>
            </div>

            <div className="flex-1 pb-16">
                <div className="mb-3 flex items-center gap-4">
                    <div className={`rounded-xl px-4 py-1 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30`}>
                        {post.role}
                    </div>
                    <span className="text-xs font-bold text-slate-500">{post.time}</span>
                </div>
                <div className="overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-10 transition hover:bg-white/[0.04]">
                    <h3 className="text-2xl font-black text-white mb-4">{post.title}</h3>
                    <p className="text-slate-400 leading-relaxed font-medium mb-6">{post.content}</p>
                    {post.image && (
                        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10">
                            <img src={post.image} className="w-full object-cover max-h-[400px]" alt="Update" />
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function StudyCard({ study }: any) {
    return (
        <div className="group overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.02] transition hover:border-emerald-500/30 hover:-translate-y-2">
            <div className="aspect-[16/9] overflow-hidden bg-slate-800 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                <img
                    src={study.image || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={study.title}
                />
            </div>
            <div className="p-10 text-right">
                <div className="mb-4 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg">رؤية 2026</span>
                    <span className="text-[10px] font-bold text-slate-500">{study.category || 'دراسة علمية'}</span>
                </div>
                <h3 className="mb-4 text-xl font-black text-white group-hover:text-emerald-400 transition-colors line-clamp-1">{study.title}</h3>
                <p className="line-clamp-2 text-sm text-slate-400 leading-relaxed mb-8">{study.summary}</p>
                <Link href="/ai-studies" className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white hover:text-emerald-400 transition-colors">
                    قراءة كاملة <ChevronLeft size={16} />
                </Link>
            </div>
        </div>
    );
}

function SocialIcon({ icon }: any) {
    return (
        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition hover:bg-emerald-500 hover:text-slate-950">
            {icon}
        </button>
    );
}
