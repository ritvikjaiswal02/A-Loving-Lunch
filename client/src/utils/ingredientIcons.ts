// Mapping of ingredient IDs to their emoji icons
export const ingredientIcons: Record<string, string> = {
  'onigiri': '🍙',
  'salmon': '🐟',
  'tamagoyaki': '🥚',
  'broccoli': '🥦',
  'cherry-tomato': '🍅',
  'edamame': '🫛',
  'carrot': '🥕',
  'pickles': '🥒',
  'umeboshi': '🔴',
  'sesame': '⚪',
};

export const getIngredientIcon = (ingredientId: string): string => {
  return ingredientIcons[ingredientId] || '❓';
};
