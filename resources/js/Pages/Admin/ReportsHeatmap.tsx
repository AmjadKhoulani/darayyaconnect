import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';

export default function ReportsHeatmap({ auth }: { auth: any }) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!mapContainer.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                version: 8,
                sources: {
                    osm: {
                        type: 'raster',
                        tiles: [
                            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                        ],
                        tileSize: 256,
                        attribution: '&copy; OpenStreetMap',
                    },
                },
                layers: [
                    {
                        id: 'osm',
                        type: 'raster',
                        source: 'osm',
                    },
                ],
            },
            center: [36.236, 33.456], // Darayya Center
            zoom: 14,
        });

        map.current.on('load', () => {
            fetchHeatmapData();
        });

        return () => {
            map.current?.remove();
        };
    }, []);

    const fetchHeatmapData = async () => {
        try {
            const response = await axios.get('/api/analytics/reports/heatmap');
            const data = response.data; // GeoJSON FeatureCollection

            if (!map.current) return;

            map.current.addSource('reports', {
                type: 'geojson',
                data: data,
            });

            // Helper to add emoji as icon
            const addEmojiIcon = (id: string, emoji: string) => {
                if (map.current?.hasImage(id)) return;

                const canvas = document.createElement('canvas');
                canvas.width = 64;
                canvas.height = 64;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.font = '48px serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(emoji, 32, 32);
                    const imageData = ctx.getImageData(0, 0, 64, 64);
                    map.current?.addImage(id, imageData);
                }
            };

            // Add all necessary icons
            addEmojiIcon('icon-water', '💧');
            addEmojiIcon('icon-electricity', '⚡');
            addEmojiIcon('icon-lighting', '💡');
            addEmojiIcon('icon-trash', '🗑️');
            addEmojiIcon('icon-road', '🚧');
            addEmojiIcon('icon-comm', '📡');
            addEmojiIcon('icon-alert', '⚠️');

            map.current.addLayer({
                id: 'reports-icons',
                type: 'symbol',
                source: 'reports',
                minzoom: 12, // Show icons when zoomed in
                layout: {
                    'icon-image': [
                        'match',
                        ['get', 'category'],
                        'water', 'icon-water',
                        'electricity', 'icon-electricity',
                        'lighting', 'icon-lighting',
                        'sanitation', 'icon-trash',
                        'trash', 'icon-trash',
                        'road', 'icon-road',
                        'infrastructure', 'icon-road',
                        'communication', 'icon-comm',
                        'icon-alert' // Default
                    ],
                    'icon-size': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        12, 0.5,
                        15, 0.8,
                        18, 1.2
                    ],
                    'icon-allow-overlap': false
                }
            });

            // Keep a subtle heatmap background for zoomed out view
            map.current.addLayer({
                id: 'reports-heatmap',
                type: 'heatmap',
                source: 'reports',
                maxzoom: 14, // Fade out heatmap as icons appear
                paint: {
                    'heatmap-weight': ['interpolate', ['linear'], ['get', 'weight'], 0, 0, 1, 1],
                    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 14, 3],
                    'heatmap-color': [
                        'interpolate', ['linear'], ['heatmap-density'],
                        0, 'rgba(0,0,0,0)',
                        0.2, 'rgb(103,169,207)',
                        0.4, 'rgb(209,229,240)',
                        0.6, 'rgb(253,219,199)',
                        0.8, 'rgb(239,138,98)',
                        1, 'rgb(178,24,43)'
                    ],
                    'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 12, 1, 14, 0]
                }
            });

            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch heatmap data', error);
            setLoading(false);
        }
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    خريطة البلاغات الحرارية
                </h2>
            }
        >
            <Head title="خريطة البلاغات" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="relative h-[600px] p-6 text-gray-900 dark:text-gray-100">
                            <div
                                ref={mapContainer}
                                className="absolute inset-0 h-full w-full"
                            />

                            {loading && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur dark:bg-black/50">
                                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600"></div>
                                </div>
                            )}

                            <div className="absolute right-4 top-4 z-10 max-w-xs rounded-xl border border-slate-200 bg-white/90 p-4 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-800/90">
                                <h3 className="mb-2 text-sm font-bold">
                                    مؤشر الكثافة
                                </h3>
                                <div className="mb-1 flex items-center gap-2">
                                    <div className="h-2 w-full rounded-full bg-gradient-to-r from-blue-200 via-orange-300 to-red-600"></div>
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-500">
                                    <span>منخفض</span>
                                    <span>عالي</span>
                                </div>
                                <p className="mt-2 text-[10px] leading-relaxed text-slate-400">
                                    تعرض الخريطة أماكن تركز البلاغات المقدمة من
                                    المواطنين. المناطق الحمراء تشير إلى عدد كبير
                                    من البلاغات أو بلاغات ذات خطورة عالية.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
