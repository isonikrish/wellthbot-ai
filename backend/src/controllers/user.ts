import { Request } from "express";
import prisma from "../lib/prisma";
import jwt from "jsonwebtoken";
export async function handleUserSignup(req: Request, res: any) {
  try {
    const data = req.body;
    const { name, email, password } = data;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return res
        .status(400)
        .json({ msg: "User with this email already exists" });
    }
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Invalid fields" });
    }
    await prisma.user.create({
      data: {
        name,
        email,
        password,
        image: "",
      },
    });

    return res.status(200).json({ msg: "Signup Successful" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
export async function handleUserLogin(req: Request, res: any) {
  try {
    const data = req.body;
    const { email, password } = data;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !user.id) {
      return res.status(400).json({ msg: "User don't exists" });
    }

    const isSame = password === user.password;
    if (!isSame) return res.status(400).json({ msg: "Password incorrect" });

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: "JWT secret not configured" });
    }
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string
    );

    return res.status(200).json({ token: token, user: user });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function handleFetchUser(req: any, res: any) {
  const userId = req.user;
  try {
    if (!userId) {
      return res.status(400).json({ msg: "Unauthorised" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
export async function handleGetMyRituals(req: any, res: any) {
  const userId = req.user;
  try {
    if (!userId) {
      return res.status(400).json({ msg: "Unauthorised" });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const rituals = await prisma.ritual.findMany({
      where: {
        userId: user.id,
      },
      include: {
        logs: true,
      },
    });


    return res.status(200).json(rituals)
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
export async function handleGetMyHabits(req: any, res: any) {
  const userId = req.user;
  try {
    if (!userId) {
      return res.status(400).json({ msg: "Unauthorised" });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const habits = await prisma.habit.findMany({
      where: {
        userId: user.id,
      },
    });


    return res.status(200).json(habits)
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
export async function handleGetMyLifeEvents(req: any, res: any) {
  const userId = req.user;
  try {
    if (!userId) {
      return res.status(400).json({ msg: "Unauthorised" });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const lifeEvents = await prisma.lifeEvent.findMany({
      where: {
        userId: user.id,
      },
    });


    return res.status(200).json(lifeEvents)
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
export async function handleGetMyMoodLogs(req: any, res: any) {
  const userId = req.user;
  try {
    if (!userId) {
      return res.status(400).json({ msg: "Unauthorised" });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const moodLogs = await prisma.moodLog.findMany({
      where: {
        userId: user.id,
      },
    });


    return res.status(200).json(moodLogs)
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
