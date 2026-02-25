import mongoose from "mongoose";

const USER_ROLE = {
    USER: "user",
    ADMIN: "admin"
};

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone: {type: String,default:""},  
    role:{type:String, enum:Object.values(USER_ROLE), default:USER_ROLE.USER},
    profilePic:{type:String, default: null},
    restricted:{type:Boolean, default:false}
},
{
    timestamps:true, 
    versionKey:false
});


const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;