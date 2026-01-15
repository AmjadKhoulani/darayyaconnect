import { useState } from 'react';
import { AlertCircle, Shield, X, MapPin, Loader2 } from 'lucide-react';
import { Geolocation } from '@capacitor/geolocation';
import api from '../services/api';
import { HapticService } from '../services/HapticService';

export default function SOSButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<'idle' | 'locating' | 'sending' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSOS = async (type: string) => {
        try {
            setStatus('locating');
            HapticService.heavyImpact();

            // 1. Get Location
            const position = await Geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 10000
            });

            setStatus('sending');

            // 2. Send to API
            await api.post('/api/sos/trigger', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                emergency_type: type,
                message: `SOS Triggered from mobile app. Type: ${type}`
            });

            setStatus('success');
            HapticService.notificationSuccess();

            // Auto close after 3 seconds
            setTimeout(() => {
                setIsOpen(false);
                setStatus('idle');
            }, 5000);

        } catch (error: any) {
            console.error('SOS Failed:', error);
            setStatus('error');
            setErrorMessage(error.message || 'فشل في إرسال إشارة الاستغاثة');
            HapticService.notificationError();
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => {
                    setIsOpen(true);
                    HapticService.mediumImpact();
                }}
                className="fixed bottom-24 left-6 z-[110] w-14 h-14 bg-rose-600 dark:bg-rose-500 rounded-full flex items-center justify-center text-white shadow-[0_10px_25px_-5px_rgba(225,29,72,0.4)] active:scale-90 transition-all border-4 border-white dark:border-slate-800 animate-pulse"
            >
                <AlertCircle size={28} />
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
                </span>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[40px] p-8 shadow-2xl relative border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-3xl flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto mb-4 animate-bounce">
                        <Shield size={40} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">استغاثة طارئة (SOS)</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">اختر نوع الطارئ وسيتم إرسال موقعك فوراً لغرفة العمليات</p>
                </div>

                {status === 'idle' ? (
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { id: 'general', label: 'إشارة عامة', icon: '🆘', color: 'bg-rose-600' },
                            { id: 'medical', label: 'حالة طبية', icon: '🚑', color: 'bg-emerald-600' },
                            { id: 'fire', label: 'حريق', icon: '🔥', color: 'bg-orange-600' },
                            { id: 'security', label: 'أمن / شرطة', icon: '👮', color: 'bg-blue-600' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleSOS(item.id)}
                                className={`flex items-center gap-4 p-4 rounded-2xl ${item.color} text-white font-bold active:scale-95 transition-all shadow-lg`}
                            >
                                <span className="text-2xl">{item.icon}</span>
                                <span className="flex-1 text-right">{item.label}</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                        {status === 'locating' && (
                            <>
                                <div className="relative mb-6">
                                    <MapPin size={60} className="text-emerald-500 animate-bounce" />
                                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
                                </div>
                                <p className="font-bold text-slate-800 dark:text-white">جاري تحديد الموقع...</p>
                            </>
                        )}
                        {status === 'sending' && (
                            <>
                                <Loader2 size={60} className="text-rose-500 animate-spin mb-6" />
                                <p className="font-bold text-slate-800 dark:text-white">جاري إرسال إشارة الاستغاثة...</p>
                            </>
                        )}
                        {status === 'success' && (
                            <>
                                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                                    <Shield size={40} />
                                </div>
                                <h4 className="text-xl font-black text-emerald-600 dark:text-emerald-400 mb-2">تم الإرسال بنجاح!</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">تم تحديد موقعك بدقة، الفرق المختصة في طريقها إليك.</p>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold"
                                >
                                    فهمت
                                </button>
                            </>
                        )}
                        {status === 'error' && (
                            <>
                                <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6">
                                    <X size={40} />
                                </div>
                                <h4 className="text-xl font-black text-rose-600 mb-2">حدث خطأ!</h4>
                                <p className="text-rose-500/80 text-sm mb-6">{errorMessage}</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="px-8 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold"
                                >
                                    حاول مجدداً
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
