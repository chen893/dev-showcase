"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasAdminKey } from "@/lib/admin";

interface AdminVerifyWrapperProps {
  children: React.ReactNode;
}

/**
 * 管理员验证包装器组件
 * 如果未验证，则重定向到验证页面
 */
export default function AdminVerifyWrapper({
  children,
}: AdminVerifyWrapperProps) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 检查是否有管理员密钥
    const adminVerified = hasAdminKey();

    if (!adminVerified) {
      // 如果未验证，重定向到验证页面
      router.push("/admin/verify");
    } else {
      setIsAdmin(true);
    }

    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent"></div>
          <p>正在验证权限...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
