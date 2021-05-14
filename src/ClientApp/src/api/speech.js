import { processAudioFile } from "../utility";

export const synthesizeText = async (text, speechTranslationOptions) => {
  const response = await fetch("speech/synthesizer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      speechTranslationOptions,
      text,
    }),
  });
  if (!response.ok) {
    throw new Error("Error getting translations");
  }
  const translations = await response.json();
  const processedTranslations = [];
  for (let index = 0; index < translations.length; index++) {
    const translation = translations[index];
    try {
      const audio = await processAudioFile(translation.ttsAudioUrl);
      const delayBeforePlaying = processedTranslations
        .slice(0, index)
        .reduce((accumulator, t) => accumulator + t.duration, 0);
      processedTranslations.push({
        ...translation,
        ...audio,
        delayBeforePlaying,
      });
    } catch (error) {
      console.error(error);
    }
  }
  return processedTranslations;
};
