import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Save, Layers, DollarSign, Users, Activity, List, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function AiStudyForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');

    const [form, setForm] = useState({
        title: '',
        icon: '📊',
        category: '',
        color: 'indigo',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        summary: '',
        is_published: false,
        is_featured: false,
        scenario: { current: '', withProject: '' },
        economics: { investment: '', revenue: '', payback: '', jobs: '', investmentRange: '', revenueRange: '', jobsBreakdown: '', costBreakdown: [] },
        social: { beneficiaries: '', impact: '' },
        environmental: { wasteReduction: '', emissions: '', waterSaved: '', energySaved: '' },
        implementation: { phase1: '', phase2: '', phase3: '' },
        risks: [], // Array of strings
        recommendations: [], // Array of strings
        technical_details: [] // Array of strings
    });

    useEffect(() => {
        if (isEdit) {
            fetchStudy();
        }
    }, [id]);

    const fetchStudy = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/ai-studies/${id}`);
            // Merge defaults for missing nested fields to avoid crashes
            setForm(prev => ({
                ...prev,
                ...res.data,
                scenario: res.data.scenario || prev.scenario,
                economics: res.data.economics || prev.economics,
                social: res.data.social || prev.social,
                environmental: res.data.environmental || prev.environmental,
                implementation: res.data.implementation || prev.implementation,
            }));
        } catch (err) {
            alert('فشل تحميل البيانات');
            navigate('/admin/ai-studies');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const url = isEdit ? `/admin/manage/ai-studies/${id}` : '/admin/manage/ai-studies';
            await api.post(url, form); // Using POST for both as per Laravel resource usually, or update logic might need PUT but plan said store/update via post in usage
            navigate('/admin/ai-studies');
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'فشل الحفظ');
        } finally {
            setSubmitting(false);
        }
    };

    const updateField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const updateNested = (section: string, key: string, value: any) => {
        setForm(prev => {
            const sectionData = prev[section as keyof typeof prev] as Record<string, any>;
            return {
                ...prev,
                [section]: { ...sectionData, [key]: value }
            };
        });
    };

    const tabs = [
        { id: 'basic', label: 'الأساسي', icon: <Layers size={18} /> },
        { id: 'scenario', label: 'السيناريو', icon: <Activity size={18} /> },
        { id: 'economics', label: 'الاقتصاد', icon: <DollarSign size={18} /> },
        { id: 'impact', label: 'الأثر', icon: <Users size={18} /> },
        { id: 'plan', label: 'التنفيذ', icon: <List size={18} /> },
    ];

    if (loading) return <div className="p-10 text-center">جاري التحميل...</div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
            <header className="bg-white border-b border-slate-100 sticky top-0 z-10 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                        <ArrowRight className="text-slate-600" />
                    </button>
                    <h1 className="text-lg font-black text-slate-800">{isEdit ? 'تعديل دراسة' : 'دراسة جديدة'}</h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
                >
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    <span>حفظ</span>
                </button>
            </header>

            <div className="sticky top-[73px] z-10 bg-white border-b border-slate-100 overflow-x-auto">
                <div className="flex p-2 gap-2 min-w-max">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === tab.id
                                ? 'bg-slate-800 text-white'
                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <main className="p-4 max-w-2xl mx-auto space-y-6">

                {activeTab === 'basic' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">عنوان الدراسة</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={e => updateField('title', e.target.value)}
                                className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 outline-none font-bold"
                                placeholder="مثلاً: مشروع الطاقة الشمسية"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">التصنيف</label>
                                <select
                                    value={form.category}
                                    onChange={e => updateField('category', e.target.value)}
                                    className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 outline-none"
                                >
                                    <option value="">اختر...</option>
                                    <option value="نقل ومواصلات">نقل ومواصلات</option>
                                    <option value="بنية تحتية">بنية تحتية</option>
                                    <option value="طاقة">طاقة</option>
                                    <option value="بيئة">بيئة</option>
                                    <option value="اقتصاد">اقتصاد</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">الأيقونة (Emoji)</label>
                                <input
                                    type="text"
                                    value={form.icon}
                                    onChange={e => updateField('icon', e.target.value)}
                                    className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 outline-none text-center text-xl"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">الملخص التنفيذي</label>
                            <textarea
                                value={form.summary}
                                onChange={e => updateField('summary', e.target.value)}
                                className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 outline-none h-32"
                                placeholder="وصف مختصر للدراسة..."
                            />
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.is_published}
                                    onChange={e => updateField('is_published', e.target.checked)}
                                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="font-bold text-slate-700">نشر الدراسة للعموم</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.is_featured}
                                    onChange={e => updateField('is_featured', e.target.checked)}
                                    className="w-5 h-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                                />
                                <span className="font-bold text-slate-700">تمييز الدراسة (Featured)</span>
                            </label>
                        </div>
                    </div>
                )}

                {activeTab === 'scenario' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">الوضع الحالي (المشكلة)</label>
                            <textarea
                                value={form.scenario.current}
                                onChange={e => updateNested('scenario', 'current', e.target.value)}
                                className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 outline-none h-40"
                                placeholder="وصف المشكلة الحالية..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">مع المشروع (الحل)</label>
                            <textarea
                                value={form.scenario.withProject}
                                onChange={e => updateNested('scenario', 'withProject', e.target.value)}
                                className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 outline-none h-40"
                                placeholder="كيف سيصبح الوضع بعد التنفيذ..."
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'economics' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">تكلفة الاستثمار</label>
                                <input
                                    type="text"
                                    value={form.economics.investment}
                                    onChange={e => updateNested('economics', 'investment', e.target.value)}
                                    className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 outline-none"
                                    placeholder="مثلاً: $50,000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">العائد المتوقع</label>
                                <input
                                    type="text"
                                    value={form.economics.revenue}
                                    onChange={e => updateNested('economics', 'revenue', e.target.value)}
                                    className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 outline-none"
                                    placeholder="مثلاً: $10,000 / سنوياً"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">فترة الاسترداد</label>
                                <input
                                    type="text"
                                    value={form.economics.payback}
                                    onChange={e => updateNested('economics', 'payback', e.target.value)}
                                    className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 outline-none"
                                    placeholder="مثلاً: 5 سنوات"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">فرص العمل</label>
                                <input
                                    type="text"
                                    value={form.economics.jobs}
                                    onChange={e => updateNested('economics', 'jobs', e.target.value)}
                                    className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 outline-none"
                                    placeholder="عدد الوظائف"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'impact' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="font-black text-slate-800 border-b pb-2">الأثر الاجتماعي</h3>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">المستفيدون</label>
                            <input
                                type="text"
                                value={form.social.beneficiaries}
                                onChange={e => updateNested('social', 'beneficiaries', e.target.value)}
                                className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 outline-none"
                                placeholder="مثلاً: سكان الحي الشمالي"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">وصف الأثر</label>
                            <textarea
                                value={form.social.impact}
                                onChange={e => updateNested('social', 'impact', e.target.value)}
                                className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 outline-none h-24"
                            />
                        </div>

                        <h3 className="font-black text-slate-800 border-b pb-2 pt-4">الأثر البيئي</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">تقليل النفايات</label>
                                <input
                                    type="text"
                                    value={form.environmental.wasteReduction}
                                    onChange={e => updateNested('environmental', 'wasteReduction', e.target.value)}
                                    className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">توفير الطاقة</label>
                                <input
                                    type="text"
                                    value={form.environmental.energySaved}
                                    onChange={e => updateNested('environmental', 'energySaved', e.target.value)}
                                    className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'plan' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">المرحلة الأولى (التأسيس)</label>
                            <textarea
                                value={form.implementation.phase1}
                                onChange={e => updateNested('implementation', 'phase1', e.target.value)}
                                className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 outline-none h-24"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">المرحلة الثانية (التشغيل)</label>
                            <textarea
                                value={form.implementation.phase2}
                                onChange={e => updateNested('implementation', 'phase2', e.target.value)}
                                className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 outline-none h-24"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">المرحلة الثالثة (التوسع)</label>
                            <textarea
                                value={form.implementation.phase3}
                                onChange={e => updateNested('implementation', 'phase3', e.target.value)}
                                className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 outline-none h-24"
                            />
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
