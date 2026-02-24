import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt.util';
import { downloadExcelService } from '@/lib/transaction.service';

export async function GET(request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith("Bearer ")) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const decoded = verifyToken(authHeader.split(" ")[1], process.env.JWT_SECRET);
        if (!decoded || decoded instanceof Error) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const period = request.nextUrl.searchParams.get("period");
        
        // Nhận buffer file Excel từ service
        const fileBuffer = await downloadExcelService(decoded.id, { period });

        // Trả về file tải xuống trong Next.js
        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Disposition': 'attachment; filename="transactions.xlsx"',
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
        });
    } catch (error) {
        return NextResponse.json({ message: "Download failed" }, { status: 500 });
    }
}