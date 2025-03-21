"use client";

import { useState } from "react";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectEditDialog } from "@/components/ProjectEditDialog";
import { hasAdminKey, withAdminKey } from "@/lib/admin";
import { formatDate } from "@/lib/utils";
import { api } from "@/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// interface ProjectClientProps {
//   params: {
//     slug: string;
//   };
// }

export function ProjectClient({ slug }: { slug: string }) {
  console.log("params", slug);
  const router = useRouter();
  const { toast } = useToast();
  const isAdmin = hasAdminKey();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // 获取项目信息
  const {
    data: project,
    isLoading,
    error,
    refetch,
  } = api.project.getBySlug.useQuery({
    slug,
  });

  // 删除项目API
  const deleteMutation = api.project.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "删除成功",
        description: "项目已成功删除",
      });
      router.push("/");
    },
    onError: (err) => {
      toast({
        title: "删除失败",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  // 处理删除项目
  const handleDeleteProject = () => {
    if (!project) return;

    try {
      deleteMutation.mutate(withAdminKey({ id: project.id }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "未知错误";
      toast({
        title: "删除失败",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-64 items-center justify-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* 面包屑导航 */}
        <div className="text-muted-foreground mb-6 flex items-center text-sm">
          <Link href="/" className="hover:text-primary hover:underline">
            首页
          </Link>
          <span className="mx-2">/</span>
          <span>{project.title}</span>
        </div>

        {/* 项目标题和管理按钮 */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">{project.title}</h1>
            {project.publishedAt && (
              <p className="text-muted-foreground mt-2">
                发布于 {formatDate(project.publishedAt)}
              </p>
            )}
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
                编辑项目
              </Button>
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                删除项目
              </Button>
            </div>
          )}
        </div>

        {/* 项目特征标签 */}
        {project.featured && (
          <div className="mb-6">
            <Badge variant="secondary" className="text-base">
              精选项目
            </Badge>
          </div>
        )}

        {/* 项目图片 */}
        <div className="mb-8 overflow-hidden rounded-lg border">
          {project.imageUrl ? (
            <div className="relative aspect-video w-full">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="bg-muted flex aspect-video w-full items-center justify-center">
              <span className="text-muted-foreground">无项目图片</span>
            </div>
          )}
        </div>

        {/* 项目描述 */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">项目描述</h2>
          <p className="text-muted-foreground">{project.description}</p>
        </div>

        {/* 项目内容 */}
        {project.content && (
          <div className="prose prose-neutral dark:prose-invert mb-8 max-w-none">
            <h2 className="mb-4 text-2xl font-semibold">项目详情</h2>
            <div
              className="mt-4"
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          </div>
        )}

        {/* 项目链接 */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">项目链接</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub 仓库
            </Link>
            {project.liveUrl && (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                在线预览
              </Link>
            )}
          </div>
        </div>

        {/* 返回按钮 */}
        <div className="mt-12 flex justify-center">
          <Link href="/">
            <Button variant="outline">返回项目列表</Button>
          </Link>
        </div>
      </div>

      {/* 编辑项目对话框 */}
      <ProjectEditDialog
        project={project}
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSuccess={() => refetch()}
      />

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              您确定要删除项目 <strong>{project.title}</strong>{" "}
              吗？此操作无法撤销。
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProject}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "删除中..." : "确认删除"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
