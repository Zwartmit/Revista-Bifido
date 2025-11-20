'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function BackToHome() {
    const pathname = usePathname();

    // Only show button when not on home page
    const isVisible = pathname !== '/';

    return (
        <>
            {isVisible && (
                <Link
                    href="/"
                    className="fixed bottom-8 left-8 z-50 p-4 bg-white text-bifido-black rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-110 group"
                    aria-label="Volver al inicio"
                >
                    <Home size={24} className="group-hover:scale-110 transition-transform duration-200" />
                </Link>
            )}
        </>
    );
}
