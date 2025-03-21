// 管理员密钥本地存储名称
const ADMIN_KEY_STORAGE = "dev_showcase_admin_key";

/**
 * 保存管理员密钥到本地存储
 */
export function saveAdminKey(key: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(ADMIN_KEY_STORAGE, key);
  }
}

/**
 * 从本地存储获取管理员密钥
 */
export function getAdminKey(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(ADMIN_KEY_STORAGE);
  }
  return null;
}

/**
 * 清除本地存储的管理员密钥
 */
export function clearAdminKey(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ADMIN_KEY_STORAGE);
  }
}

/**
 * 检查是否已经保存了管理员密钥
 */
export function hasAdminKey(): boolean {
  return getAdminKey() !== null;
}

/**
 * 将管理员密钥添加到请求数据中
 * 用于创建、更新和删除项目时自动添加密钥
 */
export function withAdminKey<T extends Record<string, unknown>>(
  data: T,
): T & { adminKey: string } {
  const adminKey = getAdminKey();

  if (!adminKey) {
    throw new Error("未找到管理员密钥，请先验证身份");
  }

  return {
    ...data,
    adminKey,
  };
}
