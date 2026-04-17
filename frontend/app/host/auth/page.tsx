"use client";

import { Suspense } from "react";
import { HostHostRouteContent } from "../../session/[id]/host/page";

export default function HostAuthRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface">
          <div className="rounded-xl bg-surface-container-low p-8 text-center">
            <p className="mb-3 text-sm text-neutral-400">Loading host dashboard...</p>
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </div>
      }
    >
      <HostHostRouteContent id="demo" allowDemoRoute={true} />
    </Suspense>
  );
}
