import { NextResponse } from 'next/server';
import { authRegisterSchema } from '@/lib/auth.schema'; // Đảm bảo bạn đã copy file auth.schema.js vào thư mục lib hoặc models
import { authRegisterService } from '@/lib/auth.service'; // Đường dẫn tới file chứa logic database của bạn

export async function POST(request) {
    try {
        const body = await request.json(); // Nhận dữ liệu người dùng gửi lên

        // 1. Kiểm tra dữ liệu bằng Zod (thay thế valid-body middleware)
        const validation = authRegisterSchema.safeParse(body);
        if (!validation.success) {
            // Nếu lỗi, gom các thông báo lỗi lại và trả về 400
            const errorMessage = validation.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join("; ");
            return NextResponse.json({ message: errorMessage }, { status: 400 });
        }

        // 2. Dữ liệu đúng thì gọi Service để lưu vào Database
        const registerResponse = await authRegisterService(body);
        
        if (!registerResponse) {
            return NextResponse.json({ message: "Email already exists" }, { status: 400 });
        }

        return NextResponse.json({ message: "Register successfully", data: registerResponse }, { status: 200 });

    } catch (error) {
        console.error("Register Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}