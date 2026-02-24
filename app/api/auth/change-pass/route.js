import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt.util';
import { authChangePasswordService } from '@/lib/auth.service';

export async function PUT(request) {
    try {
        // 1. Kiểm tra JWT
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token, process.env.JWT_SECRET);
        if (!decoded || decoded instanceof Error) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // 2. Đọc Body
        const body = await request.json();

        // 3. Gọi Service
        const user = await authChangePasswordService(decoded.id, body);
        
        return NextResponse.json({ message: "Change password successfully", data: user }, { status: 200 });
    } catch (error) {
        console.error("Change Pass Error:", error);
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}