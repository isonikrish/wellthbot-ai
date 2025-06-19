import { BACKEND_URL } from '@/stores/useApp';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
const SocketContext = createContext<Socket | null>(null)

export const useSocket = () => useContext(SocketContext);


interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
        let sock: Socket;

        const setupSocket = async () => {



            sock = io(BACKEND_URL, {
                auth: {
                    token,
                },
            });
            setSocket(sock);
        };

        setupSocket();

        return () => {
            if (sock) sock.disconnect();
        };
    }, []);


    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}