import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt.util';
import { getAddSummaryService } from '@/lib/dashboard.service';
import connectDatabase from '@/lib/database.config'; // 1. Import

export async function GET(request) {
    try {
        await connectDatabase(); // 2. Gọi hàm
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith("Bearer ")) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const decoded = verifyToken(authHeader.split(" ")[1], process.env.JWT_SECRET);
        if (!decoded || decoded instanceof Error) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const period = request.nextUrl.searchParams.get("period");
        const addSummary = await getAddSummaryService(decoded.id, period);
        
        return NextResponse.json({ message: "Get add summary successfully", data: addSummary }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}