import { useEffect, useState } from "react";

export function useVoiceToText(onResult: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.interimResults = false;
    recog.lang = "en-US";

    recog.onresult = (event: Event) => {
      const transcript = (event as any).results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
    };

    recog.onerror = () => setIsListening(false);
    recog.onend = () => setIsListening(false);

    setRecognition(recog);
  }, [onResult]);

  const startListening = () => {
    if (!recognition) return;
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    recognition?.stop();
    setIsListening(false);
  };

  return { isListening, startListening, stopListening };
}
