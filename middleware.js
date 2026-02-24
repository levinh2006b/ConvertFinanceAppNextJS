import { NextResponse } from 'next/server';

export function middleware(request) {
    // Lấy token từ Cookie trình duyệt
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // 1. Nếu chưa có token mà cố truy cập các trang Dashboard -> Đá về /login
    const isProtectedRoute = pathname === '/' || pathname.startsWith('/expense') || pathname.startsWith('/income') || pathname.startsWith('/group') || pathname.startsWith('/setting');
    
    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. Nếu đã có token (đã đăng nhập) mà cố vào lại trang /login hoặc /signup -> Đá về trang chủ (/)
    if (token && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// Cấu hình để middleware chạy trên mọi trang trừ API và file tĩnh (hình ảnh, css)
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};