import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import ReportModal from './ReportModal';
import TimeSlider from './TimeSlider';

interface InfrastructurePoint {
    id: number;
    type: string;
    latitude: number;
    longitude: number;
    status: string;
    name: string;
    metadata: any;
}

export default function Map() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [points, setPoints] = useState<InfrastructurePoint[]>([]);

    // UI State
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);
    const [currentStyle, setCurrentStyle] = useState('osm'); // osm, satellite, dark
    const [selectedFeature, setSelectedFeature] = useState<any>(null); // Floating Card State

    // Constants
    const DARAYYA_LNG_LAT: [number, number] = [36.2364, 33.4586];
    const DARAYYA_BOUNDS: [[number, number], [number, number]] = [
        [36.20, 33.43], // Southwest
        [36.28, 33.49]  // Northeast
    ];

    useEffect(() => {
        // Fetch infrastructure points
        fetch('/api/infrastructure/layers')
            .then(res => res.json())
            .then(data => {
                setPoints(data);
            })
            .catch(err => console.error(err));
    }, []);

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
                        tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
                        tileSize: 256,
                        attribution: '&copy; OpenStreetMap',
                        maxzoom: 19
                    },
                    'satellite': {
                        type: 'raster',
                        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
                        tileSize: 256,
                        attribution: '&copy; Esri',
                        maxzoom: 19
                    },
                    'dark': {
                        type: 'raster',
                        tiles: ['https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'],
                        tileSize: 256,
                        attribution: '&copy; CartoDB',
                        maxzoom: 19
                    }
                },
                layers: [
                    { id: 'satellite', type: 'raster', source: 'satellite', layout: { visibility: 'none' } },
                    { id: 'dark', type: 'raster', source: 'dark', layout: { visibility: 'none' } },
                    { id: 'osm', type: 'raster', source: 'osm', layout: { visibility: 'visible' } },
                ]
            },
            center: DARAYYA_LNG_LAT,
            zoom: 15,
            pitch: 60,
            bearing: -17.6,
            maxBounds: DARAYYA_BOUNDS
        });

        // Add controls
        map.current.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-left');

        // Handle Map Load
        map.current.on('load', () => {
            setLoading(false);

            // Fetch Vector Layers (Buildings & Streets)
            fetch('/api/infrastructure/vector-layers')
                .then(res => res.json())
                .then(geoJsonData => {
                    map.current?.addSource('vector-data', {
                        type: 'geojson',
                        data: geoJsonData
                    });

                    // Add 3D Buildings Layer
                    if (map.current && !map.current.getLayer('3d-buildings')) {
                        map.current.addLayer({
                            'id': '3d-buildings',
                            'source': 'vector-data',
                            'type': 'fill-extrusion',
                            'filter': ['in', 'type', 'public_building', 'school', 'health_center', 'park'], // Only buildings
                            'paint': {
                                'fill-extrusion-color': ['get', 'color'],
                                'fill-extrusion-height': ['get', 'height'],
                                'fill-extrusion-base': 0,
                                'fill-extrusion-opacity': 0.9
                            }
                        });
                    }

                    // Add Neighborhood Zones Layer (Pulse Layer) 💓
                    if (map.current && !map.current.getLayer('neighborhood-pulse')) {
                        map.current.addLayer({
                            'id': 'neighborhood-pulse',
                            'source': 'vector-data',
                            'type': 'fill',
                            'filter': ['==', 'type', 'neighborhood_zone'],
                            'layout': {},
                            'paint': {
                                'fill-color': [
                                    'case',
                                    ['boolean', ['feature-state', 'active'], false],
                                    '#fbbf24', // Amber-400 (Gold) for Active
                                    '#334155'  // Slate-700 (Dark) for Inactive
                                ],
                                'fill-opacity': [
                                    'case',
                                    ['boolean', ['feature-state', 'active'], false],
                                    0.4, // Brighter
                                    0.1  // Dim
                                ]
                            }
                        }, '3d-buildings'); // Place BELOW buildings
                    }

                    // Add Road Network Layer (Lines)
                    if (map.current && !map.current.getLayer('road-network')) {
                        map.current.addLayer({
                            'id': 'road-network',
                            'source': 'vector-data',
                            'type': 'line',
                            'filter': ['==', 'type', 'road'],
                            'paint': {
                                'line-color': ['get', 'color'],
                                'line-width': 4,
                                'line-opacity': 0.8
                            }
                        });
                    }

                    // Click Handling Helper
                    const handleFeatureClick = (e: any) => {
                        if (!map.current) return;
                        const feature = e.features?.[0];
                        if (!feature) return;

                        e.preventDefault();

                        // Debug log
                        console.log('Feature clicked:', feature.properties);

                        setSelectedFeature({
                            name: feature.properties?.name,
                            category: feature.properties?.category,
                            height: feature.properties?.height,
                            condition: feature.properties?.status === 'active' ? 'good' : 'poor',
                            status: feature.properties?.status,
                            color: feature.properties?.color,
                            id: feature.properties?.id,
                            project_id: feature.properties?.project_id // Capture Project ID
                        });
                    };

                    // Bind Click Handlers
                    map.current?.on('click', '3d-buildings', handleFeatureClick);
                    map.current?.on('click', 'road-network', handleFeatureClick);

                    // Cursor effects
                    const setPointer = () => map.current && (map.current.getCanvas().style.cursor = 'pointer');
                    const setDefault = () => map.current && (map.current.getCanvas().style.cursor = '');

                    map.current?.on('mouseenter', '3d-buildings', setPointer);
                    map.current?.on('mouseleave', '3d-buildings', setDefault);
                    map.current?.on('mouseenter', 'road-network', setPointer);
                    map.current?.on('mouseleave', 'road-network', setDefault);
                })
                .catch(err => console.error('Failed to load vector layers', err));

            // Add Mask Layer (GeoJSON) - Keeps focus on Darayya
            const world = [[-180, 90], [180, 90], [180, -90], [-180, -90], [-180, 90]];
            const darayyaPolygon = [
                [36.2100, 33.4700], // NW
                [36.2600, 33.4700], // NE
                [36.2600, 33.4400], // SE
                [36.2100, 33.4400], // SW
                [36.2100, 33.4700]  // Close loop
            ];

            map.current?.addSource('mask-source', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: { type: 'Polygon', coordinates: [world, darayyaPolygon] },
                    properties: {}
                }
            });

            map.current?.addLayer({
                id: 'z-mask',
                type: 'fill',
                source: 'mask-source',
                layout: {},
                paint: {
                    'fill-color': '#0f172a',
                    'fill-opacity': 0.85
                }
            });
        });

        // Handle Click for Reporting
        map.current.on('click', (e) => {
            setSelectedCoords([e.lngLat.lng, e.lngLat.lat]);
            setModalOpen(true);
        });

        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, []);

    // Style Switching Logic
    const changeStyle = (style: string) => {
        if (!map.current) return;

        setCurrentStyle(style);

        // Hide all, show selected
        ['osm', 'satellite', 'dark'].forEach(s => {
            map.current?.setLayoutProperty(s, 'visibility', s === style ? 'visible' : 'none');
        });
    };

    // Heatmap Toggle Logic
    // Heatmap Logic
    // Heatmap Logic
    const [heatmapMode, setHeatmapMode] = useState<'none' | 'problems' | 'coverage'>('none');
    const [heatmapTime, setHeatmapTime] = useState(24); // Hours ago

    useEffect(() => {
        if (!map.current) return;

        // Clean up previous layers if switching
        if (heatmapMode === 'none') {
            if (map.current.getLayer('heatmap-layer')) {
                map.current.setLayoutProperty('heatmap-layer', 'visibility', 'none');
            }
            return;
        }

        const type = heatmapMode; // 'problems' or 'coverage'
        const colorScale: any = type === 'coverage' ? [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(33,102,172,0)',
            0.2, 'rgb(166, 219, 160)', // Light Green
            0.4, 'rgb(116, 196, 118)',
            0.6, 'rgb(65, 171, 93)',
            0.8, 'rgb(35, 139, 69)',
            1, 'rgb(0, 90, 50)'        // Dark Green
        ] : [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(33,102,172,0)',
            0.2, 'rgb(103,169,207)',
            0.4, 'rgb(209,229,240)',
            0.6, 'rgb(253,219,199)', // Orange/Red ramp
            0.8, 'rgb(239,138,98)',
            1, 'rgb(178,24,43)'
        ];

        // Fetch data
        const endpoint = type === 'coverage'
            ? '/api/analytics/heatmap?type=coverage'
            : `/api/analytics/heatmap?type=problems&hours_ago=${heatmapTime}`;

        fetch(endpoint)
            .then(res => res.json())
            .then(data => {
                // Remove existing source to refresh data/source type if needed
                if (map.current?.getSource('heatmap-source')) {
                    (map.current.getSource('heatmap-source') as any).setData(data);
                } else {
                    map.current?.addSource('heatmap-source', {
                        type: 'geojson',
                        data: data
                    });
                }

                if (map.current?.getLayer('heatmap-layer')) {
                    map.current.removeLayer('heatmap-layer');
                }

                map.current?.addLayer({
                    id: 'heatmap-layer',
                    type: 'heatmap',
                    source: 'heatmap-source',
                    maxzoom: 15,
                    paint: {
                        'heatmap-weight': [
                            'interpolate', ['linear'], ['get', 'weight'],
                            0, 0,
                            1, 1
                        ],
                        'heatmap-intensity': [
                            'interpolate', ['linear'], ['zoom'],
                            11, 1,
                            15, 3
                        ],
                        'heatmap-color': colorScale,
                        'heatmap-radius': [
                            'interpolate', ['linear'], ['zoom'],
                            11, 20, // Increased radius for better "zone" feel
                            15, 40
                        ],
                        'heatmap-opacity': 0.7
                    }
                }, 'z-mask');
            });

    }, [heatmapMode, heatmapTime]); // Re-run when time changes

    // Pulse Animation Loop 💓
    useEffect(() => {
        if (!map.current) return;

        // Fetch Pulse Data
        const fetchPulse = async () => {
            try {
                const response = await fetch('/api/analytics/pulse');
                const data = await response.json();
                const activeNeighborhoods = data.active_neighborhoods || [];

                if (map.current?.getSource('vector-data')) {
                    // @ts-ignore
                    const features = map.current.querySourceFeatures('vector-data', {
                        sourceLayer: 'default',
                        filter: ['==', 'type', 'neighborhood_zone']
                    });

                    features.forEach((f: any) => {
                        const isActive = activeNeighborhoods.includes(f.properties.name);
                        map.current?.setFeatureState(
                            { source: 'vector-data', id: f.id },
                            { active: isActive }
                        );
                    });
                }

            } catch (e) {
                console.error("Pulse fetch error", e);
            }
        };

        const interval = setInterval(fetchPulse, 10000); // Check every 10s
        fetchPulse(); // Initial run

        return () => clearInterval(interval);
    }, []);

    // Render markers when points change
    // ... existing marker code ...
    useEffect(() => {
        if (!map.current || points.length === 0) return;

        points.forEach(point => {
            const el = document.createElement('div');
            el.className = 'marker';

            const icon = point.type === 'transformer' ? '⚡' : point.type === 'well' ? '💧' : '📍';
            const colorClass = point.status === 'active' ? 'bg-emerald-500' :
                point.status === 'stopped' ? 'bg-rose-500' : 'bg-amber-500';

            el.innerHTML = `<div class="w-8 h-8 rounded-full ${colorClass} text-white flex items-center justify-center text-lg shadow-lg border-2 border-white transform transition hover:scale-110 cursor-pointer">${icon}</div>`;

            const popupHTML = `
                <div class="text-right p-2 font-sans" dir="rtl">
                    <h3 class="font-bold text-sm mb-1">${point.name || 'نقطة خدمة'}</h3>
                    <p class="text-xs text-gray-600 mb-2">الحالة: <span class="font-bold ${point.status === 'active' ? 'text-emerald-600' : 'text-rose-600'}">${point.status === 'active' ? 'تعمل' : 'متوقفة'}</span></p>
                    ${point.metadata ? `<div class="text-[10px] bg-gray-50 p-1 rounded border border-gray-100">${JSON.stringify(point.metadata)}</div>` : ''}
                </div>
            `;

            el.addEventListener('click', (e) => e.stopPropagation());

            new maplibregl.Marker({ element: el })
                .setLngLat([point.longitude, point.latitude])
                .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(popupHTML))
                .addTo(map.current!);
        });

    }, [points, map.current]);

    return (
        <div className="w-full h-full relative">
            {loading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm">
                    <div className="text-gray-500 font-bold animate-pulse">جاري تحميل خريطة داريا...</div>
                </div>
            )}

            <div ref={mapContainer} className="w-full h-full" />

            {/* Style Switcher */}
            <div className="absolute top-6 right-6 bg-white p-2 rounded-xl shadow-lg z-10 flex flex-col gap-2">
                <button
                    onClick={() => changeStyle('osm')}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm transition ${currentStyle === 'osm' ? 'bg-emerald-100 ring-2 ring-emerald-500' : 'hover:bg-slate-100'}`}
                    title="مخطط"
                >
                    🗺️
                </button>
                <button
                    onClick={() => changeStyle('satellite')}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm transition ${currentStyle === 'satellite' ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-slate-100'}`}
                    title="قمر صناعي"
                >
                    🛰️
                </button>
                <button
                    onClick={() => changeStyle('dark')}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm transition ${currentStyle === 'dark' ? 'bg-slate-800 text-white ring-2 ring-slate-500' : 'hover:bg-slate-100'}`}
                    title="ليلي"
                >
                    🌑
                </button>
                <button
                    onClick={() => setHeatmapMode(heatmapMode === 'problems' ? 'none' : 'problems')}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm transition ${heatmapMode === 'problems' ? 'bg-rose-100 ring-2 ring-rose-500 animate-pulse' : 'hover:bg-slate-100'}`}
                    title="نقاط الضعف (المشاكل)"
                >
                    🔥
                </button>
                <button
                    onClick={() => setHeatmapMode(heatmapMode === 'coverage' ? 'none' : 'coverage')}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm transition ${heatmapMode === 'coverage' ? 'bg-emerald-100 ring-2 ring-emerald-500 animate-pulse' : 'hover:bg-slate-100'}`}
                    title="نطاق الخدمة (الأمان)"
                >
                    🛡️
                </button>
                <button
                    onClick={() => {
                        if (!navigator.geolocation) {
                            alert('عذراً، المتصفح لا يدعم تحديد الموقع.');
                            return;
                        }
                        navigator.geolocation.getCurrentPosition(
                            (pos) => {
                                const { longitude, latitude } = pos.coords;
                                map.current?.flyTo({
                                    center: [longitude, latitude],
                                    zoom: 17,
                                    pitch: 45
                                });
                                // Add user marker
                                new maplibregl.Marker({ color: '#3b82f6', scale: 0.8 })
                                    .setLngLat([longitude, latitude])
                                    .addTo(map.current!);
                            },
                            (err) => alert('تعذر تحديد الموقع: ' + err.message)
                        );
                    }}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-sm hover:bg-slate-100 transition mt-2 border-t pt-2"
                    title="موقعي الحالي 📍"
                >
                    📍
                </button>
            </div>



            {/* Time Slider - Only visible in 'Problems' Heatmap Mode */}
            {heatmapMode === 'problems' && (
                <TimeSlider onChange={(val) => setHeatmapTime(val)} />
            )}

            {/* Map Legend */}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg z-10 text-xs text-right hover:opacity-100 transition">
                <div className="font-bold mb-2 border-b pb-1">مفتاح الخريطة</div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>تعمل</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span>صيانة</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span>متوقفة</span>
                </div>
            </div>

            {/* Premium Floating Card */}
            {selectedFeature && (
                <div className="absolute top-6 left-6 z-30 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="h-32 bg-slate-100 relative">
                        <div className="absolute inset-0 flex items-center justify-center text-4xl bg-gradient-to-br from-slate-200 to-slate-300">
                            {selectedFeature.project_id ? '🚧' : '🏢'}
                        </div>
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-slate-700 shadow-sm">
                            {selectedFeature.category}
                        </div>
                        <button
                            onClick={() => setSelectedFeature(null)}
                            className="absolute top-3 left-3 w-6 h-6 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur transition"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="p-5 text-right" dir="rtl">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 leading-tight">{selectedFeature.name}</h3>
                                <p className="text-xs text-slate-400 mt-1">#{selectedFeature.id}</p>
                            </div>
                            <div className={`px-2 py-1 rounded text-[10px] font-bold ${selectedFeature.color === '#e11d48' || selectedFeature.color === '#f43f5e' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {selectedFeature.status === 'active' ? 'نشط' : 'صيانة'}
                            </div>
                        </div>

                        <div className="space-y-3 mt-4">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <span className="w-5 text-center">📏</span>
                                <span>الارتفاع: <span className="font-bold">{selectedFeature.height}م</span></span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <span className="w-5 text-center">🏗️</span>
                                <span>الحالة الفنية:
                                    <span className={`font-bold mr-1 ${['poor', 'critical'].includes(selectedFeature.condition) ? 'text-rose-500' : 'text-slate-700'}`}>
                                        {selectedFeature.condition}
                                    </span>
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                            {selectedFeature.project_id ? (
                                <button
                                    onClick={() => alert(`تم التصويت للمشروع رقم ${selectedFeature.project_id}! شكراً لدعمك مجتمعك.`)}
                                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:scale-[1.02] transition shadow-emerald-200 flex items-center justify-center gap-2"
                                >
                                    <span>🗳️</span>
                                    <span>صوّت للإصلاح</span>
                                </button>
                            ) : (
                                <button className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                                    التفاصيل
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <ReportModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                coordinates={selectedCoords}
            />
        </div>
    );
}
