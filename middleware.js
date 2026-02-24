import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value; // Lấy token từ cookie
  const { pathname } = request.nextUrl;

  // 1. Nếu cố vào Dashboard mà không có token -> Về trang Login
  if (!token && (pathname.startsWith('/expense') || pathname.startsWith('/group'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Nếu đã đăng nhập mà cố vào Login/Signup -> Về Dashboard
  if (token && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Chỉ chạy middleware cho các đường dẫn này
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};