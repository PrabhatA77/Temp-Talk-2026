import mongoose, { mongo } from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PersistentRoom",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    
    reactions: [
      {
        emoji: String, 
        users: [mongoose.Schema.Types.ObjectId], 
      },
    ],

    fileUrl:{type:String,default:""},
    filePublicId:{type:String,default:""},
    fileName:{type:String,default:""},
    fileType:{type:String,default:""},
  },
  { timestamps: true },
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
