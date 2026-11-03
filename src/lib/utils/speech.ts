/**
 * Tiện ích phát âm tiếng Hàn sử dụng Web Speech API chuẩn trình duyệt
 * Tự động tìm giọng đọc tiếng Hàn (ko-KR) với tốc độ phù hợp cho người học.
 */

export function playKoreanSpeech(text: string, rate: number = 0.85) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("Trình duyệt không hỗ trợ Web Speech API");
    return;
  }

  // Dừng các âm thanh đang phát trước đó
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = rate; // Tốc độ hơi chậm một chút để nghe rõ từng âm
  utterance.pitch = 1.0;

  // Tìm giọng đọc tiếng Hàn tối ưu
  const voices = window.speechSynthesis.getVoices();
  const koreanVoice = voices.find(
    (v) => v.lang.includes("ko") || v.lang.includes("KO") || v.name.includes("Korean")
  );
  if (koreanVoice) {
    utterance.voice = koreanVoice;
  }

  window.speechSynthesis.speak(utterance);
}
