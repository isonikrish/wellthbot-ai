import prisma from "../lib/prisma";

export async function handleCreateLifeEvent(req: any, res: any) {
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

    const { title, emotionType, description } = data;

    await prisma.lifeEvent.create({
      data: {
        title,
        emotionType,
        description,
        userId: user?.id,
      },
    });

    return res.status(200).json({ msg: "Life event created" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
export async function handleDeleteLifeEvent(req: any, res: any) {
  const eventId = parseInt(req.params.id);
  const userId = req.user;
  try {
    if (!eventId) {
      return res.status(400).json({ msg: "Event id not provided" });
    }
    if (!userId) {
      return res.status(400).json({ msg: "Unauthorised" });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });
    if (!user) return res.status(400).json({ msg: "No user found" });

    const event = await prisma.lifeEvent.findUnique({
      where: {
        id: eventId,
      },
    });
    if (!event) {
      return res.status(400).json({ msg: "No life event found for this id" });
    }

    if (user.id !== event.userId) {
      return res.status(400).json({ msg: "Unauthorised" });
    }

    await prisma.lifeEvent.delete({
      where: {
        id: event.id,
      },
    });

    return res.status(200).json({ msg: "Life Event Deleted" });
  } catch (error) {
    return res.status(500).json({msg: "Internal Server Error"});
  }
}
