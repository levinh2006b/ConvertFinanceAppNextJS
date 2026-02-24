import { createResponse } from "../../common/configs/response.config.js";
import { authRegisterService, authLoginService, authGetInfoService,authChangePasswordService,authGetInfosService,updateProfileService,getAvatarService } from "./auth.service.js";
import handleAsync from "../../common/utils/handle-async.util.js";


export const authRegister = handleAsync(async(req,res)=>{
    const userData = req.body;
    const registerResponse = await authRegisterService(userData);   
    if(!registerResponse){
        return createResponse(res,400,"Email already exists");
    }
    return createResponse(res,200,"Register successfully",registerResponse);
});

export const authLogin = handleAsync(async(req, res) =>{
    const userData = req.body;
    const {user,accessToken} = await authLoginService(userData);
    if(!user||!accessToken){
        return createResponse(res,400,"Invalid credentials");
    }
    return createResponse(res,200,"Login successfully",{user,accessToken});
});

export const authGetMyInfo = handleAsync(async(req,res)=>{
    const user = await authGetInfoService(req.user.id);
    return createResponse(res,200,"Get info successfully",user);
});

export const authChangeMyPassword = handleAsync(async(req,res)=>{
    const user = await authChangePasswordService(req.user.id,req.body);
    return createResponse(res,200,"Change password successfully",user);
});

export const authGetInfo = handleAsync(async(req,res)=>{
    const user = await authGetInfoService(req.params.id);
    return createResponse(res,200,"Get info successfully",user);
});

export const authGetInfos = handleAsync(async(req,res)=>{
    const users = await authGetInfosService();
    return createResponse(res,200,"Get info successfully",users);
});

export const authUpdateProfile = handleAsync(async(req,res)=>{
    const user = await updateProfileService(req.user.id,req.body.username,req.body.email,req.body.profilePic);
    return createResponse(res,200,"Update profile successfully",user);
});

export const authGetAvatar = handleAsync(async(req,res)=>{
    const avatar = await getAvatarService(req.user.id);
    return createResponse(res,200,"Get avatar successfully",avatar);
});