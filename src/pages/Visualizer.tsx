import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Palette, Layers, RotateCcw, Sparkles, Upload, ImageIcon, X, SlidersHorizontal, Camera } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import SEO from '@/components/SEO';
import LazyImage from '@/components/LazyImage';

const cabinetColors = [
    { name: 'თეთრი', value: '#FFFFFF', border: 'border-gray-200' },
    { name: 'შავი', value: '#1a1a1a', border: 'border-gray-800' },
    { name: 'ლურჯი', value: '#1e3a8a', border: 'border-blue-900' },
    { name: 'მწვანე', value: '#14532d', border: 'border-green-900' },
    { name: 'ნაცარი', value: '#374151', border: 'border-gray-600' },
    { name: 'კრემი', value: '#fef3c7', border: 'border-yellow-200' },
    { name: 'ესპრესო', value: '#3f2c20', border: 'border-orange-900' },
    { name: 'ვარდისფერი', value: '#be185d', border: 'border-pink-700' },
];

const wallColors = [
    { name: 'თეთრი', value: '#f5f5f4' },
    { name: 'კრემი', value: '#fef9ef' },
    { name: 'ცისფერი', value: '#dbeafe' },
    { name: 'მწვანე', value: '#dcfce7' },
    { name: 'ნაცარი', value: '#e5e7eb' },
];

const overlayColors = [
    { name: 'არცერთი', value: 'transparent' },
    { name: 'თეთრი', value: '#FFFFFF' },
    { name: 'შავი', value: '#1a1a1a' },
    { name: 'ლურჯი', value: '#1e3a8a' },
    { name: 'მწვანე', value: '#14532d' },
    { name: 'ნაცარი', value: '#374151' },
    { name: 'კრემი', value: '#fef3c7' },
    { name: 'ესპრესო', value: '#3f2c20' },
    { name: 'ვარდისფერი', value: '#be185d' },
    { name: 'ოქროსფერი', value: '#d4af37' },
    { name: 'წითელი', value: '#dc2626' },
    { name: 'იასამნისფერი', value: '#7c3aed' },
];

const blendModes = [
    { name: 'ფერი', value: 'color' as const },
    { name: 'მრავლობითი', value: 'multiply' as const },
    { name: 'ნათელი', value: 'overlay' as const },
    { name: 'რბილი', value: 'soft-light' as const },
];

type ViewMode = 'kitchen' | 'photo';
type TabType = 'granite' | 'furniture';

const Visualizer = () => {
    const { t } = useTranslation();
    const { data: products, isLoading } = useProducts();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const granites = products?.filter(p => p.subcategory === 'granite') || [];
    const furnitureProducts = products?.filter(p => p.category === 'furniture') || [];

    // Kitchen mode state
    const [selectedSurface, setSelectedSurface] = useState<string | null>(null);
    const [selectedCabinet, setSelectedCabinet] = useState(cabinetColors[0]);
    const [selectedWall, setSelectedWall] = useState(wallColors[0]);
    const [activeTab, setActiveTab] = useState<TabType>('granite');

    // Photo mode state
    const [viewMode, setViewMode] = useState<ViewMode>('kitchen');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [overlayColor, setOverlayColor] = useState(overlayColors[0]);
    const [overlayOpacity, setOverlayOpacity] = useState(40);
    const [blendMode, setBlendMode] = useState(blendModes[0]);
    const [textureOverlay, setTextureOverlay] = useState<string | null>(null);
    const [textureOpacity, setTextureOpacity] = useState(50);

    const activeSurface = activeTab === 'granite'
        ? granites.find(g => g.id === selectedSurface)
        : furnitureProducts.find(f => f.id === selectedSurface);

    const handleReset = () => {
        setSelectedSurface(null);
        setSelectedCabinet(cabinetColors[0]);
        setSelectedWall(wallColors[0]);
    };

    const handlePhotoReset = () => {
        setUploadedImage(null);
        setOverlayColor(overlayColors[0]);
        setOverlayOpacity(40);
        setBlendMode(blendModes[0]);
        setTextureOverlay(null);
        setTextureOpacity(50);
    };

    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setUploadedImage(reader.result as string);
            setOverlayColor(overlayColors[0]);
            setTextureOverlay(null);
        };
        reader.readAsDataURL(file);
    }, []);

    const surfaceList = activeTab === 'granite' ? granites : furnitureProducts;
    const allSurfaces = [...granites, ...furnitureProducts];
    const selectedTextureProduct = allSurfaces.find(p => p.id === textureOverlay);

    return (
        <div className="min-h-screen bg-background pb-20">
            <SEO
                title="სამზარეულოს ვიზუალიზატორი"
                description="შეარჩიეთ გრანიტი, ავეჯი და ფერები თქვენი სამზარეულოსთვის"
                canonical="/visualizer"
            />

            {/* Hero Banner */}
            <section className="relative py-12 md:py-16 bg-primary text-center overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'linear-gradient(rgba(212,175,55,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.2) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }} />
                </div>
                <div className="relative z-10 container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                            <Sparkles size={14} /> ვიზუალიზატორი
                        </div>
                        <h1 className="text-2xl md:text-4xl font-bold text-primary-foreground">
                            შექმენი შენი იდეალური სივრცე
                        </h1>
                        <p className="mt-3 text-primary-foreground/60 max-w-xl mx-auto text-sm md:text-base">
                            აირჩიეთ რეჟიმი — სამზარეულოს სიმულატორი ან ატვირთეთ საკუთარი ფოტო
                        </p>
                    </motion.div>

                    {/* Mode Toggle */}
                    <div className="mt-6 inline-flex gap-1 bg-primary-foreground/10 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('kitchen')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'kitchen'
                                    ? 'bg-gold text-accent-foreground shadow-md'
                                    : 'text-primary-foreground/70 hover:text-primary-foreground'
                                }`}
                        >
                            <Layers size={16} /> სამზარეულო
                        </button>
                        <button
                            onClick={() => setViewMode('photo')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'photo'
                                    ? 'bg-gold text-accent-foreground shadow-md'
                                    : 'text-primary-foreground/70 hover:text-primary-foreground'
                                }`}
                        >
                            <Camera size={16} /> ჩემი ფოტო
                        </button>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8">
                <AnimatePresence mode="wait">
                    {viewMode === 'kitchen' ? (
                        <motion.div
                            key="kitchen"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* ==================== KITCHEN MODE ==================== */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Kitchen Canvas */}
                                <div className="lg:col-span-2 space-y-4">
                                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border">
                                        {/* Wall */}
                                        <div
                                            className="absolute inset-0 transition-colors duration-700"
                                            style={{ backgroundColor: selectedWall.value }}
                                        >
                                            <div className="absolute top-[25%] left-0 right-0 h-[15%]" style={{
                                                backgroundImage: `
                                                    linear-gradient(45deg, rgba(0,0,0,0.03) 25%, transparent 25%),
                                                    linear-gradient(-45deg, rgba(0,0,0,0.03) 25%, transparent 25%),
                                                    linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.03) 75%),
                                                    linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.03) 75%)
                                                `,
                                                backgroundSize: '20px 20px',
                                                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                                            }} />
                                        </div>

                                        {/* Upper Cabinets */}
                                        <div className="absolute top-[2%] left-[5%] right-[5%] h-[23%] flex gap-[2%]">
                                            {[1, 2, 3].map(i => (
                                                <div key={`upper-${i}`} className="flex-1 rounded-b-lg transition-colors duration-500 relative overflow-hidden" style={{ backgroundColor: selectedCabinet.value }}>
                                                    <div className="absolute inset-[3px] rounded-b-md border border-white/10" />
                                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-white/20" />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Countertop */}
                                        <div className="absolute top-[40%] left-[3%] right-[3%] h-[8%] z-10 rounded-sm overflow-hidden">
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={selectedSurface || 'empty'}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="w-full h-full shadow-lg"
                                                    style={{
                                                        backgroundImage: activeSurface ? `url(${activeSurface.image})` : 'none',
                                                        backgroundColor: activeSurface ? 'transparent' : '#d1d5db',
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    }}
                                                >
                                                    {!activeSurface && (
                                                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground bg-white/60 backdrop-blur-sm">
                                                            ⬇ აირჩიეთ ზედაპირი
                                                        </div>
                                                    )}
                                                </motion.div>
                                            </AnimatePresence>
                                            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/15" />
                                        </div>

                                        {/* Lower Cabinets */}
                                        <div className="absolute top-[48%] left-[5%] right-[5%] bottom-[5%] flex gap-[2%]">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={`lower-${i}`} className="flex-1 rounded-t-lg transition-colors duration-500 relative overflow-hidden" style={{ backgroundColor: selectedCabinet.value }}>
                                                    <div className="absolute inset-[3px] rounded-t-md border border-white/10" />
                                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-white/20" />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Sink */}
                                        <div className="absolute top-[40%] left-[38%] w-[24%] h-[8%] z-20">
                                            <div className="w-full h-full rounded-sm border-2 border-gray-400/30 bg-gray-300/20 backdrop-blur-[1px]" />
                                            <div className="absolute -top-[60%] left-1/2 -translate-x-1/2 w-[3px] h-[70%] bg-gray-400/40 rounded-full" />
                                            <div className="absolute -top-[60%] left-[48%] w-[15%] h-[3px] bg-gray-400/40 rounded-full" />
                                        </div>

                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[30%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                                        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.15)]" />
                                    </div>

                                    <div className="flex justify-end">
                                        <button onClick={handleReset} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted">
                                            <RotateCcw size={14} /> თავიდან დაწყება
                                        </button>
                                    </div>
                                </div>

                                {/* Kitchen Controls */}
                                <div className="space-y-6 h-fit lg:sticky lg:top-24">
                                    {/* Wall Color */}
                                    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                                        <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-100 to-green-100" />
                                            კედლის ფერი
                                        </h3>
                                        <div className="flex gap-2 flex-wrap">
                                            {wallColors.map(color => (
                                                <button key={color.name} onClick={() => setSelectedWall(color)} className={`w-9 h-9 rounded-full border-2 transition-all ${selectedWall.name === color.name ? 'border-gold scale-110 shadow-md' : 'border-gray-200 hover:scale-105'}`} style={{ backgroundColor: color.value }} title={color.name} />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Cabinet Color */}
                                    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                                        <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                                            <Palette className="text-gold" size={16} />
                                            კარადის ფერი
                                        </h3>
                                        <div className="grid grid-cols-4 gap-3">
                                            {cabinetColors.map((color) => (
                                                <button key={color.name} onClick={() => setSelectedCabinet(color)} className="relative group flex flex-col items-center gap-1" title={color.name}>
                                                    <div className={`w-10 h-10 rounded-full border-2 transition-all ${selectedCabinet.name === color.name ? 'border-gold scale-110 shadow-md' : `${color.border} hover:scale-105`}`} style={{ backgroundColor: color.value }} />
                                                    <span className={`text-[10px] transition-colors ${selectedCabinet.name === color.name ? 'text-gold font-medium' : 'text-muted-foreground'}`}>{color.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Surface Selector */}
                                    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Layers className="text-gold" size={16} />
                                            <h3 className="font-semibold text-sm">ზედაპირი</h3>
                                        </div>
                                        <div className="flex gap-1 bg-muted rounded-lg p-1 mb-4">
                                            <button onClick={() => { setActiveTab('granite'); setSelectedSurface(null); }} className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${activeTab === 'granite' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                                                გრანიტი ({granites.length})
                                            </button>
                                            <button onClick={() => { setActiveTab('furniture'); setSelectedSurface(null); }} className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${activeTab === 'furniture' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                                                ხე / ავეჯი ({furnitureProducts.length})
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                                            {isLoading ? (
                                                Array.from({ length: 4 }).map((_, i) => (
                                                    <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
                                                ))
                                            ) : surfaceList.length > 0 ? surfaceList.map(item => (
                                                <button key={item.id} onClick={() => setSelectedSurface(item.id)} className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all text-left ${selectedSurface === item.id ? 'border-gold shadow-gold ring-2 ring-gold/20' : 'border-transparent hover:border-muted-foreground/30'}`}>
                                                    <LazyImage src={item.image} alt={item.title_ka} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                                    <div className="absolute bottom-1.5 left-1.5 right-1.5">
                                                        <p className="text-white text-[11px] font-medium truncate">{item.title_ka}</p>
                                                        <p className="text-white/60 text-[10px]">₾{item.price}</p>
                                                    </div>
                                                    {selectedSurface === item.id && (
                                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1.5 right-1.5 bg-gold text-accent-foreground rounded-full p-0.5">
                                                            <Check size={12} />
                                                        </motion.div>
                                                    )}
                                                </button>
                                            )) : (
                                                <p className="col-span-2 text-center text-muted-foreground text-sm py-6">პროდუქტები ჯერ არ არის</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="photo"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* ==================== PHOTO MODE ==================== */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Photo Canvas */}
                                <div className="lg:col-span-2 space-y-4">
                                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border bg-muted">
                                        {uploadedImage ? (
                                            <>
                                                {/* User's photo */}
                                                <img
                                                    src={uploadedImage}
                                                    alt="ატვირთული ფოტო"
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />

                                                {/* Color overlay */}
                                                {overlayColor.value !== 'transparent' && (
                                                    <div
                                                        className="absolute inset-0 transition-all duration-500"
                                                        style={{
                                                            backgroundColor: overlayColor.value,
                                                            opacity: overlayOpacity / 100,
                                                            mixBlendMode: blendMode.value,
                                                        }}
                                                    />
                                                )}

                                                {/* Texture overlay */}
                                                {selectedTextureProduct && (
                                                    <div
                                                        className="absolute inset-0 transition-all duration-500"
                                                        style={{
                                                            backgroundImage: `url(${selectedTextureProduct.image})`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                            opacity: textureOpacity / 100,
                                                            mixBlendMode: 'overlay',
                                                        }}
                                                    />
                                                )}

                                                {/* Remove button */}
                                                <button
                                                    onClick={() => setUploadedImage(null)}
                                                    className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </>
                                        ) : (
                                            /* Upload Area */
                                            <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileUpload}
                                                    className="hidden"
                                                />
                                                <div className="bg-gold/10 p-4 rounded-2xl mb-4">
                                                    <Upload className="text-gold" size={40} />
                                                </div>
                                                <p className="text-foreground font-semibold text-lg">ატვირთეთ ფოტო</p>
                                                <p className="text-muted-foreground text-sm mt-1">სამზარეულო, ოთახი, აბაზანა...</p>
                                                <p className="text-muted-foreground/60 text-xs mt-3">JPG, PNG — მაქს. 10MB</p>
                                            </label>
                                        )}
                                    </div>

                                    {/* Reset & Upload new */}
                                    {uploadedImage && (
                                        <div className="flex justify-between">
                                            <label className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted cursor-pointer">
                                                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                                                <ImageIcon size={14} /> სხვა ფოტო
                                            </label>
                                            <button onClick={handlePhotoReset} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted">
                                                <RotateCcw size={14} /> თავიდან დაწყება
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Photo Controls */}
                                <div className="space-y-6 h-fit lg:sticky lg:top-24">
                                    {!uploadedImage ? (
                                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm text-center">
                                            <div className="bg-gold/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                <Camera className="text-gold" size={28} />
                                            </div>
                                            <h3 className="font-semibold mb-2">როგორ მუშაობს?</h3>
                                            <div className="space-y-3 text-left text-sm text-muted-foreground">
                                                <div className="flex gap-3">
                                                    <span className="bg-gold/10 text-gold w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                                                    <p>ატვირთეთ თქვენი სამზარეულოს, ოთახის ან აბაზანის ფოტო</p>
                                                </div>
                                                <div className="flex gap-3">
                                                    <span className="bg-gold/10 text-gold w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                                                    <p>აირჩიეთ ფერი და დაარეგულირეთ ინტენსივობა</p>
                                                </div>
                                                <div className="flex gap-3">
                                                    <span className="bg-gold/10 text-gold w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                                                    <p>წაადეთ გრანიტის ან ხის ტექსტურა overlay-ად</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Color Overlay */}
                                            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                                                <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                                                    <Palette className="text-gold" size={16} />
                                                    ფერის overlay
                                                </h3>
                                                <div className="grid grid-cols-6 gap-2 mb-4">
                                                    {overlayColors.map(color => (
                                                        <button
                                                            key={color.name}
                                                            onClick={() => setOverlayColor(color)}
                                                            className={`w-9 h-9 rounded-full border-2 transition-all ${overlayColor.name === color.name ? 'border-gold scale-110 shadow-md' : 'border-gray-200 hover:scale-105'
                                                                }`}
                                                            style={{
                                                                backgroundColor: color.value === 'transparent' ? 'white' : color.value,
                                                                backgroundImage: color.value === 'transparent' ? 'linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%), linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%)' : 'none',
                                                                backgroundSize: '8px 8px',
                                                                backgroundPosition: '0 0, 4px 4px',
                                                            }}
                                                            title={color.name}
                                                        />
                                                    ))}
                                                </div>

                                                {overlayColor.value !== 'transparent' && (
                                                    <>
                                                        {/* Opacity slider */}
                                                        <div className="mb-3">
                                                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                                                <span>ინტენსივობა</span>
                                                                <span>{overlayOpacity}%</span>
                                                            </div>
                                                            <input
                                                                type="range"
                                                                min={5}
                                                                max={90}
                                                                value={overlayOpacity}
                                                                onChange={e => setOverlayOpacity(Number(e.target.value))}
                                                                className="w-full accent-gold h-1.5"
                                                            />
                                                        </div>

                                                        {/* Blend mode */}
                                                        <div>
                                                            <p className="text-xs text-muted-foreground mb-2">შერწყმის რეჟიმი</p>
                                                            <div className="grid grid-cols-2 gap-1.5">
                                                                {blendModes.map(mode => (
                                                                    <button
                                                                        key={mode.value}
                                                                        onClick={() => setBlendMode(mode)}
                                                                        className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${blendMode.value === mode.value
                                                                                ? 'bg-gold/10 text-gold border border-gold/30'
                                                                                : 'bg-muted text-muted-foreground hover:text-foreground'
                                                                            }`}
                                                                    >
                                                                        {mode.name}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* Texture Overlay */}
                                            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="font-semibold text-sm flex items-center gap-2">
                                                        <SlidersHorizontal className="text-gold" size={16} />
                                                        ტექსტურის overlay
                                                    </h3>
                                                    {textureOverlay && (
                                                        <button onClick={() => setTextureOverlay(null)} className="text-xs text-muted-foreground hover:text-foreground">
                                                            მოხსნა
                                                        </button>
                                                    )}
                                                </div>

                                                {textureOverlay && (
                                                    <div className="mb-3">
                                                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                                            <span>ინტენსივობა</span>
                                                            <span>{textureOpacity}%</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min={10}
                                                            max={80}
                                                            value={textureOpacity}
                                                            onChange={e => setTextureOpacity(Number(e.target.value))}
                                                            className="w-full accent-gold h-1.5"
                                                        />
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-3 gap-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                                                    {allSurfaces.slice(0, 12).map(item => (
                                                        <button
                                                            key={item.id}
                                                            onClick={() => setTextureOverlay(textureOverlay === item.id ? null : item.id)}
                                                            className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${textureOverlay === item.id
                                                                    ? 'border-gold ring-2 ring-gold/20'
                                                                    : 'border-transparent hover:border-muted-foreground/30'
                                                                }`}
                                                        >
                                                            <LazyImage src={item.image} alt={item.title_ka} className="w-full h-full object-cover" />
                                                            {textureOverlay === item.id && (
                                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1 right-1 bg-gold text-accent-foreground rounded-full p-0.5">
                                                                    <Check size={10} />
                                                                </motion.div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Visualizer;
