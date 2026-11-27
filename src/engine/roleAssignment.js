export const assignRoles = (
  players,
  undercoverCount,
  mrWhiteCount,
  words
) => {
  const civilianCount =
    players.length - undercoverCount - mrWhiteCount;

  if (
    !Number.isInteger(undercoverCount) ||
    !Number.isInteger(mrWhiteCount) ||
    undercoverCount < 1 ||
    mrWhiteCount < 0 ||
    civilianCount <= undercoverCount + mrWhiteCount
  ) {
    throw new Error("Invalid role configuration");
  }

  const roles = [
    ...Array(civilianCount).fill("civilian"),
    ...Array(undercoverCount).fill("undercover"),
    ...Array(mrWhiteCount).fill("mrWhite"),
  ];

  // Randomly shuffle all roles
  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [roles[i], roles[j]] = [roles[j], roles[i]];
  }

  return players.map((player, index) => ({
    id: index + 1,
    name: player,
    role: roles[index],

    word:
      roles[index] === "mrWhite"
        ? null
        : roles[index] === "civilian"
        ? words.civilian
        : words.undercover,

    isAlive: true,
  }));
};