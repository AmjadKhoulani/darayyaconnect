import PortalLayout from '@/Layouts/PortalLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
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
            }
        });
    };

    return (
        <PortalLayout
            auth={auth}
        >
            <Head title="التطوع" />

            <div className="py-12" dir="rtl">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Intro Banner */}
                    <div className="bg-emerald-600 rounded-3xl p-8 mb-8 text-white text-center relative overflow-hidden shadow-xl">
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold mb-4">كن جزءاً من التغيير! 🌱</h3>
                            <p className="max-w-2xl mx-auto text-emerald-50 text-lg leading-relaxed">
                                داريا تُبنى بسواعد أبنائها. انضم لفريق المتطوعين وساهم بوقتك أو مهاراتك في تحسين الحي، تنظيم الفعاليات، أو مساعدة الجيران.
                            </p>
                        </div>
                        {/* Decorative Circles */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 rounded-full bg-white opacity-10"></div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-6 px-2">📋 الفرص التطوعية المتاحة</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {opportunities.map((opp: Opportunity) => {
                            const isApplied = userApplications.includes(opp.id);
                            return (
                                <div key={opp.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold 
                                                ${opp.role_type === 'ميداني' ? 'bg-orange-100 text-orange-700' :
                                                    opp.role_type === 'تقني' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                                {opp.role_type}
                                            </span>
                                            <span className="text-slate-400 text-sm">⏱️ {opp.time_commitment}</span>
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-800 mb-2">{opp.title}</h4>
                                        <p className="text-slate-600 text-sm leading-relaxed mb-4">{opp.description}</p>
                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                            <span>📍</span> {opp.location}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                                        {isApplied ? (
                                            <button disabled className="w-full py-3 bg-slate-200 text-slate-500 rounded-xl font-bold cursor-not-allowed">
                                                ✅ تم التقديم مسبقاً
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => openModal(opp)}
                                                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200"
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
                        <div className="text-center py-12 text-slate-500">
                            لا توجد فرص تطوعية مفتوحة حالياً. عد لاحقاً!
                        </div>
                    )}
                </div>
            </div>

            {/* Application Modal */}
            <Modal show={!!selectedOpp} onClose={closeModal}>
                <div className="p-6 text-right" dir="rtl">
                    <h2 className="text-xl font-bold text-slate-900 mb-1">استمارة التطوع</h2>
                    <p className="text-sm text-slate-500 mb-6">أنت تقدم لفرصة: <span className="font-bold text-emerald-600">{selectedOpp?.title}</span></p>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <InputLabel value="الاسم الثلاثي" />
                            <TextInput
                                className="w-full mt-1 bg-slate-50"
                                value={data.full_name}
                                onChange={e => setData('full_name', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <InputLabel value="رقم الهاتف للتواصل (واتساب)" />
                            <TextInput
                                className="w-full mt-1"
                                value={data.phone_number}
                                onChange={e => setData('phone_number', e.target.value)}
                                placeholder="09xxxxxxxx"
                                required
                            />
                        </div>

                        <div>
                            <InputLabel value="أوقات التفرغ (الأيام والساعات)" />
                            <TextInput
                                className="w-full mt-1"
                                value={data.availability}
                                onChange={e => setData('availability', e.target.value)}
                                placeholder="مثال: الجمعة والسبت من 4-8 مساءً"
                                required
                            />
                        </div>

                        <div>
                            <InputLabel value="المهارات / الخبرات السابقة (اختياري)" />
                            <textarea
                                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 h-20"
                                value={data.skills}
                                onChange={e => setData('skills', e.target.value)}
                                placeholder="هل لديك خبرة في التنظيم، التصوير، الإسعافات الأولية..."
                            ></textarea>
                        </div>

                        <div>
                            <InputLabel value="لماذا ترغب بالانضمام؟ (دافعك)" />
                            <textarea
                                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 h-20"
                                value={data.motivation}
                                onChange={e => setData('motivation', e.target.value)}
                                required
                                placeholder="كلمات بسيطة تعبر عن رغبتك..."
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
                            <SecondaryButton onClick={closeModal}>إلغاء</SecondaryButton>
                            <PrimaryButton disabled={processing} className="bg-emerald-600 hover:bg-emerald-700">
                                {processing ? 'جاري الإرسال...' : 'تأكيد الانضمام ✅'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </PortalLayout>
    );
}
