import "@/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "开发者作品展示",
  description: "展示个人开发项目的作品集",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6">
              <div className="text-muted-foreground container mx-auto px-4 text-center text-sm">
                © {new Date().getFullYear()} 开发者作品展示. 保留所有权利.
              </div>
            </footer>
          </div>
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
