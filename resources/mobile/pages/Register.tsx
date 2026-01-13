import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Crosshair, MapPin, UserPlus } from 'lucide-react';
import { Geolocation } from '@capacitor/geolocation';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: '',
        gender: 'male',
        password: '',
        password_confirmation: '',
        mobile: '',
        country_code: '+963'
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const res = await api.post('/register', {
                ...formData,
                device_name: 'android_mobile'
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            // Redirect to Location Setup instead of Home
            navigate('/setup-location');
        } catch (err: any) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ general: 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev: any) => ({ ...prev, [field]: null }));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-10 transition-colors duration-300" dir="rtl">
            <div className="w-full max-w-md mx-auto px-6">

                {/* Clean Logo & Branding */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl mx-auto flex items-center justify-center border border-emerald-100 dark:border-emerald-800 mb-4 rotate-3">
                        <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">د</span>
                    </div>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">إنشاء حساب جديد</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">انضم إلى مجتمع داريا وابدأ المشاركة</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 p-6 rounded-3xl shadow-premium space-y-4">
                    {/* General Error */}
                    {errors.general && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-xs font-bold">
                            {errors.general}
                        </div>
                    )}

                    {/* Name */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-1">الاسم الكامل</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 text-sm"
                            placeholder="مثال: أحمد العبدالله"
                            required
                        />
                        {errors.name && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.name[0]}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-1">البريد الإلكتروني</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 text-sm"
                            placeholder="example@gmail.com"
                            required
                        />
                        {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.email[0]}</p>}
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-1">رقم الموبايل</label>
                        <div className="flex gap-2" dir="ltr">
                            {/* Independence Flag CSS */}
                            <div className="relative">
                                <select
                                    value={formData.country_code}
                                    onChange={(e) => handleChange('country_code', e.target.value)}
                                    className="h-full pl-8 pr-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 text-sm text-center appearance-none cursor-pointer w-[110px]"
                                >
                                    <option value="+963">SY (+963)</option>
                                    <option value="+971">AE (+971)</option>
                                    <option value="+966">SA (+966)</option>
                                    <option value="+962">JO (+962)</option>
                                    <option value="+90">TR (+90)</option>
                                    <option value="+1">US (+1)</option>
                                    <option value="+44">UK (+44)</option>
                                    <option value="+49">DE (+49)</option>
                                </select>
                                {/* Custom Flag Overlay */}
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-3.5 rounded-sm overflow-hidden pointer-events-none shadow-sm flex flex-col">
                                    {formData.country_code === '+963' ? (
                                        <>
                                            <div className="h-[33%] bg-[#007a3d]"></div>
                                            <div className="h-[33%] bg-white relative flex items-center justify-center gap-[1px]">
                                                <span className="text-[4px] text-red-600 leading-none block pt-[1px]">★</span>
                                                <span className="text-[4px] text-red-600 leading-none block pt-[1px]">★</span>
                                                <span className="text-[4px] text-red-600 leading-none block pt-[1px]">★</span>
                                            </div>
                                            <div className="h-[33%] bg-black"></div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-[8px]">🌍</div>
                                    )}
                                </div>
                            </div>

                            <input
                                type="tel"
                                value={formData.mobile}
                                onChange={(e) => handleChange('mobile', e.target.value)}
                                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 text-sm text-left font-mono"
                                placeholder="933XXXXXX"
                                required
                            />
                        </div>
                        {errors.mobile && <p className="text-red-500 text-[10px] mt-1 font-bold text-right">{errors.mobile[0]}</p>}
                    </div>

                    {/* Age & Gender Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-1">العمر</label>
                            <input
                                type="number"
                                value={formData.age}
                                onChange={(e) => handleChange('age', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-800 dark:text-slate-100 text-center text-sm"
                                min="12"
                                max="100"
                                required
                            />
                            {errors.age && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.age[0]}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-1">الجنس</label>
                            <select
                                value={formData.gender}
                                onChange={(e) => handleChange('gender', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-800 dark:text-slate-100 text-sm appearance-none"
                                required
                            >
                                <option value="male" className="dark:bg-slate-800">ذكر 👨</option>
                                <option value="female" className="dark:bg-slate-800">أنثى 👩</option>
                            </select>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-1">كلمة المرور</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 text-sm"
                            required
                        />
                        {errors.password && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.password[0]}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-1">تأكيد كلمة المرور</label>
                        <input
                            type="password"
                            value={formData.password_confirmation}
                            onChange={(e) => handleChange('password_confirmation', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 text-sm"
                            required
                        />
                    </div>

                    {/* Removed Location Picker */}
                    {/* Removed Residency Toggle */}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span>إنشاء حساب جديد</span>
                                <UserPlus size={20} />
                            </>
                        )}
                    </button>
                </form>

                {/* Link to Login */}
                <div className="text-center mt-6 mb-10">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        لديك حساب بالفعل؟{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline transition-colors"
                        >
                            تسجيل الدخول
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
