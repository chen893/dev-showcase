"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { withAdminKey } from "@/lib/admin";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { type RouterOutputs } from "@/trpc/react";
import { ImageUploader } from "@/components/ImageUploader";

// 定义项目类型
type Project = RouterOutputs["project"]["getAll"]["items"][number];

// 表单验证模式
const formSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  slug: z.string().min(1, "Slug不能为空"),
  description: z.string().min(1, "描述不能为空"),
  content: z.string().optional(),
  imageUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  repoUrl: z.string().min(1, "GitHub仓库链接不能为空"),
  featured: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface ProjectEditDialogProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProjectEditDialog({
  project,
  isOpen,
  onClose,
  onSuccess,
}: ProjectEditDialogProps) {
  const { toast } = useToast();
  const isEditing = !!project;

  // 创建项目API
  const createMutation = api.project.create.useMutation({
    onSuccess: () => {
      toast({
        title: "创建成功",
        description: "项目已成功创建",
      });
      onSuccess();
      onClose();
    },
    onError: (err) => {
      toast({
        title: "创建失败",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  // 更新项目API
  const updateMutation = api.project.update.useMutation({
    onSuccess: () => {
      toast({
        title: "更新成功",
        description: "项目已成功更新",
      });
      onSuccess();
      onClose();
    },
    onError: (err) => {
      toast({
        title: "更新失败",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  // 创建表单
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      content: "",
      imageUrl: "",
      liveUrl: "",
      repoUrl: "",
      featured: false,
    },
  });

  // 当项目数据变化时，重置表单
  useEffect(() => {
    if (isOpen) {
      if (project) {
        // 编辑现有项目
        form.reset({
          title: project.title,
          slug: project.slug,
          description: project.description,
          content: project.content ?? "",
          imageUrl: project.imageUrl ?? "",
          liveUrl: project.liveUrl ?? "",
          repoUrl: project.repoUrl,
          featured: project.featured,
        });
      } else {
        // 创建新项目
        form.reset({
          title: "",
          slug: "",
          description: "",
          content: "",
          imageUrl: "",
          liveUrl: "",
          repoUrl: "",
          featured: false,
        });
      }
    }
  }, [form, project, isOpen]);

  // 提交表单
  const onSubmit = (values: FormValues) => {
    try {
      if (isEditing && project) {
        // 更新项目
        updateMutation.mutate(
          withAdminKey({
            id: project.id,
            data: {
              ...values,
              imageUrl: values.imageUrl ?? undefined,
              liveUrl: values.liveUrl ?? undefined,
              content: values.content ?? undefined,
            },
          }),
        );
      } else {
        // 创建项目
        createMutation.mutate(
          withAdminKey({
            ...values,
            imageUrl: values.imageUrl ?? undefined,
            liveUrl: values.liveUrl ?? undefined,
            content: values.content ?? undefined,
          }),
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "操作失败",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "编辑项目" : "创建项目"}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>项目标题</FormLabel>
                    <FormControl>
                      <Input placeholder="输入项目标题" {...field} />
                    </FormControl>
                    <FormDescription>
                      项目的名称，将显示在项目列表和详情页。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>项目Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="project-name" {...field} />
                    </FormControl>
                    <FormDescription>
                      用于URL的唯一标识，只能包含字母、数字、连字符和下划线。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>项目描述</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="简短描述项目的主要功能和特点"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      简短的项目概述，将显示在项目卡片上。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>项目内容</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="详细描述项目的功能、技术和特点"
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      项目的详细内容，支持HTML格式。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>项目图片</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-4">
                        {field.value && (
                          <div className="rounded-md border p-2">
                            <Image
                              src={field.value}
                              alt="项目预览图"
                              width={100}
                              height={100}
                              className="h-40 w-full rounded object-cover"
                            />
                          </div>
                        )}
                        <ImageUploader
                          onUploadSuccess={(imageUrl) => {
                            field.onChange(imageUrl);
                          }}
                          buttonText={field.value ? "更换图片" : "上传项目图片"}
                        />
                        {field.value && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => field.onChange("")}
                            className="w-fit"
                          >
                            移除图片
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      项目的预览图片，将显示在项目卡片和详情页。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="repoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub仓库链接</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://github.com/username/project"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      项目的GitHub仓库链接，必填。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="liveUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>在线预览链接</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://project-demo.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      项目的在线预览链接，可选。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>精选项目</FormLabel>
                      <FormDescription>
                        设置为精选项目将在首页突出显示。
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  取消
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "处理中..."
                    : isEditing
                      ? "更新项目"
                      : "创建项目"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
