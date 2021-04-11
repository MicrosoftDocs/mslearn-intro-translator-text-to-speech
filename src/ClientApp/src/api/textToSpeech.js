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
  return await response.json();
};
