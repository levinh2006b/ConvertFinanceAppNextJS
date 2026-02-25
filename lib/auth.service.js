import User from "@/models/user.model";
import { hashPassword, comparePassword } from "@/lib/pass-handle.util";
import { generateToken } from "@/lib/jwt.util";
import mongoose from "mongoose";

const throwError = (statusCode, message) => {
    const error = new Error(message);
    error.status = statusCode;
    throw error;
};


export const authRegisterService = async(userData)=>{
    const {username,email,password} = userData;
    const hashedPassword = hashPassword(password);

    const existingUser = await User.findOne({ 
    $or: [{ email: userData.email }, { username: userData.username }] 
});

if (existingUser) {
    // Tự tạo lỗi để báo về cho Frontend biết là tài khoản đã tồn tại
    const error = new Error("Email or Username already exists");
    error.status = 400;
    throw error;
}

// Sau đó mới chạy dòng User.create cũ
   const newUser = await User.create({...userData, password: hashedPassword});

    const userResponse = newUser.toObject();
	userResponse.password = undefined;
    return userResponse;   
}

export const authLoginService = async (userData) => {
	const { email, password } = userData;
	const existingUser = await User.findOne({ email });
	if (!existingUser) {
		throwError(400, "Invalid credentials");
	}
	const isPasswordValid = comparePassword(password, existingUser.password);
	if (!isPasswordValid) {
		throwError(400, "Invalid credentials");
	}
	const accessToken = generateToken({ id: existingUser._id,username:existingUser.username,email:existingUser.email,role:existingUser.role});
	const userResponse = existingUser.toObject();
	userResponse.password = undefined;
	return { user: userResponse, accessToken };
};

export const authGetInfoService = async (userId) => {
	if (!mongoose.Types.ObjectId.isValid(userId)) {
		return throwError(400, 'Invalid user ID format');
	}
    const user = await User.findById(userId);
    if(!user){
        throwError(404,"User not found");
    }
	const userResponse = user.toObject();
	userResponse.password = undefined;
	return userResponse;
};

export const authChangePasswordService = async (userId, passwords) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return throwError(400, 'Invalid user ID format');
    }
	const user = await User.findById(userId);
	if(!user){
		return throwError(404,"User not found");
	}
    const {oldPassword,newPassword} = passwords;
	if(!oldPassword||!newPassword){
		return throwError(400,"Old password and new password are required");
	}
	const oldPasswordValid = comparePassword(oldPassword,user.password);
	if(!oldPasswordValid){
		return throwError(400,"Invalid old password");
	}
	if(oldPassword === newPassword){
		return throwError(400,"New password must be different from old password");
	}
	user.password = hashPassword(newPassword);
	await user.save();
	const userResponse = user.toObject();
	userResponse.password = undefined;
	return userResponse;
};

export const authGetInfosService = async()=>{
    const users = await User.find().select("-password");
    if(!users){
        throwError(404,"No user found");
    }
    return users;
}
export const updateProfileService = async (userId,username,email,profilePic) => {
    const user = await User.findById(userId);
    if(!user){
        return throwError(404,"User not found");
    }
    if(username){
        user.username = username;
    }
    if(email){
        user.email = email;
    }
    if(profilePic){
        user.profilePic = profilePic;
    }
    await user.save();
    const userResponse = user.toObject();
    userResponse.password = undefined;
    return userResponse;
}

export const getAvatarService = async (userId) => {
    const user = await User.findById(userId, 'profilePic');

    if (!user) {
        return throwError(404, "User not found");
    }
    
    return user.profilePic;
}
