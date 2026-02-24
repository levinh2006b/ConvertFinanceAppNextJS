import { NextResponse } from 'next/server';
import { authLoginService } from '@/lib/auth.service';

export async function POST(request) {
    try {
        const body = await request.json();
        const { user, accessToken } = await authLoginService(body);
        
        if (!user || !accessToken) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
        }
        return NextResponse.json({ message: "Login successfully", data: { user, accessToken } }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    }
}