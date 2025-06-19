import express from 'express';
import { handleFetchUser, handleGetMyHabits, handleGetMyLifeEvents, handleGetMyMoodLogs, handleGetMyRituals, handleUserLogin, handleUserSignup } from '../controllers/user';
import { protectRoute } from '../lib/getToken';

const router = express.Router();

router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
router.get("/get-user", protectRoute, handleFetchUser)
router.get("/my-rituals", protectRoute, handleGetMyRituals)
router.get("/my-habits", protectRoute, handleGetMyHabits);
router.get("/my-lifeevents", protectRoute, handleGetMyLifeEvents);
router.get("/my-moodlogs", protectRoute, handleGetMyMoodLogs);



export default router;