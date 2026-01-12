import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Crosshair, Layers, X } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Geolocation } from '@capacitor/geolocation';
import api from '../services/api';

// Sample Service Locations
const serviceLocations = [
    { id: 1, name: 'صيدلية الشفاء', type: 'pharmacy', lat: 33.458, lng: 36.234, emoji: '💊' },
    { id: 2, name: 'صيدلية داريا المركزية', type: 'pharmacy', lat: 33.455, lng: 36.238, emoji: '💊' },
    { id: 3, name: 'مركز داريا الصحي', type: 'health', lat: 33.457, lng: 36.237, emoji: '🏥' },
    { id: 4, name: 'مجلس المدينة', type: 'government', lat: 33.456, lng: 36.236, emoji: '🏛️' },
    { id: 5, name: 'حديقة الباسل', type: 'park', lat: 33.454, lng: 36.235, emoji: '🌳' },
    { id: 6, name: 'فرن داريا الآلي', type: 'service', lat: 33.459, lng: 36.239, emoji: '🍞' },
];

// Mock Infrastructure Data Generator
const generateInfrastructure = (center: [number, number]): GeoJSON.FeatureCollection => {
    const features: GeoJSON.Feature[] = [];
    const [centerLng, centerLat] = center;
    const size = 0.02; // Roughly 2km box

    const types = ['water', 'electricity', 'sewage', 'phone'];

    // Horizontal lines
    for (let i = 0; i < 8; i++) {
        const lat = centerLat - size / 2 + (size / 8) * i;
        types.forEach((type, idx) => {
            const offset = (idx * 0.00015);
            features.push({
                type: 'Feature',
                properties: { type, id: `h-${i}-${type}` },
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [centerLng - size / 2, lat + offset],
                        [centerLng + size / 2, lat + offset]
                    ]
                }
            });
        });
    }

    // Vertical lines
    for (let i = 0; i < 8; i++) {
        const lng = centerLng - size / 2 + (size / 8) * i;
        types.forEach((type, idx) => {
            const offset = (idx * 0.00015);
            features.push({
                type: 'Feature',
                properties: { type, id: `v-${i}-${type}` },
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [lng + offset, centerLat - size / 2],
                        [lng + offset, centerLat + size / 2]
                    ]
                }
            });
        });
    }

    return { type: 'FeatureCollection', features };
};

// Generate Mock Population Data for Heatmap
const generatePopulationPoints = (count: number) => {
    const points = [];
    for (let i = 0; i < count; i++) {
        const lng = 36.236 + (Math.random() - 0.5) * 0.02;
        const lat = 33.456 + (Math.random() - 0.5) * 0.02;
        points.push({ type: 'Feature', geometry: { type: 'Point', coordinates: [lng, lat] }, properties: { intensity: Math.random() } });
    }
    return points;
};

const populationPoints = generatePopulationPoints(500);

// Colors for Infrastructure
const INFRA_COLORS = {
    water: { color: '#3b82f6', label: 'شبكة المياه' },
    electricity: { color: '#eab308', label: 'الكهرباء' },
    sewage: { color: '#78350f', label: 'الصرف الصحي' },
    phone: { color: '#10b981', label: 'الهاتف' }
};

export default function Map() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showLayersMenu, setShowLayersMenu] = useState(false);

    // Layer States
    const [activeLayers, setActiveLayers] = useState({
        heatmap: true,
        water: false,
        electricity: false,
        sewage: false,
        phone: false,
        crowdElectricity: true,
        crowdWater: true
    });

    const [filteredServices, setFilteredServices] = useState(serviceLocations);

    // Initial Map Setup
    useEffect(() => {
        if (map.current) return;
        if (!mapContainer.current) return;

        console.log("Initializing Mobile Map...");

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
                layers: [
                    {
                        id: 'osm',
                        type: 'raster',
                        source: 'osm',
                    }
                ]
            },
            center: [36.236, 33.456],
            zoom: 14,
            pitch: 0,
            attributionControl: false
        });

        map.current.on('load', () => {
            if (!map.current) return;
            console.log("Mobile Map Loaded");

            // 1. Add Population Source
            map.current.addSource('population', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: populationPoints as any
                }
            });

            // 2. Add Heatmap Layer
            map.current.addLayer({
                id: 'population-heatmap',
                type: 'heatmap',
                source: 'population',
                maxzoom: 16,
                paint: {
                    'heatmap-weight': ['interpolate', ['linear'], ['get', 'intensity'], 0, 0, 1, 1],
                    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 15, 3],
                    'heatmap-color': [
                        'interpolate', ['linear'], ['heatmap-density'],
                        0, 'rgba(33,102,172,0)',
                        0.2, 'rgb(103,169,207)',
                        0.4, 'rgb(209,229,240)',
                        0.6, 'rgb(253,219,199)',
                        0.8, 'rgb(239,138,98)',
                        1, 'rgb(220,20,60)'
                    ],
                    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 15, 25],
                    'heatmap-opacity': 0.6
                },
                layout: { visibility: activeLayers.heatmap ? 'visible' : 'none' }
            });

            // 3. Infrastructure Layers (Fetch from API)
            fetch('/api/infrastructure')
                .then(res => res.json())
                .then(data => {
                    if (!map.current) return;

                    // Separate lines by type
                    ['water', 'electricity', 'sewage', 'phone'].forEach(type => {
                        const lines = data.lines.filter((l: any) => l.type === type);
                        const points = data.nodes.filter((n: any) => {
                            // Map Point Types to Network Types logic
                            if (type === 'sewage' && n.type === 'manhole') return true;
                            if (type === 'electricity' && (n.type === 'transformer' || n.type === 'pole')) return true;
                            if (type === 'water' && n.type === 'pump') return true;
                            return false;
                        });

                        const geoJson: GeoJSON.FeatureCollection = {
                            type: 'FeatureCollection',
                            features: lines.map((l: any) => ({
                                type: 'Feature',
                                geometry: { type: 'LineString', coordinates: l.coordinates },
                                properties: { type: l.type }
                            }))
                        };

                        // Add Line Source
                        map.current.addSource(`infra-${type}-source`, {
                            type: 'geojson',
                            data: geoJson
                        });

                        // Add Line Layer
                        const util = (INFRA_COLORS as any)[type];
                        map.current.addLayer({
                            id: `infra-${type}`,
                            type: 'line',
                            source: `infra-${type}-source`,
                            layout: {
                                'line-join': 'round',
                                'line-cap': 'round',
                                'visibility': 'none' // Controlled by state
                            },
                            paint: {
                                'line-color': util.color,
                                'line-width': 3,
                                'line-opacity': 0.8
                            }
                        });

                        // Add Points (Nodes) if any
                        if (points.length > 0) {

                            const nodesGeoJson: GeoJSON.FeatureCollection = {
                                type: 'FeatureCollection',
                                features: points.map((p: any) => ({
                                    type: 'Feature',
                                    geometry: { type: 'Point', coordinates: [parseFloat(p.longitude), parseFloat(p.latitude)] },
                                    properties: { type: p.type }
                                }))
                            };

                            map.current.addSource(`infra-${type}-nodes`, { type: 'geojson', data: nodesGeoJson });
                            map.current.addLayer({
                                id: `infra-${type}-nodes-layer`,
                                type: 'circle',
                                source: `infra-${type}-nodes`,
                                paint: {
                                    'circle-radius': 5,
                                    'circle-color': util.color,
                                    'circle-stroke-width': 1,
                                    'circle-stroke-color': '#fff'
                                },
                                layout: { 'visibility': 'none' }
                            });
                        }

                    });

                })
                .catch(err => console.error("Failed to fetch infra", err));

            // Crowdsourced Status Layers
            ['electricity', 'water'].forEach(type => {
                console.log(`🗺️ Fetching crowd ${type} data from API...`);

                api.get(`/infrastructure/status-heatmap?type=${type}`)
                    .then(response => {
                        const geoJson = response.data;
                        console.log(`✅ Crowd ${type} GeoJSON received:`, geoJson);
                        console.log(`   - Features count: ${geoJson.features?.length || 0}`);

                        if (!map.current) return;

                        // Add source
                        console.log(`📍 Adding map source: crowd-${type}-source`);
                        map.current.addSource(`crowd-${type}-source`, {
                            type: 'geojson',
                            data: geoJson
                        });

                        // Add fill layer (polygon)
                        console.log(`🎨 Creating fill layer: crowd-${type}-fill`);
                        map.current.addLayer({
                            id: `crowd-${type}-fill`,
                            type: 'fill',
                            source: `crowd-${type}-source`,
                            layout: { visibility: 'visible' },
                            paint: {
                                'fill-color': [
                                    'match',
                                    ['get', 'status'],
                                    'available', '#10b981',  // Green
                                    'unstable', '#f59e0b',   // Amber
                                    'cutoff', '#ef4444',     // Red
                                    '#94a3b8'                // Gray fallback
                                ],
                                'fill-opacity': 0.4
                            }
                        });

                        // Add circle layer (center point)
                        console.log(`🎨 Creating circle layer: crowd-${type}-circle`);
                        map.current.addLayer({
                            id: `crowd-${type}-circle`,
                            type: 'circle',
                            source: `crowd-${type}-source`,
                            layout: { visibility: 'visible' },
                            paint: {
                                'circle-radius': 14,
                                'circle-color': [
                                    'match',
                                    ['get', 'status'],
                                    'available', '#10b981',
                                    'unstable', '#f59e0b',
                                    'cutoff', '#ef4444',
                                    '#94a3b8'
                                ],
                                'circle-stroke-width': 2,
                                'circle-stroke-color': '#fff'
                            }
                        });

                        // Add symbol layer (percentage text)
                        console.log(`🎨 Creating symbol layer: crowd-${type}-symbol`);
                        map.current.addLayer({
                            id: `crowd-${type}-symbol`,
                            type: 'symbol',
                            source: `crowd-${type}-source`,
                            layout: {
                                visibility: 'visible',
                                'text-field': '{score}%',
                                'text-size': 12
                            },
                            paint: {
                                'text-color': '#fff',
                                'text-halo-color': '#000',
                                'text-halo-width': 1
                            }
                        });

                        console.log(`✅ Crowd ${type} layers added successfully!`);
                    })
                    .catch(err => {
                        console.error(`❌ Failed to fetch ${type} crowd data:`, err);
                        console.error(`   - Error details:`, err.response?.data || err.message);
                    });
            });
        });

        map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-left');
    }, []);

    // Handle Active Layers Changes
    useEffect(() => {
        if (!map.current || !map.current.isStyleLoaded()) return;

        // Heatmap
        if (map.current.getLayer('population-heatmap')) {
            map.current.setLayoutProperty('population-heatmap', 'visibility', activeLayers.heatmap ? 'visible' : 'none');
        }

        // Infrastructure
        ['water', 'electricity', 'sewage', 'phone'].forEach(layer => {
            const key = layer as keyof typeof activeLayers;
            const isVisible = activeLayers[key] ? 'visible' : 'none';

            if (map.current?.getLayer(`infra-${layer}`)) {
                map.current.setLayoutProperty(`infra-${layer}`, 'visibility', isVisible);
            }
            if (map.current?.getLayer(`infra-${layer}-nodes-layer`)) {
                map.current.setLayoutProperty(`infra-${layer}-nodes-layer`, 'visibility', isVisible);
            }
        });

        // Crowd Layers Toggle
        ['electricity', 'water'].forEach(type => {
            const stateKey = type === 'electricity' ? 'crowdElectricity' : 'crowdWater';
            const isVisible = activeLayers[stateKey as keyof typeof activeLayers] ? 'visible' : 'none';

            if (map.current?.getLayer(`crowd-${type}-fill`)) {
                map.current.setLayoutProperty(`crowd-${type}-fill`, 'visibility', isVisible);
            }
            if (map.current?.getLayer(`crowd-${type}-symbol`)) {
                map.current.setLayoutProperty(`crowd-${type}-symbol`, 'visibility', isVisible);
            }
            if (map.current?.getLayer(`crowd-${type}-circle`)) {
                map.current.setLayoutProperty(`crowd-${type}-circle`, 'visibility', isVisible);
            }
        });
    }, [activeLayers]);


    // Handle Search
    useEffect(() => {
        const filtered = serviceLocations.filter(loc =>
            loc.name.includes(searchQuery) ||
            loc.type.includes(searchQuery)
        );
        setFilteredServices(filtered);
    }, [searchQuery]);


    // Manage Markers
    const markersRef = useRef<maplibregl.Marker[]>([]);

    useEffect(() => {
        if (!map.current) return;

        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        filteredServices.forEach(loc => {
            const el = document.createElement('div');
            el.className = 'flex flex-col items-center justify-center animate-bounce-short cursor-pointer';
            el.innerHTML = `
                <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-emerald-500 transform transition hover:scale-110">
                    ${loc.emoji}
                </div>
                <div class="bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold shadow mt-1 whitespace-nowrap">
                    ${loc.name}
                </div>
            `;

            el.onclick = () => {
                map.current?.flyTo({ center: [loc.lng, loc.lat], zoom: 17 });
            };

            const marker = new maplibregl.Marker({ element: el })
                .setLngLat([loc.lng, loc.lat])
                .addTo(map.current!);

            markersRef.current.push(marker);
        });

    }, [filteredServices, map.current]);

    const locateUser = async () => {
        try {
            const coordinates = await Geolocation.getCurrentPosition();
            const { latitude, longitude } = coordinates.coords;

            if (map.current) {
                const el = document.createElement('div');
                el.className = 'w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg pulse-ring';

                new maplibregl.Marker({ element: el })
                    .setLngLat([longitude, latitude])
                    .addTo(map.current);

                map.current.flyTo({ center: [longitude, latitude], zoom: 16 });
            }
        } catch (e) {
            console.error("Error getting location", e);
        }
    };

    const toggleLayer = (layer: keyof typeof activeLayers) => {
        setActiveLayers(prev => ({
            ...prev,
            [layer]: !prev[layer]
        }));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col" dir="rtl">
            {/* Map Container */}
            <div className="flex-1 relative overflow-hidden">
                <div ref={mapContainer} className="absolute inset-0 z-0 bg-slate-200" />

                {/* Header & Search */}
                <div className="absolute top-0 left-0 right-0 z-10 p-4 pointer-events-none">
                    <div className="flex flex-col gap-3 pointer-events-auto">
                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-slate-600 shadow-lg border border-slate-200 active:scale-95 transition"
                            >
                                <ArrowRight size={20} className="rotate-180" />
                            </button>

                            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-slate-200">
                                <h1 className="font-bold text-slate-800 text-sm">خريطة الخدمات</h1>
                                <p className="text-[10px] text-slate-500 font-medium">{filteredServices.length} مواقع • {Object.values(activeLayers).filter(Boolean).length} طبقات</p>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-lg border border-slate-200 flex items-center gap-2 transition-all focus-within:ring-2 ring-emerald-500/20">
                            <span className="text-slate-400 mr-2">🔍</span>
                            <input
                                type="text"
                                placeholder="ابحث عن صيدلية، مركز..."
                                className="bg-transparent border-none text-sm text-slate-800 placeholder-slate-400 w-full focus:ring-0 p-0 outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* FABs */}
                <div className="absolute bottom-6 left-4 z-10 flex flex-col gap-3 pointer-events-auto">
                    <button
                        onClick={() => setShowLayersMenu(true)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-transform border z-20 ${showLayersMenu ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white text-emerald-600 border-slate-100'}`}
                    >
                        <Layers size={22} />
                    </button>
                    <button
                        onClick={locateUser}
                        className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-transform border border-slate-100"
                    >
                        <Crosshair size={24} />
                    </button>
                </div>

                {/* Layers Bottom Sheet / Modal */}
                {showLayersMenu && (
                    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/20 backdrop-blur-sm" onClick={() => setShowLayersMenu(false)}>
                        <div className="bg-white w-full max-w-md rounded-t-3xl shadow-2xl p-6 animate-in slide-in-from-bottom duration-200" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <Layers size={20} className="text-emerald-500" />
                                    طبقات الخريطة
                                </h3>
                                <button onClick={() => setShowLayersMenu(false)} className="bg-slate-50 p-2 rounded-full text-slate-500 hover:bg-slate-100">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" checked={activeLayers.heatmap} onChange={() => toggleLayer('heatmap')} className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                                        <div className="flex-1">
                                            <span className="font-bold text-slate-700 text-sm block">الكثافة السكانية</span>
                                            <span className="text-[10px] text-slate-500">خريطة حرارية لتوزيع السكان</span>
                                        </div>
                                        <div className="h-4 w-4 rounded-full bg-gradient-to-tr from-blue-300 to-red-500 opacity-80"></div>
                                    </label>
                                </div>

                                <div className="text-xs font-bold text-slate-400 mt-4 mb-2 pr-2">البنية التحتية</div>

                                {[
                                    { id: 'water', label: 'شبكة المياه', color: 'bg-blue-500', sub: 'خطوط التوزيع الرئيسية' },
                                    { id: 'electricity', label: 'الكهرباء', color: 'bg-yellow-500', sub: 'المجرورات الرئيسية' },
                                    { id: 'sewage', label: 'الصرف الصحي', color: 'bg-orange-800', sub: 'المجرورات الرئيسية' },
                                    { id: 'phone', label: 'الهاتف', color: 'bg-emerald-500', sub: 'كابلات الاتصالات' },
                                ].map(layer => (
                                    <label key={layer.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white active:bg-slate-50 transition cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={activeLayers[layer.id as keyof typeof activeLayers]}
                                            onChange={() => toggleLayer(layer.id as keyof typeof activeLayers)}
                                            className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <div className="flex-1">
                                            <span className="font-bold text-slate-700 text-sm block">{layer.label}</span>
                                            <span className="text-[10px] text-slate-500">{layer.sub}</span>
                                        </div>
                                        <div className={`w-10 h-1.5 rounded-full ${layer.color} opacity-80`}></div>
                                    </label>
                                ))}

                                <div className="text-xs font-bold text-slate-400 mt-4 mb-2 pr-2">حالة الشبكة (مجتمعي)</div>

                                {[
                                    { id: 'crowdElectricity', label: 'كهرباء (بلاغات)', color: 'bg-yellow-400', sub: 'حالة الكهرباء الآن' },
                                    { id: 'crowdWater', label: 'مياه (بلاغات)', color: 'bg-blue-400', sub: 'حالة المياه الآن' },
                                ].map(layer => (
                                    <label key={layer.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white active:bg-slate-50 transition cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={activeLayers[layer.id as keyof typeof activeLayers]}
                                            onChange={() => toggleLayer(layer.id as keyof typeof activeLayers)}
                                            className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <div className="flex-1">
                                            <span className="font-bold text-slate-700 text-sm block">{layer.label}</span>
                                            <span className="text-[10px] text-slate-500">{layer.sub}</span>
                                        </div>
                                        <div className={`w-10 h-1.5 rounded-full ${layer.color} opacity-80`}></div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Horizontal Scroll List */}
                <div className="absolute bottom-6 right-4 left-20 z-10 pointer-events-auto overflow-x-auto pb-2 -mr-4 pr-4">
                    <div className="flex gap-3">
                        {filteredServices.map((loc) => (
                            <button
                                key={loc.id}
                                onClick={() => map.current?.flyTo({ center: [loc.lng, loc.lat], zoom: 17 })}
                                className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl min-w-[130px] shadow-lg border border-slate-100 flex flex-col items-center text-center active:scale-95 transition-transform"
                            >
                                <div className="text-2xl mb-1">{loc.emoji}</div>
                                <div className="font-bold text-slate-800 text-xs truncate w-full">{loc.name}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
