import AdminVerifyWrapper from "@/components/AdminVerifyWrapper";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
// import { clearAdminKey } from "@/lib/admin";
export default function AdminPage() {
  return (
    <AdminVerifyWrapper>
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-3xl font-bold">管理员控制面板</h1>

          <div className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold">项目管理</h2>
            <p className="mb-4">您已验证为管理员，可以进行以下操作：</p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Link
                href="/"
                className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white hover:bg-blue-700"
              >
                查看并管理项目
              </Link>
              <LogoutButton />
              {/* <Link
                href="/"
                onClick={clearAdminKey}
                className="flex items-center justify-center rounded-lg bg-gray-600 px-4 py-3 text-center font-medium text-white hover:bg-gray-700"
              >
                退出登录
              </Link> */}
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold">管理提示</h2>
            <ul className="list-inside list-disc space-y-2">
              <li>您的管理员身份已通过密钥验证</li>
              <li>创建和编辑项目时将自动使用已验证的密钥</li>
              <li>您可以在项目列表页面添加、编辑或删除项目</li>
              <li>如需清除管理员凭证，请在安全场所手动清除浏览器存储</li>
              <li>请勿在公共场所使用管理功能</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminVerifyWrapper>
  );
}
