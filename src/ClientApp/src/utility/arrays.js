export const getItemByProperty = (propertyName, propertyValue, allItems) => {
  if (!allItems || allItems.length === 0) {
    return undefined;
  }
  return allItems.find((item) => item[propertyName] === propertyValue);
};

export const removeAtIndex = (array, index) => {
  return [...array.slice(0, index), ...array.slice(index + 1)];
};
