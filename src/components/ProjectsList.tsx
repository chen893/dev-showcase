"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProjectEditDialog } from "@/components/ProjectEditDialog";
import { hasAdminKey, withAdminKey } from "@/lib/admin";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { type RouterOutputs } from "@/trpc/react";

// import { ImageUploader } from "@/components/ImageUploader";
// 定义项目类型
type Project = RouterOutputs["project"]["getAll"]["items"][number];

export function ProjectsList() {
  const { toast } = useToast();
  const isAdmin = hasAdminKey();

  // 删除项目对话框状态
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // 编辑项目对话框状态
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  // 获取项目列表
  const { data, isLoading, error, refetch } = api.project.getAll.useQuery({
    limit: 50,
  });

  // 删除项目API
  const deleteMutation = api.project.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "删除成功",
        description: "项目已成功删除",
      });

      // 关闭对话框
      setDeleteDialogOpen(false);
      setProjectToDelete(null);

      // 刷新数据
      void refetch();
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
  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  // 确认删除项目
  const confirmDeleteProject = () => {
    if (!projectToDelete) return;

    try {
      deleteMutation.mutate(withAdminKey({ id: projectToDelete.id }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "未知错误";
      toast({
        title: "删除失败",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // 处理编辑项目
  const handleEditProject = (project: Project) => {
    setProjectToEdit(project);
    setEditDialogOpen(true);
  };

  // 处理新增项目
  const handleAddProject = () => {
    setProjectToEdit(null);
    setEditDialogOpen(true);
  };

  // 如果正在加载
  if (isLoading) {
    return <div>正在加载项目...</div>;
  }

  // 如果发生错误
  if (error) {
    return <div>加载项目时出错: {error.message}</div>;
  }

  // 如果没有项目
  if (!data || data.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative border-l border-gray-200 py-8 pl-6 dark:border-gray-700">
          <div className="absolute -left-9 flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700">
            <span className="text-xs">0</span>
          </div>
          <p className="text-muted-foreground mb-4 text-center text-lg">
            暂无项目。
          </p>
          {isAdmin && (
            <Button onClick={handleAddProject}>创建第一个项目</Button>
          )}
        </div>

        {/* 项目编辑对话框 */}
        <ProjectEditDialog
          project={projectToEdit}
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSuccess={() => refetch()}
        />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex justify-between">
        <h2 className="text-2xl font-bold">项目时间线</h2>
        {isAdmin && <Button onClick={handleAddProject}>添加新项目</Button>}
      </div>

      <div className="relative space-y-10 border-l border-gray-200 pl-6 dark:border-gray-700">
        {data.items.map((project, index) => (
          <div key={project.id} className="relative mb-10">
            {/* 时间线圆点 */}
            <div className="bg-primary absolute -left-9 flex h-6 w-6 items-center justify-center rounded-full text-white">
              <span className="text-xs">{index + 1}</span>
            </div>

            {/* 时间标记 */}
            <div className="text-muted-foreground mb-2 text-sm">
              {project.publishedAt
                ? new Date(project.publishedAt).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "未发布"}
            </div>

            {/* 项目卡片 */}
            <div className="bg-card text-card-foreground overflow-hidden rounded-lg border shadow transition-all hover:shadow-md">
              <div className="relative h-48 w-full">
                {project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-muted flex h-full w-full items-center justify-center">
                    <span className="text-muted-foreground">无图片</span>
                  </div>
                )}
                {project.featured && (
                  <div className="bg-primary text-primary-foreground absolute right-2 top-2 rounded-md px-2 py-1 text-xs">
                    精选项目
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="mb-2 text-xl font-semibold">
                  <Link
                    href={`/projects/${project.id}`}
                    className="hover:text-primary"
                  >
                    {project.title}
                  </Link>
                </h3>
                <p className="text-muted-foreground mb-4">
                  {project.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-muted text-muted-foreground hover:bg-muted/80 inline-flex items-center rounded-md px-3 py-1 text-sm font-medium"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="mr-1 h-4 w-4"
                      fill="currentColor"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </Link>
                  {project.liveUrl && (
                    <Link
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-3 py-1 text-sm font-medium"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="mr-1 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      预览
                    </Link>
                  )}

                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleEditProject(project)}
                        className="bg-muted text-muted-foreground hover:bg-muted/80 inline-flex items-center rounded-md px-3 py-1 text-sm font-medium"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 inline-flex items-center rounded-md px-3 py-1 text-sm font-medium"
                      >
                        删除
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              您确定要删除项目 <strong>{projectToDelete?.title}</strong>{" "}
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
              onClick={confirmDeleteProject}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "删除中..." : "确认删除"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 项目编辑对话框 */}
      <ProjectEditDialog
        project={projectToEdit}
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSuccess={() => refetch()}
      />
    </>
  );
}
