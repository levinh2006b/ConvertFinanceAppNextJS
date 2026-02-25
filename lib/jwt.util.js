import jwt from "jsonwebtoken";

// Không cần import JWT_SECRET từ file ngoài nữa, Next.js tự động đọc từ file .env
// Lấy secret từ file .env, nếu không có thì dùng "default_secret" tạm thời
const SECRET_KEY = process.env.JWT_SECRET || "default_secret";

export const generateToken = (payload, secret = SECRET_KEY, expiresIn) => {
   return jwt.sign(payload, secret, { expiresIn: expiresIn || "7d" });
}

export const verifyToken = (token, secret = SECRET_KEY) => {
   return jwt.verify(token, secret);
}