export const getVoicesForLocale = async (locale) => {
  const response = await fetch(`speech/voices?locale=${locale}`);
  return await response.json();
};
