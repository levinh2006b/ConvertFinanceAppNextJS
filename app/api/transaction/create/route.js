import { NextResponse } from 'next/server';
import { transactionSchema } from '@/lib/transaction.schema';
import { verifyToken } from '@/lib/jwt.util';
import { createTransactionService } from '@/lib/transaction.service';
import connectDatabase from '@/lib/database.config'; // 1. Import

export async function POST(request) {
    try {
        await connectDatabase(); // 2. Gọi hàm
        // 1. Kiểm tra người dùng đã đăng nhập chưa (Thay thế authMiddleware)
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized: No token provided" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token, process.env.JWT_SECRET);
        
        // Nếu token sai hoặc hết hạn
        if (!decoded || decoded instanceof Error) {
            return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
        }

        // 2. Lấy dữ liệu gửi lên
        const groupId = request.nextUrl.searchParams.get("groupId"); // Lấy groupId từ URL (nếu có)
        const body = await request.json();

        // 3. Kiểm tra dữ liệu Zod
        const validation = transactionSchema.safeParse(body);
        if (!validation.success) {
            const errorMessage = validation.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join("; ");
            return NextResponse.json({ message: errorMessage }, { status: 400 });
        }

        // 4. Lưu vào Database
        const transaction = await createTransactionService({
            ...body,
            userId: decoded.id, // Lấy ID của user từ token
            groupId: groupId
        });

        return NextResponse.json({ message: "Create transaction successfully", data: transaction }, { status: 200 });

    } catch (error) {
        console.error("Create Transaction Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}