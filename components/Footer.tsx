import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Youtube } from 'lucide-react';
import { RiTiktokLine } from "react-icons/ri";

export default function Footer() {
  return (
    <footer className="bg-bifido-black border-t border-bifido-gray mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="font-display text-2xl text-white mb-4">BÍFIDO</h3>
            <p className="text-bifido-lightgray text-sm italic">
              &quot;Periodismo crudo para sensibilidades frágiles&quot;
            </p>
            <p className="text-bifido-lightgray text-sm mt-4">
              Revista digital, cultural, alternativa e independiente.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navegación</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/parche"
                  className="text-bifido-lightgray hover:text-white text-sm transition-colors"
                >
                  El Parche
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
                  href="/buzon"
                  className="text-bifido-lightgray hover:text-white text-sm transition-colors"
                >
                  Buzón
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-white font-semibold mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/revistabifido/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bifido-lightgray hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/revistabifido/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bifido-lightgray hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://x.com/revistabifido"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bifido-lightgray hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="mailto:bifidomedio@gmail.com"
                className="text-bifido-lightgray hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
              <a
                href="https://www.youtube.com/@revistabifido"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bifido-lightgray hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@revistabifido"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bifido-lightgray hover:text-white transition-colors"
                aria-label="Tiktok"
              >
                <RiTiktokLine size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-bifido-gray mt-8 pt-8 text-center">
          <p className="text-bifido-lightgray text-sm">
            © {new Date().getFullYear()} Revista Bífido. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
