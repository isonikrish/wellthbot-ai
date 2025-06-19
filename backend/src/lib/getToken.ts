import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
export async function protectRoute(req: any, res: any, next: any) {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: "JWT secret not configured" });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const parsedId = parseInt(decoded.userId);
    req.user = parsedId;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
}
export async function socketProtectRoute(socket: Socket, next: any) {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers["authorization"]?.split(" ")[1];

    if (!token) return next(new Error("Unauthorized"));

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const parsedId = parseInt(decoded.userId);

    socket.data.userId = parsedId;

    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
}
