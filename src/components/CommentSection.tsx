"use client";

import { useState, useEffect } from "react";
import { Send, User, MessageCircle } from "lucide-react";
import type { Comment } from "@/types";

interface CommentSectionProps {
  videoId: string;
}

export default function CommentSection({ videoId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  async function fetchComments() {
    try {
      const res = await fetch(`/api/comments?videoId=${encodeURIComponent(videoId)}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch {
      // silently fail — comments are non-critical
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, author: author.trim(), message: message.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao enviar comentário.");
        return;
      }

      setAuthor("");
      setMessage("");
      fetchComments();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <h2 className="font-heading text-xl font-semibold text-white flex items-center gap-2">
        <MessageCircle size={20} />
        Comentários ({comments.length})
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
        <div>
          <label htmlFor="comment-author" className="block text-sm text-gray-400 mb-1">
            Seu nome
          </label>
          <input
            id="comment-author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={100}
            required
            placeholder="Digite seu nome..."
            className="w-full px-4 py-2.5 bg-surface rounded-lg border border-surface-border text-white placeholder-gray-500 focus:outline-none focus:border-primary-yellow/50 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="comment-message" className="block text-sm text-gray-400 mb-1">
            Comentário
          </label>
          <textarea
            id="comment-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={2000}
            required
            rows={3}
            placeholder="Escreva seu comentário..."
            className="w-full px-4 py-2.5 bg-surface rounded-lg border border-surface-border text-white placeholder-gray-500 focus:outline-none focus:border-primary-yellow/50 transition-colors resize-none"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-yellow text-surface-darkest font-semibold rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={16} />
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>

      {/* Comment List */}
      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-8">
            Ainda não há comentários. Seja o primeiro!
          </p>
        )}

        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-surface-card border border-surface-border rounded-xl p-4 space-y-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center">
                <User size={14} className="text-gray-400" />
              </div>
              <div>
                <span className="text-sm font-medium text-white">{comment.author}</span>
                <span className="text-xs text-gray-500 ml-2">
                  {new Date(comment.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-300 pl-10 whitespace-pre-wrap break-words">
              {comment.message}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
