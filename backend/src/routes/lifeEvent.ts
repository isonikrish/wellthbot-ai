import express from 'express';
import { handleCreateLifeEvent, handleDeleteLifeEvent } from '../controllers/liveEvent';
import { protectRoute } from '../lib/getToken';
const router = express.Router()

router.post("/create", protectRoute, handleCreateLifeEvent);
router.delete("/delete/:id",protectRoute, handleDeleteLifeEvent);


export default router;