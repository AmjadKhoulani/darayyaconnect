import EventWidget from '@/Components/EventWidget';
import PollWidget from '@/Components/PollWidget';
import RenaissanceSection from '@/Components/RenaissanceSection';
import ServiceLogWidget from '@/Components/ServiceLogWidget';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

interface Props {
    auth: any;
    userLogs: string[];
    communityStats: {
        electricity: number;
        water: string;
    };
    notifications: any[];
    active_poll?: any;
    upcoming_events?: any[];
    pharmacy_status?: 'open' | 'closed' | null;
}

export default function Dashboard({
    auth,
    userLogs,
    communityStats,
    notifications,
    active_poll,
    upcoming_events,
    pharmacy_status,
}: Props) {
    const { post: toggleDuty, processing: switchingDuty } = useForm({});

    const handleToggleDuty = (newStatus: string) => {
        toggleDuty(route('pharmacy.duty.toggle', { status: newStatus }));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-black leading-tight text-slate-900">
                    👤 المركز الرقمي
                </h2>
            }
        >
            <Head title="المركز الرقمي" />

            <div className="py-6" dir="rtl">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Pharmacist Specific Section */}
                    {auth.user.profession === 'pharmacist' && (
                        <div className="relative mb-8 overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                            <div className="absolute left-0 top-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-50 opacity-50"></div>
                            <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
                                <div>
                                    <h3 className="mb-2 flex items-center gap-2 text-xl font-black text-slate-900">
                                        <span className="text-2xl">💊</span>{' '}
                                        إدارة المناوبة الصيدلانية
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        بصفتك صيدلي موثق، يمكنك تحديث حالة
                                        "الصيدليات المناوبة" ليتم عرضها في
                                        الصفحة الرئيسية للمدينة.
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleToggleDuty('open')}
                                        disabled={switchingDuty}
                                        className={`rounded-2xl px-8 py-3 font-bold transition-all ${pharmacy_status === 'open' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'}`}
                                    >
                                        🟢 متاح (مناوب الآن)
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleToggleDuty('closed')
                                        }
                                        disabled={switchingDuty}
                                        className={`rounded-2xl px-8 py-3 font-bold transition-all ${pharmacy_status === 'closed' ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600'}`}
                                    >
                                        🔴 غير متاح
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Hero Section: Community Stats */}
                    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Electricity Status */}
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100 to-orange-50 p-6 shadow-sm dark:from-amber-900/40 dark:to-slate-800">
                            <div className="relative z-10">
                                <h3 className="mb-1 flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                                    <span className="text-2xl">⚡</span> حالة
                                    الكهرباء
                                </h3>
                                <div className="mt-4">
                                    <span className="text-4xl font-black text-slate-800 dark:text-white">
                                        {Number(
                                            communityStats.electricity,
                                        ).toFixed(1)}
                                    </span>
                                    <span className="mr-2 text-lg text-gray-600 dark:text-gray-300">
                                        ساعة وصل
                                    </span>
                                </div>
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    متوسط ساعات الوصل في منطقتك اليوم
                                </p>
                            </div>
                            <div className="absolute -bottom-6 -left-6 rotate-12 text-9xl opacity-10">
                                ⚡
                            </div>
                        </div>

                        {/* Water Status */}
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-100 to-blue-50 p-6 shadow-sm dark:from-cyan-900/40 dark:to-slate-800">
                            <div className="relative z-10">
                                <h3 className="mb-1 flex items-center gap-2 font-bold text-cyan-800 dark:text-cyan-300">
                                    <span className="text-2xl">💧</span> حالة
                                    المياه
                                </h3>
                                <div className="mt-4">
                                    <span className="text-2xl font-black text-slate-800 dark:text-white">
                                        {communityStats.water === 'Water Came'
                                            ? 'متوفرة اليوم 🌊'
                                            : 'لا يوجد ضخ 🏜️'}
                                    </span>
                                </div>
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    {communityStats.water === 'Water Came'
                                        ? 'المياه وصلت إلى شبكتك الرئيسية'
                                        : 'لم يتم تسجيل ضخ مياه حتى الآن'}
                                </p>
                            </div>
                            <div className="absolute -bottom-6 -left-6 rotate-12 text-9xl opacity-10">
                                💧
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Main Feed (Actions & Polls) */}
                        <div className="space-y-8 lg:col-span-2">
                            {/* Actions Needed: Service Log */}
                            {(!userLogs.includes('electricity') ||
                                !userLogs.includes('water')) && (
                                <ServiceLogWidget
                                    userLogs={userLogs}
                                    communityStats={communityStats}
                                />
                            )}

                            {/* Active Alerts */}
                            {notifications.map((note) => (
                                <div
                                    key={note.id}
                                    className="rounded-r border-l-4 border-red-500 bg-red-50 p-4 shadow-sm"
                                >
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg
                                                className="h-5 w-5 text-red-500"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="mr-3">
                                            <h3 className="text-sm font-medium text-red-800">
                                                {note.data.title}
                                            </h3>
                                            <div className="mt-2 text-sm text-red-700">
                                                <p>{note.data.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Active Poll */}
                            {active_poll && <PollWidget poll={active_poll} />}

                            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
                                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                                    <span className="rounded-lg bg-slate-100 p-2">
                                        📢
                                    </span>
                                    آخر الأخبار
                                </h3>
                                <p className="py-8 text-center text-gray-500">
                                    لا يوجد أخبار جديدة لعرضها.
                                </p>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Upcoming Events */}
                            {upcoming_events && (
                                <EventWidget events={upcoming_events} />
                            )}

                            {/* Future widgets: Weather, Prayer Times... */}
                        </div>
                    </div>

                    {/* Renaissance & Global Experiences Section */}
                    <div className="mt-8">
                        <RenaissanceSection compact={true} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
