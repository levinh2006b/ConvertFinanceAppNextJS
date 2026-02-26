import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt.util';
import { findUserService } from '@/lib/group.service'; // Hoặc tên service tương ứng trong file cũ của bạn
import connectDatabase from '@/lib/database.config'; // 1. Import


export async function GET(request) {
    try {
        await connectDatabase(); // 2. Gọi hàm
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith("Bearer ")) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const decoded = verifyToken(authHeader.split(" ")[1], process.env.JWT_SECRET);
        if (!decoded || decoded instanceof Error) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // Lấy chữ tìm kiếm từ URL (Ví dụ: /api/group/find?username=nguyenvana)
        const username = request.nextUrl.searchParams.get("username");
        
        const user = await findUserService(username);
        return NextResponse.json({ message: "Find successfully", data: user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}