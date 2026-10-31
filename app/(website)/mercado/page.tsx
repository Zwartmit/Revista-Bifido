import { Metadata } from 'next';
import { getProducts } from '@/lib/api';
import MercadoClient from './MercadoClient';

export const metadata: Metadata = {
    title: 'Mercado | Revista Bífido',
    description: 'Merch oficial de Revista Bífido. Lleva la resistencia contigo.',
};

export const dynamic = 'force-dynamic';

export default async function MercadoPage() {
    const products = await getProducts();

    return (
        <div className="min-h-screen bg-black pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-[1200px]">
                {/* Header — altura y estructura uniforme */}
                <div className="mb-12">
                    <h1
                        className="font-display text-[clamp(3.5rem,8vw,6.5rem)] leading-[0.85] text-[#f5f5f5] tracking-wide glitch-title uppercase"
                        data-text="MERCADO"
                    >
                        MERCADO
                    </h1>
                    <div className="w-48 md:w-64 h-[2px] bg-gradient-to-r from-[#b8ff00] to-transparent mt-3 md:mt-4" />
                    <p className="mt-6 font-mono text-xs md:text-base text-gray-400 tracking-widest uppercase">
                        Merch oficial · Lleva la resistencia contigo
                    </p>
                </div>

                {/* Contenido dinámico */}
                <MercadoClient products={products} />
            </div>
        </div>
    );
}
