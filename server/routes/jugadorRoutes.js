import { Router } from "express";
import {
  getPlayer,
  getPlayers,
  createPlayer,
  updatePlayer,
  deletePlayer,
} from "../controllers/jugadorController.js";

const router = Router();

router.get("/jugadores", getPlayers);
router.get("/jugador/:id", getPlayer);
router.post("/jugador", createPlayer);
router.put("/jugador/:id", updatePlayer);
router.delete("/jugador/:id", deletePlayer);

export default router;
