import express from "express";
import {createTempRoom,getTempRoom, getTempRoomParticipants,extendTempRoom} from "../Controllers/tempRoomController.js";
import { validate } from "../MiddleWare/validate.js";
import { createTempRoomSchema, joinTempRoomSchema } from "../Schemas/tempRoomSchema.js";

const router = express.Router();

router.post("/",validate(createTempRoomSchema),createTempRoom);
router.get("/:roomId",getTempRoom);

router.get("/:roomId/participants",getTempRoomParticipants);

router.patch("/:roomId/extend",extendTempRoom);

export default router;