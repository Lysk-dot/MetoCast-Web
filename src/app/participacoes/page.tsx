import type { Metadata } from "next";
import { Users, Calendar, ExternalLink, Film } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Participações",
  description:
    "Conheça os convidados e participantes que já passaram pelo MetôCast.",
};

export const revalidate = 600;

export default async function ParticipacoesPage() {
  const participacoes = await prisma.participacao.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="w-12 h-1 bg-primary-yellow rounded-full mb-4" />
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Participações
        </h1>
        <p className="text-foreground-muted">
          Conheça todos os convidados e participantes que já contribuíram com o
          MetôCast. Cada episódio traz vozes únicas para discutir educação,
          cultura e temas relevantes.
        </p>
      </div>

      {/* Stats */}
      {participacoes.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-surface-card border border-surface-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary-yellow">
              {participacoes.length}
            </p>
            <p className="text-xs text-foreground-muted mt-1">Convidados</p>
          </div>
          <div className="bg-surface-card border border-surface-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary-yellow">
              {new Set(participacoes.map((p) => p.episodio)).size}
            </p>
            <p className="text-xs text-foreground-muted mt-1">Episódios</p>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-surface-card border border-surface-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary-yellow">UMesp</p>
            <p className="text-xs text-foreground-muted mt-1">Universidade</p>
          </div>
        </div>
      )}

      {/* Participações List */}
      {participacoes.length === 0 ? (
        <p className="text-gray-500 text-center py-16">
          Nenhuma participação registrada ainda.
        </p>
      ) : (
        <div className="space-y-4">
          {participacoes.map((participacao) => {
            const date = new Date(
              participacao.data + "T00:00:00"
            ).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            });

            return (
              <div
                key={participacao.id}
                className="group bg-surface-card border border-surface-border rounded-2xl p-5 hover:border-primary-yellow/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar / Photo */}
                  {participacao.fotoUrl ? (
                    <img
                      src={participacao.fotoUrl}
                      alt={participacao.nome}
                      className="flex-shrink-0 w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary-yellow/20 flex items-center justify-center">
                      <Users size={22} className="text-primary-yellow" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-foreground group-hover:text-primary-yellow transition-colors">
                      {participacao.nome}
                    </h3>
                    <p className="text-sm text-foreground-muted mt-0.5">
                      {participacao.cargo}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                      <span className="inline-flex items-center gap-1.5 text-xs text-foreground-faint">
                        <Calendar size={12} />
                        {date}
                      </span>
                      <span className="text-xs text-foreground-secondary font-medium">
                        {participacao.episodio}
                      </span>
                      {participacao.videoUrl && (
                        <span className="inline-flex items-center gap-1 text-xs text-primary-yellow">
                          <Film size={12} />
                          Vídeo disponível
                        </span>
                      )}
                    </div>

                    {/* Video embed */}
                    {participacao.videoUrl && (
                      <div className="mt-3 rounded-xl overflow-hidden aspect-video max-w-md">
                        <video
                          src={participacao.videoUrl}
                          controls
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Link to episode */}
                  {participacao.videoId && (
                    <Link
                      href={`/episodio/${participacao.videoId}`}
                      className="flex-shrink-0 w-9 h-9 rounded-lg bg-surface-hover flex items-center justify-center text-foreground-muted hover:text-primary-yellow hover:bg-primary-yellow/10 transition-colors"
                      title="Assistir episódio"
                    >
                      <ExternalLink size={16} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
