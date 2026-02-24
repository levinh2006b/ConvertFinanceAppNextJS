import "./globals.css"; // Chứa CSS Tailwind của bạn
import { UserContextProvider } from "@/context/userContext";

export const metadata = {
  title: "Finance App",
  description: "Quản lý tài chính cá nhân",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Bọc toàn bộ ứng dụng bằng Context giống như bên MERN cũ */}
        <UserContextProvider>
          {children}
        </UserContextProvider>
      </body>
    </html>
  );
}