import prisma from "./prisma";
import { createTransport, createTestAccount,getTestMessageUrl  } from "nodemailer";
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
export async function getUserRitual(userId: number) {
  try {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const userRitual = await prisma.ritual.findFirst({
      where: {
        userId,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return userRitual;
  } catch (error) {
    return { error: "Failed to fetch userr ritual" };
  }
}
export async function getUserLifeEvent(userId: number) {
  try {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const userLifeEvent = await prisma.lifeEvent.findFirst({
      where: {
        userId,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return userLifeEvent;
  } catch (error) {
    return { error: "Failed to fetch life event" };
  }
}
export async function getUserHabit(userId: number) {
  try {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const userHabit = await prisma.habit.findFirst({
      where: {
        userId,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return userHabit;
  } catch (error) {
    return { error: "Failed to fetch user habit" };
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
      return `I Updated user mood to ${updatedLog.mood}, stress level ${updatedLog.stressLevel} and energy level ${updatedLog.energyLevel}`;
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

export async function checkDataCompletions(userId: number) {
  const moodLog = await getUserMoodLog(userId);
  const lifeEvent = await getUserLifeEvent(userId);
  const ritual = await getUserRitual(userId);
  const habit = await getUserHabit(userId);

  return {
    isComplete: moodLog && lifeEvent && ritual && habit,
  };
}

export async function generateReport(userId: number) {


  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user || !user.email) {
    console.error("❌ User not found or missing email");
    throw new Error("User not found or missing email");
  }

  const moodLog = await getUserMoodLog(userId);

  const lifeEvents = await getUserLifeEvents(userId);

  const rituals = await getUserRituals(userId);

  const habits = await prisma.habit.findMany({ where: { userId } });

  const report = `
📊 Your Wellness Report

😌 Mood: ${
    "mood" in moodLog
      ? `${moodLog.mood} (Energy: ${moodLog.energyLevel}, Stress: ${moodLog.stressLevel})`
      : "No mood data available"
  }

🧘 Rituals: ${
    Array.isArray(rituals) && rituals.length > 0
      ? rituals.map((r) => r.title).join(", ")
      : "No rituals found"
  }

🌱 Habits: ${
    Array.isArray(habits) && habits.length > 0
      ? habits.map((h) => h.title).join(", ")
      : "No habits found"
  }

📖 Life Events: ${
    Array.isArray(lifeEvents) && lifeEvents.length > 0
      ? lifeEvents.map((e) => `${e.title} (${e.emotionType})`).join(", ")
      : "No life events recorded"
  }

💡 Keep going, you're doing great!
  `;
  console.log("📝 Final report:\n", report);
  const testAccount = await createTestAccount();
  const transporter = createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  console.log("📧 Transporter created");

  const info = await transporter.sendMail({
    from: '"Your Bot" <no-reply@yourapp.com>',
    to: user.email,
    subject: "Your Wellness Report",
    text: report,
  });

    const previewUrl = getTestMessageUrl(info);

    return previewUrl;

}
