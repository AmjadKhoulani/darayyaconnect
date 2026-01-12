import { Link, Head } from '@inertiajs/react';
import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';

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
    }
}

export default function Welcome({ auth, dutyPharmacies, cityStats, feed, featuredStudy, latestDiscussions, sections }: Props) {

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white" dir="rtl">
            <Head title="بوابة المدينة الذكية" />

            {/* Top Navigation - Official Portal Style (Light) */}
            <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-900/10">
                            D
                        </div>
                        <div className="hidden md:block">
                            <h1 className="font-bold text-lg leading-tight text-slate-900">داريا <span className="text-emerald-600">الرقمية</span></h1>
                            <p className="text-[10px] text-slate-500 tracking-wider uppercase">منصة إدارة المدينة الموحدة</p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <NavLink href={route('infrastructure.index')} label="الخريطة" />
                        <NavLink href={route('initiatives.public')} label="المبادرات" />
                        <NavLink href={route('ai-studies')} label="الدراسات" />
                        <NavLink href={route('community.index')} label="المجتمع" />
                        <NavLink href={route('volunteer.index')} label="التطوع" />
                    </div>

                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <Link href={route('dashboard')} className="flex items-center gap-3 px-4 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition group">
                                <span className="text-sm font-bold text-emerald-700 group-hover:text-emerald-800">لوحة التحكم</span>
                            </Link>
                        ) : (
                            <Link href={route('login')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition shadow-lg shadow-emerald-900/10">
                                دخول الموظفين
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto pt-24 px-4 pb-12">
                {/* 1. Quick Services Grid (Mobile Style) - Moved to TOP as requested */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <Link href="/directory" className="group relative bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all active:scale-[0.98] h-32 flex items-center gap-4 text-inherit no-underline">
                        <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="text-3xl">📞</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-lg mb-1">دليل الطوارئ</h4>
                            <p className="text-slate-500 text-xs">أرقام الخدمات السريعة</p>
                        </div>
                    </Link>

                    <Link href="/lost-found" className="group relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all active:scale-[0.98] h-32 flex items-center gap-4 overflow-hidden text-white no-underline">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                        <div className="relative z-10 w-14 h-14 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                            <span className="text-3xl">🔍</span>
                        </div>
                        <div className="relative z-10">
                            <h4 className="font-bold text-white text-lg mb-1">المفقودات</h4>
                            <p className="text-indigo-100/80 text-xs font-medium">ساعد في الإعادة</p>
                        </div>
                    </Link>

                    <Link href="/books" className="group relative bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-6 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all active:scale-[0.98] h-32 flex items-center gap-4 overflow-hidden text-white no-underline">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                        <div className="relative z-10 w-14 h-14 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                            <span className="text-3xl">📚</span>
                        </div>
                        <div className="relative z-10">
                            <h4 className="font-bold text-white text-lg mb-1">مكتبة الكتب</h4>
                            <p className="text-emerald-50/80 text-xs font-medium">تبادل المعرفة</p>
                        </div>
                    </Link>

                    <Link href="/ai-studies" className="group relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all active:scale-[0.98] h-32 flex items-center gap-4 overflow-hidden text-white no-underline">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                        <div className="relative z-10 w-14 h-14 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                            <span className="text-3xl">💡</span>
                        </div>
                        <div className="relative z-10">
                            <h4 className="font-bold text-white text-lg mb-1">التوعية المجتمعية</h4>
                            <p className="text-blue-50/80 text-xs font-medium">مقالات ودراسات</p>
                        </div>
                    </Link>
                </div>

                {/* 1. Lost & Found Section - Moved UP for visibility */}
                <HomeSection title="المفقودات" icon="🔍" href={route('admin.lost-found.index')}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {sections.lostFound.map((item) => (
                            <div key={item.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                                <div className="h-32 bg-slate-100 flex items-center justify-center relative">
                                    {item.images && item.images[0] ? (
                                        <img src={`/storage/${item.images[0]}`} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-3xl">{item.type === 'lost' ? '❓' : '🎁'}</span>
                                    )}
                                    <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold ${item.type === 'lost' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                        {item.type === 'lost' ? 'مفقود' : 'موجود'}
                                    </span>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1">{item.title}</h4>
                                    <p className="text-slate-500 text-[10px] line-clamp-2 h-7 mb-2">{item.location}</p>
                                    <div className="text-[9px] text-slate-400 font-bold">{item.date}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </HomeSection>

                {/* 2. Book Library Section - Moved UP for visibility */}
                <HomeSection title="مكتبة الكتب التبادلية" icon="📚" href={route('admin.books.index')}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {sections.books.map((item) => (
                            <div key={item.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group flex gap-3 p-3">
                                <div className="w-16 h-24 bg-slate-100 rounded flex-shrink-0 overflow-hidden shadow-inner">
                                    {item.cover_image ? (
                                        <img src={`/storage/${item.cover_image}`} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">📖</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 text-xs mb-1 line-clamp-2 leading-tight">{item.title}</h4>
                                    <p className="text-slate-500 text-[10px] line-clamp-1 mb-2">{item.author}</p>
                                    <div className="inline-block bg-emerald-50 text-emerald-600 text-[9px] font-bold px-1.5 py-0.5 rounded">متاح</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </HomeSection>

                {/* 3. Awareness Section - Moved UP for visibility */}
                <HomeSection title="التوعية والتعليم" icon="💡" href={route('ai-studies')}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {sections.awareness.map((item) => (
                            <StudyCard key={item.id} item={item} color="blue" />
                        ))}
                    </div>
                </HomeSection>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
                    {/* Right Column: Key Indicators & Quick Services (3 Cols) */}
                    <aside className="lg:col-span-3 space-y-6">
                        {/* Live Status Card */}
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="font-bold text-sm text-slate-700">📊 المؤشرات الحيوية</h3>
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            </div>
                            <div className="p-4 space-y-4">
                                <StatusRow label="الكهرباء (المدينة)" value="متوفرة (2س)" status="good" icon="⚡" />
                                <StatusRow label="المياه (الضخ)" value="المنطقة أ، ب" status="good" icon="💧" />
                                <StatusRow label="الإنترنت (الأرضي)" value="مستقر" status="good" icon="🌐" />
                                <StatusRow label="حالة الطرق" value="ازدحام متوسط" status="warning" icon="🚦" />
                            </div>
                        </div>

                        {/* Quick Access Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <QuickBtn icon="🔌" label="المولدات" color="amber" href={route('admin.generators.index')} />
                            <QuickBtn icon="🔍" label="المفقودات" color="rose" href={route('admin.lost-found.index')} />
                            <QuickBtn icon="🏗️" label="المشاريع" color="blue" href={route('infrastructure.index')} />
                        </div>

                        {/* Duty Pharmacy Mini */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-slate-700/50 rounded-xl p-4 shadow-lg">
                            <h3 className="text-xs font-bold text-slate-300 mb-3 uppercase flex items-center gap-2">
                                <span>💊</span> الصيدليات المناوبة
                            </h3>
                            <div className="space-y-2">
                                {dutyPharmacies && dutyPharmacies.length > 0 ? dutyPharmacies.slice(0, 2).map((p, i) => (
                                    <div key={i} className="text-sm font-bold text-slate-900 bg-white p-2 rounded border border-white/5 shadow-sm">
                                        {p.name}
                                    </div>
                                )) : <span className="text-xs text-slate-400">جاري التحديث...</span>}
                            </div>
                        </div>
                    </aside>

                    <main className="lg:col-span-6 space-y-6">
                        {/* Featured Study (Hero) */}
                        {featuredStudy ? (
                            <div className="relative rounded-2xl overflow-hidden aspect-video md:aspect-[2/1] group shadow-xl shadow-emerald-900/10 border border-emerald-100">
                                <div className={`absolute inset-0 bg-gradient-to-br ${featuredStudy?.gradient || 'from-emerald-500 to-teal-600'} opacity-90`}></div>
                                <img
                                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
                                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
                                />
                                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-white/20 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                            {featuredStudy?.icon || '📄'} دراسة مميزة
                                        </span>
                                        <span className="bg-white/20 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                            {featuredStudy?.category || 'عام'}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2 drop-shadow-sm">
                                        {featuredStudy?.title}
                                    </h2>
                                    <p className="text-white/90 text-sm md:text-base line-clamp-2 mb-4 drop-shadow-sm font-medium">
                                        {featuredStudy?.summary || 'استكشف تفاصيل هذه الدراسة المستقبلية التي تهدف لتحسين واقع المدينة...'}
                                    </p>
                                    <Link
                                        href={route('ai-studies')}
                                        className="bg-white text-emerald-900 px-5 py-2 rounded-lg font-bold text-sm w-fit hover:bg-emerald-50 transition shadow-lg flex items-center gap-2"
                                    >
                                        قراءة الدراسة الكاملة <span>←</span>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            // Fallback Placeholder
                            <div className="bg-slate-100 rounded-2xl p-8 text-center border-2 border-dashed border-slate-200">
                                <div className="text-4xl mb-2">🚧</div>
                                <h3 className="font-bold text-slate-500">جاري إعداد الدراسات...</h3>
                            </div>
                        )}

                        {/* Feed Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                            <h2 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                                <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
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
                            {(feed && feed.length > 0) ? feed.map((post: any) => (
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
                            )) : (
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
                    <aside className="lg:col-span-3 space-y-6">
                        {/* Stats Widget */}
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 text-sm">أرقام ونسب</h3>
                            <div className="space-y-4">
                                <StatBar label="إنجاز مشاريع الطاقة" current={75} total={100} color="emerald" />
                                <StatBar label="استجابة الشكاوى" current={92} total={100} color="blue" />
                                <StatBar label="جاهزية المدارس" current={60} total={100} color="amber" />
                            </div>
                        </div>

                        {/* Community Discussions Widget (New) */}
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                    <span>💬</span> نقاشات المجتمع
                                </h3>
                                <Link href={route('community.index')} className="text-[10px] text-emerald-600 font-bold hover:underline">الكل</Link>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {latestDiscussions && latestDiscussions.length > 0 ? latestDiscussions.map((d: any) => (
                                    <Link key={d.id} href={route('community.show', d.id)} className="block p-3 hover:bg-slate-50 transition group">
                                        <h4 className="font-bold text-slate-700 text-xs mb-1 group-hover:text-emerald-600 line-clamp-1">{d?.title}</h4>
                                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                                            <span>{d?.user}</span>
                                            <div className="flex items-center gap-2">
                                                <span>{d?.time}</span>
                                                <span className="flex items-center gap-1 bg-slate-100 px-1.5 rounded-full">
                                                    <span>↩️</span> {d?.replies_count}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                )) : (
                                    <div className="p-4 text-center text-xs text-slate-400">لا توجد نقاشات حالياً</div>
                                )}
                            </div>
                            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                                <Link href={route('community.index')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 block w-full">
                                    + فتح نقاش جديد
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Secondary Horizontal Sections */}

                {/* 4. Initiatives Section */}
                <HomeSection title="المبادرات المجتمعية" icon="🤝" href={route('initiatives.public')}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {sections.initiatives.map((item) => (
                            <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
                                <div className="h-32 bg-slate-100 rounded-lg mb-3 overflow-hidden">
                                    {item.image ? (
                                        <img src={`/storage/${item.image}`} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-3xl italic font-serif">Initiative</div>
                                    )}
                                </div>
                                <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1">{item.title}</h4>
                                <p className="text-slate-500 text-[11px] line-clamp-2 mb-3 h-8">{item.description}</p>
                                <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase">{item.status}</span>
                                    <span className="text-[10px] text-slate-400">{item.created_at.split('T')[0]}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </HomeSection>

                {/* 5. Studies Section */}
                <HomeSection title="الدراسات والأبحاث" icon="📑" href={route('ai-studies')}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {sections.studies.map((item) => (
                            <StudyCard key={item.id} item={item} />
                        ))}
                    </div>
                </HomeSection>

                {/* 6. Global Experiences */}
                <HomeSection title="تجارب عالمية" icon="🌍" href={route('ai-studies')}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {sections.global.map((item) => (
                            <StudyCard key={item.id} item={item} color="blue" />
                        ))}
                    </div>
                </HomeSection>

                {/* 7. Volunteer Opportunities */}
                <HomeSection title="فرص التطوع" icon="🙋‍♂️" href={route('volunteer.index')}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {sections.opportunities.map((item) => (
                            <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-emerald-200 transition relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:scale-110"></div>
                                <h4 className="font-bold text-slate-800 text-sm relative z-10 mb-2">{item.title}</h4>
                                <p className="text-slate-500 text-xs mb-4 line-clamp-2">{item.description}</p>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50 text-[10px] font-bold">
                                    <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded">نشط</span>
                                    <span className="text-slate-400">نهاية الموعد: {item.deadline || 'دائم'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </HomeSection>

            </div>

            <footer className="border-t border-slate-200 bg-white py-8 text-center mt-12">
                <p className="text-slate-500 text-xs font-medium">
                    منصة الإدارة المحلية الذكية &copy; 2026
                </p>
            </footer>
        </div >
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
    )
}

function StatusRow({ label, value, status, icon }: any) {
    const colors = {
        good: 'text-emerald-600',
        warning: 'text-amber-600',
        bad: 'text-rose-600'
    }[status as string] || 'text-slate-500';

    return (
        <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 flex items-center gap-2"><span>{icon}</span> {label}</span>
            <span className={`font-bold ${colors}`}>{value}</span>
        </div>
    )
}

function QuickBtn({ icon, label, color, href }: any) {
    const colors: any = {
        amber: 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100',
        rose: 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100',
        blue: 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100',
    };

    if (href) {
        return (
            <Link href={href} className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 group ${colors[color]}`}>
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{icon}</span>
                <span className="text-xs font-bold">{label}</span>
            </Link>
        )
    }

    return (
        <button className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 group ${colors[color]}`}>
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{icon}</span>
            <span className="text-xs font-bold">{label}</span>
        </button>
    )
}

function FilterBtn({ label, active }: any) {
    return (
        <button className={`text-xs font-bold px-3 py-1.5 rounded-full transition ${active ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>
            {label}
        </button>
    )
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
            <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">{label}</span>
                <span className="text-slate-500">{percentage}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ${colors[color] || 'bg-slate-500'}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    )
}

function HomeSection({ title, icon, children, href }: any) {
    return (
        <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-black text-2xl text-slate-800 flex items-center gap-3">
                    <span className="text-3xl">{icon}</span>
                    {title}
                </h2>
                {href && (
                    <Link href={href} className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
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
        <Link href={route('ai-studies')} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
            <div className={`h-3 bg-gradient-to-r ${colorClasses[color]}`}></div>
            <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.category}</span>
                    <span className="text-[10px] text-slate-300">•</span>
                    <span className="text-[10px] text-slate-400">{item.created_at.split('T')[0]}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-2 group-hover:text-emerald-600 transition line-clamp-2 leading-tight h-10">
                    {item.title}
                </h4>
                <p className="text-slate-500 text-[11px] line-clamp-2 h-8 mb-4">{item.summary || item.content.substring(0, 100)}</p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-400">👀 1.2k</span>
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
        <div className={`p-5 rounded-xl shadow-sm border border-slate-200 ${colors[color]?.bg || 'bg-white'} ${colors[color]?.border}`}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-400">
                        {author.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">{author}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span className="font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-600">{role}</span>
                            <span>•</span>
                            <span>{time}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mr-12"> {/* Indent for avatars */}
                <h3 className="font-black text-slate-800 mb-2 text-base">{title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{content}</p>

                {image && (
                    <div className="rounded-lg overflow-hidden mb-4 border border-slate-100">
                        <img src={image} className="w-full h-auto object-cover max-h-64" alt="update" />
                    </div>
                )}

                <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
                    <button className="flex items-center gap-1 text-slate-400 hover:text-rose-500 transition text-xs font-bold">
                        <span>❤️</span> أعجبني
                    </button>
                    <button className="flex items-center gap-1 text-slate-400 hover:text-blue-500 transition text-xs font-bold">
                        <span>💬</span> تعليق
                    </button>
                    <button className="flex items-center gap-1 text-slate-400 hover:text-emerald-500 transition text-xs font-bold">
                        <span>↗️</span> مشاركة
                    </button>
                </div>
            </div>
        </div>
    )
}
