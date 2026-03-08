import type { Metadata } from "next";
import SuggestionList from "@/components/SuggestionList";

export const metadata: Metadata = {
  title: "Comunidade",
  description: "Sugira temas e vote nas ideias para os próximos episódios do MetôCast.",
};

export default function ComunidadePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Comunidade
        </h1>
        <p className="text-foreground-muted">
          Sugira temas para os próximos episódios e vote nas ideias que você mais gosta.
          Sua voz faz parte do MetôCast!
        </p>
      </div>

      <SuggestionList />
    </div>
  );
}
