import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import PortalLayout from '@/Layouts/PortalLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Opportunity {
    id: number;
    title: string;
    description: string;
    role_type: string;
    location: string;
    time_commitment: string;
}

export default function Index({ auth, opportunities, userApplications }: any) {
    const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        opportunity_id: '',
        full_name: auth.user.name,
        phone_number: '',
        availability: '',
        skills: '',
        motivation: '',
    });

    const openModal = (opp: Opportunity) => {
        setSelectedOpp(opp);
        setData('opportunity_id', opp.id.toString());
    };

    const closeModal = () => {
        setSelectedOpp(null);
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('volunteer.apply'), {
            onSuccess: () => {
                closeModal();
                alert('شكراً لك! تم إرسال طلب التطوع بنجاح.');
            },
        });
    };

    return (
        <PortalLayout auth={auth}>
            <Head title="التطوع" />

            <div className="py-12" dir="rtl">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Intro Banner */}
                    <div className="relative mb-8 overflow-hidden rounded-3xl bg-emerald-600 p-8 text-center text-white shadow-xl">
                        <div className="relative z-10">
                            <h3 className="mb-4 text-3xl font-bold">
                                كن جزءاً من التغيير! 🌱
                            </h3>
                            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-emerald-50">
                                داريا تُبنى بسواعد أبنائها. انضم لفريق المتطوعين
                                وساهم بوقتك أو مهاراتك في تحسين الحي، تنظيم
                                الفعاليات، أو مساعدة الجيران.
                            </p>
                        </div>
                        {/* Decorative Circles */}
                        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white opacity-10"></div>
                        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-40 w-40 rounded-full bg-white opacity-10"></div>
                    </div>

                    <h3 className="mb-6 px-2 text-2xl font-bold text-gray-800">
                        📋 الفرص التطوعية المتاحة
                    </h3>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {opportunities.map((opp: Opportunity) => {
                            const isApplied = userApplications.includes(opp.id);
                            return (
                                <div
                                    key={opp.id}
                                    className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <div className="flex-1 p-6">
                                        <div className="mb-4 flex items-start justify-between">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-bold ${
                                                    opp.role_type === 'ميداني'
                                                        ? 'bg-orange-100 text-orange-700'
                                                        : opp.role_type ===
                                                            'تقني'
                                                          ? 'bg-blue-100 text-blue-700'
                                                          : 'bg-purple-100 text-purple-700'
                                                }`}
                                            >
                                                {opp.role_type}
                                            </span>
                                            <span className="text-sm text-slate-400">
                                                ⏱️ {opp.time_commitment}
                                            </span>
                                        </div>
                                        <h4 className="mb-2 text-xl font-bold text-slate-800">
                                            {opp.title}
                                        </h4>
                                        <p className="mb-4 text-sm leading-relaxed text-slate-600">
                                            {opp.description}
                                        </p>
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <span>📍</span> {opp.location}
                                        </div>
                                    </div>
                                    <div className="border-t border-slate-100 bg-slate-50 p-4">
                                        {isApplied ? (
                                            <button
                                                disabled
                                                className="w-full cursor-not-allowed rounded-xl bg-slate-200 py-3 font-bold text-slate-500"
                                            >
                                                ✅ تم التقديم مسبقاً
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => openModal(opp)}
                                                className="w-full rounded-xl bg-slate-900 py-3 font-bold text-white shadow-lg shadow-slate-200 transition hover:bg-slate-800"
                                            >
                                                انضم للفريق 🚀
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {opportunities.length === 0 && (
                        <div className="py-12 text-center text-slate-500">
                            لا توجد فرص تطوعية مفتوحة حالياً. عد لاحقاً!
                        </div>
                    )}
                </div>
            </div>

            {/* Application Modal */}
            <Modal show={!!selectedOpp} onClose={closeModal}>
                <div className="p-6 text-right" dir="rtl">
                    <h2 className="mb-1 text-xl font-bold text-slate-900">
                        استمارة التطوع
                    </h2>
                    <p className="mb-6 text-sm text-slate-500">
                        أنت تقدم لفرصة:{' '}
                        <span className="font-bold text-emerald-600">
                            {selectedOpp?.title}
                        </span>
                    </p>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <InputLabel value="الاسم الثلاثي" />
                            <TextInput
                                className="mt-1 w-full bg-slate-50"
                                value={data.full_name}
                                onChange={(e) =>
                                    setData('full_name', e.target.value)
                                }
                                required
                            />
                        </div>

                        <div>
                            <InputLabel value="رقم الهاتف للتواصل (واتساب)" />
                            <TextInput
                                className="mt-1 w-full"
                                value={data.phone_number}
                                onChange={(e) =>
                                    setData('phone_number', e.target.value)
                                }
                                placeholder="09xxxxxxxx"
                                required
                            />
                        </div>

                        <div>
                            <InputLabel value="أوقات التفرغ (الأيام والساعات)" />
                            <TextInput
                                className="mt-1 w-full"
                                value={data.availability}
                                onChange={(e) =>
                                    setData('availability', e.target.value)
                                }
                                placeholder="مثال: الجمعة والسبت من 4-8 مساءً"
                                required
                            />
                        </div>

                        <div>
                            <InputLabel value="المهارات / الخبرات السابقة (اختياري)" />
                            <textarea
                                className="mt-1 h-20 w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                value={data.skills}
                                onChange={(e) =>
                                    setData('skills', e.target.value)
                                }
                                placeholder="هل لديك خبرة في التنظيم، التصوير، الإسعافات الأولية..."
                            ></textarea>
                        </div>

                        <div>
                            <InputLabel value="لماذا ترغب بالانضمام؟ (دافعك)" />
                            <textarea
                                className="mt-1 h-20 w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                value={data.motivation}
                                onChange={(e) =>
                                    setData('motivation', e.target.value)
                                }
                                required
                                placeholder="كلمات بسيطة تعبر عن رغبتك..."
                            ></textarea>
                        </div>

                        <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
                            <SecondaryButton onClick={closeModal}>
                                إلغاء
                            </SecondaryButton>
                            <PrimaryButton
                                disabled={processing}
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                {processing
                                    ? 'جاري الإرسال...'
                                    : 'تأكيد الانضمام ✅'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </PortalLayout>
    );
}
