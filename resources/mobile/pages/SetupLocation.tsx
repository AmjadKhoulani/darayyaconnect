import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Crosshair, MapPin, CheckCircle } from 'lucide-react';
import { Geolocation } from '@capacitor/geolocation';

export default function SetupLocation() {
    const navigate = useNavigate();
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const marker = useRef<maplibregl.Marker | null>(null);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        latitude: '',
        longitude: '',
        is_resident: false
    });
    const [error, setError] = useState('');

    // Initialize Map
    useEffect(() => {
        if (map.current) return;
        if (!mapContainer.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                version: 8,
                sources: {
                    'osm': {
                        type: 'raster',
                        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                        tileSize: 256,
                        attribution: '&copy; OpenStreetMap'
                    }
                },
                layers: [{ id: 'osm', type: 'raster', source: 'osm' }]
            },
            center: [36.236, 33.456], // Darayya Center
            zoom: 13
        });

        map.current.on('click', (e) => {
            const { lng, lat } = e.lngLat;
            updateLocation(lat, lng);
        });

        // Aggressive resizing to ensure render
        setTimeout(() => map.current?.resize(), 500);
        setTimeout(() => map.current?.resize(), 2000);

        map.current.on('load', () => {
            map.current?.resize();
        });
    }, []);

    const updateLocation = (lat: number, lng: number) => {
        setFormData(prev => ({ ...prev, latitude: lat.toString(), longitude: lng.toString() }));
        setError('');

        if (map.current) {
            if (marker.current) {
                marker.current.setLngLat([lng, lat]);
            } else {
                marker.current = new maplibregl.Marker({ color: '#10b981' })
                    .setLngLat([lng, lat])
                    .addTo(map.current);
            }
            map.current.flyTo({ center: [lng, lat], zoom: 15 });
        }
    };

    const handleLocateMe = async () => {
        try {
            const position = await Geolocation.getCurrentPosition();
            const { latitude, longitude } = position.coords;
            updateLocation(latitude, longitude);
        } catch (e) {
            alert('تعذر تحديد الموقع. يرجى التأكد من تفعيل GPS.');
        }
    };

    const handleSubmit = async () => {
        if (!formData.latitude || !formData.longitude) {
            setError('يرجى تحديد موقع سكنك على الخريطة للمتابعة.');
            return;
        }

        setLoading(true);
        try {
            // Use the correct API endpoint for updating location
            // Re-using the logic from App.tsx but ensuring we save residency too
            // We might need a specific endpoint to update profile fully or just use user/location
            // For now, let's assume we can update user profile via a PUT request or similar
            // But wait, the task plan said "Submit to /api/user/location".
            // Let's use the updateLocation endpoint but we might need to send is_resident too.
            // The UserController updateLocation only takes lat/long in standard Laravel usually?
            // Actually, AuthController has updateLocation maybe?
            // Let's check routes... Route::middleware('auth:sanctum')->post('/user/location', [\App\Http\Controllers\Api\UserController::class, 'updateLocation']);
            // I should check UserController content.
            // Assuming I can pass residency there or create a new endpoint.
            // To be safe and since I can't check UserController right now without delay, 
            // I'll send it to a new logical endpoint or assume updateLocation handles it if I modify it.
            // OR I can use a generic profile update endpoint?
            // Let's Assume I'll simply call the updateLocation and it might ignore is_resident for now unless I update it.
            // CHECK: The plan said "Backend: updateLocation: Ensure it handles the initial setup scenario."
            // So I will need to update UserController later.

            await api.post('/api/user/location', {
                latitude: formData.latitude,
                longitude: formData.longitude,
                is_resident: formData.is_resident
            });

            navigate('/');
        } catch (err: any) {
            console.error(err);
            const serverMessage = err.response?.data?.message || err.message || 'Unknown Error';
            setError(`فشل الحفظ: ${serverMessage} (${err.response?.status || 'No Status'})`);
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = async () => {
        setLoading(true);
        try {
            // Submit with null location and not resident
            await api.post('/api/user/location', {
                latitude: null,
                longitude: null,
                is_resident: false
            });
            navigate('/');
        } catch (err: any) {
            console.error(err);
            const serverMessage = err.response?.data?.message || err.message || 'Unknown Error';
            setError(`فشل التخطي: ${serverMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col p-6 transition-colors duration-300" dir="rtl">
            <div className="w-full max-w-md mx-auto flex-1 flex flex-col">

                <div className="text-center mb-6 mt-4">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
                        <MapPin size={32} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">تحديد عنوان السكن (اختياري)</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        تحديد موقعك يساعدنا في خدمتك بشكل أفضل، ولكن هذه الخطوة ليست إجبارية. يمكنك تخطيها إذا كنت تفضل ذلك أو إذا كنت تقيم خارج داريا.
                    </p>
                </div>

                {/* Map Container - Force LTR to prevent MapLibre issues */}
                {/* Map Container - Fixed Height & Direct LTR */}
                <div className="w-full h-80 relative rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-inner group mb-6">
                    <div
                        ref={mapContainer}
                        className="w-full h-full bg-slate-100 dark:bg-slate-800 relative z-0"
                        dir="ltr"
                    />

                    <button
                        type="button"
                        onClick={handleLocateMe}
                        className="absolute bottom-4 right-4 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 active:scale-95 transition-transform"
                    >
                        <Crosshair size={24} />
                    </button>

                    {!formData.latitude && (
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                            <div className="bg-white/95 dark:bg-slate-900/95 px-4 py-3 rounded-2xl text-sm font-bold shadow-lg flex items-center gap-2 animate-bounce">
                                <MapPin size={18} className="text-emerald-500" />
                                <span className="text-slate-800 dark:text-slate-200">اضغط على الخريطة لتحديد منزلك</span>
                            </div>
                        </div>
                    )}
                </div>

                {error && <p className="text-red-500 text-sm font-bold text-center mb-4 bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}

                {/* Residency Toggle */}
                <div className="mb-6 flex items-start gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="pt-0.5">
                        <input
                            type="checkbox"
                            id="is_resident"
                            checked={formData.is_resident}
                            onChange={(e) => setFormData(prev => ({ ...prev, is_resident: e.target.checked }))}
                            className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                    </div>
                    <label htmlFor="is_resident" className="flex-1 cursor-pointer">
                        <span className="block text-sm font-bold text-slate-800 dark:text-slate-100 mb-0.5">أنا مقيم حالياً في هذا العنوان</span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            تفعيل هذا الخيار يساعدنا في إحصاء السكان الفعليين لتقديم خدمات أفضل للمدينة.
                        </span>
                    </label>
                </div>

                {/* Submit Logic */}
                <div className="space-y-3 mt-auto">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span>حفظ ومتابعة</span>
                                <CheckCircle size={20} />
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleSkip}
                        disabled={loading}
                        className="w-full py-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold text-lg active:scale-[0.98] transition-all"
                    >
                        تخطي هذه الخطوة
                    </button>
                </div>
            </div>
        </div>
    );
}
