import type { Metadata } from "next";
import { Instagram, Music, Youtube, Users, Mic, BookOpen } from "lucide-react";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça o MetôCast, o podcast criado por estudantes da Universidade Metodista.",
};

const FEATURES = [
  {
    icon: Mic,
    title: "Podcast Estudantil",
    description:
      "Produzido inteiramente por estudantes da Universidade Metodista, com conteúdo autoral e relevante.",
  },
  {
    icon: BookOpen,
    title: "Educação e Cultura",
    description:
      "Discutimos educação, vida universitária, cultura e temas sociais que impactam a comunidade acadêmica.",
  },
  {
    icon: Users,
    title: "Feito pela Comunidade",
    description:
      "Um projeto colaborativo que conecta estudantes e cria espaço para vozes diversas dentro da universidade.",
  },
];

const SOCIAL_LINKS = [
  {
    href: "https://open.spotify.com/show/1QpRW5ISZzqqJyd3orYxsy",
    label: "Spotify",
    icon: Music,
    color: "bg-brand-spotify",
  },
  {
    href: "https://www.instagram.com/meto_cast/",
    label: "Instagram",
    icon: Instagram,
    color: "bg-brand-instagram",
  },
  {
    href: "https://www.youtube.com/@MetoCast",
    label: "YouTube",
    icon: Youtube,
    color: "bg-brand-youtube",
  },
];

export default function SobrePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero section */}
      <section className="text-center space-y-6">
        <div className="flex justify-center">
          <Logo size={100} className="rounded-2xl shadow-2xl shadow-primary-blue/20" />
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white">
          Sobre o Metô<span className="text-primary-yellow">Cast</span>
        </h1>

        <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          O MetôCast é um podcast criado por estudantes da{" "}
          <strong className="text-white">Universidade Metodista</strong> para discutir
          educação, vida universitária, cultura e temas sociais relevantes. Nosso objetivo
          é dar voz à comunidade acadêmica e criar um espaço de diálogo aberto e acessível.
        </p>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="bg-surface-card border border-surface-border rounded-xl p-6 text-center space-y-3 hover:border-primary-yellow/30 transition-colors"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-primary-yellow/10 flex items-center justify-center">
              <feature.icon size={22} className="text-primary-yellow" />
            </div>
            <h3 className="font-heading font-semibold text-white">{feature.title}</h3>
            <p className="text-sm text-gray-400">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Mission */}
      <section className="bg-surface-card border border-surface-border rounded-2xl p-8 space-y-4">
        <h2 className="font-heading text-2xl font-bold text-white">Nossa Missão</h2>
        <p className="text-gray-300 leading-relaxed">
          Acreditamos que a universidade é um espaço de transformação. Por isso, criamos o
          MetôCast como uma plataforma para amplificar as vozes dos estudantes, debater
          questões que importam e construir pontes entre a comunidade acadêmica e a
          sociedade.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Cada episódio é pensado para ser acessível, interessante e relevante — trazendo
          entrevistas, debates e reflexões sobre o que acontece dentro e fora dos muros da
          universidade.
        </p>
      </section>

      {/* Social Links */}
      <section className="text-center space-y-6">
        <h2 className="font-heading text-2xl font-bold text-white">Nos acompanhe</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-3 ${link.color} text-white font-semibold rounded-full hover:brightness-110 transition-all`}
            >
              <link.icon size={18} />
              {link.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
