import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt.util';
import { getAvatarService } from '@/lib/auth.service';
import connectDatabase from '@/lib/database.config';

export async function GET(request) {
    try {
        await connectDatabase();
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith("Bearer ")) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const decoded = verifyToken(authHeader.split(" ")[1], process.env.JWT_SECRET);
        if (!decoded || decoded instanceof Error) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const avatar = await getAvatarService(decoded.id);
        return NextResponse.json({ message: "Get avatar successfully", data: avatar }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}