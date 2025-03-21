"use client";
// import { Link } from "@/components/ui/button";
import { clearAdminKey } from "@/lib/admin";
import Link from "next/link";

export default function LogoutButton() {
  return (
    <Link
      href="/admin/verify"
      onClick={clearAdminKey}
      className="flex items-center justify-center rounded-lg bg-gray-600 px-4 py-3 text-center font-medium text-white hover:bg-gray-700"
    >
      退出登录
    </Link>
  );
}
