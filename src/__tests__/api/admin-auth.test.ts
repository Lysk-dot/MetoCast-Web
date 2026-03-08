import { describe, it, expect, vi, beforeEach } from "vitest";

describe("POST /api/admin/auth", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns 503 when ADMIN_PASSWORD is not set", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "");

    const { POST } = await import("@/app/api/admin/auth/route");
    const req = new Request("http://localhost/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "test" }),
    });

    const { NextRequest } = await import("next/server");
    const res = await POST(new NextRequest(req));
    expect(res.status).toBe(503);
  });

  it("returns 401 for wrong password", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "correct-pass");

    const { POST } = await import("@/app/api/admin/auth/route");
    const req = new Request("http://localhost/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "wrong" }),
    });

    const { NextRequest } = await import("next/server");
    const res = await POST(new NextRequest(req));
    expect(res.status).toBe(401);
  });

  it("returns 200 for correct password", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "correct-pass");

    const { POST } = await import("@/app/api/admin/auth/route");
    const req = new Request("http://localhost/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "correct-pass" }),
    });

    const { NextRequest } = await import("next/server");
    const res = await POST(new NextRequest(req));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
  });
});
