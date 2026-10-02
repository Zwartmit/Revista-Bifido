import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CategoriaPage({ params }: { params: { slug: string } }) {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
            <h1 className="font-display text-5xl md:text-7xl text-[#b8ff00] uppercase mb-6">Categoría: {params.slug}</h1>
            <p className="font-googlesans text-gray-400 max-w-xl text-lg mb-12 leading-relaxed">
                Estamos construyendo el índice global de esta categoría. Por ahora, puedes filtrar artículos por categoría directamente en la sección (La Manada) de cada uno de nuestros personajes.
            </p>
            <Link href="/" className="inline-flex items-center px-6 py-3 border border-[#b8ff00] text-[#b8ff00] hover:bg-[#b8ff00] hover:text-black transition-colors font-display tracking-widest uppercase">
                <ArrowLeft className="mr-2" size={20} /> Volver al Inicio
            </Link>
        </div>
    );
}
