import { NextResponse } from 'next/server';
import { authLoginSchema } from '@/lib/auth.schema'; // Đổi đường dẫn theo dự án của bạn
import { authLoginService } from '@/lib/auth.service'; 

export async function POST(request) {
    try {
        const body = await request.json();

        // 1. Zod Validation
        const validation = authLoginSchema.safeParse(body);
        if (!validation.success) {
            const errorMessage = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join("; ");
            return NextResponse.json({ message: errorMessage }, { status: 400 });
        }

        // 2. Xử lý Logic Login
        const { user, accessToken } = await authLoginService(body);
        if (!user || !accessToken) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
        }

        return NextResponse.json({ message: "Login successfully", data: { user, accessToken } }, { status: 200 });
    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ message: "Email or password is incorrect" }, { status: 400 });
    }
}