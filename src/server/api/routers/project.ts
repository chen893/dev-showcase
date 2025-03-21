import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { env } from "@/env.js";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

// 项目输入验证模式
const projectInput = z.object({
  title: z.string().min(1, "标题不能为空"),
  slug: z.string().min(1, "Slug不能为空"),
  description: z.string().min(1, "描述不能为空"),
  content: z.string().optional(),
  imageUrl: z.string().optional().nullable(),
  liveUrl: z.string().optional().nullable(),
  repoUrl: z.string().min(1, "GitHub仓库链接不能为空"),
  publishedAt: z.date().optional().nullable(),
  featured: z.boolean().default(false),
});

// 验证管理员密钥
const validateAdminKey = (key: string) => {
  console.log(env.ADMIN_KEY, key);
  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: `管理员密钥无效`,
    });
  }
};

export const projectRouter = createTRPCRouter({
  // 获取所有项目
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).optional(),
        cursor: z.string().optional(),
        featured: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const cursor = input.cursor;

      const where =
        input.featured !== undefined ? { featured: input.featured } : {};

      const items = await ctx.db.project.findMany({
        take: limit + 1,
        where,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { publishedAt: "desc" },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  // 获取单个项目
  getBySlug: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.project.findUnique({
        where: { id: input.id },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "项目不存在",
        });
      }

      return project;
    }),

  // 创建项目
  create: protectedProcedure
    .input(
      z.object({
        ...projectInput.shape,
        adminKey: z.string().min(1, "管理员密钥不能为空"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 验证管理员密钥
      // 移除adminKey字段，不保存到数据库
      const { adminKey, ...projectData } = input;
      validateAdminKey(adminKey);

      return ctx.db.project.create({
        data: {
          ...projectData,
          publishedAt: projectData.publishedAt ?? new Date(),
        },
      });
    }),

  // 更新项目
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: projectInput,
        adminKey: z.string().min(1, "管理员密钥不能为空"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 验证管理员密钥
      validateAdminKey(input.adminKey);

      const project = await ctx.db.project.findUnique({
        where: { id: input.id },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "要更新的项目不存在",
        });
      }

      return ctx.db.project.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  // 删除项目
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        adminKey: z.string().min(1, "管理员密钥不能为空"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 验证管理员密钥
      validateAdminKey(input.adminKey);

      const project = await ctx.db.project.findUnique({
        where: { id: input.id },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "要删除的项目不存在",
        });
      }

      return ctx.db.project.delete({
        where: { id: input.id },
      });
    }),
});
