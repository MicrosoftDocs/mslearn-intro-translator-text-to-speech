export const getLocales = async () => {
  const response = await fetch("speech/locales");
  return await response.json();
};
