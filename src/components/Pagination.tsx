import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Paginação" className="flex items-center justify-center gap-2 mt-10">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={currentPage - 1 === 1 ? basePath : `${basePath}?page=${currentPage - 1}`}
          className="p-2 rounded-lg bg-surface-card hover:bg-surface-hover text-gray-400 hover:text-white transition-colors"
          aria-label="Página anterior"
        >
          <ChevronLeft size={18} />
        </Link>
      ) : (
        <span className="p-2 rounded-lg bg-surface-card text-gray-600 cursor-not-allowed">
          <ChevronLeft size={18} />
        </span>
      )}

      {/* Page Numbers */}
      {pages.map((page) => (
        <Link
          key={page}
          href={page === 1 ? basePath : `${basePath}?page=${page}`}
          className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
            page === currentPage
              ? "bg-primary-yellow text-surface-darkest"
              : "bg-surface-card text-gray-400 hover:bg-surface-hover hover:text-white"
          }`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </Link>
      ))}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="p-2 rounded-lg bg-surface-card hover:bg-surface-hover text-gray-400 hover:text-white transition-colors"
          aria-label="Próxima página"
        >
          <ChevronRight size={18} />
        </Link>
      ) : (
        <span className="p-2 rounded-lg bg-surface-card text-gray-600 cursor-not-allowed">
          <ChevronRight size={18} />
        </span>
      )}
    </nav>
  );
}
