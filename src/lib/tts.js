// الراوي الصوتي — تحويل النص إلى كلام من المتصفح (Web Speech API) بدون أي خدمة خارجية

export const ttsSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

export function getVoice(lang) {
  if (!ttsSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  const l = lang.toLowerCase();
  return (
    voices.find((v) => v.lang?.toLowerCase().startsWith(l) && /google|natural|online/i.test(v.name)) ||
    voices.find((v) => v.lang?.toLowerCase().startsWith(l)) ||
    null
  );
}

/** تقسيم النص لجمل قصيرة (بعض المتصفحات تقطع الجمل الطويلة) */
function chunks(text, max = 180) {
  const parts = text.replace(/\s+/g, ' ').split(/(?<=[.!?؟،؛:])\s+/);
  const out = [];
  let cur = '';
  for (const p of parts) {
    if ((cur + ' ' + p).length > max && cur) {
      out.push(cur);
      cur = p;
    } else cur = cur ? cur + ' ' + p : p;
  }
  if (cur) out.push(cur);
  return out.flatMap((c) => (c.length > max * 1.6 ? c.match(new RegExp(`.{1,${max}}(\\s|$)`, 'g')) || [c] : [c]));
}

/** ينطق النص ثم يستدعي onEnd — يرجع دالة للإيقاف */
export function speak(text, lang, rate, onEnd) {
  if (!ttsSupported() || !text) {
    onEnd?.();
    return () => {};
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  const list = chunks(text);
  const voice = getVoice(lang);
  let i = 0;
  let stopped = false;
  const next = () => {
    if (stopped) return;
    if (i >= list.length) return onEnd?.();
    const u = new SpeechSynthesisUtterance(list[i++]);
    u.lang = voice?.lang || lang;
    if (voice) u.voice = voice;
    u.rate = rate;
    u.onend = next;
    u.onerror = next;
    synth.speak(u);
  };
  next();
  return () => {
    stopped = true;
    synth.cancel();
  };
}
