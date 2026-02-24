import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt.util';
import { sendInviteService } from '@/lib/group.service';

export async function POST(request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith("Bearer ")) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const decoded = verifyToken(authHeader.split(" ")[1], process.env.JWT_SECRET);
        if (!decoded || decoded instanceof Error) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        
        // Truyền thêm ID của người gửi (chính là bạn) vào dữ liệu
        const invite = await sendInviteService({ ...body, senderId: decoded.id });
        
        return NextResponse.json({ message: "Send invite successfully", data: invite }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}