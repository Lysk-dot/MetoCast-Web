"use client";

import { useState, useEffect, useCallback } from "react";
import { ThumbsUp, User, CalendarDays } from "lucide-react";
import SuggestionForm from "./SuggestionForm";
import type { Suggestion } from "@/types";

export default function SuggestionList() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [votedIds, setVotedIds] = useState<Set<number>>(new Set());

  const fetchSuggestions = useCallback(async () => {
    try {
      const res = await fetch("/api/suggestions");
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchSuggestions();

    // Restore voted IDs from localStorage
    try {
      const stored = localStorage.getItem("metocast-votes");
      if (stored) setVotedIds(new Set(JSON.parse(stored)));
    } catch {
      // ignore
    }
  }, [fetchSuggestions]);

  async function handleVote(id: number) {
    if (votedIds.has(id)) return;

    try {
      const res = await fetch(`/api/suggestions/${id}/vote`, { method: "POST" });
      if (res.ok) {
        const newVoted = new Set(votedIds).add(id);
        setVotedIds(newVoted);
        localStorage.setItem("metocast-votes", JSON.stringify([...newVoted]));
        fetchSuggestions();
      }
    } catch {
      // silently fail
    }
  }

  return (
    <div className="space-y-8">
      <SuggestionForm onSubmitted={fetchSuggestions} />

      <div className="space-y-4">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Sugestões da comunidade ({suggestions.length})
        </h2>

        {suggestions.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-8">
            Ainda não há sugestões. Seja o primeiro a sugerir um tema!
          </p>
        )}

        {suggestions.map((sug) => (
          <div
            key={sug.id}
            className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <h3 className="font-heading font-semibold text-foreground">{sug.title}</h3>
                <div className="flex items-center gap-3 text-xs text-foreground-faint">
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {sug.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays size={12} />
                    {new Date(sug.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleVote(sug.id)}
                disabled={votedIds.has(sug.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  votedIds.has(sug.id)
                    ? "bg-primary-yellow/20 text-primary-yellow cursor-default"
                    : "bg-surface-hover text-foreground-muted hover:text-primary-yellow hover:bg-surface-hover"
                }`}
                aria-label={`Votar (${sug.votes} votos)`}
              >
                <ThumbsUp size={16} />
                <span className="text-xs font-semibold">{sug.votes}</span>
              </button>
            </div>

            <p className="text-sm text-foreground-secondary whitespace-pre-wrap break-words">
              {sug.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
