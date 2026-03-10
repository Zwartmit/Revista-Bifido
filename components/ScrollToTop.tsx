'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 w-[50px] h-[50px] rounded-2xl border border-bifido-neon flex items-center justify-center text-bifido-neon bg-black hover:bg-bifido-neon hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(204,253,41,0.3)] group"
                    aria-label="Volver arriba"
                >
                    <ChevronUp size={36} className="stroke-[3px] group-hover:-translate-y-1 transition-transform duration-200" />
                </button>
            )}
        </>
    );
}
