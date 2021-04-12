import { processAudioFile } from "../utility";

export const getLocales = async () => {
  const response = await fetch("speech/locales");
  return await response.json();
};

export const getVoicesForLocale = async (locale) => {
  const response = await fetch(`speech/voices?locale=${locale}`);
  return await response.json();
};

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
    const audio = await processAudioFile(translation.ttsAudioUrl);
    processedTranslations.push({
      ...translation,
      ...audio,
    });
  }
  return processedTranslations;
};
