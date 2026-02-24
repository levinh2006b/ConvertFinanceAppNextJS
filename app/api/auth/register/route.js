import { NextResponse } from 'next/server';
import { authRegisterService } from '@/lib/auth.service'; // Chỉnh lại đường dẫn tới file service của bạn

export async function POST(request) {
    try {
        const body = await request.json();
        const registerResponse = await authRegisterService(body);   
        
        if (!registerResponse) {
            return NextResponse.json({ message: "Email already exists" }, { status: 400 });
        }
        return NextResponse.json({ message: "Register successfully", data: registerResponse }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}