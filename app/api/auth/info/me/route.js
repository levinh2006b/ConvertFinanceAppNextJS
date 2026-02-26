import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt.util';
import { authGetInfoService } from '@/lib/auth.service';
import connectDatabase from '@/lib/database.config';

export async function GET(request) {
    try {
        await connectDatabase();
        // 1. Kiểm tra JWT (Thay thế authMiddleware)
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized: No token provided" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token, process.env.JWT_SECRET);
        if (!decoded || decoded instanceof Error) {
            return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
        }

        // 2. Lấy thông tin User dựa vào ID trong Token
        const user = await authGetInfoService(decoded.id);
        
        return NextResponse.json({ message: "Get info successfully", data: user }, { status: 200 });
    } catch (error) {
        console.error("Get Info Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}