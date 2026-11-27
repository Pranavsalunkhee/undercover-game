export const detectWinner = (players) => {
  const activePlayers = players.filter(
    (player) => player.isAlive
  );

  const civilians = activePlayers.filter(
    (player) => player.role === "civilian"
  );

  const undercover = activePlayers.filter(
    (player) => player.role === "undercover"
  );

  const mrWhite = activePlayers.filter(
    (player) => player.role === "mrWhite"
  );

  // Civilians win
  if (
    civilians.length > 0 &&
    undercover.length === 0 &&
    mrWhite.length === 0
  ) {
    return "civilian";
  }

  // Undercover wins
  if (
    undercover.length > 0 &&
    civilians.length <= 1
  ) {
    return "undercover";
  }

  // Mr. White wins by surviving
  if (
    mrWhite.length > 0 &&
    undercover.length === 0 &&
    civilians.length <= 1
  ) {
    return "mrWhite";
  }

  // Game continues
  return null;
};