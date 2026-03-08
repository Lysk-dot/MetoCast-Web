"use client";

import { useState } from "react";
import { Send, Lightbulb } from "lucide-react";

export default function SuggestionForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!author.trim() || !title.trim() || !description.trim()) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: author.trim(),
          title: title.trim(),
          description: description.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao enviar sugestão.");
        return;
      }

      setAuthor("");
      setTitle("");
      setDescription("");
      setSuccess(true);
      onSubmitted();
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-card border border-surface-border rounded-xl p-6 space-y-4">
      <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
        <Lightbulb size={20} className="text-primary-yellow" />
        Sugira um tema
      </h2>

      <div>
        <label htmlFor="sug-author" className="block text-sm text-foreground-muted mb-1">
          Seu nome
        </label>
        <input
          id="sug-author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={100}
          required
          placeholder="Digite seu nome..."
          className="w-full px-4 py-2.5 bg-surface rounded-lg border border-surface-border text-foreground placeholder-foreground-faint focus:outline-none focus:border-primary-yellow/50 transition-colors"
        />
      </div>

      <div>
        <label htmlFor="sug-title" className="block text-sm text-foreground-muted mb-1">
          Título da sugestão
        </label>
        <input
          id="sug-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
          placeholder="Ex: Saúde mental na universidade"
          className="w-full px-4 py-2.5 bg-surface rounded-lg border border-surface-border text-foreground placeholder-foreground-faint focus:outline-none focus:border-primary-yellow/50 transition-colors"
        />
      </div>

      <div>
        <label htmlFor="sug-desc" className="block text-sm text-foreground-muted mb-1">
          Descrição
        </label>
        <textarea
          id="sug-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={2000}
          required
          rows={4}
          placeholder="Descreva sua ideia para o episódio..."
          className="w-full px-4 py-2.5 bg-surface rounded-lg border border-surface-border text-foreground placeholder-foreground-faint focus:outline-none focus:border-primary-yellow/50 transition-colors resize-none"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {success && <p className="text-green-400 text-sm">Sugestão enviada com sucesso!</p>}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-yellow text-gray-900 font-semibold rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={16} />
        {loading ? "Enviando..." : "Enviar sugestão"}
      </button>
    </form>
  );
}
