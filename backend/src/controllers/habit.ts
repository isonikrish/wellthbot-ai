import prisma from "../lib/prisma";
import { startOfDay } from "date-fns";
export async function handleCreateHabit(req: any, res: any) {
  const userId = req.user;
  const data = req.body;
  try {
    if (!userId) {
      return res.status(400).json({ msg: "Unauthorised" });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });
    if (!user) return res.status(400).json({ msg: "No user found" });

    const { title } = data;

    await prisma.habit.create({
      data: {
        title,
        userId: user?.id,
      },
    });
    return res.status(200).json({ msg: "Habit Created" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
export async function handleCompleteHabit(req: any, res: any) {
  const userId = req.user;
  const data = req.body;
  const habitId = parseInt(req.params.id);
  try {
    if (!userId) {
      return res.status(400).json({ msg: "Unauthorised" });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });
    if (!user) return res.status(400).json({ msg: "No user found" });
    if (!habitId) return res.status(400).json({ msg: "Habit id not provided" });

    const habit = await prisma.habit.findUnique({
      where: {
        id: habitId,
      },
    });
    if (!habit) return res.status(400).json({ msg: "Habit not found" });
    if (user.id !== habit.userId)
      return res.status(400).json({ msg: "Unauthorised" });

    const today = startOfDay(new Date());
    const existingLog = await prisma.habitLog.findFirst({
      where: {
        habitId,
        date: today,
      },
    });

    if (existingLog) {
      return res.status(400).json({ msg: "Habit already completed today" });
    }
    await prisma.habitLog.create({
      data: {
        habitId: habit.id,
        date: today,
      },
    });

    return res.status(200).json({ msg: "Completed" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
