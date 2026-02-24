import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt.util';
import { getMyGroupService } from '@/lib/group.service';

// Nhận tham số động qua biến 'params'
export async function GET(request, { params }) {
    try {
        // 1. Kiểm tra JWT
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith("Bearer ")) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const decoded = verifyToken(authHeader.split(" ")[1], process.env.JWT_SECRET);
        if (!decoded || decoded instanceof Error) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // 2. Lấy ID từ params (params.id tương ứng với tên thư mục [id])
        const groupId = params.id;

        // 3. Gọi Service
        const group = await getMyGroupService(groupId);
        
        return NextResponse.json({ message: "Get my group successfully", data: group }, { status: 200 });
    } catch (error) {
        console.error("Get Group Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}