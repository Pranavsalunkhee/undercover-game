import { useNavigate, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Shield,
  Fingerprint,
  Ghost,
  Plus,
  Minus,
  Play,
} from "lucide-react";

import useGameStore from "../store/gameStore";

function GameConfig() {
  const navigate = useNavigate();

  const {
    players,
    undercoverCount,
    mrWhiteCount,
    setUndercoverCount,
    setMrWhiteCount,
    startGame,
  } = useGameStore();

  const totalPlayers = players.length;

  const civilianCount =
    totalPlayers - undercoverCount - mrWhiteCount;

  const maxSpecialRoles = Math.floor(
    (totalPlayers - 1) / 2
  );

  const canAddRole =
    undercoverCount + mrWhiteCount < maxSpecialRoles;

  const isValid =
    totalPlayers >= 3 &&
    undercoverCount >= 1 &&
    mrWhiteCount >= 0 &&
    civilianCount > undercoverCount + mrWhiteCount;

  if (totalPlayers < 3) {
    return <Navigate to="/players" replace />;
  }

  const handleStartGame = () => {
    if (!isValid) return;

    try {
      startGame();
      navigate("/reveal", { replace: true });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white px-5 py-8">

      <div className="max-w-md mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate("/players")}
          className="flex items-center gap-2 text-gray-400 mb-8 cursor-pointer"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Header */}
        <h1 className="text-3xl font-bold">
          Game Configuration
        </h1>

        <p className="text-gray-400 mt-2">
          Configure the roles before starting the game.
        </p>

        {/* Total players */}
        <div className="mt-6 bg-[#1d1d30] rounded-xl p-5 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <Users className="text-purple-400" />
            <span>Total Players</span>
          </div>

          <span className="text-2xl font-bold text-purple-400">
            {totalPlayers}
          </span>

        </div>

        {/* Role configuration */}
        <h2 className="text-lg font-semibold mt-8 mb-4">
          Configure Roles
        </h2>

        <div className="space-y-4">

          {/* Civilians */}
          <div className="bg-[#1d1d30] border border-green-500/20 rounded-2xl p-5">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 shrink-0 bg-green-500/15 rounded-xl flex items-center justify-center">
                <Shield className="text-green-400" />
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-green-400">
                  Civilians
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  Receive the same secret word
                </p>
              </div>

              <span className="text-2xl font-bold">
                {civilianCount}
              </span>

            </div>
          </div>

          {/* Undercover */}
          <div className="bg-[#1d1d30] border border-red-500/20 rounded-2xl p-5">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 shrink-0 bg-red-500/15 rounded-xl flex items-center justify-center">
                <Fingerprint className="text-red-400" />
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-red-400">
                  Undercover
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  Receive a different secret word
                </p>
              </div>

            </div>

            <div className="flex items-center justify-between mt-5">

              <button
                onClick={() =>
                  setUndercoverCount(undercoverCount - 1)
                }
                disabled={undercoverCount <= 1}
                className="w-10 h-10 bg-[#303047] rounded-lg flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minus size={20} />
              </button>

              <span className="text-2xl font-bold">
                {undercoverCount}
              </span>

              <button
                onClick={() =>
                  setUndercoverCount(undercoverCount + 1)
                }
                disabled={!canAddRole}
                className="w-10 h-10 bg-[#303047] rounded-lg flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Plus size={20} />
              </button>

            </div>
          </div>

          {/* Mr. White */}
          <div className="bg-[#1d1d30] border border-gray-500/20 rounded-2xl p-5">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 shrink-0 bg-gray-500/15 rounded-xl flex items-center justify-center">
                <Ghost className="text-gray-300" />
              </div>

              <div className="flex-1">
                <h3 className="font-bold">
                  Mr. White
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  Receives no secret word
                </p>
              </div>

            </div>

            <div className="flex items-center justify-between mt-5">

              <button
                onClick={() =>
                  setMrWhiteCount(mrWhiteCount - 1)
                }
                disabled={mrWhiteCount <= 0}
                className="w-10 h-10 bg-[#303047] rounded-lg flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minus size={20} />
              </button>

              <span className="text-2xl font-bold">
                {mrWhiteCount}
              </span>

              <button
                onClick={() =>
                  setMrWhiteCount(mrWhiteCount + 1)
                }
                disabled={!canAddRole}
                className="w-10 h-10 bg-[#303047] rounded-lg flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Plus size={20} />
              </button>

            </div>
          </div>

        </div>

        {/* Players list */}
        <h2 className="text-lg font-semibold mt-8 mb-4">
          Players
        </h2>

        <div className="grid grid-cols-2 gap-3">

          {players.map((player, index) => (
            <div
              key={index}
              className="bg-[#1d1d30] p-3 rounded-xl flex items-center gap-3"
            >
              <div className="w-9 h-9 shrink-0 bg-purple-600/20 text-purple-400 rounded-full flex items-center justify-center font-bold">
                {player.charAt(0).toUpperCase()}
              </div>

              <span className="truncate">
                {player}
              </span>
            </div>
          ))}

        </div>

        {/* Validation */}
        {!isValid && (
          <p className="text-red-400 text-sm mt-5 text-center">
            Civilians must outnumber Undercover and Mr. White combined.
            Please adjust the role counts.
          </p>
        )}

        {/* Start Game button */}
        <button
          onClick={handleStartGame}
          disabled={!isValid}
          className="w-full mt-8 bg-purple-600 hover:bg-purple-700 p-4 rounded-xl font-bold flex items-center justify-center gap-3 cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Play size={22} />
          Start Game
        </button>

        <p className="text-center text-gray-500 text-xs mt-4">
          Roles and secret words will be assigned randomly.
        </p>

      </div>
    </div>
  );
}

export default GameConfig;