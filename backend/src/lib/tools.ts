import prisma from "./prisma";
import { startOfDay, endOfDay } from "date-fns";

type EventDataType = {
  title: string;
  description: string;
  emotionType: string;
  userId: number;
};

type RitualDataType = {
  title: string;
  ritualType: string;
  duration: number;
  ritualSteps: string[];
  notes: string;
  userId: number;
};
type HabitDataType = {
  title: string;
  userId: number;
};
type MoodLogDataType = {
  userId: number;
  mood: string;
  energyLevel: number;
  stressLevel: number;
};

export async function getUserLifeEvents(userId: number) {
  try {
    const events = await prisma.lifeEvent.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return events;
  } catch (error) {
    return { error: "Failed to fetch life events" };
  }
}
export async function getUserRituals(userId: number) {
  try {
    const rituals = await prisma.ritual.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return rituals;
  } catch (error) {
    return { error: "Failed to fetch rituals" };
  }
}
export async function getUserMoodLog(userId: number) {
  try {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const moodLog = await prisma.moodLog.findFirst({
      where: {
        userId,
        date: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      orderBy: { date: "desc" },
    });
    return moodLog;
  } catch (error) {
    return { error: "Failed to fetch mood log" };
  }
}
export async function createLifeEvent(eventData: EventDataType) {
  try {
    const res = await prisma.lifeEvent.create({
      data: {
        title: eventData.title,
        description: eventData.description,
        emotionType: eventData.emotionType,
        userId: eventData.userId,
      },
    });

    if (!res) {
      return { error: "Event creation failed" };
    }
    return `I Created a live event titled ${res.title}`;
  } catch (error) {
    return { error: "Failed to create event" };
  }
}

export async function createRitual(ritualData: RitualDataType) {
  try {
    const res = await prisma.ritual.create({
      data: {
        title: ritualData.title,
        ritualType: ritualData.ritualType,
        duration: ritualData.duration,
        ritualSteps: ritualData.ritualSteps,
        notes: ritualData.notes,
        userId: ritualData.userId,
      },
    });

    return `I Created a ritual titled ${res.title}`;
  } catch (error) {
    return { error: "Failed to create ritual" };
  }
}

export async function updateUserMoodlog(data: MoodLogDataType) {
  try {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const existingLog = await prisma.moodLog.findFirst({
      where: {
        userId: data.userId,
        date: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });
    if (existingLog) {
      const updatedLog = await prisma.moodLog.update({
        where: { id: existingLog.id },
        data: {
          mood: data.mood,
          energyLevel: data.energyLevel,
          stressLevel: data.stressLevel,
        },
      });
      return updatedLog;
    } else {
      const newLog = await prisma.moodLog.create({
        data: {
          userId: data.userId,
          mood: data.mood,
          energyLevel: data.energyLevel,
          stressLevel: data.stressLevel,
        },
      });
      return `I Updated user mood to ${newLog.mood}, stress level ${newLog.stressLevel} and energy level ${newLog.energyLevel}`;
    }
  } catch (error) {
    return { error: "Failed to update mood log" };
  }
}

export async function startRitual(ritualId: number) {
  try {
    const ritual = await prisma.ritual.findUnique({
      where: {
        id: ritualId,
      },
    });

    if (!ritual) {
      return { error: "Ritual not found" };
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
      throw new Error("Log already exists for this ritual today.");
    }

    const ritualLog = await prisma.ritualLog.create({
      data: {
        ritualId: ritual.id,
        status: "STARTED",
        startedAt: now,
      },
    });

    return ritualLog;
  } catch (error) {
    return { error: "Failed to start ritual" };
  }
}
export async function endRitual(ritualId: number) {
  try {
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

    const updatedLog = await prisma.ritualLog.update({
      where: { id: existingLog.id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    return updatedLog;
  } catch (error) {
    return { error: "Failed to end ritual" };
  }
}

export async function createHabit(data: HabitDataType) {
  try {
    const res = await prisma.habit.create({
      data: {
        title: data.title,
        userId: data.userId,
      },
    });
    if (!res) return { error: "Failed to create habit" };

    return `I Created an habit titled ${res.title}`;
  } catch (error) {
    return { error: "Failed to create habit" };
  }
}
