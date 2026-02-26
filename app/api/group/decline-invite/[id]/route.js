import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt.util';
import { declineInviteService } from '@/lib/group.service';
import connectDatabase from '@/lib/database.config'; // 1. Import

export async function POST(request, { params }) {
    try {
        await connectDatabase(); // 2. Gọi hàm
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith("Bearer ")) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const decoded = verifyToken(authHeader.split(" ")[1], process.env.JWT_SECRET);
        if (!decoded || decoded instanceof Error) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const inviteId = params.id; // Lấy ID của lời mời từ URL
        
        const result = await declineInviteService(inviteId, decoded.id);
        return NextResponse.json({ message: "Decline invite successfully", data: result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}