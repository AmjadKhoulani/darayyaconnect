import { useEffect, FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        age: '',
        gender: 'male', // Default
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-cyan-50 p-6" dir="rtl">
            <Head title="إنشاء حساب جديد" />

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                {/* Header */}
                <div className="bg-emerald-600 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-lg mb-4">
                            💎
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">أهلاً بك في داريا</h2>
                        <p className="text-emerald-100 text-sm">أنشئ حسابك وشارك في بناء مدينتك</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="p-8 space-y-5">

                    {/* Name */}
                    <div>
                        <InputLabel htmlFor="name" value="الاسم الكامل" className="text-gray-700 font-bold mb-1" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="مثال: أحمد العبدالله"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    {/* Email */}
                    <div>
                        <InputLabel htmlFor="email" value="البريد الإلكتروني" className="text-gray-700 font-bold mb-1" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            placeholder="example@gmail.com"
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* Age & Gender Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="age" value="العمر" className="text-gray-700 font-bold mb-1" />
                            <TextInput
                                id="age"
                                type="number"
                                name="age"
                                value={data.age}
                                className="mt-1 block w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50 text-center"
                                onChange={(e) => setData('age', e.target.value)}
                                required
                                min="12"
                                max="100"
                            />
                            <InputError message={errors.age} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="gender" value="الجنس" className="text-gray-700 font-bold mb-1" />
                            <select
                                id="gender"
                                name="gender"
                                value={data.gender}
                                onChange={(e) => setData('gender', e.target.value)}
                                className="mt-1 block w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50"
                                required
                            >
                                <option value="male">ذكر 👨</option>
                                <option value="female">أنثى 👩</option>
                            </select>
                            <InputError message={errors.gender} className="mt-2" />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <InputLabel htmlFor="password" value="كلمة المرور" className="text-gray-700 font-bold mb-1" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <InputLabel htmlFor="password_confirmation" value="تأكيد كلمة المرور" className="text-gray-700 font-bold mb-1" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    <div className="pt-2">
                        <PrimaryButton className="w-full justify-center py-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-lg font-bold shadow-lg shadow-emerald-200" disabled={processing}>
                            {processing ? 'جاري الإنشاء...' : 'إنشاء الحساب 🚀'}
                        </PrimaryButton>
                    </div>

                    <div className="text-center mt-4">
                        <Link
                            href={route('login')}
                            className="text-sm text-gray-500 hover:text-emerald-600 font-bold transition"
                        >
                            لديك حساب بالفعل؟ تسجيل الدخول
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
