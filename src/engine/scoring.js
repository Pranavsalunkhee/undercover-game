export const ROLE_POINTS = {
  civilian: 2,
  undercover: 10,
  mrWhite: 6,
};

export const calculateScores = (
  players,
  winner,
  winningPlayerId = null
) => {
  return players.map((player) => {
    const isWinner =
      winningPlayerId !== null
        ? player.id === winningPlayerId
        : player.role === winner;

    return {
      id: player.id,
      name: player.name,
      role: player.role,
      points: isWinner
        ? ROLE_POINTS[player.role] || 0
        : 0,
    };
  });
};

export const updateLeaderboard = (
  previousScores,
  gameScores
) => {
  const updatedScores = { ...previousScores };

  gameScores.forEach((player) => {
    const key = player.name.trim().toLowerCase();

    updatedScores[key] =
      (Object.hasOwn(updatedScores, key)
        ? updatedScores[key]
        : 0) + player.points;
  });

  return updatedScores;
};