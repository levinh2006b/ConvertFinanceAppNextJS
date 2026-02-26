import { NextResponse } from 'next/server';
import { authGetInfoService } from '@/lib/auth.service';
import { verifyToken } from '@/lib/jwt.util'; // Hàm verify token tự viết ở bước trước
import connectDatabase from '@/lib/database.config';

export async function GET(request) {
    try {
        await connectDatabase();
        // Tự động kiểm tra Token (thay cho authMiddleware cũ)
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith("Bearer ")) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        
        const decoded = verifyToken(authHeader.split(" ")[1], process.env.JWT_SECRET);
        if (!decoded || decoded instanceof Error) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // Lấy thông tin dựa trên ID giải mã từ token
        const user = await authGetInfoService(decoded.id);
        return NextResponse.json({ message: "Get info successfully", data: user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}   