import mongoose from "mongoose";

const tempRoomSchema = new mongoose.Schema({
    roomId:{type:String,required:true,unique:true},
    topic:{type:String,default:"General Chat"},
    creatorName:{type:String,required:true},
    isExtended:{type:Boolean,default:false},
    maxParticipants:{type:Number,default:10},
    expiresAt:{type:Date,required:true},
    createdAt:{type:Date,default:Date.now}
});

tempRoomSchema.index({expiresAt:1},{expireAfterSeconds:0});

export default mongoose.model('TempRoom',tempRoomSchema);