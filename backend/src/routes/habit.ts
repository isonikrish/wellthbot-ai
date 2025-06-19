import express from 'express'
import { protectRoute } from '../lib/getToken';
import { handleCompleteHabit, handleCreateHabit } from '../controllers/habit';
const router = express.Router();

router.post("/create", protectRoute, handleCreateHabit);
router.post("/complete/:id", protectRoute, handleCompleteHabit)

export default router;