'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

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
                    className="fixed bottom-8 bg-black rounded-2xl right-8 z-50 w-[50px] h-[50px] flex items-center justify-center hover:scale-110 transition-transform duration-300 group"
                    aria-label="Volver arriba"
                >
                    <Image 
                        src="/icons/scroll_top.svg" 
                        alt="Subir" 
                        width={50} 
                        height={50} 
                        className="object-contain" 
                    />
                </button>
            )}
        </>
    );
}
