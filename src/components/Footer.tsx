import Link from "next/link";
import { Instagram, Music, Youtube } from "lucide-react";
import Logo from "./Logo";

const SOCIAL_LINKS = [
  {
    href: "https://www.instagram.com/meto_cast/",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "https://open.spotify.com/show/1QpRW5ISZzqqJyd3orYxsy",
    label: "Spotify",
    icon: Music,
  },
  {
    href: "https://www.youtube.com/@MetoCast",
    label: "YouTube",
    icon: Youtube,
  },
];

const SITE_LINKS = [
  { href: "/episodios", label: "Episódios" },
  { href: "/assistir", label: "Assistir" },
  { href: "/sobre", label: "Sobre" },
  { href: "/comunidade", label: "Comunidade" },
];

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Logo size={32} />
              <span className="font-heading font-bold text-lg text-white">
                MetôCast
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs">
              Podcast criado por estudantes da Universidade Metodista para
              discutir educação, vida universitária, cultura e temas sociais
              relevantes.
            </p>
          </div>

          {/* Site Links */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">
              Navegação
            </h3>
            <ul className="space-y-2">
              {SITE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-primary-yellow transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">
              Redes Sociais
            </h3>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-card hover:bg-surface-hover text-gray-400 hover:text-primary-yellow transition-colors"
                >
                  <link.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-surface-border text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} MetôCast — Universidade Metodista.
            Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
