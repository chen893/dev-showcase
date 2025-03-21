import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { type RouterOutputs } from "@/trpc/react";

type Project = RouterOutputs["project"]["getAll"]["items"][number];

interface ProjectCardProps {
  project: Project;
  isAdmin: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export function ProjectCard({
  project,
  isAdmin,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
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
            <Badge className="absolute right-2 top-2" variant="secondary">
              精选项目
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="mb-2 text-xl font-semibold">
          <Link
            href={`/projects/${project.slug}`}
            className="hover:text-primary"
          >
            {project.title}
          </Link>
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {project.description}
        </p>
        {project.publishedAt && (
          <p className="text-muted-foreground text-sm">
            发布于 {formatDate(project.publishedAt)}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-2 border-t p-4">
        <div className="flex gap-2">
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
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit?.(project)}
              className="bg-muted text-muted-foreground hover:bg-muted/80 inline-flex items-center rounded-md px-3 py-1 text-sm font-medium"
            >
              编辑
            </button>
            <button
              onClick={() => onDelete?.(project)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 inline-flex items-center rounded-md px-3 py-1 text-sm font-medium"
            >
              删除
            </button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
