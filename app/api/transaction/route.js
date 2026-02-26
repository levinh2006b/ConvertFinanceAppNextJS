import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt.util';
import { getTransactionsByFilterService, createTransactionService } from '@/lib/transaction.service';
import connectDatabase from '@/lib/database.config';


// Xử lý Lấy danh sách (GET)
export async function GET(request) {
    try {

        await connectDatabase();
        
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith("Bearer ")) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const decoded = verifyToken(authHeader.split(" ")[1], process.env.JWT_SECRET);
        if (!decoded || decoded instanceof Error) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // Lấy period từ URL (VD: /api/transaction?period=7d)
        const period = request.nextUrl.searchParams.get("period");
        const transactions = await getTransactionsByFilterService(decoded.id, { period });
        
        return NextResponse.json({ message: "Get transactions successfully", data: transactions }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// Xử lý Tạo mới (POST)
export async function POST(request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith("Bearer ")) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const decoded = verifyToken(authHeader.split(" ")[1], process.env.JWT_SECRET);
        if (!decoded || decoded instanceof Error) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const groupId = request.nextUrl.searchParams.get("groupId");
        const body = await request.json();

        const transaction = await createTransactionService({
            ...body,
            userId: decoded.id,
            groupId: groupId
        });
        
        return NextResponse.json({ message: "Create transaction successfully", data: transaction }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}