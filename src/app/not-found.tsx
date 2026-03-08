import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="font-heading text-6xl font-extrabold text-primary-yellow">404</h1>
        <p className="text-xl text-gray-300">Página não encontrada</p>
        <p className="text-gray-500 max-w-md mx-auto">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-yellow text-surface-darkest font-semibold rounded-lg hover:brightness-110 transition-all"
          >
            <Home size={16} />
            Ir para início
          </Link>
          <Link
            href="/episodios"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-card border border-surface-border text-gray-300 font-semibold rounded-lg hover:bg-surface-hover transition-colors"
          >
            <ArrowLeft size={16} />
            Ver episódios
          </Link>
        </div>
      </div>
    </div>
  );
}
