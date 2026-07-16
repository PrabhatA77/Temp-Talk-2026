import mongoose from "mongoose";
import {generateRoomId} from "../Utils/generateRoomId.js";

const persistentRoomSchema = new mongoose.Schema({

    roomCode:{
        type:String,
        unique:true,
        default:()=>generateRoomId(),
    },

    name:{
        type:String,
        required:true,
        trim:true
    },

    description:{
        type:String,
        trim:true,
        default:""
    },

    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    members : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    ],

    admins : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    
    blockedUsers: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        }
    ],

    mood:{
        label:{type:String,default:""},
        emoji:{type:String,default:""},
        confidence:{type:Number,default:0},
        description:{type:String,default:""},
        updatedAt:{type:Date,default:null},
    },

    lastActivity:{
        type:Date,
        default:Date.now,
    }
},
{ timestamps:true }
)

persistentRoomSchema.index({members:1});
persistentRoomSchema.index({lastActivity:-1});

const PersistentRoom = mongoose.model("PersistentRoom",persistentRoomSchema);

export default PersistentRoom;