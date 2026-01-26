import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight, MapPin, Plus, Save, Trash2, X, Info, Layers,
    Droplets, Zap, Wind, Phone, PenTool, CheckCircle2,
    Undo2, Redo2, Check, MousePointer2
} from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
// @ts-ignore
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import api from '../services/api';

// --- Configuration (Copied & Adapted from Web Editor) ---
type SectorType = 'water' | 'electricity' | 'sewage' | 'phone';

const SECTOR_CONFIG: Record<string, {
    label: string;
    color: string;
    icon: any;
    nodeTypes: { type: string; label: string; icon: string; canFeedNeighborhood?: boolean }[];
    lineTypes: { type: string; label: string; icon: string; canFeedNeighborhood?: boolean }[];
}> = {
    water: {
        label: 'المياه',
        color: '#3b82f6',
        icon: Droplets,
        nodeTypes: [
            { type: 'water_tank', label: 'خزان', icon: '🏰', canFeedNeighborhood: true },
            { type: 'pump', label: 'مضخة', icon: '⚙️', canFeedNeighborhood: true },
            { type: 'valve', label: 'سكر/صمام', icon: '🔧' },
        ],
        lineTypes: [
            { type: 'water_pipe_main', label: 'أنبوب رئيسي', icon: '🌊' },
            { type: 'water_pipe_distribution', label: 'أنبوب فرعي', icon: '💧' },
        ]
    },
    electricity: {
        label: 'الكهرباء',
        color: '#eab308',
        icon: Zap,
        nodeTypes: [
            { type: 'transformer', label: 'محولة', icon: '⚡', canFeedNeighborhood: true },
            { type: 'pole', label: 'عامود', icon: '🗼' },
            { type: 'generator', label: 'مولدة', icon: '🔋', canFeedNeighborhood: true },
        ],
        lineTypes: [
            { type: 'power_cable_underground', label: 'كبل أرضي', icon: '🔌' },
            { type: 'power_line_overhead', label: 'كبل هوائي', icon: '🚡' },
        ]
    },
    sewage: {
        label: 'الصرف',
        color: '#78350f',
        icon: Wind,
        nodeTypes: [
            { type: 'manhole', label: 'ريكار', icon: '🕳️' },
        ],
        lineTypes: [
            { type: 'sewage_pipe', label: 'قسطل', icon: '🚿' },
        ]
    },
    phone: {
        label: 'الهاتف',
        color: '#10b981',
        icon: Phone,
        nodeTypes: [
            { type: 'exchange', label: 'مقسم', icon: '🏢' },
            { type: 'cabinet', label: 'علبة', icon: '📦' },
        ],
        lineTypes: [
            { type: 'telecom_cable', label: 'كبل', icon: '📞' },
        ]
    }
};

const NEIGHBORHOODS = [
    "الشرقي", "الغربي", "القبلية", "الكورنيش", "الثورة", "المركز", "الشاميات", "الخليج"
];

export default function MapEditor() {
    const navigate = useNavigate();
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const draw = useRef<MapboxDraw | null>(null);

    // State
    const [activeSector, setActiveSector] = useState<SectorType>('water');
    const [activeTool, setActiveTool] = useState<'select' | 'point' | 'line'>('select');
    const [selectedSubType, setSelectedSubType] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [inspectorData, setInspectorData] = useState<any | null>(null);

    // Form State for Inspector
    const [editForm, setEditForm] = useState({
        serial_number: '',
        status: 'active',
        assigned_neighborhood: '',
        notes: ''
    });

    const activeConfig = SECTOR_CONFIG[activeSector];

    // Refs for closure access
    const activeToolRef = useRef(activeTool);
    const subTypeRef = useRef(selectedSubType);
    useEffect(() => { activeToolRef.current = activeTool; }, [activeTool]);
    useEffect(() => { subTypeRef.current = selectedSubType; }, [selectedSubType]);

    // Init Map
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
            center: [36.236, 33.456],
            zoom: 15
        });

        // Initialize Draw
        draw.current = new MapboxDraw({
            displayControlsDefault: false,
            // Mobile-optimized touch interactions are handled natively by mapbox-gl-draw mostly,
            // but we rely on our custom toolbar buttons to trigger modes.
            touchEnabled: true,
            styles: [
                {
                    id: 'gl-draw-line',
                    type: 'line',
                    filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
                    layout: { 'line-cap': 'round', 'line-join': 'round' },
                    paint: {
                        'line-color': '#EF4444', // Red for new drawing
                        'line-dasharray': [2, 2],
                        'line-width': 4
                    },
                },
                {
                    id: 'gl-draw-point',
                    type: 'circle',
                    filter: ['all', ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
                    paint: {
                        'circle-radius': 10, // Larger for touch
                        'circle-color': '#EF4444',
                        'circle-stroke-width': 3,
                        'circle-stroke-color': '#fff'
                    },
                },
            ]
        });
        map.current.addControl(draw.current, 'top-left');

        map.current.on('load', () => {
            fetchData();
        });

        // Listeners for drawing
        map.current.on('draw.create', (e) => handleCreate(e.features[0]));
        map.current.on('click', (e) => {
            const features = map.current?.queryRenderedFeatures(e.point);
            if (features && features.length > 0) {
                // Find first feature that has an ID and belongs to our layers
                const relevantFeature = features.find(f => f.layer.id.startsWith('net-'));
                if (relevantFeature && relevantFeature.properties?.id) {
                    const props = relevantFeature.properties;
                    // Parse meta if string
                    const meta = typeof props.meta === 'string' ? JSON.parse(props.meta) : (props.meta || {});

                    setInspectorData({
                        id: props.id,
                        type: props.type,
                        layer: relevantFeature.layer.id,
                        properties: { ...props, meta }
                    });

                    // Populate Form
                    setEditForm({
                        serial_number: props.serial_number || '',
                        status: props.status || 'active',
                        assigned_neighborhood: meta.assigned_neighborhood || '',
                        notes: meta.notes || ''
                    });

                    // Switch to select mode to stop drawing if active
                    startTool('select');
                }
            }
        });

    }, []);

    // Fetch Data on Sector Change
    useEffect(() => {
        if (map.current?.loaded()) {
            fetchData();
        }
    }, [activeSector]);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Fetch ALL infrastructure
            const { data } = await api.get('/infrastructure'); // This endpoint usually returns everything

            // Filter client-side by active sector configuration
            const sectorNodes = data.nodes.filter((n: any) =>
                activeConfig.nodeTypes.some(t => t.type === n.type)
            );
            const sectorLines = data.lines.filter((l: any) =>
                activeConfig.lineTypes.some(t => t.type === l.type)
            );

            renderData(sectorLines, sectorNodes);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const renderData = (lines: any[], nodes: any[]) => {
        if (!map.current) return;
        const sourceId = 'net-layer';

        // Clear existing if any (simplification: remove source and add fresh)
        // Ideally we keep one source and update data, but for sector switching cleaning is safer
        if (map.current.getSource(sourceId)) {
            (map.current.getSource(sourceId) as maplibregl.GeoJSONSource).setData({
                type: 'FeatureCollection',
                features: []
            });
        } else {
            map.current.addSource(sourceId, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
            // Add layers
            map.current.addLayer({
                id: 'net-lines',
                type: 'line',
                source: sourceId,
                filter: ['==', '$type', 'LineString'],
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: {
                    'line-color': activeConfig.color,
                    'line-width': 4,
                    'line-dasharray': ['case', ['==', ['get', 'is_published'], false], ['literal', [2, 2]], ['literal', [1, 0]]]
                }
            });
            map.current.addLayer({
                id: 'net-nodes',
                type: 'circle',
                source: sourceId,
                filter: ['==', '$type', 'Point'],
                paint: {
                    'circle-radius': 8,
                    'circle-color': activeConfig.color,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#fff'
                }
            });
        }

        const geojson: any = {
            type: 'FeatureCollection',
            features: [
                ...lines.map(l => ({
                    type: 'Feature',
                    geometry: { type: 'LineString', coordinates: l.coordinates },
                    properties: { ...l, id: l.id, type: l.type }
                })),
                ...nodes.map(n => ({
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [parseFloat(n.longitude), parseFloat(n.latitude)] },
                    properties: { ...n, id: n.id, type: n.type }
                }))
            ]
        };

        (map.current.getSource(sourceId) as maplibregl.GeoJSONSource).setData(geojson);
    };

    // Tools
    const startTool = (mode: 'select' | 'point' | 'line', subType?: string) => {
        setActiveTool(mode);
        if (subType) setSelectedSubType(subType);

        if (!draw.current) return;

        if (mode === 'select') {
            draw.current.changeMode('simple_select');
        } else if (mode === 'point') {
            draw.current.changeMode('draw_point');
        } else if (mode === 'line') {
            draw.current.changeMode('draw_line_string');
        }
    };

    const handleCreate = async (feature: any) => {
        const type = subTypeRef.current;
        if (!type || activeToolRef.current === 'select') return;

        try {
            if (activeToolRef.current === 'point') {
                const coords = feature.geometry.coordinates;
                await api.post('/infrastructure/nodes', {
                    type,
                    latitude: coords[1],
                    longitude: coords[0],
                    status: 'active'
                });
            } else if (activeToolRef.current === 'line') {
                await api.post('/infrastructure/lines', {
                    type,
                    coordinates: feature.geometry.coordinates,
                    status: 'active'
                });
            }
            alert('تم الحفظ!');
            draw.current?.deleteAll();
            fetchData(); // Refresh to see styled custom layer version

            // Stay in mode? Or exit? Web editor stays. Let's stay.
            startTool(activeToolRef.current, subTypeRef.current);

        } catch (e: any) {
            alert('فشل الحفظ: ' + e.message);
            draw.current?.delete(feature.id);
        }
    };

    const updateAsset = async () => {
        if (!inspectorData) return;
        try {
            setLoading(true);
            const endpoint = inspectorData.layer.includes('nodes') ? 'nodes' : 'lines';

            await api.put(`/infrastructure/${endpoint}/${inspectorData.id}/update`, {
                serial_number: editForm.serial_number,
                status: editForm.status,
                meta: {
                    assigned_neighborhood: editForm.assigned_neighborhood,
                    notes: editForm.notes
                }
            });

            setInspectorData(null);
            alert('تم تحديث البيانات');
            fetchData();
        } catch (e) {
            alert('فشل التحديث');
        } finally {
            setLoading(false);
        }
    };

    const deleteAsset = async () => {
        if (!inspectorData || !confirm('تأكيد الحذف؟')) return;
        try {
            const endpoint = inspectorData.layer.includes('nodes') ? 'nodes' : 'lines';
            await api.delete(`/infrastructure/${endpoint}/${inspectorData.id}`);
            setInspectorData(null);
            fetchData();
        } catch (e) {
            alert('فشل الحذف');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50" dir="rtl">
            {/* Header & Sector Tabs */}
            <div className="bg-white border-b border-slate-200 z-20">
                <div className="px-4 py-3 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                        <ArrowRight className="text-slate-600" />
                    </button>
                    <h1 className="font-black text-slate-800">محرر الشبكة</h1>
                    <div className="w-10"></div>
                </div>

                {/* Horizontal Scrollable Tabs */}
                <div className="flex overflow-x-auto px-4 pb-3 gap-2 hide-scrollbar">
                    {Object.entries(SECTOR_CONFIG).map(([key, val]) => {
                        const Icon = val.icon;
                        const isActive = activeSector === key;
                        return (
                            <button
                                key={key}
                                onClick={() => { setActiveSector(key as any); startTool('select'); }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border whitespace-nowrap transition-all ${isActive ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600'
                                    }`}
                            >
                                <Icon size={16} />
                                <span className="text-xs font-bold">{val.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Map */}
            <div className="flex-1 relative">
                <div ref={mapContainer} className="absolute inset-0 z-0 bg-slate-200" />

                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-50">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-slate-800"></div>
                    </div>
                )}
            </div>

            {/* Bottom Toolbar & Inspector */}
            {inspectorData ? (
                // Inspector Sheet
                <div className="bg-white border-t border-slate-200 p-6 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-30 animate-slide-up max-h-[60vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: activeConfig.color }}>
                                <Info size={20} />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-800 text-lg">{inspectorData.properties.type}</h3>
                                <p className="text-[10px] text-slate-400 font-mono">ID: {inspectorData.id}</p>
                            </div>
                        </div>
                        <button onClick={() => setInspectorData(null)} className="bg-slate-100 p-2 rounded-full text-slate-500"><X size={20} /></button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-1.5 block">الرقم التسلسلي</label>
                            <input
                                value={editForm.serial_number}
                                onChange={e => setEditForm({ ...editForm, serial_number: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold"
                                placeholder="SN-..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 mb-1.5 block">الحالة</label>
                                <select
                                    value={editForm.status}
                                    onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold"
                                >
                                    <option value="active">يعمل</option>
                                    <option value="maintenance">صيانة</option>
                                    <option value="damaged">معطل</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 mb-1.5 block">الحارة</label>
                                <select
                                    value={editForm.assigned_neighborhood}
                                    onChange={e => setEditForm({ ...editForm, assigned_neighborhood: e.target.value })}
                                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold"
                                >
                                    <option value="">(بدون)</option>
                                    {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-1.5 block">ملاحظات</label>
                            <textarea
                                value={editForm.notes}
                                onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold h-20 resize-none"
                                placeholder="أي ملاحظات فنية..."
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button onClick={updateAsset} className="flex-1 bg-slate-900 text-white py-3.5 rounded-xl font-bold shadow-lg">حفظ التعديلات</button>
                            <button onClick={deleteAsset} className="bg-rose-50 text-rose-500 py-3.5 px-5 rounded-xl font-bold"><Trash2 size={20} /></button>
                        </div>
                    </div>
                </div>
            ) : (
                // Tools Toolbar
                <div className="bg-white border-t border-slate-200 p-4 pb-8 z-30">
                    <p className="text-[10px] font-bold text-slate-400 mb-3 px-1 uppercase tracking-wider">أدوات الرسم - {activeConfig.label}</p>

                    {/* Horizontal Scroller for Tools */}
                    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                        {/* Select Tool */}
                        <button
                            onClick={() => startTool('select')}
                            className={`flex flex-col items-center gap-1 min-w-[70px] p-3 rounded-2xl border transition-all ${activeTool === 'select'
                                ? 'bg-slate-100 border-slate-300 text-slate-900'
                                : 'bg-white border-slate-100 text-slate-400'
                                }`}
                        >
                            <MousePointer2 size={24} />
                            <span className="text-[10px] font-bold">تحريك</span>
                        </button>

                        <div className="w-px bg-slate-100 h-16 mx-1"></div>

                        {/* Node Tools */}
                        {activeConfig.nodeTypes.map(t => (
                            <button
                                key={t.type}
                                onClick={() => startTool('point', t.type)}
                                className={`flex flex-col items-center gap-1 min-w-[70px] p-3 rounded-2xl border transition-all ${activeTool === 'point' && selectedSubType === t.type
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm'
                                    : 'bg-white border-slate-100 text-slate-600'
                                    }`}
                            >
                                <span className="text-xl">{t.icon}</span>
                                <span className="text-[10px] font-bold text-center leading-tight">{t.label}</span>
                            </button>
                        ))}

                        <div className="w-px bg-slate-100 h-16 mx-1"></div>

                        {/* Line Tools */}
                        {activeConfig.lineTypes.map(t => (
                            <button
                                key={t.type}
                                onClick={() => startTool('line', t.type)}
                                className={`flex flex-col items-center gap-1 min-w-[70px] p-3 rounded-2xl border transition-all ${activeTool === 'line' && selectedSubType === t.type
                                    ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                                    : 'bg-white border-slate-100 text-slate-600'
                                    }`}
                            >
                                <span className="text-xl">{t.icon}</span>
                                <span className="text-[10px] font-bold text-center leading-tight">{t.label}</span>
                            </button>
                        ))}
                    </div>

                    {activeTool !== 'select' && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-full shadow-xl text-xs font-bold animate-bounce">
                            {activeTool === 'point' ? 'اضغط لإضافة نقطة' : 'اضغط لرسم نقاط الخط'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}


const NODE_TYPES = [
    { value: 'water_tank', label: 'خزان مياه', sector: 'water', icon: '🏰' },
    { value: 'pump', label: 'مضخة', sector: 'water', icon: '⚙️' },
    { value: 'valve', label: 'سكب/محبس', sector: 'water', icon: '🔧' },
    { value: 'transformer', label: 'محولة كهرباء', sector: 'electricity', icon: '⚡' },
    { value: 'pole', label: 'عمود كهرباء', sector: 'electricity', icon: '🗼' },
    { value: 'generator', label: 'مولدة أمبيرات', sector: 'electricity', icon: '🔋' },
    { value: 'manhole', label: 'ريكار/فتحة', sector: 'sewage', icon: '🕳️' },
    { value: 'sewage_pump', label: 'مضخة صرف صحي', sector: 'sewage', icon: '🌀' },
    { value: 'exchange', label: 'مقسم هاتف', sector: 'phone', icon: '🏢' },
    { value: 'cabinet', label: 'خزانة توزيع هاتف', sector: 'phone', icon: '📦' },
    { value: 'antenna', label: 'برج اتصالات', sector: 'phone', icon: '📡' },
];

export default function MapEditor() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [editForm, setEditForm] = useState({
        type: 'transformer',
        serial_number: '',
        status: 'active',
        latitude: 0,
        longitude: 0
    });

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
            center: [36.236, 33.456],
            zoom: 15
        });

        map.current.on('load', () => {
            setLoading(false);
            loadData();
        });

        map.current.on('click', (e) => {
            if (isAdding) {
                setEditForm({
                    type: 'transformer',
                    serial_number: '',
                    status: 'active',
                    latitude: e.lngLat.lat,
                    longitude: e.lngLat.lng
                });
                setIsAdding(false);
                setSelectedItem({ id: 'new', is_new: true });
            }
        });
    }, [isAdding]);

    const loadData = async () => {
        try {
            const res = await api.get('/infrastructure');
            const { nodes } = res.data;

            // Add sources and layers if not exist
            const mapInstance = map.current;
            if (!mapInstance) return;

            if (mapInstance.getSource('nodes-source')) {
                (mapInstance.getSource('nodes-source') as any).setData({
                    type: 'FeatureCollection',
                    features: nodes.map((n: any) => ({
                        type: 'Feature',
                        geometry: { type: 'Point', coordinates: [parseFloat(n.longitude), parseFloat(n.latitude)] },
                        properties: n
                    }))
                });
            } else {
                mapInstance.addSource('nodes-source', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: nodes.map((n: any) => ({
                            type: 'Feature',
                            geometry: { type: 'Point', coordinates: [parseFloat(n.longitude), parseFloat(n.latitude)] },
                            properties: n
                        }))
                    }
                });

                mapInstance.addLayer({
                    id: 'nodes-layer',
                    type: 'circle',
                    source: 'nodes-source',
                    paint: {
                        'circle-radius': 8,
                        'circle-color': '#000',
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#fff'
                    }
                });

                mapInstance.on('click', 'nodes-layer', (e) => {
                    if (e.features && e.features[0]) {
                        const props = e.features[0].properties;
                        setSelectedItem(props);
                        setEditForm({
                            type: props.type,
                            serial_number: props.serial_number || '',
                            status: props.status || 'active',
                            latitude: props.latitude,
                            longitude: props.longitude
                        });
                    }
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async () => {
        try {
            if (selectedItem.is_new) {
                await api.post('/infrastructure/nodes', editForm);
            } else {
                await api.post(`/infrastructure/nodes/${selectedItem.id}/update`, editForm);
            }
            setSelectedItem(null);
            loadData();
            alert('تم الحفظ بنجاح');
        } catch (err) {
            alert('فشل الحفظ');
        }
    };

    const handleDelete = async () => {
        if (!confirm('هل أنت متأكد من الحفظ؟')) return;
        try {
            await api.delete(`/infrastructure/nodes/${selectedItem.id}`);
            setSelectedItem(null);
            loadData();
        } catch (err) {
            alert('فشل الحذف');
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-50 flex flex-col" dir="rtl">
            <header className="bg-white px-4 py-4 border-b border-slate-100 flex items-center justify-between z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                        <ArrowRight className="text-slate-600" />
                    </button>
                    <h1 className="text-lg font-black text-slate-800">محرر الخريطة</h1>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all ${isAdding ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-900 text-white'
                        }`}
                >
                    <Plus size={24} />
                </button>
            </header>

            <div className="flex-1 relative">
                <div ref={mapContainer} className="absolute inset-0 z-0" />

                {isAdding && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-2 rounded-full text-xs font-black shadow-xl z-10 animate-fade-in">
                        انقر على الخريطة لوضع نقطة جديدة
                    </div>
                )}

                {selectedItem && (
                    <div className="absolute bottom-6 left-6 right-6 bg-white rounded-[40px] p-8 shadow-2xl border border-slate-100 z-10 animate-slide-up">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-slate-800">
                                {selectedItem.is_new ? 'إضافة نقطة جديدة' : 'تعديل البيانات'}
                            </h3>
                            <button onClick={() => setSelectedItem(null)} className="text-slate-400">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">نوع المنشأة</label>
                                <select
                                    value={editForm.type}
                                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                                    className="w-full bg-slate-50 border-slate-100 rounded-2xl p-4 text-sm font-bold"
                                >
                                    {NODE_TYPES.map(t => (
                                        <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">الرقم التسلسلي</label>
                                <input
                                    type="text"
                                    value={editForm.serial_number}
                                    onChange={(e) => setEditForm({ ...editForm, serial_number: e.target.value })}
                                    className="w-full bg-slate-50 border-slate-100 rounded-2xl p-4 text-sm font-bold"
                                    placeholder="SN-XXXXX"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">الحالة التشغيلية</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['active', 'maintenance', 'damaged'].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setEditForm({ ...editForm, status: s })}
                                            className={`p-3 rounded-2xl text-[10px] font-black transition-all ${editForm.status === s
                                                ? 'bg-slate-900 text-white'
                                                : 'bg-slate-50 text-slate-400'
                                                }`}
                                        >
                                            {s === 'active' ? 'يعمل' : s === 'maintenance' ? 'صيانة' : 'معطل'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <button
                                    onClick={handleSave}
                                    className="flex-1 bg-emerald-500 text-white py-4 rounded-3xl font-black shadow-lg shadow-emerald-200"
                                >
                                    حفظ التغييرات
                                </button>
                                {!selectedItem.is_new && (
                                    <button
                                        onClick={handleDelete}
                                        className="bg-rose-50 text-rose-500 w-16 rounded-3xl flex items-center justify-center shadow-lg shadow-rose-100"
                                    >
                                        <Trash2 size={24} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
