'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Tag, Store } from 'lucide-react';

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
        description: 'Set de 10 stickers con las mascotas y frases icónicas.',
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

    return (
        <div className="min-h-screen py-20 sm:py-20 bg-bifido-black">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-bifido-gray rounded-full mb-4">
                        <Store className="text-white" size={32} />
                    </div>
                    <h1 className="font-display text-5xl md:text-6xl mb-4 text-white">
                        Mercado Bífido
                    </h1>
                    <p className="text-xl text-bifido-lightgray italic max-w-2xl mx-auto">
                        &quot;Lleva la resistencia contigo&quot;
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === null
                            ? 'bg-white text-bifido-black'
                            : 'bg-bifido-gray text-gray-300 hover:bg-gray-700'
                            }`}
                    >
                        Todos
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === category
                                ? 'bg-white text-bifido-black'
                                : 'bg-bifido-gray text-gray-300 hover:bg-gray-700'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="group bg-bifido-gray rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-800 flex flex-col"
                        >
                            {/* Image */}
                            <div className="relative h-64 w-full bg-black overflow-hidden">
                                {/* Placeholder visual if image fails or is placeholder */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                                    <ShoppingBag size={48} />
                                </div>
                                {/* Actual Image */}
                                {/* Uncomment when real images are available
                                <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                */}
                                <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1">
                                    <Tag size={12} />
                                    {product.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-grow flex flex-col">
                                <h3 className="font-display text-2xl mb-2 text-white group-hover:text-bifido-red transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-gray-300 text-sm mb-4 flex-grow">
                                    {product.description}
                                </p>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                                    <span className="text-xl font-bold text-white">
                                        ${product.price.toLocaleString()} COP
                                    </span>
                                    <button className="bg-white text-bifido-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
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
                        <p className="text-gray-500 text-lg">No se encontraron productos en esta categoría.</p>
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="mt-4 text-bifido-red hover:underline font-medium"
                        >
                            Ver todos los productos
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
