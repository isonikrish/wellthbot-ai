import { endOfDay, startOfDay } from "date-fns";
import prisma from "../lib/prisma";

export async function handleCreateRitual(req: any, res: any) {
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

    const { title, ritualType, duration, ritualSteps, notes } = data;

    const ritual = await prisma.ritual.create({
      data: {
        title,
        ritualType,
        duration,
        ritualSteps,
        notes,
        userId: user?.id,
      },
    });

    if (!ritual)
      return res.status(400).json({ msg: "Failed to create ritual" });
    return res.status(200).json({ msg: "Ritual Created" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
export async function handleStartRitual(req: any, res: any) {
  const userId = req.user;
  const ritualId = parseInt(req.params.id);
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
    if (!ritualId)
      return res.status(400).json({ msg: "Ritual id not provided" });

    const ritual = await prisma.ritual.findUnique({
      where: {
        id: ritualId,
      },
    });

    if (!ritual) return res.status(400).json({ msg: "Ritual not found" });

    if (user.id !== ritual.userId) {
      return res.status(400).json({ msg: "Unauthorised" });
    }

    const now = new Date();
    const normalizedDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const existingLog = await prisma.ritualLog.findFirst({
      where: {
        ritualId,
        date: normalizedDate,
      },
    });

    if (existingLog) {
      return res.status(400).json({ msg: "Ritual is already started/ended" });
    }

    await prisma.ritualLog.create({
      data: {
        ritualId: ritual.id,
        status: "STARTED",
        startedAt: now,
      },
    });
    return res.status(200).json({ msg: "Ritual Started" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function handleEndRitual(req: any, res: any) {
  const userId = req.user;
  const ritualId = parseInt(req.params.id);
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
    if (!ritualId)
      return res.status(400).json({ msg: "Ritual id not provided" });

    const ritual = await prisma.ritual.findUnique({
      where: {
        id: ritualId,
      },
    });

    if (!ritual) return res.status(400).json({ msg: "Ritual not found" });

    if (user.id !== ritual.userId) {
      return res.status(400).json({ msg: "Unauthorised" });
    }
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());
    const existingLog = await prisma.ritualLog.findFirst({
      where: {
        ritualId,
        date: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });
    if (!existingLog) {
      return { error: "You have not started this ritual." };
    }

    await prisma.ritualLog.update({
      where: { id: existingLog.id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });


    return res.status(200).json({msg: "Ritual Ended"});
  } catch (error) {
    return res.status(500).json({ msg: "Interna l Server Error" });
  }
}
