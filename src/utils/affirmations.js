const groupedAffirmations = require('../affirmations.json');

export const flattenAffirmations = groupedAffirmations.flatMap(group => {
  if (!group || !group.category || !Array.isArray(group.affirmations)) {
    return [];
  }

  return group.affirmations.map((text, index) => ({
    id: `${group.category}-${index}`,
    text,
    category: group.category,
  }));
});
