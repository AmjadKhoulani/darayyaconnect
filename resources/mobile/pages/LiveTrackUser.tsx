import { useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ArrowRight } from 'lucide-react';

export default function LiveTrackUser() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);

    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const name = searchParams.get('name') || 'مستخدم';

    useEffect(() => {
        if (!mapContainer.current) return;
        if (map.current) return;

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
            center: [lng, lat],
            zoom: 15
        });

        // Add Marker
        const el = document.createElement('div');
        el.className = 'flex flex-col items-center justify-center';
        el.innerHTML = `
            <div class="w-10 h-10 rounded-full border-4 border-white shadow-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                ${name.charAt(0)}
            </div>
            <div class="mt-1 bg-white px-2 py-1 rounded-lg text-xs font-bold shadow-md text-slate-800">
                ${name}
            </div>
        `;

        new maplibregl.Marker({ element: el })
            .setLngLat([lng, lat])
            .addTo(map.current);

    }, [lat, lng, name]);

    return (
        <div className="flex flex-col h-screen bg-white">
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                >
                    <ArrowRight className="text-slate-600" />
                </button>
            </div>

            <div ref={mapContainer} className="flex-1 w-full bg-slate-100" />

            <div className="bg-white p-4 pb-8 rounded-t-[32px] -mt-6 relative z-0 flex items-center gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">
                    {name.charAt(0)}
                </div>
                <div>
                    <h2 className="font-black text-slate-800">موقع {name}</h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5" dir="ltr">{lat.toFixed(5)}, {lng.toFixed(5)}</p>
                </div>
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mr-auto w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center"
                >
                    <ArrowRight className="rotate-[-45deg]" size={20} />
                </a>
            </div>
        </div>
    );
}
