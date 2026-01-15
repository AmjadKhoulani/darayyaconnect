import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Crosshair, Layers, X } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { GeolocationService } from '../services/GeolocationService';
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
                    // Capture map instance to ensure type safety in closure and fix lint errors
                    const mapInstance = map.current;
                    if (!mapInstance) return;

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
                        mapInstance.addSource(`infra-${type}-source`, {
                            type: 'geojson',
                            data: geoJson
                        });

                        // Add Line Layer
                        const util = (INFRA_COLORS as any)[type];
                        mapInstance.addLayer({
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

                            mapInstance.addSource(`infra-${type}-nodes`, { type: 'geojson', data: nodesGeoJson });
                            mapInstance.addLayer({
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


    // Auto-locate on mount
    useEffect(() => {
        if (map.current) {
            locateUser();
        }
    }, [map.current]);

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
                <div class="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-emerald-500 transform transition hover:scale-110">
                    ${loc.emoji}
                </div>
                <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold shadow-sm mt-1 whitespace-nowrap text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700/50">
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
            console.log("Locating user...");
            const result = await GeolocationService.getCurrentPosition();

            if (result.coords) {
                const { latitude, longitude } = result.coords;
                console.log("User located:", latitude, longitude);

                if (map.current) {
                    // Remove existing user marker if any
                    const existingMarker = document.getElementById('user-location-marker');
                    if (existingMarker) existingMarker.remove();

                    const el = document.createElement('div');
                    el.id = 'user-location-marker';
                    el.className = 'w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-slate-100 shadow-lg pulse-ring';

                    new maplibregl.Marker({ element: el })
                        .setLngLat([longitude, latitude])
                        .addTo(map.current);

                    map.current.flyTo({ center: [longitude, latitude], zoom: 16 });
                }
            } else if (result.error) {
                console.error("Location error:", result.error);
                alert(result.error);
            }
        } catch (e) {
            console.error("Error getting location", e);
            alert('تعذر تحديد موقعك الحالي');
        }
    };

    const toggleLayer = (layer: keyof typeof activeLayers) => {
        setActiveLayers(prev => ({
            ...prev,
            [layer]: !prev[layer]
        }));
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-slate-50 dark:bg-slate-900 flex flex-col z-0">
            {/* Map Container */}
            <div className="relative w-full h-full">
                <div ref={mapContainer} className="absolute inset-0 z-0 bg-slate-200 dark:bg-slate-800" />

                {/* Header & Search - Added Safe Area Top */}
                <div className="absolute top-0 left-0 right-0 z-10 pt-12 px-4 pointer-events-none bg-gradient-to-b from-white/80 to-transparent dark:from-slate-900/80 pb-6">
                    <div className="flex flex-col gap-3 pointer-events-auto max-w-lg mx-auto w-full">
                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-lg border border-slate-200 dark:border-slate-700 active:scale-95 transition"
                            >
                                <ArrowRight size={20} className="rotate-180" />
                            </button>

                            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-200 dark:border-slate-700">
                                <h1 className="font-bold text-slate-800 dark:text-slate-100 text-sm">خريطة الخدمات</h1>
                            </div>

                            <div className="w-10"></div> {/* Spacer for alignment */}
                        </div>

                        {/* Search Bar - Floating Card Style */}
                        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3 transition-all focus-within:ring-2 ring-emerald-500/20">
                            <span className="text-slate-400 dark:text-slate-500">🔍</span>
                            <input
                                type="text"
                                placeholder="ابحث عن صيدلية، مركز..."
                                className="bg-transparent border-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 w-full focus:ring-0 p-0 outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-red-500 transition-colors">
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* FABs - Adjusted Bottom Position for Nav Bar */}
                <div className="absolute bottom-32 left-4 z-10 flex flex-col gap-3 pointer-events-auto">
                    <button
                        onClick={() => setShowLayersMenu(true)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-premium active:scale-95 transition-transform border ${showLayersMenu ? 'bg-emerald-600 dark:bg-emerald-500 text-white border-emerald-700 dark:border-emerald-400' : 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border-slate-100 dark:border-slate-700'}`}
                    >
                        <Layers size={22} />
                    </button>
                    <button
                        onClick={locateUser}
                        className="w-12 h-12 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shadow-premium active:scale-95 transition-transform border border-slate-100 dark:border-slate-700"
                    >
                        <Crosshair size={24} />
                    </button>
                </div>

                {/* Horizontal Scroll List - Raised above Bottom Nav */}
                <div className="absolute bottom-24 right-0 left-20 z-10 pointer-events-auto overflow-x-auto pb-4 px-4 no-scrollbar">
                    <div className="flex gap-3 pr-2">
                        {filteredServices.map((loc) => (
                            <button
                                key={loc.id}
                                onClick={() => map.current?.flyTo({ center: [loc.lng, loc.lat], zoom: 17 })}
                                className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-3 rounded-2xl min-w-[120px] shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center active:scale-95 transition-all w-28 snap-start"
                            >
                                <div className="text-2xl mb-2 bg-slate-50 dark:bg-slate-700/50 w-10 h-10 rounded-full flex items-center justify-center">{loc.emoji}</div>
                                <div className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate w-full">{loc.name}</div>
                                <div className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">{loc.type}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bottom Shadow Gradient for Text Readability */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none z-0"></div>
            </div>

            {/* Layers Bottom Sheet - Improved Z-Index */}
            {showLayersMenu && (
                <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowLayersMenu(false)}>
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] p-6 animate-in slide-in-from-bottom duration-300 mb-safe" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <span className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                    <Layers size={18} />
                                </span>
                                طبقات الخريطة
                            </h3>
                            <button onClick={() => setShowLayersMenu(false)} className="bg-slate-50 dark:bg-slate-800 p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                            <div className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative">
                                        <input type="checkbox" checked={activeLayers.heatmap} onChange={() => toggleLayer('heatmap')} className="peer sr-only" />
                                        <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                                    </div>
                                    <div className="flex-1 text-right">
                                        <span className="font-bold text-slate-700 dark:text-slate-200 text-sm block">الكثافة السكانية</span>
                                        <span className="text-[10px] text-slate-500 dark:text-slate-400">خريطة حرارية لتوزيع السكان</span>
                                    </div>
                                    <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-blue-300 to-red-500 shadow-sm"></div>
                                </label>
                            </div>

                            <div className="text-xs font-bold text-slate-400 dark:text-slate-600 mt-4 mb-2 pr-2 text-right uppercase tracking-wider">البنية التحتية</div>

                            {[
                                { id: 'water', label: 'شبكة المياه', color: 'bg-blue-500', sub: 'خطوط التوزيع الرئيسية' },
                                { id: 'electricity', label: 'الكهرباء', color: 'bg-yellow-500', sub: 'المجرورات الرئيسية' },
                                { id: 'sewage', label: 'الصرف الصحي', color: 'bg-orange-800', sub: 'المجرورات الرئيسية' },
                                { id: 'phone', label: 'الهاتف', color: 'bg-emerald-500', sub: 'كابلات الاتصالات' },
                            ].map(layer => (
                                <label key={layer.id} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 active:bg-slate-50 dark:active:bg-slate-800 transition cursor-pointer hover:border-emerald-200 dark:hover:border-emerald-800/50">
                                    <div className="relative item-center flex">
                                        <input
                                            type="checkbox"
                                            checked={activeLayers[layer.id as keyof typeof activeLayers]}
                                            onChange={() => toggleLayer(layer.id as keyof typeof activeLayers)}
                                            className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 transition-all"
                                        />
                                    </div>
                                    <div className="flex-1 text-right">
                                        <span className="font-bold text-slate-700 dark:text-slate-200 text-sm block">{layer.label}</span>
                                        <span className="text-[10px] text-slate-500 dark:text-slate-400">{layer.sub}</span>
                                    </div>
                                    <div className={`w-2 h-8 rounded-full ${layer.color} opacity-80 shadow-sm`}></div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
