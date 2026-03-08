import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    suggestion: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { GET, POST } from "@/app/api/suggestions/route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

function makeRequest(url: string, init?: RequestInit) {
  return new NextRequest(new URL(url, "http://localhost"), init as any);
}

describe("GET /api/suggestions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns suggestions ordered by votes", async () => {
    const mockSuggestions = [
      { id: 1, author: "A", title: "Tema X", description: "Desc", votes: 5, createdAt: new Date() },
      { id: 2, author: "B", title: "Tema Y", description: "Desc2", votes: 3, createdAt: new Date() },
    ];
    vi.mocked(prisma.suggestion.findMany).mockResolvedValue(mockSuggestions as never);

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveLength(2);
    expect(data[0].votes).toBe(5);
  });
});

describe("POST /api/suggestions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 400 for empty author", async () => {
    const res = await POST(
      makeRequest("http://localhost/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: "", title: "Test", description: "Desc" }),
      })
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 for title exceeding 200 chars", async () => {
    const res = await POST(
      makeRequest("http://localhost/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: "Test",
          title: "A".repeat(201),
          description: "Desc",
        }),
      })
    );
    expect(res.status).toBe(400);
  });

  it("creates suggestion with valid data", async () => {
    const mockSuggestion = {
      id: 1,
      author: "Test",
      title: "Meu Tema",
      description: "Uma descrição",
      votes: 0,
      createdAt: new Date(),
    };
    vi.mocked(prisma.suggestion.create).mockResolvedValue(mockSuggestion as never);

    const res = await POST(
      makeRequest("http://localhost/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: "Test",
          title: "Meu Tema",
          description: "Uma descrição",
        }),
      })
    );
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe("Meu Tema");
  });
});
