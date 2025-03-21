import { Suspense } from "react";
import { ProjectClient } from "./project-client";

// 服务端入口组件
export default function ProjectPage({ params }: { params: { slug: string } }) {
  console.log("params", params);
  // await;
  const slug = params.slug;
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="flex h-64 items-center justify-center">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          </div>
        </div>
      }
    >
      {slug && <ProjectClient slug={slug} />}
    </Suspense>
  );
}
