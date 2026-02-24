import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt.util';
import { getGroupTransactionService } from '@/lib/transaction.service';

export async function GET(request, { params }) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith("Bearer ")) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const decoded = verifyToken(authHeader.split(" ")[1], process.env.JWT_SECRET);
        if (!decoded || decoded instanceof Error) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const groupId = params.id; // Lấy ID từ URL
        const period = request.nextUrl.searchParams.get("period");
        const type = request.nextUrl.searchParams.get("type");

        const groupTransaction = await getGroupTransactionService(groupId, { period, type });
        
        return NextResponse.json({ message: "Get group transaction successfully", data: groupTransaction }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}                       