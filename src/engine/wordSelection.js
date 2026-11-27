import words from "../data/words.json";

export const selectRandomWords = () => {
  const randomIndex = Math.floor(Math.random() * words.length);

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
