import { NextResponse } from 'next/server';
import connectDatabase from '@/lib/database.config';
import { verifyToken } from '@/lib/jwt.util';
import { getMyGroupsService } from '@/lib/group.service';

export async function GET(request) {
    try {
        await connectDatabase(); 

        // 1. Kiểm tra Token gửi lên
        const authHeader = request.headers.get('authorization'); // Chữ a viết thường
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        
        // 2. Giải mã Token
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        
        // 3. Gọi Data
        const groups = await getMyGroupsService(decoded.id);
        return NextResponse.json({ message: "Success", data: groups }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Lỗi Server" }, { status: 500 });
    }
}