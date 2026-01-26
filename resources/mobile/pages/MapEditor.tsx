import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Plus, Save, Trash2, X, Info, Layers } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import api from '../services/api';

const INFRA_COLORS = {
    water: '#3b82f6',
    electricity: '#eab308',
    sewage: '#78350f',
    phone: '#10b981'
};

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
