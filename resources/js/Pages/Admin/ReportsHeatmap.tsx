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
            const response = await axios.get('/api/reports/heatmap');
            const data = response.data; // Array of [lat, lng, intensity]

            if (!map.current) return;

            const features = data.map((point: number[]) => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [point[1], point[0]], // GeoJSON is [lng, lat]
                },
                properties: {
                    intensity: point[2],
                },
            }));

            map.current.addSource('reports', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: features,
                },
            });

            map.current.addLayer({
                id: 'reports-heatmap',
                type: 'heatmap',
                source: 'reports',
                maxzoom: 18,
                paint: {
                    // Increase the heatmap weight based on frequency and property magnitude
                    'heatmap-weight': [
                        'interpolate',
                        ['linear'],
                        ['get', 'intensity'],
                        0,
                        0,
                        1,
                        1,
                    ],
                    // Increase the heatmap color weight weight by zoom level
                    // heatmap-intensity is a multiplier on top of heatmap-weight
                    'heatmap-intensity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0,
                        1,
                        15,
                        3,
                    ],
                    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                    // Begin color ramp at 0-stop with a 0-transparancy color
                    // to create a blur-like effect.
                    'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0,
                        'rgba(33,102,172,0)',
                        0.2,
                        'rgb(103,169,207)',
                        0.4,
                        'rgb(209,229,240)',
                        0.6,
                        'rgb(253,219,199)',
                        0.8,
                        'rgb(239,138,98)',
                        1,
                        'rgb(178,24,43)',
                    ],
                    // Adjust the heatmap radius by zoom level
                    'heatmap-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0,
                        2,
                        9,
                        20,
                    ],
                    // Transition from heatmap to circle layer by zoom level
                    'heatmap-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        1,
                        18,
                        1,
                    ],
                },
            });

            // Add circle layer for more detail at high zoom
            map.current.addLayer({
                id: 'reports-point',
                type: 'circle',
                source: 'reports',
                minzoom: 14,
                paint: {
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        [
                            'interpolate',
                            ['linear'],
                            ['get', 'intensity'],
                            1,
                            1,
                            6,
                            4,
                        ],
                        16,
                        [
                            'interpolate',
                            ['linear'],
                            ['get', 'intensity'],
                            1,
                            5,
                            6,
                            50,
                        ],
                    ],
                    'circle-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'intensity'],
                        0,
                        'rgba(33,102,172,0)',
                        0.2,
                        'rgb(103,169,207)',
                        0.4,
                        'rgb(209,229,240)',
                        0.6,
                        'rgb(253,219,199)',
                        0.8,
                        'rgb(239,138,98)',
                        1,
                        'rgb(178,24,43)',
                    ],
                    'circle-stroke-color': 'white',
                    'circle-stroke-width': 1,
                    'circle-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        0,
                        8,
                        1,
                    ],
                },
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
