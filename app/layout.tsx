import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 1. Import UserProvider từ file context của bạn 
// (Sử dụng đúng tên UserProvider mà bạn đã 'export default' ở file context)
import UserProvider from "@/context/userContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finance App", 
  description: "Quản lý tài chính cá nhân",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 2. Bọc Provider xung quanh toàn bộ giao diện */}
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}