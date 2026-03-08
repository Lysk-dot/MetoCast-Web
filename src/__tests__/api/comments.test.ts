import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma before importing route
vi.mock("@/lib/prisma", () => ({
  prisma: {
    comment: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { GET, POST } from "@/app/api/comments/route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

function makeRequest(url: string, init?: RequestInit) {
  return new NextRequest(new URL(url, "http://localhost"), init as any);
}

describe("GET /api/comments", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 400 for missing videoId", async () => {
    const res = await GET(makeRequest("http://localhost/api/comments"));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid videoId", async () => {
    const res = await GET(
      makeRequest("http://localhost/api/comments?videoId=<script>alert(1)")
    );
    expect(res.status).toBe(400);
  });

  it("returns comments for valid videoId", async () => {
    const mockComments = [
      { id: 1, videoId: "dQw4w9WgXcQ", author: "Test", message: "Oi", createdAt: new Date() },
    ];
    vi.mocked(prisma.comment.findMany).mockResolvedValue(mockComments as never);

    const res = await GET(
      makeRequest("http://localhost/api/comments?videoId=dQw4w9WgXcQ")
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveLength(1);
    expect(data[0].author).toBe("Test");
  });
});

describe("POST /api/comments", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 400 for invalid JSON", async () => {
    const res = await POST(
      makeRequest("http://localhost/api/comments", {
        method: "POST",
        body: "not json",
      })
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing videoId", async () => {
    const res = await POST(
      makeRequest("http://localhost/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: "Test", message: "Hello" }),
      })
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 for XSS in videoId", async () => {
    const res = await POST(
      makeRequest("http://localhost/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: "<script>alert(1)</script>",
          author: "Test",
          message: "Hello",
        }),
      })
    );
    expect(res.status).toBe(400);
  });
});
