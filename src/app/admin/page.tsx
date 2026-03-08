"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Shield,
  Trash2,
  MessageCircle,
  Lightbulb,
  BarChart3,
  Eye,
  Clock,
  Users,
  Video,
  LogIn,
} from "lucide-react";
import type { Comment, Suggestion, MetricsSummary } from "@/types";

type Tab = "comments" | "suggestions" | "metrics";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<Tab>("comments");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      sessionStorage.setItem("admin-pw", password);
      setAuthenticated(true);
    } else {
      setAuthError("Senha incorreta.");
    }
  }

  useEffect(() => {
    const saved = sessionStorage.getItem("admin-pw");
    if (saved) {
      fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: saved }),
      }).then((res) => {
        if (res.ok) {
          setPassword(saved);
          setAuthenticated(true);
        }
      });
    }
  }, []);

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-surface-card border border-surface-border rounded-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <Shield size={40} className="mx-auto text-primary-yellow" />
            <h1 className="font-heading text-2xl font-bold text-foreground">
              Painel Admin
            </h1>
            <p className="text-foreground-muted text-sm">
              Acesso restrito à equipe MetôCast.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm text-foreground-muted mb-1"
              >
                Senha
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Digite a senha de admin..."
                className="w-full px-4 py-2.5 bg-surface rounded-lg border border-surface-border text-foreground placeholder-foreground-faint focus:outline-none focus:border-primary-yellow/50 transition-colors"
              />
            </div>

            {authError && (
              <p className="text-red-400 text-sm">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-yellow text-gray-900 font-semibold rounded-lg hover:brightness-110 transition-all"
            >
              <LogIn size={16} />
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  const authHeader = { "x-admin-password": password };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Shield size={28} className="text-primary-yellow" />
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
          Painel Administrativo
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-surface-border">
        {([
          { id: "comments" as Tab, label: "Comentários", icon: MessageCircle },
          { id: "suggestions" as Tab, label: "Sugestões", icon: Lightbulb },
          { id: "metrics" as Tab, label: "Métricas", icon: BarChart3 },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id
                ? "border-primary-yellow text-primary-yellow"
                : "border-transparent text-foreground-muted hover:text-foreground"
            }`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "comments" && <CommentsTab authHeader={authHeader} />}
      {tab === "suggestions" && <SuggestionsTab authHeader={authHeader} />}
      {tab === "metrics" && <MetricsTab authHeader={authHeader} />}
    </div>
  );
}

/* ===== Comments Tab ===== */
function CommentsTab({ authHeader }: { authHeader: Record<string, string> }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetch_ = useCallback(async () => {
    const res = await fetch("/api/admin/comments", { headers: authHeader });
    if (res.ok) setComments(await res.json());
  }, [authHeader]);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir este comentário?")) return;
    setDeleting(id);
    await fetch(`/api/admin/comments?id=${id}`, {
      method: "DELETE",
      headers: authHeader,
    });
    setComments((prev) => prev.filter((c) => c.id !== id));
    setDeleting(null);
  }

  return (
    <div className="space-y-4">
      <p className="text-foreground-muted text-sm">
        {comments.length} comentário(s) no total
      </p>

      {comments.length === 0 && (
        <p className="text-foreground-faint text-center py-8">
          Nenhum comentário ainda.
        </p>
      )}

      {comments.map((c) => (
        <div
          key={c.id}
          className="bg-surface-card border border-surface-border rounded-xl p-4 flex items-start gap-4"
        >
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-foreground">{c.author}</span>
              <span className="text-foreground-faint text-xs">
                em vídeo {c.videoId}
              </span>
              <span className="text-foreground-faint text-xs">
                {new Date(c.createdAt).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <p className="text-sm text-foreground-secondary break-words">
              {c.message}
            </p>
          </div>
          <button
            onClick={() => handleDelete(c.id)}
            disabled={deleting === c.id}
            className="flex-shrink-0 p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Excluir comentário"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ===== Suggestions Tab ===== */
function SuggestionsTab({
  authHeader,
}: {
  authHeader: Record<string, string>;
}) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetch_ = useCallback(async () => {
    const res = await fetch("/api/admin/suggestions", { headers: authHeader });
    if (res.ok) setSuggestions(await res.json());
  }, [authHeader]);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir esta sugestão?")) return;
    setDeleting(id);
    await fetch(`/api/admin/suggestions?id=${id}`, {
      method: "DELETE",
      headers: authHeader,
    });
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    setDeleting(null);
  }

  return (
    <div className="space-y-4">
      <p className="text-foreground-muted text-sm">
        {suggestions.length} sugestão(ões) no total
      </p>

      {suggestions.length === 0 && (
        <p className="text-foreground-faint text-center py-8">
          Nenhuma sugestão ainda.
        </p>
      )}

      {suggestions.map((s) => (
        <div
          key={s.id}
          className="bg-surface-card border border-surface-border rounded-xl p-4 flex items-start gap-4"
        >
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-foreground">{s.title}</span>
              <span className="text-primary-yellow text-xs font-semibold">
                {s.votes} votos
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-foreground-faint">
              <span>por {s.author}</span>
              <span>
                {new Date(s.createdAt).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <p className="text-sm text-foreground-secondary break-words">
              {s.description}
            </p>
          </div>
          <button
            onClick={() => handleDelete(s.id)}
            disabled={deleting === s.id}
            className="flex-shrink-0 p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Excluir sugestão"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ===== Metrics Tab ===== */
function MetricsTab({ authHeader }: { authHeader: Record<string, string> }) {
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);

  useEffect(() => {
    fetch("/api/admin/metrics", { headers: authHeader })
      .then((r) => r.json())
      .then(setMetrics)
      .catch(() => {});
  }, [authHeader]);

  if (!metrics) {
    return (
      <p className="text-foreground-faint text-center py-8">
        Carregando métricas...
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Eye}
          label="Page Views"
          value={metrics.totalPageViews}
        />
        <StatCard
          icon={Users}
          label="Sessões Únicas"
          value={metrics.uniqueSessions}
        />
        <StatCard
          icon={Video}
          label="Vídeos Assistidos"
          value={metrics.totalVideoViews}
        />
        <StatCard
          icon={Clock}
          label="Minutos Assistidos"
          value={metrics.totalWatchMinutes}
        />
      </div>

      {/* Top Pages */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4">
          Páginas Mais Acessadas
        </h3>
        {metrics.topPages.length === 0 ? (
          <p className="text-foreground-faint text-sm">Sem dados ainda.</p>
        ) : (
          <div className="space-y-2">
            {metrics.topPages.map((p) => (
              <div
                key={p.path}
                className="flex items-center justify-between py-2 border-b border-surface-border last:border-0"
              >
                <div className="min-w-0">
                  <span className="text-sm text-foreground font-medium">
                    {p.name}
                  </span>
                  <span className="text-xs text-foreground-faint ml-2">
                    {p.path}
                  </span>
                </div>
                <span className="text-sm font-semibold text-primary-yellow flex-shrink-0">
                  {p.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Videos */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4">
          Vídeos Mais Assistidos
        </h3>
        {metrics.topVideos.length === 0 ? (
          <p className="text-foreground-faint text-sm">Sem dados ainda.</p>
        ) : (
          <div className="space-y-2">
            {metrics.topVideos.map((v) => (
              <div
                key={v.videoId}
                className="flex items-center justify-between py-2 border-b border-surface-border last:border-0"
              >
                <div className="min-w-0 flex-1 mr-4">
                  <span className="text-sm text-foreground font-medium truncate block">
                    {v.title}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm flex-shrink-0">
                  <span className="text-foreground-muted">
                    {v.views} views
                  </span>
                  <span className="font-semibold text-primary-yellow">
                    {v.minutes} min
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-2">
      <div className="flex items-center gap-2 text-foreground-muted">
        <Icon size={16} />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">
        {value.toLocaleString("pt-BR")}
      </p>
    </div>
  );
}
