import generalWords from "../data/words.json";
import maharashtraWords from "../data/maharashtra_words.json";

const libraries = {
  general: generalWords,
  maharashtra: maharashtraWords,
  mixed: [...generalWords, ...maharashtraWords],
};

export const selectRandomWords = (
  library = "general"
) => {
  const words = libraries[library] || generalWords;

  if (words.length === 0) {
    throw new Error("Selected word library is empty.");
  }

  const randomIndex = Math.floor(
    Math.random() * words.length
  );

  const selectedPair = words[randomIndex];

  const swap = Math.random() < 0.5;

  return {
    civilian: swap
      ? selectedPair.undercover
      : selectedPair.civilian,

    undercover: swap
      ? selectedPair.civilian
      : selectedPair.undercover,
  };
};