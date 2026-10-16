"use client";

import { useEffect, useState } from "react";

type HealthState = "checking" | "connected" | "error";

type HealthResponse = {
  status: "ok";
  service: "visionai-api";
};

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

function isHealthResponse(payload: unknown): payload is HealthResponse {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  return (
    "status" in payload &&
    payload.status === "ok" &&
    "service" in payload &&
    payload.service === "visionai-api"
  );
}

export default function Home() {
  const [health, setHealth] = useState<HealthState>("checking");

  useEffect(() => {
    const controller = new AbortController();

    async function checkBackend() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/health`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Backend returned HTTP ${response.status}`);
        }

        const payload: unknown = await response.json();
        if (!isHealthResponse(payload)) {
          throw new Error("Backend returned an unexpected health response");
        }

        setHealth("connected");
      } catch {
        if (!controller.signal.aborted) {
          setHealth("error");
        }
      }
    }

    void checkBackend();
    return () => controller.abort();
  }, []);

  const connectionLabel = {
    checking: "Checking connection",
    connected: "API connected",
    error: "API unavailable",
  }[health];

  const connectionStyle = {
    checking: "bg-amber-400",
    connected: "bg-emerald-400",
    error: "bg-rose-400",
  }[health];

  return (
    <main className="min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(37,99,235,0.13),_transparent_38%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between border-b border-white/[0.08] pb-6">
          <a href="/" className="flex items-center gap-3" aria-label="VisionAI home">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  d="M3 12s3.2-6 9-6 9 6 9 6-3.2 6-9 6-9-6-9-6Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-wide text-white">
                VisionAI
              </span>
              <span className="block text-xs text-slate-500">Computer vision workspace</span>
            </span>
          </a>

          <div
            className="flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs text-slate-300"
            role="status"
            aria-live="polite"
          >
            <span className={`h-2 w-2 rounded-full ${connectionStyle}`} />
            {connectionLabel}
          </div>
        </header>

        <section className="grid flex-1 content-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div className="flex flex-col justify-center">
            <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              <span className="h-px w-6 bg-blue-400" />
              Local-first vision
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your vision
              <br />
              <span className="text-slate-400">starts here.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
              A private computer vision workspace, built to run detection locally
              with OpenCV and YOLO.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                <span className="block text-xs text-slate-500">Inference</span>
                <span className="mt-1 block text-sm font-medium text-slate-200">
                  Runs on your machine
                </span>
              </div>
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                <span className="block text-xs text-slate-500">AI API key</span>
                <span className="mt-1 block text-sm font-medium text-slate-200">
                  Not required
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full rounded-2xl border border-white/[0.09] bg-[#0d111b]/90 p-5 shadow-2xl shadow-black/20 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">Project status</p>
                  <p className="mt-1 text-xs text-slate-500">Foundation · Stage 1 of 4</p>
                </div>
                <span className="rounded-full border border-blue-400/20 bg-blue-400/[0.08] px-2.5 py-1 text-[11px] font-medium text-blue-300">
                  SETUP
                </span>
              </div>

              <div className="mt-7 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-400/10 text-emerald-300">
                      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                        <path d="m5 10 3.2 3.2L15.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-slate-200">Web dashboard</span>
                      <span className="mt-0.5 block text-xs text-slate-500">Next.js · TypeScript</span>
                    </span>
                  </div>
                  <span className="text-xs text-emerald-300">Ready</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${connectionStyle}`} />
                    <span>
                      <span className="block text-sm font-medium text-slate-200">Python API</span>
                      <span className="mt-0.5 block text-xs text-slate-500">FastAPI · /api/health</span>
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {health === "connected" ? "Ready" : health === "error" ? "Offline" : "Checking"}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-400/10 text-slate-400">
                      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                        <rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
                        <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" />
                        <path d="m5 4 1-2h3l1 2" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-slate-200">Detection pipeline</span>
                      <span className="mt-0.5 block text-xs text-slate-500">OpenCV + YOLO</span>
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">Next stage</span>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-blue-400/15 bg-blue-400/[0.045] p-4">
                <p className="text-xs font-medium text-blue-200">Next up</p>
                <p className="mt-1.5 text-sm leading-6 text-slate-400">
                  Add secure image input and real YOLO detections, then connect a
                  live camera with controlled frame sampling.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-2 border-t border-white/[0.08] pt-5 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>VisionAI · Development workspace</span>
          <span>Detection is not enabled in this setup stage.</span>
        </footer>
      </div>
    </main>
  );
}
