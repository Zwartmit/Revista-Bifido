import Link from 'next/link';
import { Facebook, Instagram, Mail, Youtube } from 'lucide-react';
import { RiTiktokLine, RiTwitterXLine } from "react-icons/ri";

export default function Footer() {
  return (
    <footer className="bg-bifido-black border-t border-bifido-gray mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="text-center">
            <h3 className="font-display text-6xl sm:text-7xl text-white">REVISTA BÍFIDO</h3>
            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #FCD116 33.33%, #003893 33.33%, #003893 66.66%, #CE1126 66.66%)' }} />
            <p className="text-bifido-lightgray text-sm sm:text-lg mt-2">
              Revista digital, cultural, alternativa e independiente
            </p>
            <p className="text-bifido-lightgray text-sm sm:text-lg italic mt-4">
              &quot;Periodismo crudo para sensibilidades frágiles&quot;
            </p>
          </div>

          {/* Navigation Links */}
          <div className="text-center">
            <h4 className="text-white mb-4 text-2xl">Parchese</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/lamanada"
                  className="text-bifido-lightgray hover:text-white text-sm transition-colors"
                >
                  La manada
                </Link>
              </li>
              <li>
                <Link
                  href="/mercado"
                  className="text-bifido-lightgray hover:text-white text-sm transition-colors"
                >
                  Mercado
                </Link>
              </li>
              <li>
                <Link
                  href="/manifiesto"
                  className="text-bifido-lightgray hover:text-white text-sm transition-colors"
                >
                  Manifiesto
                </Link>
              </li>
              <li>
                <Link
                  href="/contactanos"
                  className="text-bifido-lightgray hover:text-white text-sm transition-colors"
                >
                  Contáctanos
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="text-center">
            <h4 className="text-white mb-4 text-2xl">Síguenos</h4>
            <div className="flex space-x-4 justify-center">
              <a
                href="https://www.facebook.com/revistabifido/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bifido-lightgray hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={25} />
              </a>
              <a
                href="https://www.instagram.com/revistabifido/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bifido-lightgray hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={25} />
              </a>
              <a
                href="https://x.com/revistabifido"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bifido-lightgray hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <RiTwitterXLine size={25} />
              </a>
              <a
                href="https://www.youtube.com/@revistabifido"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bifido-lightgray hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={25} />
              </a>
              <a
                href="https://www.tiktok.com/@revistabifido"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bifido-lightgray hover:text-white transition-colors"
                aria-label="Tiktok"
              >
                <RiTiktokLine size={25} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-bifido-gray mt-8 pt-8 text-center">
          <p className="text-bifido-lightgray text-sm">
            © {new Date().getFullYear()} Revista Bífido.<br className="md:hidden" /> Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
