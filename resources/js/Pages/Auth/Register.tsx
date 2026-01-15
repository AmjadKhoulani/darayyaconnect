import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';

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
        <div
            className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-cyan-50 p-6"
            dir="rtl"
        >
            <Head title="إنشاء حساب جديد" />

            <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl">
                {/* Header */}
                <div className="relative overflow-hidden bg-emerald-600 p-8 text-center">
                    <div className="absolute left-0 top-0 h-full w-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-lg">
                            💎
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-white">
                            أهلاً بك في داريا
                        </h2>
                        <p className="text-sm text-emerald-100">
                            أنشئ حسابك وشارك في بناء مدينتك
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="space-y-5 p-8">
                    {/* Name */}
                    <div>
                        <InputLabel
                            htmlFor="name"
                            value="الاسم الكامل"
                            className="mb-1 font-bold text-gray-700"
                        />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-emerald-500 focus:ring-emerald-500"
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
                        <InputLabel
                            htmlFor="email"
                            value="البريد الإلكتروني"
                            className="mb-1 font-bold text-gray-700"
                        />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-emerald-500 focus:ring-emerald-500"
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
                            <InputLabel
                                htmlFor="age"
                                value="العمر"
                                className="mb-1 font-bold text-gray-700"
                            />
                            <TextInput
                                id="age"
                                type="number"
                                name="age"
                                value={data.age}
                                className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 text-center focus:border-emerald-500 focus:ring-emerald-500"
                                onChange={(e) => setData('age', e.target.value)}
                                required
                                min="12"
                                max="100"
                            />
                            <InputError message={errors.age} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="gender"
                                value="الجنس"
                                className="mb-1 font-bold text-gray-700"
                            />
                            <select
                                id="gender"
                                name="gender"
                                value={data.gender}
                                onChange={(e) =>
                                    setData('gender', e.target.value)
                                }
                                className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-emerald-500 focus:ring-emerald-500"
                                required
                            >
                                <option value="male">ذكر 👨</option>
                                <option value="female">أنثى 👩</option>
                            </select>
                            <InputError
                                message={errors.gender}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <InputLabel
                            htmlFor="password"
                            value="كلمة المرور"
                            className="mb-1 font-bold text-gray-700"
                        />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-emerald-500 focus:ring-emerald-500"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="تأكيد كلمة المرور"
                            className="mb-1 font-bold text-gray-700"
                        />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-emerald-500 focus:ring-emerald-500"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    <div className="pt-2">
                        <PrimaryButton
                            className="w-full justify-center rounded-xl bg-emerald-600 py-4 text-lg font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700"
                            disabled={processing}
                        >
                            {processing ? 'جاري الإنشاء...' : 'إنشاء الحساب 🚀'}
                        </PrimaryButton>
                    </div>

                    <div className="mt-4 text-center">
                        <Link
                            href={route('login')}
                            className="text-sm font-bold text-gray-500 transition hover:text-emerald-600"
                        >
                            لديك حساب بالفعل؟ تسجيل الدخول
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
