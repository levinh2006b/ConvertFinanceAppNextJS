import { NextResponse } from 'next/server';
import { authLoginService } from '@/lib/auth.service';
import connectDatabase from '@/lib/database.config';

export async function POST(request) {
    try {
        await connectDatabase();
        
        const body = await request.json();
        const { user, accessToken } = await authLoginService(body);
        
        if (!user || !accessToken) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
        }

        // Tạo một Response chuẩn bị trả về
        const response = NextResponse.json({ message: "Login successfully", data: { user, accessToken } }, { status: 200 });

        // Gắn token vào Cookie của Response
        response.cookies.set({
            name: 'token',
            value: accessToken,
            httpOnly: false, // Để false nếu frontend của bạn cần lấy token này từ cookie
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // 30 ngày
        });

        return response;

    } catch (error) {
        return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    }
}