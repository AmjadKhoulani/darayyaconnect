import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Shield, X, MapPin, Loader2 } from 'lucide-react';
import { Geolocation } from '@capacitor/geolocation';
import api from '../services/api';
import { HapticService } from '../services/HapticService';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function EmergencyModal({ isOpen, onClose }: Props) {
    const [status, setStatus] = useState<'idle' | 'confirming' | 'locating' | 'sending' | 'success' | 'error'>('idle');
    const [selectedType, setSelectedType] = useState<{ id: string, label: string, icon: string } | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!isOpen) {
            // Reset status when closed
            setTimeout(() => {
                setStatus('idle');
                setSelectedType(null);
            }, 300);
        }
    }, [isOpen]);

    const initiateSOS = (type: any) => {
        setSelectedType(type);
        setStatus('confirming');
    };

    const handleConfirmedSOS = async () => {
        if (!selectedType) return;

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
            await api.post('/sos/trigger', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                emergency_type: selectedType.id,
                message: `SOS Triggered from mobile app. Type: ${selectedType.id}`
            });

            setStatus('success');
            HapticService.notificationSuccess();

            // Auto close after 3 seconds
            setTimeout(() => {
                onClose();
            }, 3000);

        } catch (error: any) {
            console.error('SOS Failed:', error);
            setStatus('error');
            setErrorMessage(error.message || 'فشل في إرسال إشارة الاستغاثة');
            HapticService.notificationError();
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[40px] p-8 shadow-2xl relative border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 z-10"
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

                {status === 'idle' && (
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { id: 'general', label: 'إشارة عامة', icon: '🆘', color: 'bg-rose-600' },
                            { id: 'medical', label: 'حالة طبية', icon: '🚑', color: 'bg-emerald-600' },
                            { id: 'fire', label: 'حريق', icon: '🔥', color: 'bg-orange-600' },
                            { id: 'security', label: 'أمن / شرطة', icon: '👮', color: 'bg-blue-600' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => initiateSOS(item)}
                                className={`flex items-center gap-4 p-4 rounded-2xl ${item.color} text-white font-bold active:scale-95 transition-all shadow-lg`}
                            >
                                <span className="text-2xl">{item.icon}</span>
                                <span className="flex-1 text-right">{item.label}</span>
                            </button>
                        ))}
                    </div>
                )}

                {status === 'confirming' && selectedType && (
                    <div className="text-center py-4">
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">تأكيد الإرسال؟</h4>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">
                            سيتم إرسال بلاغ
                            <span className="font-bold mx-1 text-rose-600">"{selectedType.label}"</span>
                            مع موقعك الحالي.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setStatus('idle')}
                                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleConfirmedSOS}
                                className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-500/30"
                            >
                                تأكيد وإرسال
                            </button>
                        </div>
                    </div>
                )}

                {(status === 'locating' || status === 'sending' || status === 'success' || status === 'error') && (
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
                                    onClick={onClose}
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
        </div>,
        document.body
    );
}
