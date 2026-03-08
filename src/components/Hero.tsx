import Link from "next/link";
import { Music, Instagram, Play, Youtube } from "lucide-react";
import Logo from "./Logo";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient — theme-aware */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100 via-amber-50 to-surface-darkest dark:from-primary-blue/20 dark:via-surface-darkest dark:to-primary-yellow/10" />

      {/* Decorative blurred circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-blue/15 dark:bg-primary-blue/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-yellow/15 dark:bg-primary-yellow/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/30 dark:bg-transparent rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-8">
        {/* Floating Logo */}
        <div className="flex justify-center">
          <div className="animate-float">
            <Logo size={120} className="rounded-2xl shadow-2xl shadow-primary-blue/20" />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground">
          Metô<span className="text-primary-yellow">Cast</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-foreground-secondary max-w-2xl mx-auto leading-relaxed">
          Podcast criado por estudantes da Universidade Metodista para discutir
          educação, vida universitária, cultura e temas sociais relevantes.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="https://open.spotify.com/show/1QpRW5ISZzqqJyd3orYxsy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-spotify text-white font-semibold rounded-full hover:brightness-110 transition-all"
          >
            <Music size={18} />
            Ouvir no Spotify
          </a>
          <a
            href="https://www.youtube.com/@MetoCast"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:brightness-110 transition-all"
          >
            <Youtube size={18} />
            YouTube
          </a>
          <a
            href="https://www.instagram.com/meto_cast/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-instagram text-white font-semibold rounded-full hover:brightness-110 transition-all"
          >
            <Instagram size={18} />
            Instagram
          </a>
          <Link
            href="/episodios"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-yellow text-gray-900 font-semibold rounded-full hover:brightness-110 transition-all"
          >
            <Play size={18} />
            Ver Episódios
          </Link>
        </div>
      </div>

      {/* Bottom wave — theme-aware */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 40L48 36C96 32 192 24 288 28C384 32 480 48 576 52C672 56 768 48 864 40C960 32 1056 24 1152 28C1248 32 1344 48 1392 56L1440 64V80H0V40Z"
            className="fill-surface-darkest"
          />
        </svg>
      </div>
    </section>
  );
}
