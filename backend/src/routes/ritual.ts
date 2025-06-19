import express from 'express';
import { protectRoute } from '../lib/getToken';
import { handleCreateRitual, handleEndRitual, handleStartRitual } from '../controllers/ritual';

const router = express.Router()

router.post("/create", protectRoute, handleCreateRitual);
router.post("/start/:id", protectRoute, handleStartRitual);
router.post("/end/:id", protectRoute, handleEndRitual);


export default router;