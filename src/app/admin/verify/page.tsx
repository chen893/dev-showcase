"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { saveAdminKey, hasAdminKey } from "@/lib/admin";

export default function AdminVerifyPage() {
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);
  const router = useRouter();

  // 检查是否已经验证过
  useState(() => {
    setIsAlreadyVerified(hasAdminKey());
  });

  // 验证密钥API调用
  const verifyMutation = api.admin.verifyKey.useMutation({
    onSuccess: () => {
      // 验证成功，保存密钥
      saveAdminKey(adminKey);
      setError(null);
      setIsVerifying(false);

      // 返回首页
      router.push("/");
    },
    onError: (error) => {
      setError(error.message);
      setIsVerifying(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsVerifying(true);

    verifyMutation.mutate({ adminKey });
  };

  const handleReturnHome = () => {
    router.push("/");
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          管理员验证
        </h1>

        {isAlreadyVerified ? (
          <div className="text-center">
            <p className="mb-4 text-green-600 dark:text-green-400">
              您已经完成验证
            </p>
            <button
              onClick={handleReturnHome}
              className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              返回首页
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="adminKey"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                管理员密钥
              </label>
              <input
                type="password"
                id="adminKey"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="请输入管理员密钥"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                required
              />
            </div>

            {error && (
              <div
                className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-gray-800 dark:text-red-400"
                role="alert"
              >
                <span className="font-medium">错误:</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {isVerifying ? "验证中..." : "验证"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
