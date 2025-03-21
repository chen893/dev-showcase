import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import COS from "cos-nodejs-sdk-v5";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";

// 创建 COS 实例
const cos = new COS({
  SecretId: env.COS_SECRET_ID,
  SecretKey: env.COS_SECRET_KEY,
});

// 定义 COS 存储桶相关配置
const COS_BUCKET = env.COS_BUCKET;
const COS_REGION = env.COS_REGION;

export const uploadRouter = createTRPCRouter({
  // 上传图片到腾讯云 COS
  uploadImage: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
        fileData: z.string(), // Base64 编码的文件数据
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // 确保用户已登录
        // if (!ctx.session || !ctx.session.user) {
        //   throw new TRPCError({ code: "UNAUTHORIZED" });
        // }

        // 从 Base64 转换为 Buffer
        const buffer = Buffer.from(
          input.fileData.replace(/^data:image\/\w+;base64,/, ""),
          "base64",
        );

        // 生成唯一的文件名
        const timestamp = Date.now();
        // const userId = ctx.session.user.id; // 使用用户ID作为前缀
        const key = `uploads/${timestamp}-${input.fileName}`;

        // 上传文件到 COS
        const uploadResult = await new Promise<COS.PutObjectResult>(
          (resolve, reject) => {
            cos.putObject(
              {
                Bucket: COS_BUCKET,
                Region: COS_REGION,
                Key: key,
                Body: buffer,
                ContentType: input.fileType,
              },
              (err, data) => {
                if (err) {
                  reject(new Error(err.message));
                } else {
                  resolve(data);
                }
              },
            );
          },
        );

        // 构建完整的访问 URL
        const fileUrl = `https://${COS_BUCKET}.cos.${COS_REGION}.myqcloud.com/${key}`;

        return {
          success: true,
          url: fileUrl,
          etag: uploadResult.ETag,
          key,
        };
      } catch (error) {
        console.error("上传文件到 COS 失败:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "上传文件失败",
          cause: error,
        });
      }
    }),
});
