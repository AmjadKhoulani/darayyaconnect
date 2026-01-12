import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
// @ts-ignore
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { Save, Layers, AlertTriangle, Settings, MousePointer, Info } from 'lucide-react';
import axios from 'axios';

// Define Types
type NetworkType = 'water' | 'electricity' | 'sewage' | 'phone';
type NodeType = 'manhole' | 'pump' | 'transformer' | 'pole';

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
            department?: {
                id: number;
                slug: string;
                name: string;
            }
        }
    }
}

export default function InfrastructureEditor({ auth }: Props) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const draw = useRef<MapboxDraw | null>(null);

    // State
    const [selectedType, setSelectedType] = useState<string>('');
    const [lines, setLines] = useState<any[]>([]);
    const [nodes, setNodes] = useState<any[]>([]);
    const [activeLayer, setActiveLayer] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [inspectorData, setInspectorData] = useState<any | null>(null);

    // Permissions Logic
    const allowedTypes = useMemo(() => {
        const role = auth.user.role;
        const deptSlug = auth.user.department?.slug;

        if (role === 'admin') return ['water', 'electricity', 'sewage', 'phone'];
        if (deptSlug === 'water') return ['water'];
        if (deptSlug === 'electricity') return ['electricity'];
        if (deptSlug === 'municipality') return ['sewage'];
        if (deptSlug === 'telecom') return ['phone'];
        return [];
    }, [auth.user]);

    // Initial Selection
    useEffect(() => {
        if (allowedTypes.length > 0 && !selectedType) {
            setSelectedType(allowedTypes[0]);
        }
    }, [allowedTypes]);

    useEffect(() => {
        if (map.current) return;
        if (!mapContainer.current) return;

        // Initialize Map
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
            center: [36.236, 33.456],
            zoom: 15
        });

        // Initialize Draw Tools
        draw.current = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                line_string: true,
                point: true,
                trash: true
            },
            styles: [
                // ACTIVE (being drawn)
                // line stroke
                {
                    "id": "gl-draw-line",
                    "type": "line",
                    "filter": ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
                    "layout": {
                        "line-cap": "round",
                        "line-join": "round"
                    },
                    "paint": {
                        "line-color": "#2563eb",
                        "line-dasharray": [0.2, 2],
                        "line-width": 4
                    }
                },
                // vertex point halos
                {
                    "id": "gl-draw-polygon-and-line-vertex-halo-active",
                    "type": "circle",
                    "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
                    "paint": {
                        "circle-radius": 7,
                        "circle-color": "#FFF"
                    }
                },
                // vertex points
                {
                    "id": "gl-draw-polygon-and-line-vertex-active",
                    "type": "circle",
                    "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
                    "paint": {
                        "circle-radius": 5,
                        "circle-color": "#2563eb",
                    }
                },
                // point
                {
                    "id": "gl-draw-point-point-stroke-active",
                    "type": "circle",
                    "filter": ["all", ["==", "$type", "Point"], ["==", "meta", "feature"], ["!=", "mode", "static"]],
                    "paint": {
                        "circle-radius": 8,
                        "circle-opacity": 1,
                        "circle-color": "#fff"
                    }
                },
                {
                    "id": "gl-draw-point-active",
                    "type": "circle",
                    "filter": ["all", ["==", "$type", "Point"], ["==", "meta", "feature"], ["!=", "mode", "static"]],
                    "paint": {
                        "circle-radius": 6,
                        "circle-color": "#facc15"
                    }
                },
            ]
        });

        map.current.addControl(draw.current, 'top-left');
        map.current.addControl(new maplibregl.NavigationControl(), 'bottom-right');

        // Event Listeners
        map.current.on('load', () => fetchData());

        map.current.on('draw.create', (e) => saveDraw(e.features[0]));
        map.current.on('draw.update', (e) => updateDraw(e.features[0]));
        map.current.on('draw.delete', (e) => deleteDraw(e.features[0]));

        map.current.on('click', (e) => {
            // Check if clicked on existing feature
            const features = map.current?.queryRenderedFeatures(e.point);
            if (features && features.length > 0 && features[0].properties?.id) {
                setInspectorData({
                    id: features[0].properties.id,
                    type: features[0].properties.type,
                    layer: features[0].layer.id
                });
            } else {
                setInspectorData(null);
            }
        });

    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/infrastructure');
            setLines(data.lines);
            setNodes(data.nodes);
            renderData(data.lines, data.nodes);
        } catch (e) {
            console.error("Failed to fetch data", e);
        } finally {
            setLoading(false);
        }
    };

    const renderData = (linesData: any[], nodesData: any[]) => {
        if (!map.current) return;

        // Helper to add layer if not exists
        const addLayer = (id: string, color: string, type: 'line' | 'circle', data: any[]) => {
            if (map.current?.getSource(id)) {
                (map.current.getSource(id) as maplibregl.GeoJSONSource).setData({
                    type: 'FeatureCollection',
                    features: data
                });
                return;
            }

            map.current?.addSource(id, {
                type: 'geojson',
                data: { type: 'FeatureCollection', features: data }
            });

            if (type === 'line') {
                map.current?.addLayer({
                    id: id,
                    type: 'line',
                    source: id,
                    layout: { 'line-join': 'round', 'line-cap': 'round' },
                    paint: {
                        'line-color': color,
                        'line-width': 4,
                        'line-opacity': 0.8
                    }
                });
            } else {
                map.current?.addLayer({
                    id: id,
                    type: 'circle',
                    source: id,
                    paint: {
                        'circle-radius': 6,
                        'circle-color': color,
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#fff'
                    }
                });
            }
        };

        // Group by type
        const networks = {
            water: { color: '#3b82f6', lines: [], nodes: [] },
            electricity: { color: '#eab308', lines: [], nodes: [] },
            sewage: { color: '#78350f', lines: [], nodes: [] },
            phone: { color: '#10b981', lines: [], nodes: [] }
        };

        linesData.forEach(l => {
            //@ts-ignore
            if (networks[l.type]) networks[l.type].lines.push({
                type: 'Feature',
                geometry: { type: 'LineString', coordinates: l.coordinates },
                properties: { id: l.id, type: l.type }
            });
        });

        nodesData.forEach(n => {
            // Map Node to Network
            let net: string = '';
            if (['manhole'].includes(n.type)) net = 'sewage';
            else if (['pump'].includes(n.type)) net = 'water';
            else if (['transformer', 'pole'].includes(n.type)) net = 'electricity';

            if (net && networks[net as keyof typeof networks]) {
                //@ts-ignore
                networks[net as keyof typeof networks].nodes.push({
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [parseFloat(n.longitude), parseFloat(n.latitude)] },
                    properties: { id: n.id, type: n.type }
                });
            }
        });

        // Render Layers
        Object.entries(networks).forEach(([key, val]) => {
            addLayer(`net-${key}-lines`, val.color, 'line', val.lines);
            addLayer(`net-${key}-nodes`, val.color, 'circle', val.nodes);
        });
    };

    const saveDraw = async (feature: any) => {
        if (!selectedType) return alert("Select a type first");
        if (!allowedTypes.includes(selectedType)) return alert("Permission Denied");

        try {
            if (feature.geometry.type === 'Point') {
                // Determine node type based on network selection
                let nodeType = 'pole'; // Default
                if (selectedType === 'water') nodeType = 'pump';
                if (selectedType === 'sewage') nodeType = 'manhole';
                if (selectedType === 'electricity') nodeType = 'transformer';

                await axios.post('/api/infrastructure/nodes', {
                    type: nodeType, // Simplified
                    latitude: feature.geometry.coordinates[1],
                    longitude: feature.geometry.coordinates[0],
                    status: 'active'
                });
            } else {
                await axios.post('/api/infrastructure/lines', {
                    type: selectedType,
                    coordinates: feature.geometry.coordinates,
                    status: 'active'
                });
            }

            // Clear Draw and Refresh
            draw.current?.deleteAll();
            fetchData();
        } catch (e) {
            alert("Failed to save");
            console.error(e);
        }
    };

    const updateDraw = (feature: any) => {
        console.log("Update not implemented yet", feature);
    };

    const deleteDraw = (feature: any) => {
        console.log("Delete not implemented yet", feature);
    };

    // UI Components
    return (
        <AdminLayout user={auth.user} header={<h2 className="font-bold text-xl text-slate-800 hidden">Infrastructure</h2>}>
            <Head title="GIS Editor" />

            <div className="relative h-[calc(100vh-64px)] w-full bg-slate-100 overflow-hidden flex">

                {/* 1. Left Floating Toolbox */}
                <div className="absolute top-4 left-14 z-10 flex flex-col gap-2">
                    <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-200 w-64">
                        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                            <div className="bg-slate-900 text-white p-1.5 rounded-lg"><Settings size={16} /></div>
                            <span className="font-bold text-sm text-slate-800">Editor Controls</span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Active Network</label>
                                <select
                                    className="w-full text-sm rounded-lg border-slate-200 bg-slate-50 font-bold"
                                    value={selectedType}
                                    onChange={e => setSelectedType(e.target.value)}
                                >
                                    {allowedTypes.map(t => (
                                        <option key={t} value={t}>{t.toUpperCase()}</option>
                                    ))}
                                    {allowedTypes.length === 0 && <option disabled>No Permissions</option>}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => draw.current?.changeMode('draw_line_string')}
                                    disabled={allowedTypes.length === 0}
                                    className="flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-xs font-bold"
                                >
                                    <span>〰️</span> Draw Line
                                </button>
                                <button
                                    onClick={() => draw.current?.changeMode('draw_point')}
                                    disabled={allowedTypes.length === 0}
                                    className="flex items-center justify-center gap-2 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition text-xs font-bold"
                                >
                                    <span>📍</span> Add Node
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats / Info */}
                    <div className="bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg border border-slate-200 w-64 text-xs">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-slate-500">Total Lines</span>
                            <span className="font-bold">{lines.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">Total Assets</span>
                            <span className="font-bold">{nodes.length}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Map Area */}
                <div ref={mapContainer} className="flex-1 h-full relative" />

                {/* 3. Right Inspector Panel (Conditional) */}
                {inspectorData && (
                    <div className="absolute top-4 right-4 z-10 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 animate-in slide-in-from-right-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Info size={16} className="text-blue-500" /> Asset Details
                            </h3>
                            <button onClick={() => setInspectorData(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>

                        <div className="space-y-3">
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="text-xs text-slate-400 uppercase font-bold mb-1">Asset ID</div>
                                <div className="font-mono text-sm">{inspectorData.id}</div>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="text-xs text-slate-400 uppercase font-bold mb-1">Type</div>
                                <div className="font-bold text-slate-700 capitalize">{inspectorData.type}</div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button className="flex-1 bg-rose-50 text-rose-600 py-2 rounded-lg text-xs font-bold hover:bg-rose-100">Delete Asset</button>
                                <button className="flex-1 bg-slate-800 text-white py-2 rounded-lg text-xs font-bold hover:bg-slate-700">Edit Data</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"></div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

