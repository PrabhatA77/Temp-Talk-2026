import express from "express";
import verifyToken from "../MiddleWare/verifyToken.js"
import {validate} from "../MiddleWare/validate.js"
import { createPersistentRoomSchema,joinPersistentRoomSchema } from "../Schemas/persistentRoomSchema.js";
import { createPersistentRoom,getPersistentRooms,joinPersistentRoom,getRoomMessages, getRoomByCode,getRoomById,sendFileMessage } from "../Controllers/persistentRoomController.js";
import { leaveRoom,deleteRoom,promoteAdmin,kickMember ,blockMember} from "../Controllers/roomMembershipController.js";
import upload from "../MiddleWare/multer.js";

const router = express.Router();


router.use(verifyToken);

router.post("/",validate(createPersistentRoomSchema),createPersistentRoom);
router.get("/",getPersistentRooms);
router.post("/join",validate(joinPersistentRoomSchema),joinPersistentRoom);
router.get("/:roomId/messages",getRoomMessages);
router.get("/code/:roomCode",getRoomByCode);

router.post("/:roomId/leave",leaveRoom);
router.delete("/:roomId",deleteRoom);
router.post("/:roomId/promote", promoteAdmin);

router.get("/:roomId", getRoomById);

router.post("/:roomId/image",upload.single("file"),sendFileMessage);


router.post("/:roomId/kick", kickMember);   
router.post("/:roomId/block", blockMember); 

export default router;