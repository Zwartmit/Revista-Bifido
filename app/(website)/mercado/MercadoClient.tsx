'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { ShoppingBag, ExternalLink, Search, X, RotateCcw, ArrowUpDown } from 'lucide-react';

interface Product {
    id: string | number;
    name: string;
    slug: string;
    price: number;
    currency: string;
    category: string;
    categoryLabel: string;
    featuredImage: string;
    available: boolean;
    purchaseLink: string | null;
    seller: { name: string; contact: string | null } | null;
    tags: string[];
}

interface MercadoClientProps {
    products: Product[];
}

const CATEGORY_ORDER = ['merchandising', 'art', 'publications', 'music', 'other'];

function normalizeText(text?: string | null): string {
    return (text || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

export default function MercadoClient({ products }: MercadoClientProps) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name-asc'>('default');

    // Categorías presentes en los productos
    const presentCategories = useMemo(() =>
        CATEGORY_ORDER.filter((c) => products.some((p) => p.category === c)),
        [products]
    );

    // Contadores por categoría
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { all: products.length };
        products.forEach((p) => {
            counts[p.category] = (counts[p.category] || 0) + 1;
        });
        return counts;
    }, [products]);

    // Filtrado y ordenación combinados
    const filtered = useMemo(() => {
        let result = activeCategory ? products.filter((p) => p.category === activeCategory) : products;
        const q = normalizeText(search);

        if (q) {
            const words = q.split(/\s+/).filter(Boolean);
            result = result.filter((p) => {
                const searchable = [
                    p.name,
                    p.categoryLabel,
                    p.category,
                    ...(p.tags || []),
                    p.seller?.name || '',
                ].map(normalizeText).join(' ');

                return words.every((w) => searchable.includes(w));
            });
        }

        // Ordenamiento
        const sorted = [...result];
        if (sortBy === 'price-asc') {
            sorted.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            sorted.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'name-asc') {
            sorted.sort((a, b) => a.name.localeCompare(b.name, 'es'));
        }

        return sorted;
    }, [products, activeCategory, search, sortBy]);

    const hasActiveFilters = activeCategory !== null || search.trim() !== '' || sortBy !== 'default';

    const handleClearFilters = () => {
        setActiveCategory(null);
        setSearch('');
        setSortBy('default');
    };

    // Caso 1: Aún no hay productos en la base de datos (Próximamente oficial)
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-10 text-center">
                <div className="relative">
                    <div className="w-32 h-32 border-2 border-[#b8ff00]/30 flex items-center justify-center bg-black">
                        <ShoppingBag size={56} strokeWidth={1} className="text-[#b8ff00]" />
                    </div>
                    <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#b8ff00]" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#b8ff00]" />
                    <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#b8ff00]" />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#b8ff00]" />
                </div>
                <div className="max-w-xl">
                    <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] uppercase text-white mb-6">
                        Pronto podrás ver
                        <br />
                        <span className="text-[#b8ff00]">toda la merch</span>
                    </h2>
                    <p className="text-gray-400 font-mono text-md leading-relaxed">
                        Estamos preparando algo especial para ti.
                        <br />
                        Camisetas, accesorios y más — al estilo Bífido.
                    </p>
                </div>
            </div>
        );
    }

    // Caso 2: Hay productos disponibles en el catálogo
    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: `
                .hide-scrollbar::-webkit-scrollbar { display:none; }
                .hide-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
            `}} />

            {/* ─── Control Bar: Búsqueda y Filtros Mejorados ─── */}
            <div className="flex flex-col gap-5 mb-12">
                {/* Fila superior: Input de búsqueda + Selector de orden */}
                <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                    {/* Search Input con estilo Bífido */}
                    <div className="relative flex-1 max-w-xl group">
                        <div className="relative flex items-center bg-black border border-white/20 focus-within:border-white/50 transition-all">
                            <Search
                                size={15}
                                className={`ml-4 transition-colors ${search ? 'text-white' : 'text-gray-500 group-hover:text-gray-400'}`}
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="BUSCAR POR NOMBRE, ARTÍCULO O ETIQUETA..."
                                className="w-full bg-transparent text-white font-mono text-xs md:text-sm tracking-wider uppercase pl-3 pr-10 py-3 focus:outline-none placeholder:text-zinc-600 placeholder:font-mono"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="absolute right-3 p-1 text-gray-500 hover:text-[#b8ff00] transition-colors"
                                    aria-label="Limpiar búsqueda"
                                    title="Limpiar búsqueda"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Selector de orden */}
                    <div className="flex items-center gap-2 border border-white/15 px-3 py-2 bg-black self-start md:self-auto">
                        <ArrowUpDown size={13} className="text-gray-500" />
                        <span className="font-mono text-[11px] tracking-widest uppercase text-gray-500 hidden sm:inline">
                            ORDEN:
                        </span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-black text-white font-mono text-xs tracking-wider uppercase outline-none cursor-pointer pr-2"
                        >
                            <option value="default">Relevancia</option>
                            <option value="price-asc">Menor precio</option>
                            <option value="price-desc">Mayor precio</option>
                            <option value="name-asc">Nombre A-Z</option>
                        </select>
                    </div>
                </div>

                {/* Chips de Categorías con contador */}
                {presentCategories.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 border-b border-white/10 w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
                        <button
                            onClick={() => setActiveCategory(null)}
                            aria-pressed={activeCategory === null}
                            className={`whitespace-nowrap flex-shrink-0 px-4 py-2 font-mono text-xs tracking-widest uppercase transition-all flex items-center gap-2 ${
                                activeCategory === null
                                    ? 'bg-[#b8ff00] text-black font-bold shadow-[2px_2px_0px_#ffffff]'
                                    : 'bg-black text-gray-400 border border-white/15 hover:border-white/40 hover:text-white'
                            }`}
                        >
                            <span>Todos</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                activeCategory === null
                                    ? 'bg-black text-[#b8ff00] font-bold'
                                    : 'bg-white/10 text-gray-400'
                            }`}>
                                {categoryCounts['all'] || products.length}
                            </span>
                        </button>

                        {presentCategories.map((cat) => {
                            const label = products.find((p) => p.category === cat)?.categoryLabel || cat;
                            const count = categoryCounts[cat] || 0;
                            const isActive = activeCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    aria-pressed={isActive}
                                    className={`whitespace-nowrap flex-shrink-0 px-4 py-2 font-mono text-xs tracking-widest uppercase transition-all flex items-center gap-2 ${
                                        isActive
                                            ? 'bg-[#b8ff00] text-black font-bold shadow-[2px_2px_0px_#ffffff]'
                                            : 'bg-black text-gray-400 border border-white/15 hover:border-white/40 hover:text-white'
                                    }`}
                                >
                                    <span>{label}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                        isActive
                                            ? 'bg-black text-[#b8ff00] font-bold'
                                            : 'bg-white/10 text-gray-400'
                                    }`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Barra de estado con resumen y botón de reset */}
                <div className="flex items-center justify-between text-xs font-mono tracking-widest uppercase text-gray-500 min-h-[24px]">
                    <span>
                        Mostrando{' '}
                        <strong className="text-white font-bold">{filtered.length}</strong>{' '}
                        {filtered.length === 1 ? 'producto' : 'productos'}
                        {search && (
                            <>
                                {' '}para &ldquo;<span className="text-[#b8ff00]">{search}</span>&rdquo;
                            </>
                        )}
                    </span>

                    {hasActiveFilters && (
                        <button
                            onClick={handleClearFilters}
                            className="flex items-center gap-1.5 text-xs text-[#b8ff00] hover:underline transition-all"
                        >
                            <RotateCcw size={12} />
                            Limpiar filtros
                        </button>
                    )}
                </div>
            </div>

            {/* ─── Grid de Productos ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product, i) => (
                    <div
                        key={product.id}
                        style={{ animationDelay: `${i * 60}ms` }}
                        className="group relative bg-black border border-white/10 hover:border-[#b8ff00]/60 transition-colors duration-300 flex flex-col animate-slide-up [animation-fill-mode:backwards] motion-reduce:animate-none overflow-hidden"
                    >
                        {/* Barra neon superior */}
                        <div className="absolute top-0 left-0 h-[3px] w-full bg-[#b8ff00] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 z-10" />

                        {/* Imagen */}
                        <div className="relative aspect-square w-full bg-black overflow-hidden">
                            <Image
                                src={product.featuredImage}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <span className="absolute top-4 left-4 border border-[#b8ff00]/60 bg-black/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b8ff00] z-10">
                                {product.categoryLabel}
                            </span>
                        </div>

                        {/* Contenido */}
                        <div className="p-6 flex-grow flex flex-col">
                            <h3 className="font-display text-3xl leading-none mb-3 text-white uppercase group-hover:text-[#b8ff00] transition-colors">
                                {product.name}
                            </h3>

                            {product.seller?.name && (
                                <p className="font-mono text-[10px] tracking-widest uppercase text-gray-500 mb-3">
                                    {product.seller.name}
                                </p>
                            )}

                            <div className="flex-grow" />

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                                <span className="font-display text-3xl text-[#b8ff00] leading-none">
                                    ${product.price.toLocaleString('es-CO')}{' '}
                                    <span className="text-sm text-gray-400">{product.currency}</span>
                                </span>

                                {product.purchaseLink ? (
                                    <a
                                        href={product.purchaseLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-[#b8ff00] text-black px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] hover:brightness-110 transition flex items-center gap-2"
                                    >
                                        <ExternalLink size={14} />
                                        Comprar
                                    </a>
                                ) : (
                                    <span className="px-4 py-2 text-xs font-mono uppercase tracking-[0.15em] border border-white/20 text-gray-500">
                                        Próximamente
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty state cuando los filtros no arrojan resultados */}
            {filtered.length === 0 && (
                <div className="text-center py-20 border border-dashed border-white/20 max-w-2xl mx-auto px-6 bg-black">
                    <p className="text-white font-display text-3xl md:text-5xl opacity-75 mb-3">
                        SIN RESULTADOS
                    </p>
                    <p className="font-mono text-xs md:text-sm text-gray-500 uppercase tracking-widest max-w-md mx-auto mb-6">
                        No encontramos productos que coincidan con &ldquo;{search || activeCategory}&rdquo;.
                    </p>
                    <button
                        onClick={handleClearFilters}
                        className="px-6 py-3 bg-[#b8ff00] text-black font-mono text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all inline-flex items-center gap-2"
                    >
                        <RotateCcw size={14} />
                        Restablecer todos los filtros
                    </button>
                </div>
            )}
        </>
    );
}
