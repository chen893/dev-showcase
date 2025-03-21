"use client";
import { Suspense } from "react";
import { ProjectsList } from "@/components/ProjectsList";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProjectsListSkeleton />}>
        <ProjectsList />
      </Suspense>
    </div>
  );
}

function ProjectsListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="bg-card rounded-lg border shadow-sm">
            <div className="bg-muted h-48 animate-pulse"></div>
            <div className="p-4">
              <div className="bg-muted mb-2 h-6 w-3/4 animate-pulse rounded"></div>
              <div className="mb-4 space-y-2">
                <div className="bg-muted h-4 w-full animate-pulse rounded"></div>
                <div className="bg-muted h-4 w-5/6 animate-pulse rounded"></div>
              </div>
              <div className="bg-muted h-4 w-1/3 animate-pulse rounded"></div>
            </div>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <div className="bg-muted h-8 w-20 animate-pulse rounded"></div>
                <div className="bg-muted h-8 w-20 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
