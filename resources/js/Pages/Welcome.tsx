import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

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

    const isEnabled = (module: string) => settings[`module_${module}`] === '1';


    useEffect(() => {
        if (carouselItems.length > 1) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
            }, 6000);
            return () => clearInterval(timer);
        }
    }, [carouselItems.length]);

    return (
        <div
            className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-500 selection:text-white"
            dir="rtl"
        >
            <Head title="بوابة المدينة الذكية" />

            {/* Top Navigation - Transparent/Glassmorphism */}
            <nav className="fixed top-0 z-50 h-20 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
                <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
                    <div className="flex items-center gap-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-2xl font-black text-white shadow-xl shadow-emerald-500/20 ring-4 ring-emerald-500/10">
                            D
                        </div>
                        <div className="hidden md:block">
                            <h1 className="text-xl font-black tracking-tight text-slate-900">
                                {settings?.city_name || 'داريا'} <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">الرقمية</span>
                            </h1>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                                {settings?.site_name || 'Smart City Ecosystem'}
                            </p>
                        </div>
                    </div>

                    <div className="hidden items-center gap-8 lg:flex">
                        {isEnabled('infrastructure') && <NavLink href={route('infrastructure.index')} label="الخريطة" active={route().current('infrastructure.*')} />}
                        {isEnabled('initiatives') && <NavLink href={route('initiatives.public')} label="المبادرات" />}
                        {isEnabled('knowledge') && <NavLink href={route('ai-studies')} label="الدراسات" />}
                        {isEnabled('discussions') && <NavLink href={route('community.index')} label="المجتمع" />}
                        {isEnabled('volunteering') && <NavLink href={route('volunteer.index')} label="التطوع" />}
                    </div>

                    <div className="flex items-center gap-4">
                        {auth?.user ? (
                            <Link
                                href={route('dashboard')}
                                className="group flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 px-5 py-2 transition-all hover:bg-emerald-100/80 active:scale-95"
                            >
                                <span className="text-sm font-black text-emerald-700">لوحة التحكم</span>
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-black text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-slate-800 hover:-translate-y-0.5 active:scale-95"
                            >
                                نظام الموظفين
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content Container */}
            <div className="mx-auto max-w-7xl px-6 pb-20 pt-28">

                {/* 1. Stunning Hero Section / Carousel */}
                <div className="relative mb-16 overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl shadow-slate-900/30 min-h-[500px] flex items-center">

                    {carouselItems.length > 0 ? (
                        <>
                            {carouselItems.map((item: any, index: number) => (
                                <div
                                    key={item.id}
                                    className={`absolute inset-0 transition-all duration-1000 ease-in-out px-8 md:px-16 lg:px-20 py-12 flex items-center ${index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}
                                >
                                    {/* Background: Image or Gradient */}
                                    <div className="absolute inset-0 z-0">
                                        {item.image_type === 'gradient' && item.gradient ? (
                                            <div
                                                className={`h-full w-full ${item.gradient.includes('from-') ? `bg-gradient-to-br ${item.gradient}` : ''}`}
                                                style={!item.gradient.includes('from-') ? { background: item.gradient } : {}}
                                            ></div>
                                        ) : item.image_path ? (
                                            <>
                                                <img src={`/storage/${item.image_path}`} className="h-full w-full object-cover opacity-30" alt="" />
                                                <div className="absolute inset-0 bg-gradient-to-l from-slate-900 via-slate-900/50 to-transparent"></div>
                                            </>
                                        ) : null}
                                    </div>

                                    <div className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-right w-full lg:w-2/3">
                                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 backdrop-blur-md">
                                            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                                                {item.type === 'global' ? 'تجارب عالمية' : item.type === 'awareness' ? 'توعية مجتمعية' : `${settings?.city_name || 'داريا'} الرقمية`}
                                            </span>
                                        </div>
                                        <h1 className="mb-6 text-4xl font-black leading-[1.1] text-white md:text-5xl lg:text-7xl">
                                            {item.title}
                                        </h1>
                                        <p className="mb-10 text-lg font-medium leading-relaxed text-slate-400 md:text-xl">
                                            {item.description}
                                        </p>

                                        {item.button_text && (
                                            <div className="flex flex-col gap-4 sm:flex-row">
                                                <a
                                                    href={item.button_link || '#'}
                                                    className="flex items-center justify-center gap-3 rounded-2xl bg-emerald-500 px-8 py-4 text-sm font-black text-slate-900 shadow-xl shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:-translate-y-1 active:scale-95"
                                                >
                                                    {item.button_text} <span>←</span>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Dots navigation */}
                            <div className="absolute bottom-10 left-10 z-20 flex gap-2">
                                {carouselItems.map((_: any, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`h-2 transition-all duration-300 rounded-full ${index === currentSlide ? 'w-8 bg-emerald-500' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        // Fallback static Hero if no items configured
                        <div className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-right px-8 md:px-16 lg:px-20">
                            <div className="absolute inset-0 opacity-20 overflow-hidden pointer-events-none">
                                <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                                <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                            </div>

                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 backdrop-blur-md">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">{settings?.site_name || 'Darayya Digital Portal 2026'}</span>
                            </div>
                            <h1 className="mb-6 max-w-3xl text-4xl font-black leading-[1.1] text-white md:text-5xl lg:text-7xl">
                                مستقبل <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">{settings?.city_name || 'داريا'}</span> يصنعه مجتمعها الرقمي
                            </h1>
                            <p className="mb-10 max-w-2xl text-lg font-medium leading-relaxed text-slate-400 md:text-xl">
                                المنصة الموحدة لإدارة خدمات المدينة، المبادرات المجتمعية، والدراسات الرقمية المتقدمة لتعزيز جودة الحياة في {settings?.city_name || 'داريا'}.
                            </p>

                            <div className="flex flex-col gap-4 sm:flex-row">
                                {isEnabled('infrastructure') && (
                                    <Link
                                        href={route('infrastructure.index')}
                                        className="flex items-center justify-center gap-3 rounded-2xl bg-emerald-500 px-8 py-4 text-sm font-black text-slate-900 shadow-xl shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:-translate-y-1 active:scale-95"
                                    >
                                        <span className="text-lg">🗺️</span> استكشف خريطة المدينة
                                    </Link>
                                )}
                                {isEnabled('discussions') && (
                                    <Link
                                        href={route('community.index')}
                                        className="flex items-center justify-center gap-3 rounded-2xl border border-slate-700 bg-slate-800/50 px-8 py-4 text-sm font-black text-white backdrop-blur-xl transition-all hover:bg-slate-800 hover:-translate-y-1 active:scale-95"
                                    >
                                        <span className="text-lg">💬</span> انضم لمجلس المجتمع
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Floating Cards (Decorative for Desktop) - Only show if not on a slide with a big image or just keep as global decoration */}
                    <div className="absolute left-20 top-1/2 hidden -translate-y-1/2 lg:block z-20">
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'مدارس', val: cityStats.schools, icon: '🏫', color: 'blue' },
                                { label: 'صحة', val: cityStats.clinics, icon: '🏥', color: 'rose' },
                                { label: 'طاقة', val: cityStats.transformers, icon: '⚡', color: 'amber' },
                                { label: 'آبار', val: cityStats.wells, icon: '💧', color: 'emerald' },
                            ].map((s, i) => (
                                <div key={i} className="group relative w-32 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl transition-all hover:bg-white/10">
                                    <div className={`mb-2 text-2xl`}>{s.icon}</div>
                                    <div className="text-xl font-black text-white">{s.val}</div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. Quick Services Grid (Modern App Style) */}
                <div className="mb-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {isEnabled('directory') && (
                        <Link
                            href="/directory"
                            className="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10"
                        >
                            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-amber-50 text-amber-500 transition-transform group-hover:scale-110 group-hover:rotate-6">
                                <span className="text-3xl">📞</span>
                            </div>
                            <div>
                                <h4 className="mb-2 text-xl font-black text-slate-800">دليل الخدمات</h4>
                                <p className="text-sm font-medium text-slate-400">أرقام الطوارئ والمؤسسات الخدمية في متناول يدك</p>
                            </div>
                            <div className="mt-6 flex items-center gap-2 font-black text-emerald-600">
                                <span className="text-xs uppercase tracking-widest">تصفح الآن</span>
                                <span className="transition-transform group-hover:translate-x-[-4px]">←</span>
                            </div>
                        </Link>
                    )}

                    {isEnabled('lost_found') && (
                        <Link
                            href="/lost-found"
                            className="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-600/30"
                        >
                            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-white/20 bg-white/20 text-white backdrop-blur-md transition-transform group-hover:scale-110 group-hover:rotate-6">
                                <span className="text-3xl">🔍</span>
                            </div>
                            <div>
                                <h4 className="mb-2 text-xl font-black">مركز المفقودات</h4>
                                <p className="text-sm font-medium text-indigo-100/70">ساهم في إعادة الممتلكات لأصحابها أو أبلغ عن مفقود</p>
                            </div>
                            <div className="mt-6 flex items-center gap-2 font-black">
                                <span className="text-xs uppercase tracking-widest">المزيد</span>
                                <span className="transition-transform group-hover:translate-x-[-4px]">←</span>
                            </div>
                        </Link>
                    )}

                    {isEnabled('library') && (
                        <Link
                            href="/books"
                            className="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-teal-500 to-emerald-600 p-8 text-white shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/30"
                        >
                            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-white/20 bg-white/20 text-white backdrop-blur-md transition-transform group-hover:scale-110 group-hover:rotate-6">
                                <span className="text-3xl">📚</span>
                            </div>
                            <div>
                                <h4 className="mb-2 text-xl font-black">مكتبة المجتمع</h4>
                                <p className="text-sm font-medium text-emerald-50/70">منصة تبادل الكتب الورقية لتشجيع القراءة في المدينة</p>
                            </div>
                            <div className="mt-6 flex items-center gap-2 font-black">
                                <span className="text-xs uppercase tracking-widest">تصفح الكتب</span>
                                <span className="transition-transform group-hover:translate-x-[-4px]">←</span>
                            </div>
                        </Link>
                    )}

                    {isEnabled('knowledge') && (
                        <Link
                            href="/ai-studies"
                            className="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-50 p-8 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/50"
                        >
                            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-slate-900 text-white transition-transform group-hover:scale-110 group-hover:rotate-6">
                                <span className="text-3xl">💡</span>
                            </div>
                            <div>
                                <h4 className="mb-2 text-xl font-black text-slate-800">مركز المعرفة</h4>
                                <p className="text-sm font-medium text-slate-400">تحليل البيانات والمبادرات الرقمية لتطوير المدينة</p>
                            </div>
                            <div className="mt-6 flex items-center gap-2 font-black text-slate-800">
                                <span className="text-xs uppercase tracking-widest">الدراسات</span>
                                <span className="transition-transform group-hover:translate-x-[-4px]">←</span>
                            </div>
                        </Link>
                    )}
                </div>

                {/* 1. Lost & Found Section */}
                {isEnabled('lost_found') && (
                    <HomeSection
                        title="المفقودات"
                        icon="🔍"
                        href={route('admin.lost-found.index')}
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {sections.lostFound.map((item) => (
                                <div
                                    key={item.id}
                                    className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                                >
                                    <div className="relative flex h-32 items-center justify-center bg-slate-100">
                                        {item.images && item.images[0] ? (
                                            <img
                                                src={`/storage/${item.images[0]}`}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-3xl">
                                                {item.type === 'lost' ? '❓' : '🎁'}
                                            </span>
                                        )}
                                        <span
                                            className={`absolute right-2 top-2 rounded px-2 py-0.5 text-[10px] font-bold ${item.type === 'lost' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}
                                        >
                                            {item.type === 'lost'
                                                ? 'مفقود'
                                                : 'موجود'}
                                        </span>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="mb-1 line-clamp-1 text-sm font-bold text-slate-800">
                                            {item.title}
                                        </h4>
                                        <p className="mb-2 line-clamp-2 h-7 text-[10px] text-slate-500">
                                            {item.location}
                                        </p>
                                        <div className="text-[9px] font-bold text-slate-400">
                                            {item.date}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </HomeSection>
                )}

                {/* 2. Book Library Section */}
                {isEnabled('library') && (
                    <HomeSection
                        title="مكتبة الكتب التبادلية"
                        icon="📚"
                        href={route('admin.books.index')}
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {sections.books.map((item) => (
                                <div
                                    key={item.id}
                                    className="group flex gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md"
                                >
                                    <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded bg-slate-100 shadow-inner">
                                        {item.cover_image ? (
                                            <img
                                                src={`/storage/${item.cover_image}`}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-slate-300">
                                                📖
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="mb-1 line-clamp-2 text-xs font-bold leading-tight text-slate-800">
                                            {item.title}
                                        </h4>
                                        <p className="mb-2 line-clamp-1 text-[10px] text-slate-500">
                                            {item.author}
                                        </p>
                                        <div className="inline-block rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600">
                                            متاح
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </HomeSection>
                )}

                {/* 3. Awareness Section */}
                {isEnabled('knowledge') && (
                    <HomeSection
                        title="التوعية والتعليم"
                        icon="💡"
                        href={route('ai-studies')}
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {sections.awareness.map((item) => (
                                <StudyCard key={item.id} item={item} color="blue" />
                            ))}
                        </div>
                    </HomeSection>
                )}

                <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-12">
                    {/* Right Column: Live Ecosystem (3 Cols) */}
                    <aside className="space-y-8 lg:col-span-4">
                        {/* Live Status Card - New Premium Design */}
                        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
                            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-8 py-5">
                                <h3 className="flex items-center gap-3 text-sm font-black text-slate-900 uppercase tracking-widest">
                                    <span className="text-xl">📊</span> المؤشرات الحيوية
                                </h3>
                                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
                                    <span className="text-[10px] font-black text-emerald-600">LIVE</span>
                                </div>
                            </div>
                            <div className="space-y-6 p-8">
                                {liveIndicators && liveIndicators.map((item, i) => (
                                    <StatusRow
                                        key={i}
                                        label={item.label}
                                        value={item.value}
                                        status={item.status}
                                        icon={item.icon}
                                        percentage={item.percentage}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Duty Pharmacy Mini - Dark Mode Premium */}
                        <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/30">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-emerald-500/20 blur-2xl"></div>
                            <h3 className="relative z-10 mb-6 flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-400">
                                <span className="text-xl">💊</span> الصيدليات المناوبة
                            </h3>
                            <div className="relative z-10 space-y-3">
                                {dutyPharmacies && dutyPharmacies.length > 0 ? (
                                    dutyPharmacies.slice(0, 3).map((p, i) => (
                                        <div
                                            key={i}
                                            className="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10"
                                        >
                                            <span className="text-sm font-black">{p.name}</span>
                                            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-slate-700 p-4 text-center">
                                        <span className="text-xs font-bold text-slate-500">جاري تحديث البيانات...</span>
                                    </div>
                                )}
                            </div>
                            <Link href="/directory" className="relative z-10 mt-6 block text-center text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300">
                                عرض الدليل الكامل
                            </Link>
                        </div>
                        {/* Community Discussions Widget */}
                        {isEnabled('discussions') && (
                            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/40 mt-8">
                                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-8 py-5">
                                    <h3 className="flex items-center gap-3 text-sm font-black text-slate-900 uppercase tracking-widest">
                                        <span>💬</span> نقاشات المجتمع
                                    </h3>
                                    <Link
                                        href={route('community.index')}
                                        className="text-[10px] font-black text-emerald-600 hover:underline"
                                    >
                                        الكل
                                    </Link>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {latestDiscussions && latestDiscussions.length > 0 ? (
                                        latestDiscussions.map((d: any) => (
                                            <Link
                                                key={d.id}
                                                href={route('community.show', d.id)}
                                                className="group block p-6 transition hover:bg-slate-50"
                                            >
                                                <h4 className="mb-2 line-clamp-1 text-sm font-black text-slate-700 group-hover:text-emerald-600">
                                                    {d?.title}
                                                </h4>
                                                <div className="flex items-center justify-between text-[10px] text-slate-400">
                                                    <span className="font-bold">{d?.user}</span>
                                                    <div className="flex items-center gap-3">
                                                        <span>{d?.time}</span>
                                                        <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-0.5">
                                                            <span>↩️</span> {d?.replies_count}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="p-10 text-center text-xs text-slate-400">
                                            لا توجد نقاشات حالياً
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </aside>

                    <main className="space-y-10 lg:col-span-8">
                        {/* Featured Study (Hero) - Enhanced */}
                        {featuredStudy ? (
                            <div className="group relative min-h-[400px] overflow-hidden rounded-[2.5rem] border border-emerald-100 shadow-2xl shadow-emerald-500/10">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent z-10"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2069&auto=format&fit=crop"
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt="Featured Study"
                                />
                                <div className="absolute inset-0 z-20 flex flex-col justify-end p-10 md:p-14">
                                    <div className="mb-4 flex items-center gap-2">
                                        <span className="rounded-full bg-emerald-500/20 px-4 py-1.5 text-[10px] font-black text-emerald-400 backdrop-blur-md border border-emerald-500/30">
                                            {featuredStudy?.icon || '📄'} دراسة مميزة
                                        </span>
                                        <span className="rounded-full bg-white/10 px-4 py-1.5 text-[10px] font-black text-white backdrop-blur-md">
                                            {featuredStudy?.category || 'عام'}
                                        </span>
                                    </div>
                                    <h2 className="mb-4 text-3xl font-black leading-tight text-white md:text-5xl">
                                        {featuredStudy?.title}
                                    </h2>
                                    <p className="mb-8 max-w-2xl text-base font-medium text-slate-300 drop-shadow-sm line-clamp-2">
                                        {featuredStudy?.summary || 'رؤية مستقبلية لتطوير البنية التحتية والخدمات الذكية في مدينة داريا.'}
                                    </p>
                                    <Link
                                        href={route('ai-studies')}
                                        className="flex w-fit items-center gap-3 rounded-2xl bg-white px-8 py-4 text-sm font-black text-slate-900 shadow-xl transition-all hover:bg-emerald-50 hover:-translate-y-1"
                                    >
                                        قراءة الدراسة <span>←</span>
                                    </Link>
                                </div>
                            </div>
                        ) : null}

                        {/* Feed Header */}
                        <div className="flex flex-col gap-6 border-b border-slate-100 pb-8 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="flex items-center gap-4 text-3xl font-black text-slate-900">
                                <span className="h-8 w-2 rounded-full bg-emerald-500"></span>
                                نبض المدينة
                            </h2>
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                                <FilterBtn label="الكل" active />
                                <FilterBtn label="رسمي" />
                                <FilterBtn label="خدمي" />
                                <FilterBtn label="أهلي" />
                            </div>
                        </div>

                        {/* Timeline Posts */}
                        <div className="space-y-8">
                            {feed && feed.length > 0 ? (
                                feed.map((post: any) => (
                                    <UpdateCard
                                        key={`${post.type}-${post.id}`}
                                        author={post.author}
                                        role={post.role}
                                        time={post.time}
                                        title={post.title}
                                        content={post.content}
                                        color={post.color}
                                        image={post.image}
                                    />
                                ))
                            ) : (
                                <div className="rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
                                    <div className="mb-4 text-5xl">📡</div>
                                    <h3 className="text-xl font-black text-slate-800">لا توجد تحديثات حالياً</h3>
                                    <p className="text-sm font-medium text-slate-400">كن أول من يشارك عبر تقديم مبادرة أو الإبلاغ عن مفقودات!</p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>

                {/* Secondary Horizontal Sections */}

                {/* 4. Initiatives Section */}
                {isEnabled('initiatives') && (
                    <HomeSection
                        title="المبادرات المجتمعية"
                        icon="🤝"
                        href={route('initiatives.public')}
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {sections.initiatives.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                                >
                                    <div className="mb-3 h-32 overflow-hidden rounded-lg bg-slate-100">
                                        {item.image ? (
                                            <img
                                                src={`/storage/${item.image}`}
                                                className="h-full w-full object-cover"
                                                alt={item.title}
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center font-serif text-3xl italic text-slate-300">
                                                Initiative
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="mb-1 line-clamp-1 text-sm font-bold text-slate-800">
                                        {item.title}
                                    </h4>
                                    <p className="mb-3 line-clamp-2 h-8 text-[11px] text-slate-500">
                                        {item.description}
                                    </p>
                                    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2">
                                        <span className="text-[10px] font-bold uppercase text-emerald-600">
                                            {item.status}
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                            {item.created_at.split('T')[0]}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </HomeSection>
                )}

                {/* 5. Studies Section */}
                {isEnabled('knowledge') && (
                    <HomeSection
                        title="الدراسات والأبحاث"
                        icon="📑"
                        href={route('ai-studies')}
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {sections.studies.map((item) => (
                                <StudyCard key={item.id} item={item} />
                            ))}
                        </div>
                    </HomeSection>
                )}

                {/* 6. Global Experiences */}
                {isEnabled('knowledge') && (
                    <HomeSection
                        title="تجارب عالمية"
                        icon="🌍"
                        href={route('ai-studies')}
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {sections.global.map((item) => (
                                <StudyCard key={item.id} item={item} color="blue" />
                            ))}
                        </div>
                    </HomeSection>
                )}

                {/* 7. Volunteer Opportunities */}
                {isEnabled('volunteering') && (
                    <HomeSection
                        title="فرص التطوع"
                        icon="🙋‍♂️"
                        href={route('volunteer.index')}
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {sections.opportunities.map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200"
                                >
                                    <div className="absolute right-0 top-0 -mr-10 -mt-10 h-20 w-20 rounded-bl-full bg-emerald-50 transition-all group-hover:scale-110"></div>
                                    <h4 className="relative z-10 mb-2 text-sm font-bold text-slate-800">
                                        {item.title}
                                    </h4>
                                    <p className="mb-4 line-clamp-2 text-xs text-slate-500">
                                        {item.description}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4 text-[10px] font-bold">
                                        <span className="rounded bg-emerald-50 px-2 py-1 text-emerald-600">
                                            نشط
                                        </span>
                                        <span className="text-slate-400">
                                            نهاية الموعد: {item.deadline || 'دائم'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </HomeSection>
                )}
            </div>

            <footer className="mt-12 border-t border-slate-200 bg-white py-8 text-center">
                <p className="text-xs font-medium text-slate-500">
                    منصة الإدارة المحلية الذكية &copy; 2026
                </p>
            </footer>
        </div>
    );
}

// Sub-components

function NavLink({ href, label, active }: any) {
    return (
        <Link
            href={href}
            className={`text-sm font-bold transition-colors ${active ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900'}`}
        >
            {label}
        </Link>
    );
}

function StatusRow({ label, value, status, icon, percentage }: any) {
    const colors =
        {
            good: 'emerald',
            warning: 'amber',
            bad: 'rose',
        }[status as string] || 'slate';

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-black text-slate-500 uppercase tracking-tighter">
                    <span className="text-base">{icon}</span> {label}
                </span>
                <span className={`font-black text-${colors}-600`}>{value}</span>
            </div>
            {percentage !== undefined && (
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                        className={`h-full rounded-full bg-${colors}-500 transition-all duration-1000`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            )}
        </div>
    );
}

function QuickBtn({ icon, label, color, href }: any) {
    const colors: any = {
        amber: 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100',
        rose: 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100',
        blue: 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100',
        emerald:
            'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100',
    };

    if (href) {
        return (
            <Link
                href={href}
                className={`group flex flex-col items-center justify-center rounded-xl border p-4 transition-all duration-300 ${colors[color]}`}
            >
                <span className="mb-1 text-2xl transition-transform group-hover:scale-110">
                    {icon}
                </span>
                <span className="text-xs font-bold">{label}</span>
            </Link>
        );
    }

    return (
        <button
            className={`group flex flex-col items-center justify-center rounded-xl border p-4 transition-all duration-300 ${colors[color]}`}
        >
            <span className="mb-1 text-2xl transition-transform group-hover:scale-110">
                {icon}
            </span>
            <span className="text-xs font-bold">{label}</span>
        </button>
    );
}

function FilterBtn({ label, active }: any) {
    return (
        <button
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${active ? 'bg-emerald-600 text-white shadow-md' : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
        >
            {label}
        </button>
    );
}

function StatBar({ label, current, total, color }: any) {
    const percentage = Math.round((current / total) * 100);
    const colors: any = {
        emerald: 'bg-emerald-500',
        blue: 'bg-blue-500',
        amber: 'bg-amber-500',
        rose: 'bg-rose-500',
    };

    return (
        <div>
            <div className="mb-1 flex justify-between text-xs">
                <span className="font-bold text-slate-700">{label}</span>
                <span className="text-slate-500">{percentage}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ${colors[color] || 'bg-slate-500'}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}

function HomeSection({ title, icon, children, href }: any) {
    return (
        <section className="mt-16">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-3 text-2xl font-black text-slate-800">
                    <span className="text-3xl">{icon}</span>
                    {title}
                </h2>
                {href && (
                    <Link
                        href={href}
                        className="flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700"
                    >
                        تصفح الكل <span>←</span>
                    </Link>
                )}
            </div>
            {children}
        </section>
    );
}

function StudyCard({ item, color = 'emerald' }: { item: any; color?: string }) {
    const colorClasses: any = {
        emerald: 'from-emerald-500 to-emerald-600',
        blue: 'from-blue-500 to-blue-600',
        amber: 'from-amber-500 to-amber-600',
    };

    return (
        <Link
            href={route('ai-studies')}
            className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
        >
            <div
                className={`h-3 bg-gradient-to-r ${colorClasses[color]}`}
            ></div>
            <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                        {item.category}
                    </span>
                    <span className="text-[10px] text-slate-300">•</span>
                    <span className="text-[10px] text-slate-400">
                        {item.created_at.split('T')[0]}
                    </span>
                </div>
                <h4 className="mb-2 line-clamp-2 h-10 text-sm font-bold leading-tight text-slate-800 transition group-hover:text-emerald-600">
                    {item.title}
                </h4>
                <p className="mb-4 line-clamp-2 h-8 text-[11px] text-slate-500">
                    {item.summary || item.content.substring(0, 100)}
                </p>
                <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-3">
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-400">
                            👀 1.2k
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function UpdateCard({ author, role, time, title, content, color, image }: any) {
    const colors: any = {
        emerald: { border: 'border-l-4 border-emerald-500', bg: 'bg-white' },
        blue: { border: 'border-l-4 border-blue-500', bg: 'bg-white' },
        amber: { border: 'border-l-4 border-amber-500', bg: 'bg-white' },
        rose: { border: 'border-l-4 border-rose-500', bg: 'bg-white' },
    };

    return (
        <div
            className={`rounded-xl border border-slate-200 p-5 shadow-sm ${colors[color]?.bg || 'bg-white'} ${colors[color]?.border}`}
        >
            <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-400">
                        {author.charAt(0)}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">
                            {author}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                                {role}
                            </span>
                            <span>•</span>
                            <span>{time}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mr-12">
                {' '}
                {/* Indent for avatars */}
                <h3 className="mb-2 text-base font-black text-slate-800">
                    {title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-slate-600">
                    {content}
                </p>
                {image && (
                    <div className="mb-4 overflow-hidden rounded-lg border border-slate-100">
                        <img
                            src={image}
                            className="h-auto max-h-64 w-full object-cover"
                            alt="update"
                        />
                    </div>
                )}
                <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
                    <button className="flex items-center gap-1 text-xs font-bold text-slate-400 transition hover:text-rose-500">
                        <span>❤️</span> أعجبني
                    </button>
                    <button className="flex items-center gap-1 text-xs font-bold text-slate-400 transition hover:text-blue-500">
                        <span>💬</span> تعليق
                    </button>
                    <button className="flex items-center gap-1 text-xs font-bold text-slate-400 transition hover:text-emerald-500">
                        <span>↗️</span> مشاركة
                    </button>
                </div>
            </div>
        </div>
    );
}
