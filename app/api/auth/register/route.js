import { NextResponse } from 'next/server';
import { authRegisterService } from '@/lib/auth.service'; 
import connectDB from '@/lib/database.config'; // 1. Import hàm kết nối DB

export async function POST(request) {
    try {
        await connectDB(); // 2. BẮT BUỘC gọi kết nối DB trước khi làm việc khác

        const body = await request.json();
        const registerResponse = await authRegisterService(body);   
        
        if (!registerResponse) {
            return NextResponse.json({ message: "Email already exists" }, { status: 400 });
        }
        return NextResponse.json({ message: "Register successfully", data: registerResponse }, { status: 200 });
    } catch (error) {
        console.error("LỖI ĐĂNG KÝ BACKEND:", error); 
        // Lấy mã status từ service truyền sang (400), nếu không có thì mặc định là 500
        const statusCode = error.status || 500; 
        return NextResponse.json(
            { message: error.message || "Internal Server Error" }, 
            { status: statusCode }
        );
    }
}