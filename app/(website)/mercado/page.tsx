'use client';

import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';

// Dummy data for products
const products = [
    {
        id: 1,
        name: 'Camiseta Bífido Original',
        price: 45000,
        category: 'Ropa',
        image: '/images/placeholder-article.jpg', // Using existing placeholder for now
        description: 'Camiseta 100% algodón con el logo oficial de Revista Bífido.',
    },
    {
        id: 2,
        name: 'Tote Bag "Resistencia"',
        price: 25000,
        category: 'Accesorios',
        image: '/images/placeholder-article.jpg',
        description: 'Bolsa de tela resistente con diseño exclusivo de nuestra colección.',
    },
    {
        id: 3,
        name: 'Stickers Pack Vol. 1',
        price: 10000,
        category: 'Papelería',
        image: '/images/placeholder-article.jpg',
        description: 'Set de 10 stickers con los personajes y frases icónicas.',
    },
    {
        id: 4,
        name: 'Fanzine Edición Especial',
        price: 15000,
        category: 'Publicaciones',
        image: '/images/placeholder-article.jpg',
        description: 'Edición impresa limitada con contenido exclusivo y arte inédito.',
    },
    {
        id: 5,
        name: 'Mug "Verdades Incómodas"',
        price: 20000,
        category: 'Hogar',
        image: '/images/placeholder-article.jpg',
        description: 'Para tu café de la mañana mientras lees las noticias.',
    },
    {
        id: 6,
        name: 'Pin Metálico Punkibrí',
        price: 12000,
        category: 'Accesorios',
        image: '/images/placeholder-article.jpg',
        description: 'Pin esmaltado de nuestro guardián de la naturaleza.',
    },
];

export default function MercadoPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = Array.from(new Set(products.map(p => p.category)));

    const filteredProducts = selectedCategory
        ? products.filter(p => p.category === selectedCategory)
        : products;

    const chipClass = (active: boolean) =>
        `px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] border transition-colors ${active
            ? 'bg-bifido-neon border-bifido-neon text-bifido-black'
            : 'border-white/25 text-gray-300 hover:border-bifido-neon hover:text-bifido-neon'
        }`;

    return (
        <div className="min-h-screen bg-black pt-24 md:pt-40 pb-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center md:text-left mb-12 md:mb-14 max-w-3xl">
                    <span className="font-jack text-xs tracking-[0.3em] uppercase text-bifido-neon block mb-4">
                        Tienda · vista previa
                    </span>
                    <h1 className="font-display text-6xl md:text-8xl leading-[0.9] uppercase text-white">
                        Mercado <span className="text-bifido-neon">Bífido</span>
                    </h1>
                    <div className="w-20 h-[3px] bg-bifido-neon my-6 mx-auto md:mx-0" />
                    <p className="text-xl text-bifido-lightgray italic">
                        &quot;Lleva la resistencia contigo&quot;
                    </p>
                    <p className="text-sm text-gray-400 mt-3">
                        Colección de muestra: la tienda abre pronto.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-12" role="group" aria-label="Filtrar por categoría">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        aria-pressed={selectedCategory === null}
                        className={chipClass(selectedCategory === null)}
                    >
                        Todos
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            aria-pressed={selectedCategory === category}
                            className={chipClass(selectedCategory === category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product, i) => (
                        <div
                            key={product.id}
                            style={{ animationDelay: `${i * 70}ms` }}
                            className="group relative bg-[#0c0c0c] border border-white/10 hover:border-bifido-neon/60 transition-colors duration-300 flex flex-col animate-slide-up [animation-fill-mode:backwards] motion-reduce:animate-none overflow-hidden"
                        >
                            {/* Accent bar */}
                            <div className="absolute top-0 left-0 h-[3px] w-full bg-bifido-neon scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 z-10" />

                            {/* Image */}
                            <div className="relative h-64 w-full bg-black overflow-hidden bg-[repeating-linear-gradient(135deg,transparent_0_14px,rgba(184,255,0,0.05)_14px_15px)]">
                                {/* Placeholder visual until real product photos are available */}
                                <div className="absolute inset-0 flex items-center justify-center text-white/25">
                                    <ShoppingBag size={48} strokeWidth={1.25} />
                                </div>
                                <span className="absolute top-4 left-4 border border-bifido-neon/60 bg-black/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-bifido-neon">
                                    {product.category}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-grow flex flex-col">
                                <h3 className="font-display text-3xl leading-none mb-3 text-white uppercase group-hover:text-bifido-neon transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-gray-300 text-sm mb-4 flex-grow">
                                    {product.description}
                                </p>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                                    <span className="font-display text-3xl text-bifido-neon leading-none">
                                        ${product.price.toLocaleString('es-CO')} <span className="text-sm text-gray-400">COP</span>
                                    </span>
                                    <button className="bg-bifido-neon text-bifido-black px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] hover:brightness-110 transition flex items-center gap-2">
                                        <ShoppingBag size={16} />
                                        Comprar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">No se encontraron productos en esta categoría.</p>
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="mt-4 text-bifido-neon hover:underline font-medium"
                        >
                            Ver todos los productos
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
