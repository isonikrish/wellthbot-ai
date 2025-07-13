export function TextToSpeech(text: string) {
  // Remove all URLs from the text
  const sanitizedText = text.replace(/https?:\/\/[^\s]+/g, "").replace(/www\.[^\s]+/g, "");

  const utterance = new SpeechSynthesisUtterance(sanitizedText.trim());
  utterance.lang = "en-US";
  window.speechSynthesis.speak(utterance);
}
