import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cấu hình kết nối Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
    try {
        // 1. Đọc file ảnh từ form gửi lên
        const data = await request.formData();
        const file = data.get("avatar"); // Ở FE bạn đang gửi file với tên field là 'avatar'

        if (!file) {
            return NextResponse.json({ message: "No file uploaded." }, { status: 400 });
        }

        // 2. Biến file thành Buffer (chuỗi dữ liệu thô) để Next.js hiểu
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 3. Đẩy thẳng Buffer lên Cloudinary bằng stream
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    transformation: { width: 800, height: 800, crop: "fill", gravity: "auto" }
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        // 4. Trả về đường link ảnh thành công
        return NextResponse.json({ message: "File uploaded successfully.", url: uploadResult.secure_url }, { status: 200 });

    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}