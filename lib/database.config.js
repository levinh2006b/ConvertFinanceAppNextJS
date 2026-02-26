import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI; // Nhớ đổi đúng tên biến môi trường của bạn trong file .env

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Tạo một biến cache toàn cục để Next.js không tạo ra hàng nghìn kết nối
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDatabase() {
    // Nếu đã có kết nối sẵn từ trước thì dùng lại luôn, không tạo mới
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log("Đã kết nối MongoDB thành công!");
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDatabase;