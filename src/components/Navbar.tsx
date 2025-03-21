"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { hasAdminKey } from "@/lib/admin";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const isAdmin = hasAdminKey();
  const isAdmin = true;
  const navItems = [
    { name: "首页", href: "/" },
    { name: "关于", href: "/about" },
    ...(isAdmin ? [{ name: "管理面板", href: "/admin" }] : []),
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              开发者作品展示
            </Link>
          </div>

          {/* 桌面导航 */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  {item.name}
                </Link>
              ))}
              {!isAdmin && (
                <Link
                  href="/admin/verify"
                  className="text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-medium"
                >
                  管理员入口
                </Link>
              )}
            </div>
          </div>

          {/* 移动端汉堡菜单按钮 */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md p-2 focus:outline-none"
            >
              <span className="sr-only">打开主菜单</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-md px-3 py-2 text-base font-medium",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {!isAdmin && (
              <Link
                href="/admin/verify"
                className="text-muted-foreground hover:bg-accent hover:text-accent-foreground block rounded-md px-3 py-2 text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                管理员入口
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
