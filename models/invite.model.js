import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
    groupId:{type:mongoose.Schema.Types.ObjectId,ref:"Group",required:true},
    inviterId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    inviteeId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}
},{timestamps:true,versionKey:false});

const Invite = mongoose.models.Invite || mongoose.model('Invite', inviteSchema);

export default Invite;
