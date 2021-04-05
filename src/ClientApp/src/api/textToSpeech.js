export const getLocales = async () => {
  const response = await fetch("speech/locales");
  return await response.json();
};

export const getVoices = async () => {
  const response = await fetch("speech/voices");
  return await response.json();
};

export const synthesizeText = async (targetLanguage, text) => {
  const response = await fetch("speech/synthesizer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      targetLanguage,
      text,
    }),
  });
  return await response.text();
};
