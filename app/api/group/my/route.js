import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt.util';
import { getMyGroupsService } from '@/lib/group.service';

export async function GET(request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith("Bearer ")) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const decoded = verifyToken(authHeader.split(" ")[1], process.env.JWT_SECRET);
        if (!decoded || decoded instanceof Error) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const groups = await getMyGroupsService(decoded.id);
        return NextResponse.json({ message: "Get my groups successfully", data: groups }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}