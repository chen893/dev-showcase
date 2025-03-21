import { projectRouter } from "@/server/api/routers/project";
import { adminRouter } from "@/server/api/routers/admin";
import { uploadRouter } from "@/server/api/routers/upload";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  project: projectRouter,
  admin: adminRouter,
  upload: uploadRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.project.getAll();
 *       ^? { items: Project[], nextCursor?: string }
 */
export const createCaller = createCallerFactory(appRouter);
