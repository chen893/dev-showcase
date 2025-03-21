import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { env } from "@/env.js";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const adminRouter = createTRPCRouter({
  // 验证管理员密钥
  verifyKey: publicProcedure
    .input(z.object({ adminKey: z.string().min(1, "管理员密钥不能为空") }))
    .mutation(async ({ input }) => {
      if (!env.ADMIN_KEY || input.adminKey !== env.ADMIN_KEY) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `管理员密钥无效: ${env.ADMIN_KEY} !== ${input.adminKey}`,
        });
      }

      return { success: true };
    }),
});
