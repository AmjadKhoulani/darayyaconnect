import { Head, Link } from '@inertiajs/react';

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
}

export default function Welcome({
    auth,
    dutyPharmacies,
    cityStats,
    feed,
    featuredStudy,
    latestDiscussions,
    sections,
}: Props) {
    return (
        <div
            className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-500 selection:text-white"
            dir="rtl"
        >
            <Head title="بوابة المدينة الذكية" />

            {/* Top Navigation - Official Portal Style (Light) */}
            <nav className="fixed top-0 z-50 h-16 w-full border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-md">
                <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 text-xl font-black text-white shadow-lg shadow-emerald-900/10">
                            D
                        </div>
                        <div className="hidden md:block">
                            <h1 className="text-lg font-bold leading-tight text-slate-900">
                                داريا{' '}
                                <span className="text-emerald-600">
                                    الرقمية
                                </span>
                            </h1>
                            <p className="text-[10px] uppercase tracking-wider text-slate-500">
                                منصة إدارة المدينة الموحدة
                            </p>
                        </div>
                    </div>

                    <div className="hidden items-center gap-6 md:flex">
                        <NavLink
                            href={route('infrastructure.index')}
                            label="الخريطة"
                        />
                        <NavLink
                            href={route('initiatives.public')}
                            label="المبادرات"
                        />
                        <NavLink href={route('ai-studies')} label="الدراسات" />
                        <NavLink
                            href={route('community.index')}
                            label="المجتمع"
                        />
                        <NavLink
                            href={route('volunteer.index')}
                            label="التطوع"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <Link
                                href={route('dashboard')}
                                className="group flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-1.5 transition hover:bg-slate-100"
                            >
                                <span className="text-sm font-bold text-emerald-700 group-hover:text-emerald-800">
                                    لوحة التحكم
                                </span>
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-700"
                            >
                                دخول الموظفين
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <div className="mx-auto max-w-7xl px-4 pb-12 pt-24">
                {/* 1. Quick Services Grid (Mobile Style) - Moved to TOP as requested */}
                <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Link
                        href="/directory"
                        className="group relative flex h-32 items-center gap-4 rounded-3xl border border-slate-200 bg-white p-6 text-inherit no-underline shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                    >
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 transition-transform group-hover:scale-110">
                            <span className="text-3xl">📞</span>
                        </div>
                        <div>
                            <h4 className="mb-1 text-lg font-bold text-slate-800">
                                دليل الطوارئ
                            </h4>
                            <p className="text-xs text-slate-500">
                                أرقام الخدمات السريعة
                            </p>
                        </div>
                    </Link>

                    <Link
                        href="/lost-found"
                        className="group relative flex h-32 items-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white no-underline shadow-lg shadow-indigo-500/10 transition-all hover:shadow-indigo-500/20 active:scale-[0.98]"
                    >
                        <div className="absolute right-0 top-0 -mr-12 -mt-12 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
                        <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/20 text-white backdrop-blur-md transition-transform group-hover:scale-110">
                            <span className="text-3xl">🔍</span>
                        </div>
                        <div className="relative z-10">
                            <h4 className="mb-1 text-lg font-bold text-white">
                                المفقودات
                            </h4>
                            <p className="text-xs font-medium text-indigo-100/80">
                                ساعد في الإعادة
                            </p>
                        </div>
                    </Link>

                    <Link
                        href="/books"
                        className="group relative flex h-32 items-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-600 p-6 text-white no-underline shadow-lg shadow-emerald-500/10 transition-all hover:shadow-emerald-500/20 active:scale-[0.98]"
                    >
                        <div className="absolute right-0 top-0 -mr-12 -mt-12 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
                        <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/20 text-white backdrop-blur-md transition-transform group-hover:scale-110">
                            <span className="text-3xl">📚</span>
                        </div>
                        <div className="relative z-10">
                            <h4 className="mb-1 text-lg font-bold text-white">
                                مكتبة الكتب
                            </h4>
                            <p className="text-xs font-medium text-emerald-50/80">
                                تبادل المعرفة
                            </p>
                        </div>
                    </Link>

                    <Link
                        href="/ai-studies"
                        className="group relative flex h-32 items-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white no-underline shadow-lg shadow-blue-500/10 transition-all hover:shadow-blue-500/20 active:scale-[0.98]"
                    >
                        <div className="absolute right-0 top-0 -mr-12 -mt-12 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
                        <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/20 text-white backdrop-blur-md transition-transform group-hover:scale-110">
                            <span className="text-3xl">💡</span>
                        </div>
                        <div className="relative z-10">
                            <h4 className="mb-1 text-lg font-bold text-white">
                                التوعية المجتمعية
                            </h4>
                            <p className="text-xs font-medium text-blue-50/80">
                                مقالات ودراسات
                            </p>
                        </div>
                    </Link>
                </div>

                {/* 1. Lost & Found Section - Moved UP for visibility */}
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

                {/* 2. Book Library Section - Moved UP for visibility */}
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

                {/* 3. Awareness Section - Moved UP for visibility */}
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

                <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Right Column: Key Indicators & Quick Services (3 Cols) */}
                    <aside className="space-y-6 lg:col-span-3">
                        {/* Live Status Card */}
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
                                <h3 className="text-sm font-bold text-slate-700">
                                    📊 المؤشرات الحيوية
                                </h3>
                                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
                            </div>
                            <div className="space-y-4 p-4">
                                <StatusRow
                                    label="الكهرباء (المدينة)"
                                    value="متوفرة (2س)"
                                    status="good"
                                    icon="⚡"
                                />
                                <StatusRow
                                    label="المياه (الضخ)"
                                    value="المنطقة أ، ب"
                                    status="good"
                                    icon="💧"
                                />
                                <StatusRow
                                    label="الإنترنت (الأرضي)"
                                    value="مستقر"
                                    status="good"
                                    icon="🌐"
                                />
                                <StatusRow
                                    label="حالة الطرق"
                                    value="ازدحام متوسط"
                                    status="warning"
                                    icon="🚦"
                                />
                            </div>
                        </div>

                        {/* Quick Access Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <QuickBtn
                                icon="🔌"
                                label="المولدات"
                                color="amber"
                                href={route('admin.generators.index')}
                            />
                            <QuickBtn
                                icon="🔍"
                                label="المفقودات"
                                color="rose"
                                href={route('admin.lost-found.index')}
                            />
                            <QuickBtn
                                icon="🏗️"
                                label="المشاريع"
                                color="blue"
                                href={route('infrastructure.index')}
                            />
                        </div>

                        {/* Duty Pharmacy Mini */}
                        <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white shadow-lg">
                            <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase text-slate-300">
                                <span>💊</span> الصيدليات المناوبة
                            </h3>
                            <div className="space-y-2">
                                {dutyPharmacies && dutyPharmacies.length > 0 ? (
                                    dutyPharmacies.slice(0, 2).map((p, i) => (
                                        <div
                                            key={i}
                                            className="rounded border border-white/5 bg-white p-2 text-sm font-bold text-slate-900 shadow-sm"
                                        >
                                            {p.name}
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-xs text-slate-400">
                                        جاري التحديث...
                                    </span>
                                )}
                            </div>
                        </div>
                    </aside>

                    <main className="space-y-6 lg:col-span-6">
                        {/* Featured Study (Hero) */}
                        {featuredStudy ? (
                            <div className="group relative aspect-video overflow-hidden rounded-2xl border border-emerald-100 shadow-xl shadow-emerald-900/10 md:aspect-[2/1]">
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${featuredStudy?.gradient || 'from-emerald-500 to-teal-600'} opacity-90`}
                                ></div>
                                <img
                                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
                                    className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-overlay"
                                />
                                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                                    <div className="mb-2 flex items-center gap-2">
                                        <span className="rounded bg-white/20 px-2 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur">
                                            {featuredStudy?.icon || '📄'} دراسة
                                            مميزة
                                        </span>
                                        <span className="rounded bg-white/20 px-2 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur">
                                            {featuredStudy?.category || 'عام'}
                                        </span>
                                    </div>
                                    <h2 className="mb-2 text-2xl font-black leading-tight text-white drop-shadow-sm md:text-3xl">
                                        {featuredStudy?.title}
                                    </h2>
                                    <p className="mb-4 line-clamp-2 text-sm font-medium text-white/90 drop-shadow-sm md:text-base">
                                        {featuredStudy?.summary ||
                                            'استكشف تفاصيل هذه الدراسة المستقبلية التي تهدف لتحسين واقع المدينة...'}
                                    </p>
                                    <Link
                                        href={route('ai-studies')}
                                        className="flex w-fit items-center gap-2 rounded-lg bg-white px-5 py-2 text-sm font-bold text-emerald-900 shadow-lg transition hover:bg-emerald-50"
                                    >
                                        قراءة الدراسة الكاملة <span>←</span>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            // Fallback Placeholder
                            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-100 p-8 text-center">
                                <div className="mb-2 text-4xl">🚧</div>
                                <h3 className="font-bold text-slate-500">
                                    جاري إعداد الدراسات...
                                </h3>
                            </div>
                        )}

                        {/* Feed Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
                                <span className="h-6 w-2 rounded-full bg-emerald-500"></span>
                                نبض المدينة
                            </h2>
                            <div className="flex gap-2">
                                <FilterBtn label="الكل" active />
                                <FilterBtn label="رسمي" />
                                <FilterBtn label="خدمي" />
                                <FilterBtn label="أهلي" />
                            </div>
                        </div>

                        {/* Timeline Posts */}
                        <div className="space-y-6">
                            {/* Dynamic Feed */}
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
                                <UpdateCard
                                    author="المنظومة الذكية"
                                    role="مرحباً"
                                    time="الآن"
                                    title="أهلاً بك في داريا الرقمية"
                                    color="emerald"
                                    content="لم يتم نشر أي تحديثات جديدة بعد. كن أول من يشارك عبر تقديم مبادرة أو الإبلاغ عن مفقودات!"
                                />
                            )}
                        </div>
                    </main>

                    {/* Left Column: Data & Analytics (3 Cols) */}
                    <aside className="space-y-6 lg:col-span-3">
                        {/* Stats Widget */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="mb-4 text-sm font-bold text-slate-800">
                                أرقام ونسب
                            </h3>
                            <div className="space-y-4">
                                <StatBar
                                    label="إنجاز مشاريع الطاقة"
                                    current={75}
                                    total={100}
                                    color="emerald"
                                />
                                <StatBar
                                    label="استجابة الشكاوى"
                                    current={92}
                                    total={100}
                                    color="blue"
                                />
                                <StatBar
                                    label="جاهزية المدارس"
                                    current={60}
                                    total={100}
                                    color="amber"
                                />
                            </div>
                        </div>

                        {/* Community Discussions Widget (New) */}
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-4">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                                    <span>💬</span> نقاشات المجتمع
                                </h3>
                                <Link
                                    href={route('community.index')}
                                    className="text-[10px] font-bold text-emerald-600 hover:underline"
                                >
                                    الكل
                                </Link>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {latestDiscussions &&
                                latestDiscussions.length > 0 ? (
                                    latestDiscussions.map((d: any) => (
                                        <Link
                                            key={d.id}
                                            href={route('community.show', d.id)}
                                            className="group block p-3 transition hover:bg-slate-50"
                                        >
                                            <h4 className="mb-1 line-clamp-1 text-xs font-bold text-slate-700 group-hover:text-emerald-600">
                                                {d?.title}
                                            </h4>
                                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                                                <span>{d?.user}</span>
                                                <div className="flex items-center gap-2">
                                                    <span>{d?.time}</span>
                                                    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-1.5">
                                                        <span>↩️</span>{' '}
                                                        {d?.replies_count}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-xs text-slate-400">
                                        لا توجد نقاشات حالياً
                                    </div>
                                )}
                            </div>
                            <div className="border-t border-slate-100 bg-slate-50 p-3 text-center">
                                <Link
                                    href={route('community.index')}
                                    className="block w-full text-xs font-bold text-emerald-600 hover:text-emerald-700"
                                >
                                    + فتح نقاش جديد
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Secondary Horizontal Sections */}

                {/* 4. Initiatives Section */}
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

                {/* 5. Studies Section */}
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

                {/* 6. Global Experiences */}
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

                {/* 7. Volunteer Opportunities */}
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

function StatusRow({ label, value, status, icon }: any) {
    const colors =
        {
            good: 'text-emerald-600',
            warning: 'text-amber-600',
            bad: 'text-rose-600',
        }[status as string] || 'text-slate-500';

    return (
        <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-500">
                <span>{icon}</span> {label}
            </span>
            <span className={`font-bold ${colors}`}>{value}</span>
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
