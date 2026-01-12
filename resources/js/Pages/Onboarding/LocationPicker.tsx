import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function LocationPicker() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const marker = useRef<maplibregl.Marker | null>(null);

    // Default to Municipality Center
    const [coords, setCoords] = useState<[number, number]>([36.2365, 33.4585]);

    const { data, setData, post, processing } = useForm({
        latitude: 33.4585,
        longitude: 36.2365,
    });

    useEffect(() => {
        if (map.current) return;
        if (!mapContainer.current) return;

        // Initialize Map
        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                version: 8,
                sources: {
                    'carto-voyager': {
                        type: 'raster',
                        tiles: ['https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'],
                        tileSize: 256,
                        attribution: '&copy; CartoDB'
                    }
                },
                layers: [
                    { id: 'carto-voyager', type: 'raster', source: 'carto-voyager' }
                ]
            },
            center: coords,
            zoom: 15
        });

        // Force resize after load to fix blank canvas on mobile
        map.current.on('load', () => {
            map.current?.resize();
        });

        // Add Marker
        marker.current = new maplibregl.Marker({
            draggable: true,
            color: '#10b981' // Emerald 500
        })
            .setLngLat(coords)
            .addTo(map.current);

        marker.current.on('dragend', () => {
            const lngLat = marker.current?.getLngLat();
            if (lngLat) {
                setCoords([lngLat.lng, lngLat.lat]);
                setData('latitude', lngLat.lat);
                setData('longitude', lngLat.lng);
            }
        });

        map.current.on('click', (e) => {
            marker.current?.setLngLat(e.lngLat);
            setCoords([e.lngLat.lng, e.lngLat.lat]);
            setData('latitude', e.lngLat.lat);
            setData('longitude', e.lngLat.lng);
        });

    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/onboarding/location');
    };

    return (
        <div className="h-screen w-full relative bg-slate-100">
            <Head title="حدد موقع منزلك" />

            {/* Map Layer (Background) */}
            <div className="absolute inset-0 z-0">
                <div ref={mapContainer} className="w-full h-full" />
            </div>

            {/* Top Overlay: Instructions */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4">
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl text-center border border-white/50">
                    <h2 className="text-lg font-bold text-gray-800">أين تسكن؟ 📍</h2>
                    <p className="text-gray-600 text-xs mt-1 mb-2">حرك الدبوس لتحديد موقع منزلك</p>
                    <div className="bg-emerald-50 text-emerald-800 p-2 rounded-lg text-[10px] leading-relaxed border border-emerald-100">
                        نستخدم الموقع لإرسال تنبيهات الحي (الكهرباء والماء) فقط.
                    </div>
                </div>
            </div>

            {/* Bottom Overlay: Action */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-white via-white/80 to-transparent pt-12">
                <form onSubmit={submit}>
                    <PrimaryButton className="w-full justify-center py-4 text-lg bg-slate-900 shadow-xl rounded-xl" disabled={processing}>
                        تأكيد موقع المنزل ✅
                    </PrimaryButton>
                </form>
            </div>
        </div>
    );
}
