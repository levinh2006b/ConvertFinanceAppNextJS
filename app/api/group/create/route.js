import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt.util';
import { createGroupService } from '@/lib/group.service';

export async function POST(request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith("Bearer ")) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const decoded = verifyToken(authHeader.split(" ")[1], process.env.JWT_SECRET);
        if (!decoded || decoded instanceof Error) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const group = await createGroupService({ ...body, createdBy: decoded.id });
        
        return NextResponse.json({ message: "Create group successfully", data: group }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}