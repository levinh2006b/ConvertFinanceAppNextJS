import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt.util';
import { getIncomeService } from '@/lib/transaction.service';

export async function GET(request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith("Bearer ")) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const decoded = verifyToken(authHeader.split(" ")[1], process.env.JWT_SECRET);
        if (!decoded || decoded instanceof Error) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const period = request.nextUrl.searchParams.get("period");
        const income = await getIncomeService(decoded.id, period);
        
        return NextResponse.json({ message: "Get income successfully", data: income }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}