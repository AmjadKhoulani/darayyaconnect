import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Crosshair, Layers, X, Clock, Edit3 } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { GeolocationService } from '../services/GeolocationService';
import { Geolocation } from '@capacitor/geolocation';

import api from '../services/api';

// Real Service Locations will be fetched from API

// Mock Infrastructure Data Generator Removed

// Population mocks removed

// Colors for Infrastructure
const INFRA_COLORS = {
    water: { color: '#3b82f6', label: 'شبكة المياه' },
    electricity: { color: '#eab308', label: 'الكهرباء' },
    sewage: { color: '#78350f', label: 'الصرف الصحي' },
    phone: { color: '#10b981', label: 'الهاتف' }
};

const INFRA_ICONS: Record<string, { icon: string, bg: string, color: string }> = {
    water_tank: { icon: '🏰', bg: '#dbeafe', color: '#1d4ed8' },
    pump: { icon: '⚙️', bg: '#dbeafe', color: '#1d4ed8' },
    valve: { icon: '🔧', bg: '#dbeafe', color: '#1d4ed8' },
    transformer: { icon: '⚡', bg: '#fef3c7', color: '#b45309' },
    pole: { icon: '🗼', bg: '#fef3c7', color: '#b45309' },
    generator: { icon: '🔋', bg: '#fef3c7', color: '#b45309' },
    manhole: { icon: '🕳️', bg: '#ffedd5', color: '#9a3412' },
    exchange: { icon: '🏢', bg: '#d1fae5', color: '#047857' },
    cabinet: { icon: '📦', bg: '#d1fae5', color: '#047857' },
    antenna: { icon: '📡', bg: '#d1fae5', color: '#047857' },
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
        crowdWater: true,
        publicReports: true
    });

    const [filteredServices, setFilteredServices] = useState<any[]>([]);
    const [allServices, setAllServices] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [timeOffset, setTimeOffset] = useState(0);
    const [selectedInfra, setSelectedInfra] = useState<any | null>(null);
    const [infraData, setInfraData] = useState<{ nodes: any[], lines: any[] }>({ nodes: [], lines: [] });
    const [crowdData, setCrowdData] = useState<{ electricity?: any, water?: any }>({});

    const selectedDate = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() + timeOffset);
        return d.toISOString().split('T')[0];
    }, [timeOffset]);

    const selectedDateLabel = useMemo(() => {
        if (timeOffset === 0) return 'اليوم';
        if (timeOffset === -1) return 'أمس';
        const d = new Date();
        d.setDate(d.getDate() + timeOffset);
        return d.toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'short' });
    }, [timeOffset]);

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
            if (!map.current) return;
            console.log("Mobile Map Loaded");

            // Load Custom Infrastructure Icons
            const images = [
                { id: 'icon_water_tank', url: '/mobile_assets/map-icons/water_tank.png' },
                { id: 'icon_transformer', url: '/mobile_assets/map-icons/transformer.png' },
                { id: 'icon_manhole', url: '/mobile_assets/map-icons/manhole.png' },
                { id: 'icon_cabinet', url: '/mobile_assets/map-icons/cabinet.png' },
            ];

            images.forEach(img => {
                if (!map.current!.hasImage(img.id)) {
                    map.current!.loadImage(img.url, (error, image) => {
                        if (error) console.error(error);
                        if (image && !map.current!.hasImage(img.id)) map.current!.addImage(img.id, image);
                    });
                }
            });

            // 1. Add Population Source
            // 1. Initial Population Source (Empty, will be filled by useEffect)
            map.current.addSource('population', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
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
            api.get('/infrastructure')
                .then(res => {
                    const data = res.data;
                    const mapInstance = map.current;
                    if (!mapInstance) return;

                    ['water', 'electricity', 'sewage', 'phone'].forEach(type => {
                        const lines = data.lines.filter((l: any) => l.type === type);
                        const points = data.nodes.filter((n: any) => {
                            if (type === 'sewage' && n.type === 'manhole') return true;
                            if (type === 'electricity' && (n.type === 'transformer' || n.type === 'pole' || n.type === 'generator')) return true;
                            if (type === 'water' && (n.type === 'pump' || n.type === 'water_tank' || n.type === 'valve')) return true;
                            if (type === 'phone' && (n.type === 'exchange' || n.type === 'cabinet')) return true;
                            return false;
                        });

                        const geoJson: GeoJSON.FeatureCollection = {
                            type: 'FeatureCollection',
                            features: lines.map((l: any) => ({
                                type: 'Feature',
                                geometry: { type: 'LineString', coordinates: l.coordinates },
                                properties: {
                                    id: l.id,
                                    type: l.type,
                                    serial_number: l.serial_number
                                }
                            }))
                        };

                        mapInstance.addSource(`infra-${type}-source`, {
                            type: 'geojson',
                            data: geoJson
                        });

                        const util = (INFRA_COLORS as any)[type];
                        mapInstance.addLayer({
                            id: `infra-${type}`,
                            type: 'line',
                            source: `infra-${type}-source`,
                            layout: {
                                'line-join': 'round',
                                'line-cap': 'round',
                                'visibility': 'none'
                            },
                            paint: {
                                'line-color': util.color,
                                'line-width': 3,
                                'line-opacity': 0.8
                            }
                        });

                        if (points.length > 0) {
                            const nodesGeoJson: GeoJSON.FeatureCollection = {
                                type: 'FeatureCollection',
                                features: points.map((p: any) => ({
                                    type: 'Feature',
                                    geometry: { type: 'Point', coordinates: [parseFloat(p.longitude), parseFloat(p.latitude)] },
                                    properties: {
                                        id: p.id,
                                        type: p.type,
                                        serial_number: p.serial_number
                                    }
                                }))
                            };

                            mapInstance.addSource(`infra-${type}-nodes`, {
                                type: 'geojson',
                                data: nodesGeoJson
                            });

                            mapInstance.addLayer({
                                id: `infra-${type}-nodes-layer`,
                                type: 'symbol',
                                source: `infra-${type}-nodes`,
                                layout: {
                                    'visibility': activeLayers[type as keyof typeof activeLayers] ? 'visible' : 'none',
                                    'icon-image': [
                                        'match',
                                        ['get', 'type'],
                                        'water_tank', 'icon_water_tank',
                                        'pump', 'icon_water_tank', // Fallback/Shared
                                        'transformer', 'icon_transformer',
                                        'generator', 'icon_transformer', // Fallback/Shared
                                        'manhole', 'icon_manhole',
                                        'cabinet', 'icon_cabinet',
                                        'exchange', 'icon_cabinet', // Fallback/Shared
                                        'marker-15'
                                    ],
                                    'icon-size': 0.12, // Slightly smaller for public map view
                                    'icon-allow-overlap': true
                                }
                            });

                            // Click Handler
                            mapInstance.on('click', `infra-${type}-nodes-layer`, (e) => {
                                if (e.features && e.features[0]) {
                                    const props = e.features[0].properties;
                                    const coords = (e.features[0].geometry as any).coordinates;
                                    setSelectedInfra({
                                        ...props,
                                        lng: coords[0],
                                        lat: coords[1],
                                        sector: type
                                    });
                                }
                            });

                            mapInstance.on('mouseenter', `infra-${type}-nodes-layer`, () => {
                                mapInstance.getCanvas().style.cursor = 'pointer';
                            });
                            mapInstance.on('mouseleave', `infra-${type}-nodes-layer`, () => {
                                mapInstance.getCanvas().style.cursor = '';
                            });
                        }
                    });

                    setInfraData(data);
                    updateStatusBubbles(data, {});
                })
                .catch(err => console.error("Failed to fetch infra", err));

            // Crowdsourced Status Layers (Initial Placeholder)
            ['electricity', 'water'].forEach(type => {
                if (!map.current) return;
                map.current.addSource(`crowd-${type}-source`, {
                    type: 'geojson',
                    data: { type: 'FeatureCollection', features: [] }
                });

                map.current.addLayer({
                    id: `crowd-${type}-fill`,
                    type: 'fill',
                    source: `crowd-${type}-source`,
                    layout: { visibility: 'visible' },
                    paint: {
                        'fill-color': [
                            'match',
                            ['get', 'status'],
                            'available', '#10b981',
                            'unstable', '#f59e0b',
                            'cutoff', '#ef4444',
                            '#94a3b8'
                        ],
                        'fill-opacity': 0.4
                    }
                });

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

                map.current.addLayer({
                    id: `crowd-${type}-symbol`,
                    type: 'symbol',
                    source: `crowd-${type}-source`,
                    layout: {
                        visibility: 'visible',
                        'text-field': ['concat', ['get', 'score'], '%'],
                        'text-size': 10
                    },
                    paint: {
                        'text-color': '#fff',
                        'text-halo-color': '#000',
                        'text-halo-width': 1
                    }
                });
            });

            // 4. Public Reports Layer
            map.current.addSource('public-reports-source', {
                type: 'geojson',
                data: { type: 'FeatureCollection', features: [] }
            });

            const addEmojiIcon = (id: string, emoji: string) => {
                if (map.current?.hasImage(id)) return;
                const canvas = document.createElement('canvas');
                canvas.width = 64; canvas.height = 64;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.font = '48px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                    ctx.fillText(emoji, 32, 32);
                    const imageData = ctx.getImageData(0, 0, 64, 64);
                    map.current?.addImage(id, imageData);
                }
            };

            addEmojiIcon('report-water', '💧');
            addEmojiIcon('report-electricity', '⚡');
            addEmojiIcon('report-lighting', '💡');
            addEmojiIcon('report-sanitation', '🗑️');
            addEmojiIcon('report-trash', '🗑️');
            addEmojiIcon('report-road', '🚧');
            addEmojiIcon('report-comm', '📡');
            addEmojiIcon('report-other', '⚠️');

            map.current.addLayer({
                id: 'public-reports-layer',
                type: 'symbol',
                source: 'public-reports-source',
                layout: {
                    'visibility': activeLayers.publicReports ? 'visible' : 'none',
                    'icon-image': [
                        'match',
                        ['get', 'category'],
                        'water', 'report-water',
                        'electricity', 'report-electricity',
                        'lighting', 'report-lighting',
                        'sanitation', 'report-sanitation',
                        'trash', 'report-trash',
                        'road', 'report-road',
                        'communication', 'report-comm',
                        'report-other'
                    ],
                    'icon-size': 0.6,
                    'icon-allow-overlap': true
                }
            });

            map.current.on('click', 'public-reports-layer', (e) => {
                if (e.features && e.features[0]) {
                    const props = e.features[0].properties;
                    const categoryAr = {
                        water: 'شبكة المياه',
                        electricity: 'شبكة الكهرباء',
                        lighting: 'الإنارة العامة',
                        sanitation: 'الصرف الصحي',
                        trash: 'النظافة العامة',
                        road: 'الطرق والجسور',
                        communication: 'الاتصالات',
                        other: 'بلاغ عام'
                    }[props.category as string] || 'بلاغ خدمة';

                    alert(`📅 تاريخ البلاغ: ${props.created_at || 'غير محدد'}\n⚠️ نوع البلاغ: ${categoryAr}`);
                }
            });
        });

        // Removed default NavigationControl as per user request (buttons behind bar) and mobile preference (pinch zoom).
        // map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-left');
    }, []);

    // Handle Time Machine Data Updates
    useEffect(() => {
        if (!map.current) return;
        const currentMap = map.current;

        // 1. Update Heatmap Data
        api.get(`/analytics/heatmap?date=${selectedDate}`)
            .then(res => {
                const source = currentMap.getSource('population');
                if (source) {
                    (source as any).setData({
                        type: 'FeatureCollection',
                        features: res.data.map((r: any) => ({
                            type: 'Feature',
                            geometry: { type: 'Point', coordinates: [r[1], r[0]] },
                            properties: { intensity: r[2] }
                        }))
                    });
                }
            });

        // 2. Update Crowd Status Layers
        ['electricity', 'water'].forEach(type => {
            api.get(`/infrastructure/status-heatmap?type=${type}&date=${selectedDate}`)
                .then(res => {
                    const source = currentMap.getSource(`crowd-${type}-source`);
                    if (source) {
                        (source as any).setData(res.data);
                        setCrowdData(prev => ({ ...prev, [type]: res.data }));
                    }
                });
        });
    }, [selectedDate]);

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

        updateStatusBubbles(infraData, crowdData);

        if (map.current?.getLayer('public-reports-layer')) {
            map.current.setLayoutProperty('public-reports-layer', 'visibility', activeLayers.publicReports ? 'visible' : 'none');
        }
    }, [activeLayers, infraData, crowdData]);

    // Fetch Public Reports
    useEffect(() => {
        if (!map.current) return;
        api.get('/infrastructure/public-reports')
            .then(res => {
                const source = map.current?.getSource('public-reports-source');
                if (source) {
                    (source as any).setData(res.data);
                }
            });
    }, [activeLayers.publicReports]);


    // Auto-locate on mount
    useEffect(() => {
        if (map.current) {
            locateUser();
        }
    }, [map.current]);

    // Fetch Real Services from Directory
    useEffect(() => {
        api.get('/directory')
            .then(res => {
                const services = res.data
                    .filter((item: any) => {
                        const lat = parseFloat(item.latitude);
                        const lng = parseFloat(item.longitude);
                        return !isNaN(lat) && !isNaN(lng);
                    })
                    .map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        type: item.category,
                        lat: parseFloat(item.latitude),
                        lng: parseFloat(item.longitude),
                        emoji: getCategoryEmoji(item.category)
                    }));
                setAllServices(services);
                setFilteredServices(services);
            })
            .catch(err => console.error("Failed to fetch directory", err));

        // Fetch User Info for Admin check
        api.get('/user')
            .then(res => setUser(res.data))
            .catch(() => setUser(null));
    }, []);

    const getCategoryEmoji = (category: string) => {
        const emojis: Record<string, string> = {
            'pharmacy': '💊',
            'health': '🏥',
            'government': '🏛️',
            'park': '🌳',
            'service': '🍞',
            'food': '🍴',
            'education': '🎓',
            'transport': '🚌'
        };
        return emojis[category] || '📍';
    };

    // Handle Search
    useEffect(() => {
        const filtered = allServices.filter(loc =>
            loc.name.includes(searchQuery) ||
            loc.type.includes(searchQuery)
        );
        setFilteredServices(filtered);
    }, [searchQuery, allServices]);


    // Manage Markers
    const markersRef = useRef<maplibregl.Marker[]>([]);
    const statusMarkersRef = useRef<maplibregl.Marker[]>([]);

    const updateStatusBubbles = (data: { nodes: any[], lines: any[] }, crowd: { electricity?: any, water?: any }) => {
        if (!map.current) return;

        // Clean up
        statusMarkersRef.current.forEach(m => m.remove());
        statusMarkersRef.current = [];

        // 1. Assets with Issues
        data.nodes.forEach(node => {
            const sector = getLayerForNodeType(node.type);
            if (!sector) return;

            // Only show if the sector layer is active
            if (!activeLayers[sector as keyof typeof activeLayers]) return;

            // Conditions for showing a status bubble
            const isDamaged = node.status === 'damaged' || node.status === 'unsafe';
            const isMaintenance = node.status === 'maintenance';

            if (isDamaged || isMaintenance) {
                const el = document.createElement('div');
                el.className = `status-bubble ${isDamaged ? 'critical' : 'warning'}`;
                el.innerHTML = isDamaged ? '💥' : '🏗️';
                el.style.animationDelay = `${Math.random() * -4}s`;

                el.onclick = (e) => {
                    e.stopPropagation();
                    map.current?.flyTo({ center: [parseFloat(node.longitude), parseFloat(node.latitude)], zoom: 18 });
                    setSelectedInfra({ ...node, lng: node.longitude, lat: node.latitude, sector });
                };

                const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
                    .setLngLat([parseFloat(node.longitude), parseFloat(node.latitude)])
                    .setOffset([0, -15]) // Float above the node
                    .addTo(map.current!);

                statusMarkersRef.current.push(marker);
            }
        });

        // 2. Crowdsourced Cutoffs (Cities: Skylines "No Power/Water" feel)
        ['electricity', 'water'].forEach(type => {
            const stateKey = type === 'electricity' ? 'crowdElectricity' : 'crowdWater';
            if (!activeLayers[stateKey as keyof typeof activeLayers]) return;

            const features = crowd[type as keyof typeof crowd]?.features || [];
            features.forEach((feat: any) => {
                if (feat.properties.status === 'cutoff' && feat.geometry.type === 'Point') {
                    const el = document.createElement('div');
                    el.className = 'status-bubble pb-1 pt-1';
                    el.innerHTML = type === 'electricity' ? '⚡' : '💧';
                    el.style.borderColor = '#ef4444';
                    el.style.animationDelay = `${Math.random() * -4}s`; // Real staggered bobbing

                    el.onclick = (e) => {
                        e.stopPropagation();
                        map.current?.flyTo({ center: feat.geometry.coordinates, zoom: 16 });
                    };

                    const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' }) // Anchor bottom for tail
                        .setLngLat(feat.geometry.coordinates)
                        .addTo(map.current!);

                    statusMarkersRef.current.push(marker);
                }
            });
        });
    };

    const getLayerForNodeType = (type: string) => {
        if (['manhole'].includes(type)) return 'sewage';
        if (['transformer', 'pole', 'generator'].includes(type)) return 'electricity';
        if (['pump', 'water_tank', 'valve'].includes(type)) return 'water';
        if (['exchange', 'cabinet'].includes(type)) return 'phone';
        return null;
    };

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
        const newState = !activeLayers[layer];
        setActiveLayers(prev => ({
            ...prev,
            [layer]: newState
        }));

        if (map.current) {
            const visibility = newState ? 'visible' : 'none';
            if (map.current.getLayer(`infra-${layer}`)) {
                map.current.setLayoutProperty(`infra-${layer}`, 'visibility', visibility);
            }
            if (map.current.getLayer(`infra-${layer}-nodes-layer`)) {
                map.current.setLayoutProperty(`infra-${layer}-nodes-layer`, 'visibility', visibility);
            }
            if (map.current.getLayer(`infra-${layer}-nodes-bg`)) {
                map.current.setLayoutProperty(`infra-${layer}-nodes-bg`, 'visibility', visibility);
            }

            // Toggle custom HTML markers
            const markers = (map.current as any)._infraMarkers?.[layer];
            if (markers) {
                markers.forEach((m: any) => {
                    m.element.style.visibility = newState ? 'visible' : 'hidden';
                });
            }
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-slate-50 dark:bg-slate-900 flex flex-col z-0">
            {/* Map Container */}
            <div className="relative w-full h-full">
                <div ref={mapContainer} className="absolute inset-0 z-0 bg-slate-200 dark:bg-slate-800" />

                {/* Header & Search - Added Safe Area Top */}
                <div className="absolute top-0 left-0 right-0 z-10 pt-16 px-4 pointer-events-none bg-gradient-to-b from-white/80 to-transparent dark:from-slate-900/80 pb-6">
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

                    </div>

                    {/* FABs - Adjusted Bottom Position for Nav Bar */}
                    <div className="absolute bottom-32 left-4 z-10 flex flex-col gap-3 pointer-events-auto pb-safe">
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

                        {user?.role === 'admin' && (
                            <button
                                onClick={() => navigate('/admin/map-editor')}
                                className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-premium active:scale-95 transition-transform border border-slate-800"
                            >
                                <Edit3 size={20} />
                            </button>
                        )}
                    </div>

                    {/* Time Machine Slider */}
                    <div className="absolute bottom-10 left-6 right-6 z-40">
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-xl">
                            <div className="flex justify-between items-center mb-2 px-1">
                                <h4 className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <Clock size={12} className="text-emerald-500" />
                                    آلة الزمن
                                </h4>
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                                    {selectedDateLabel}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="-7"
                                max="0"
                                step="1"
                                value={timeOffset}
                                onChange={(e) => setTimeOffset(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 mb-1"
                            />
                            <div className="flex justify-between px-1">
                                <span className="text-[9px] text-slate-400 font-bold">قبل أسبوع</span>
                                <span className="text-[9px] text-slate-400 font-bold">اليوم</span>
                            </div>
                        </div>
                    </div>
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

                            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar overscroll-contain pb-10 touch-pan-y" onTouchStart={(e) => e.stopPropagation()}>
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

                                <div className="text-xs font-bold text-slate-400 dark:text-slate-600 mt-4 mb-2 pr-2 text-right uppercase tracking-wider">حالة الشبكة (مجتمعي)</div>

                                {[
                                    { id: 'crowdElectricity', label: 'كهرباء (بلاغات)', color: 'bg-yellow-500', sub: 'حالة الكهرباء الآن' },
                                    { id: 'crowdWater', label: 'مياه (بلاغات)', color: 'bg-blue-500', sub: 'حالة المياه الآن' },
                                    { id: 'publicReports', label: 'بلاغات المواطنين', color: 'bg-rose-500', sub: 'أماكن المشاكل الحالية' },
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
                {/* Infra Detail Modal */}
                {selectedInfra && (
                    <div className="absolute inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm px-4 pb-20" onClick={() => setSelectedInfra(null)}>
                        <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                        {(INFRA_ICONS[selectedInfra.type] as any)?.icon || '📍'}
                                    </div>
                                    <div className="text-right">
                                        <h3 className="font-bold text-slate-900 dark:text-white">
                                            {selectedInfra.type === 'water_tank' ? 'خزان مياه' :
                                                selectedInfra.type === 'transformer' ? 'محولة كهرباء' :
                                                    selectedInfra.type === 'pole' ? 'عامود إنارة' :
                                                        selectedInfra.type === 'pump' ? 'مضخة مياه' :
                                                            selectedInfra.type === 'valve' ? 'صمام' :
                                                                selectedInfra.type === 'generator' ? 'مولدة' :
                                                                    selectedInfra.type === 'manhole' ? 'ريكار' :
                                                                        selectedInfra.type}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {INFRA_COLORS[selectedInfra.sector as keyof typeof INFRA_COLORS]?.label} | {selectedInfra.serial_number || `ID: ${selectedInfra.id}`}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedInfra(null)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center text-sm p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <span className="text-slate-500">الحالة</span>
                                    <span className="font-bold text-emerald-600">يعمل بشكل جيد</span>
                                </div>
                                {selectedInfra.meta && (
                                    <div className="text-sm p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-right">
                                        <span className="text-slate-500 block mb-1">معلومات إضافية</span>
                                        <span className="text-slate-700 dark:text-slate-300">
                                            {typeof selectedInfra.meta === 'string' ? selectedInfra.meta : JSON.stringify(selectedInfra.meta)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setSelectedInfra(null)}
                                    className="py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm transition-active active:scale-95"
                                >
                                    إغلاق
                                </button>
                                <button
                                    onClick={() => {
                                        navigate('/add-report', {
                                            state: {
                                                prefill: {
                                                    type: 'infrastructure',
                                                    title: `عطل في ${(INFRA_ICONS[selectedInfra.type] || '')} ${selectedInfra.type}`,
                                                    latitude: selectedInfra.lat,
                                                    longitude: selectedInfra.lng,
                                                    infrastructure_node_id: selectedInfra.sector !== 'line' ? selectedInfra.id : null,
                                                    infrastructure_line_id: selectedInfra.sector === 'line' ? selectedInfra.id : null,
                                                    serial_number: selectedInfra.serial_number
                                                }
                                            }
                                        });
                                    }}
                                    className="py-3 px-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 transition-active active:scale-95"
                                >
                                    تبليغ عن عطل
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            );
}
