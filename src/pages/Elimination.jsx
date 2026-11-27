import { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Crosshair,
  UserX,
  Shield,
  Fingerprint,
  Ghost,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

import useGameStore from "../store/gameStore";

const roleNames = {
  civilian: "Civilian",
  undercover: "Undercover",
  mrWhite: "Mr. White",
};

const roleColors = {
  civilian: "text-green-400",
  undercover: "text-red-400",
  mrWhite: "text-gray-200",
};

const roleIcons = {
  civilian: Shield,
  undercover: Fingerprint,
  mrWhite: Ghost,
};

function Elimination() {
  const {
    assignedPlayers,
    currentRound,
    gameStatus,
    lastEliminated,
    winner,
    eliminatePlayer,
    continueAfterElimination,
    discussAgain,
  } = useGameStore();

  const [selectedPlayer, setSelectedPlayer] =
    useState(null);

  const [showConfirm, setShowConfirm] =
    useState(false);

  if (gameStatus === "mrWhiteGuess") {
    return <Navigate to="/guess" replace />;
  }

  if (gameStatus === "finished") {
    return <Navigate to="/results" replace />;
  }

  if (gameStatus === "discussion") {
    return <Navigate to="/discussion" replace />;
  }

  if (
    gameStatus !== "elimination" &&
    gameStatus !== "eliminationResult"
  ) {
    return <Navigate to="/" replace />;
  }

  const activePlayers = assignedPlayers.filter(
    (player) => player.isAlive
  );

  const handleEliminate = () => {
    if (!selectedPlayer) return;

    eliminatePlayer(selectedPlayer.id);

    setShowConfirm(false);
    setSelectedPlayer(null);
  };

  // Show eliminated player's actual role
  if (
    gameStatus === "eliminationResult" &&
    lastEliminated
  ) {
    const RoleIcon =
      roleIcons[lastEliminated.role];

    return (
      <div className="min-h-screen bg-[#0f0f1a] text-white flex items-center justify-center px-6">

        <div className="w-full max-w-md text-center">

          <UserX
            size={70}
            className="mx-auto text-red-400 mb-6"
          />

          <p className="text-gray-400">
            Player Eliminated
          </p>

          <h1 className="text-4xl font-bold mt-3">
            {lastEliminated.name}
          </h1>

          <div className="mt-8 bg-[#1d1d30] rounded-2xl p-8">

            <RoleIcon
              size={60}
              className={`mx-auto ${
                roleColors[lastEliminated.role]
              }`}
            />

            <p className="text-gray-400 mt-4">
              Their actual role was
            </p>

            <h2
              className={`text-3xl font-black mt-3 ${
                roleColors[lastEliminated.role]
              }`}
            >
              {roleNames[lastEliminated.role]}
            </h2>

          </div>

          <button
            onClick={continueAfterElimination}
            className="w-full mt-8 bg-purple-600 rounded-xl p-4 font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            {winner ? "View Results" : "Next Round"}

            <ArrowRight size={20} />
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white px-5 py-8">

      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="text-center">

          <p className="text-purple-400 font-bold">
            ROUND {currentRound}
          </p>

          <Crosshair
            size={52}
            className="mx-auto text-red-400 mt-6 mb-4"
          />

          <h1 className="text-3xl font-bold">
            Eliminate a Player
          </h1>

          <p className="text-gray-400 mt-3">
            Discuss and vote in person, then select
            the most suspicious player.
          </p>

        </div>

        {/* Player selection */}
        <div className="grid grid-cols-2 gap-3 mt-8">

          {assignedPlayers.map((player) => (
            <button
              key={player.id}
              disabled={!player.isAlive}
              onClick={() => setSelectedPlayer(player)}
              className={`rounded-2xl p-5 text-center border-2 transition cursor-pointer
                ${
                  !player.isAlive
                    ? "opacity-40 bg-[#1d1d30] border-transparent cursor-not-allowed"
                    : selectedPlayer?.id === player.id
                    ? "bg-red-500/15 border-red-500"
                    : "bg-[#1d1d30] border-transparent"
                }`}
            >

              <div className="w-14 h-14 mx-auto bg-purple-600/20 text-purple-400 rounded-full flex items-center justify-center text-xl font-bold mb-3">
                {player.name.charAt(0).toUpperCase()}
              </div>

              <p className="font-semibold break-words">
                {player.name}
              </p>

              <p
                className={`text-xs mt-2 ${
                  player.isAlive
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {player.isAlive ? "Alive" : "Eliminated"}
              </p>

              {!player.isAlive && (
                <p className="text-gray-400 text-xs mt-1">
                  {roleNames[player.role]}
                </p>
              )}

            </button>
          ))}

        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          {activePlayers.length} players remaining
        </p>

        {/* Eliminate button */}
        <button
          disabled={!selectedPlayer}
          onClick={() => setShowConfirm(true)}
          className="w-full mt-6 bg-red-600 hover:bg-red-700 p-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <UserX size={20} />

          Eliminate{" "}
          {selectedPlayer?.name || "Player"}
        </button>

        {/* Tie button */}
        <button
          onClick={discussAgain}
          className="w-full mt-4 bg-[#1d1d30] p-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw size={18} />

          Tie? Discuss Again
        </button>

      </div>

      {/* Confirmation modal */}
      {showConfirm && selectedPlayer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">

          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm bg-[#1d1d30] rounded-2xl p-6 text-center"
          >

            <UserX
              size={45}
              className="mx-auto text-red-400 mb-4"
            />

            <h2 className="text-xl font-bold">
              Confirm Elimination
            </h2>

            <p className="text-gray-400 mt-3">
              Are you sure you want to eliminate{" "}
              {selectedPlayer.name}?
            </p>

            <button
              onClick={handleEliminate}
              className="w-full mt-6 bg-red-600 p-3 rounded-xl font-bold cursor-pointer"
            >
              Confirm Elimination
            </button>

            <button
              onClick={() => setShowConfirm(false)}
              className="w-full mt-3 bg-[#303047] p-3 rounded-xl cursor-pointer"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default Elimination;