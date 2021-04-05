export const getItemByProperty = (propertyName, propertyValue, allItems) => {
  if (!allItems || allItems.length === 0) {
    return undefined;
  }
  return allItems.find((item) => item[propertyName] === propertyValue);
};
