import type { Metadata } from "next";
import Image from "next/image";
import { Users, Camera, Calendar, ExternalLink, Film } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Participações",
  description:
    "Galeria de convidados e participantes que já passaram pelo MetôCast.",
};

export const dynamic = "force-dynamic";
export const revalidate = 600;

export default async function ParticipacoesPage() {
  const participacoes = await prisma.participacao.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const withPhoto = participacoes.filter((p) => p.fotoUrl);
  const withoutPhoto = participacoes.filter((p) => !p.fotoUrl);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="w-12 h-1 bg-primary-yellow rounded-full mb-4" />
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Participações
        </h1>
        <p className="text-foreground-muted">
          Galeria de todos os convidados e participantes que já contribuíram com
          o MetôCast.
        </p>
      </div>

      {/* Stats */}
      {participacoes.length > 0 && (
        <div className="flex flex-wrap gap-6 mb-10 text-sm text-foreground-muted">
          <span className="inline-flex items-center gap-2">
            <Users size={16} className="text-primary-yellow" />
            <strong className="text-foreground">{participacoes.length}</strong> participantes
          </span>
          <span className="inline-flex items-center gap-2">
            <Camera size={16} className="text-primary-yellow" />
            <strong className="text-foreground">{withPhoto.length}</strong> fotos
          </span>
          {new Set(participacoes.map((p) => p.episodio).filter(Boolean)).size > 0 && (
            <span className="inline-flex items-center gap-2">
              <Film size={16} className="text-primary-yellow" />
              <strong className="text-foreground">
                {new Set(participacoes.map((p) => p.episodio).filter(Boolean)).size}
              </strong> episódios
            </span>
          )}
        </div>
      )}

      {/* Empty State */}
      {participacoes.length === 0 && (
        <div className="text-center py-20">
          <Camera size={48} className="mx-auto text-foreground-faint mb-4" />
          <p className="text-foreground-muted">Nenhuma participação registrada ainda.</p>
        </div>
      )}

      {/* Photo Album Grid */}
      {withPhoto.length > 0 && (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4 mb-12">
          {withPhoto.map((p) => (
            <div
              key={p.id}
              className="group break-inside-avoid bg-surface-card border border-surface-border rounded-2xl overflow-hidden hover:border-primary-yellow/40 transition-all duration-300"
            >
              {/* Photo */}
              <div className="relative w-full aspect-[3/4] sm:aspect-auto sm:h-auto">
                <img
                  src={p.fotoUrl!}
                  alt={p.nome}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Link overlay */}
                {p.videoId && (
                  <Link
                    href={`/episodio/${p.videoId}`}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-primary-yellow hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                    title="Assistir episódio"
                  >
                    <ExternalLink size={14} />
                  </Link>
                )}
              </div>

              {/* Info */}
              <div className="p-3 space-y-1">
                <h3 className="font-heading font-semibold text-sm text-foreground group-hover:text-primary-yellow transition-colors truncate">
                  {p.nome}
                </h3>
                {p.cargo && (
                  <p className="text-xs text-foreground-muted truncate">{p.cargo}</p>
                )}
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-foreground-faint">
                  {p.episodio && <span className="truncate">{p.episodio}</span>}
                  {p.data && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(p.data + "T00:00:00").toLocaleDateString("pt-BR")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Without photo – simple list */}
      {withoutPhoto.length > 0 && (
        <>
          {withPhoto.length > 0 && (
            <div className="border-t border-surface-border pt-8 mb-6">
              <h2 className="font-heading text-lg font-semibold text-foreground mb-4">
                Outros participantes
              </h2>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {withoutPhoto.map((p) => (
              <div
                key={p.id}
                className="group flex items-center gap-3 bg-surface-card border border-surface-border rounded-xl p-3 hover:border-primary-yellow/30 transition-all"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-yellow/20 flex items-center justify-center">
                  <Users size={16} className="text-primary-yellow" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary-yellow transition-colors">
                    {p.nome}
                  </p>
                  {p.cargo && (
                    <p className="text-xs text-foreground-faint truncate">{p.cargo}</p>
                  )}
                  {p.episodio && (
                    <p className="text-xs text-foreground-faint truncate">{p.episodio}</p>
                  )}
                </div>
                {p.videoId && (
                  <Link
                    href={`/episodio/${p.videoId}`}
                    className="flex-shrink-0 text-foreground-faint hover:text-primary-yellow transition-colors"
                    title="Assistir episódio"
                  >
                    <ExternalLink size={14} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
