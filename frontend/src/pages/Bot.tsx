import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { useSocket } from "@/lib/SocketProvider";
import { TextToSpeech } from "@/components/TextToSpeech";
import { useVoiceToText } from "@/components/VoiceToText";

export default function WellthBot() {
  const [statusText, setStatusText] = useState("Hello! Tap mic and speak to begin.");
  const socket = useSocket();

  const speak = useCallback((text: string) => {
    setStatusText(`Bot: ${text}`);
    TextToSpeech(text);
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !socket) return;
      setStatusText(`You: ${text}`);
      socket.emit("user:message", text.trim());
    },
    [socket]
  );

  const onVoiceResult = useCallback((voiceText: string) => {
    sendMessage(voiceText);
  }, [sendMessage]);

  const { isListening, startListening, stopListening } = useVoiceToText(onVoiceResult);
  useEffect(() => {
    if (!socket) return;

    const handleReply = (reply: string) => speak(reply);
    const handleResult = (result: any) => speak(`Action completed: ${JSON.stringify(result)}`);
    const handleError = (err: string) => speak(`Error: ${err}`);

    socket.on("bot:reply", handleReply);
    socket.on("bot:result", handleResult);
    socket.on("bot:error", handleError);

    return () => {
      socket.off("bot:reply", handleReply);
      socket.off("bot:result", handleResult);
      socket.off("bot:error", handleError);
    };
  }, [socket, speak]);

  const handleVoiceToggle = () => {
    if (isListening) stopListening();
    else startListening();
  };

  return (
   <div className="flex items-center justify-center h-screen">
  <div className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/10 text-center">
    <h1 className="text-4xl font-extrabold mb-2 text-white tracking-tight">WellthBot AI</h1>
    <p className="text-sm text-gray-300 mb-6">
      Your wellness companion — speak freely, I'm listening.
    </p>

    <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-6 min-h-[100px] mb-8">
      <p className="text-base text-gray-200 leading-relaxed">{statusText}</p>
    </div>

    <Button
      size="lg"
      onClick={handleVoiceToggle}
      className={`w-24 h-24 rounded-full transition-all duration-300 mx-auto text-white border-2 ${
        isListening
          ? "bg-emerald-500 border-white animate-ping-slow"
          : "bg-black border-white/30 hover:bg-white/20"
      }`}
    >
      {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
    </Button>

    <p className="mt-4 text-sm text-gray-400">
      {isListening ? "Listening..." : "Tap the mic to talk"}
    </p>
  </div>
</div>

  );
}
