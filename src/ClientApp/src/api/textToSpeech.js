export const getLocales = async () => {
  const response = await fetch("speech/locales");
  return await response.json();
};

export const getVoicesForLocale = async (locale) => {
  const response = await fetch(`speech/voices?locale=${locale}`);
  return await response.json();
};

export const synthesizeText = async (targetLanguages, voiceName, text) => {
  const response = await fetch("speech/synthesizer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      targetLanguage: targetLanguages[0],
      voiceName,
      text,
    }),
  });
  return await response.text();
};
