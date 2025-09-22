import express from "express";
import { createPlayer, deletePlayer, getAllPlayers, getByIdPlayers, updatePlayer } from "../controllers/playersController.js";

const router = express.Router()

router.get("/", getAllPlayers);
router.get("/:id", getByIdPlayers);
router.post("/", createPlayer);
router.delete("/:id", deletePlayer);
router.put("/:id", updatePlayer);

export default router 