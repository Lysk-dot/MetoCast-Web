import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    pageView: { create: vi.fn() },
    videoView: { create: vi.fn() },
  },
}));

// The route uses `prisma as any` so we import the mock directly
import { POST } from "@/app/api/metrics/route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

const db = prisma as any;

function makeRequest(body: unknown) {
  return new NextRequest(new URL("http://localhost/api/metrics"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/metrics", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects missing sessionId", async () => {
    const res = await POST(makeRequest({ type: "pageview", path: "/" }));
    expect(res.status).toBe(400);
  });

  it("rejects invalid type", async () => {
    const res = await POST(
      makeRequest({ type: "unknown", sessionId: "abc123" })
    );
    expect(res.status).toBe(400);
  });

  it("tracks pageview", async () => {
    db.pageView.create.mockResolvedValue({});
    const res = await POST(
      makeRequest({ type: "pageview", path: "/episodios", sessionId: "abc123" })
    );
    expect(res.status).toBe(201);
    expect(db.pageView.create).toHaveBeenCalledWith({
      data: { path: "/episodios", sessionId: "abc123" },
    });
  });

  it("tracks videoview with clamped seconds", async () => {
    db.videoView.create.mockResolvedValue({});
    const res = await POST(
      makeRequest({
        type: "videoview",
        videoId: "dQw4w9WgXcQ",
        watchSeconds: 999999,
        sessionId: "abc123",
      })
    );
    expect(res.status).toBe(201);
    expect(db.videoView.create).toHaveBeenCalledWith({
      data: {
        videoId: "dQw4w9WgXcQ",
        sessionId: "abc123",
        watchSeconds: 86400,
      },
    });
  });

  it("rejects invalid videoId", async () => {
    const res = await POST(
      makeRequest({
        type: "videoview",
        videoId: "invalid!",
        watchSeconds: 60,
        sessionId: "abc123",
      })
    );
    expect(res.status).toBe(400);
  });
});
