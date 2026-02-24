import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",default:null},
    groupId:{type:mongoose.Schema.Types.ObjectId,ref:"Group",default:null},
    amount:{type:Number,required:true},
    type:{type:String,enum:["income","expense"],required:true},
    category:{type:String,required:true},
    description:{type:String},
    date:{type:Date,default:Date.now}
},{timestamps:true,versionKey:false});


const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);


export default Transaction;
