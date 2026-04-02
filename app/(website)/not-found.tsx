import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] lg:h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-black px-4 mt-20 md:mt-24">
      
      {/* Background Glitch Image */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20 lg:opacity-40 pointer-events-none">
        {/* Desktop Image */}
        <Image 
          src="/backgrounds/404desk.png" 
          alt="404 Background Desktop" 
          fill
          className="object-cover hidden sm:block"
          priority
          unoptimized
        />
        {/* Mobile Image */}
        <Image 
          src="/backgrounds/404movil.png" 
          alt="404 Background Mobile" 
          fill
          className="object-cover sm:hidden"
          priority
          unoptimized
        />
        {/* CRT Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]"></div>
        
        {/* Top/Bottom Fade Blur */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none"></div>
        
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Glitch Animated 404 */}
        <div className="relative inline-block animate-[float_4s_ease-in-out_infinite]">
          <h1 className="font-jack text-bifido-neon text-8xl md:text-[14rem] leading-none mb-0 drop-shadow-[0_0_20px_rgba(204,253,41,0.5)] relative z-10" style={{ letterSpacing: '-0.05em' }}>404</h1>
          <h1 className="font-jack text-[#FF6B6B] text-8xl md:text-[14rem] leading-none mb-0 absolute top-0 left-[6px] -z-10 mix-blend-screen opacity-70 animate-pulse" style={{ letterSpacing: '-0.05em' }}>404</h1>
          <h1 className="font-jack text-[#00BCD4] text-8xl md:text-[14rem] leading-none mb-0 absolute top-0 -left-[6px] -z-20 mix-blend-screen opacity-70 animate-pulse" style={{ animationDelay: '0.2s', letterSpacing: '-0.05em' }}>404</h1>
        </div>
        
        <h2 className="font-display text-white text-4xl md:text-5xl uppercase tracking-widest mt-2 mb-6 drop-shadow-lg">
          SEÑAL PERDIDA
        </h2>
        
        <p className="max-w-md font-sans text-gray-300 text-lg mb-12 font-light">
          Parece que te has desviado del camino. La página que buscas no existe o ha sido eliminada.
        </p>
        
        <Link 
          href="/"
          className="group relative inline-flex items-center justify-center px-8 py-3 font-display text-xl uppercase tracking-widest text-black bg-bifido-neon hover:bg-white transition-colors duration-300 rounded-3xl transform hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(204,253,41,0.3)]"
        >
          <span className="relative z-10 flex items-center gap-2">
            Volver al inicio
          </span>
          <div className="absolute inset-0 border border-bifido-neon scale-[1.03] opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 -z-10"></div>
        </Link>
      </div>

      {/* Static noise animation */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
    </div>
  );
}
