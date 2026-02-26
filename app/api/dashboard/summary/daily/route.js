import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt.util';
import { getDailySummaryService } from '@/lib/dashboard.service';
import connectDatabase from '@/lib/database.config'; // 1. Import

export async function GET(request) {
    try {
        await connectDatabase(); // 2. Gọi hàm
        // 1. Kiểm tra JWT
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith("Bearer ")) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const decoded = verifyToken(authHeader.split(" ")[1], process.env.JWT_SECRET);
        if (!decoded || decoded instanceof Error) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // 2. Lấy query parameters (ví dụ: ?period=7d)
        const period = request.nextUrl.searchParams.get("period");

        // 3. Gọi Service
        const dailySummary = await getDailySummaryService(decoded.id, period);
        
        return NextResponse.json({ message: "Get daily summary successfully", data: dailySummary }, { status: 200 });
    } catch (error) {
        console.error("Dashboard Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}