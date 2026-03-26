'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function BackToHome() {
    const pathname = usePathname();

    // Only show button when not on home page
    const isVisible = pathname !== '/';

    return (
        <>
            {isVisible && (
                <Link
                    href="/"
                    className="fixed bottom-8 left-8 z-50 p-4 bg-black text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 group"
                    aria-label="Volver al inicio"
                >
                    <Image src="/icons/home.svg" alt="Inicio" width={25} height={25} className="object-contain group-hover:scale-110 transition-transform duration-200" />
                </Link>
            )}
        </>
    );
}
