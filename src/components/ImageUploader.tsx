"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload } from "lucide-react";

interface ImageUploaderProps {
  onUploadSuccess?: (imageUrl: string) => void;
  buttonText?: string;
  className?: string;
}

export function ImageUploader({
  onUploadSuccess,
  buttonText = "上传图片",
  className,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // 创建上传图片的 trpc 调用
  const uploadMutation = api.upload.uploadImage.useMutation({
    onSuccess: (data) => {
      setIsUploading(false);
      toast({
        title: "上传成功",
        description: "图片已成功上传到云存储",
      });
      if (onUploadSuccess) {
        onUploadSuccess(data.url);
      }
    },
    onError: (error) => {
      setIsUploading(false);
      toast({
        title: "上传失败",
        description: error.message || "图片上传过程中发生错误",
        variant: "destructive",
      });
    },
  });

  // 处理文件选择和上传
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file) {
      toast({
        title: "未选择文件",
        description: "请选择一个文件进行上传",
        variant: "destructive",
      });
      return;
    }

    // 检查文件类型是否为图片
    if (!file.type.startsWith("image/")) {
      toast({
        title: "文件类型错误",
        description: "请选择图片文件进行上传",
        variant: "destructive",
      });
      return;
    }

    // 检查文件大小 (限制为 10MB)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      toast({
        title: "文件过大",
        description: "图片大小不能超过 10MB",
        variant: "destructive",
      });
      return;
    }

    // 开始上传
    setIsUploading(true);

    try {
      // 读取文件为 base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileResult = e.target?.result;
        if (fileResult && typeof fileResult === "string") {
          // 调用 trpc 接口上传图片
          await uploadMutation.mutateAsync({
            fileName: file.name,
            fileType: file.type,
            fileData: fileResult,
          });
        } else {
          throw new Error("读取文件失败");
        }
      };
      reader.onerror = () => {
        throw new Error("读取文件失败");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
      toast({
        title: "上传失败",
        description: "处理图片时出错",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={className}>
      <Button
        type="button"
        variant="outline"
        disabled={isUploading}
        onClick={() => document.getElementById("file-upload")?.click()}
        className="flex items-center gap-2"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            正在上传...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            {buttonText}
          </>
        )}
      </Button>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
