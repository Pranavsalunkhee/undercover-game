import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import confetti from "canvas-confetti";

import {
  Trophy,
  Medal,
  Play,
  LogOut,
  Shield,
  Fingerprint,
  Ghost,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import useGameStore from "../store/gameStore";

const roles = {
  civilian: {
    name: "Civilian",
    title: "Civilians Win!",
    color: "text-green-400",
    icon: Shield,
  },

  undercover: {
    name: "Undercover",
    title: "Undercover Wins!",
    color: "text-red-400",
    icon: Fingerprint,
  },

  mrWhite: {
    name: "Mr. White",
    title: "Mr. White Wins!",
    color: "text-gray-200",
    icon: Ghost,
  },
};

function Results() {
  const navigate = useNavigate();

  const {
    winner,
    winningPlayerId,
    assignedPlayers,
    words,
    currentRound,
    gameStatus,

    scores,
    gameNumber,
    completedGames,
    lastGameScores,

    nextGame,
    resetGame,
  } = useGameStore();

  const [showRoles, setShowRoles] = useState(false);
  const [showEndSession, setShowEndSession] =
    useState(false);

  useEffect(() => {
    if (gameStatus === "finished" && winner) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        disableForReducedMotion: true,
      });
    }
  }, [winner, gameStatus]);

  if (
    gameStatus !== "finished" ||
    !winner ||
    !words
  ) {
    return <Navigate to="/" replace />;
  }

  const winningRole = roles[winner];
  const WinnerIcon = winningRole.icon;

  const winningPlayers = assignedPlayers.filter(
    (player) =>
      winningPlayerId !== null
        ? player.id === winningPlayerId
        : player.role === winner
  );

  // Create the leaderboard
  const leaderboard = assignedPlayers
    .map((player) => {
      const key = player.name.trim().toLowerCase();

      const earnedPoints =
        lastGameScores.find(
          (item) => item.id === player.id
        )?.points || 0;

      return {
        ...player,
        totalPoints: scores[key] || 0,
        earnedPoints,
      };
    })
    .sort(
      (a, b) => b.totalPoints - a.totalPoints
    );

  const handleContinue = () => {
    try {
      nextGame();
      navigate("/reveal", { replace: true });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEndSession = () => {
    resetGame();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white px-5 py-8">

      <div className="max-w-md mx-auto">

        {/* Winner section */}
        <div className="text-center">

          <p className="text-purple-400 text-sm font-bold tracking-widest">
            GAME {gameNumber} COMPLETED
          </p>

          <Trophy
            size={75}
            className="mx-auto text-yellow-400 mt-6 mb-5"
          />

          <h1
            className={`text-4xl font-black ${winningRole.color}`}
          >
            {winningRole.title}
          </h1>

          <p className="text-gray-400 mt-3">
            Completed in {currentRound} rounds
          </p>

        </div>

        {/* Winning players */}
        <div className="mt-7 bg-[#1d1d30] rounded-2xl p-5 text-center">

          <WinnerIcon
            size={32}
            className={`mx-auto ${winningRole.color}`}
          />

          <h2 className="font-bold mt-3">
            Winning Players
          </h2>

          <p className="text-gray-300 mt-2">
            {winningPlayers
              .map((player) => player.name)
              .join(", ")}
          </p>

        </div>

        {/* Leaderboard heading */}
        <div className="flex items-center justify-between mt-8 mb-4">

          <div className="flex items-center gap-2">
            <BarChart3 className="text-purple-400" />

            <h2 className="text-xl font-bold">
              Leaderboard
            </h2>
          </div>

          <span className="text-xs text-gray-400">
            {completedGames} games played
          </span>

        </div>

        {/* Leaderboard table header */}
        <div className="flex items-center gap-3 px-3 mb-3 text-xs text-gray-500">

          <span className="w-8">Rank</span>

          <span className="flex-1">Player</span>

          <span className="w-12 text-center">
            Earned
          </span>

          <span className="w-12 text-right">
            Total
          </span>

        </div>

        {/* Leaderboard players */}
        <div className="space-y-3">

          {leaderboard.map((player, index) => {
            const rank =
              leaderboard.findIndex(
                (item) =>
                  item.totalPoints === player.totalPoints
              ) + 1;

            return (
              <div
                key={player.id}
                className={`flex items-center gap-3 p-3 rounded-xl border ${
                  rank === 1
                    ? "bg-yellow-500/10 border-yellow-500/30"
                    : "bg-[#1d1d30] border-transparent"
                }`}
              >

                {/* Rank */}
                <div className="w-8 flex justify-center">

                  {rank <= 3 ? (
                    <Medal
                      size={23}
                      className={
                        rank === 1
                          ? "text-yellow-400"
                          : rank === 2
                          ? "text-gray-300"
                          : "text-orange-400"
                      }
                    />
                  ) : (
                    <span className="text-gray-400">
                      {rank}
                    </span>
                  )}

                </div>

                {/* Player avatar */}
                <div className="w-9 h-9 shrink-0 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 font-bold">
                  {player.name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                {/* Player name */}
                <div className="flex-1 min-w-0">

                  <p className="font-semibold truncate">
                    {player.name}
                  </p>

                  <p
                    className={`text-xs ${
                      roles[player.role].color
                    }`}
                  >
                    {roles[player.role].name}
                  </p>

                </div>

                {/* Points earned */}
                <span
                  className={`w-12 text-center font-medium ${
                    player.earnedPoints > 0
                      ? "text-green-400"
                      : "text-gray-500"
                  }`}
                >
                  +{player.earnedPoints}
                </span>

                {/* Total score */}
                <span className="w-12 text-right text-xl font-bold">
                  {player.totalPoints}
                </span>

              </div>
            );
          })}

        </div>

        {/* Secret words */}
        <h2 className="font-bold text-xl mt-8 mb-4">
          Secret Words
        </h2>

        <div className="grid grid-cols-2 gap-3">

          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">

            <p className="text-green-400 text-xs">
              Civilian Word
            </p>

            <h3 className="text-xl font-bold mt-2 break-words">
              {words.civilian}
            </h3>

          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">

            <p className="text-red-400 text-xs">
              Undercover Word
            </p>

            <h3 className="text-xl font-bold mt-2 break-words">
              {words.undercover}
            </h3>

          </div>

        </div>

        {/* Expandable player roles */}
        <button
          onClick={() => setShowRoles(!showRoles)}
          className="w-full mt-5 bg-[#1d1d30] rounded-xl p-4 flex items-center justify-between cursor-pointer"
        >

          <span>View All Player Roles</span>

          {showRoles ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}

        </button>

        {showRoles && (
          <div className="space-y-3 mt-3">

            {assignedPlayers.map((player) => {
              const RoleIcon =
                roles[player.role].icon;

              return (
                <div
                  key={player.id}
                  className="bg-[#1d1d30] rounded-xl p-4 flex items-center gap-3"
                >

                  <RoleIcon
                    className={roles[player.role].color}
                  />

                  <div className="flex-1 min-w-0">

                    <p className="font-semibold truncate">
                      {player.name}
                    </p>

                    <p
                      className={`text-xs ${
                        roles[player.role].color
                      }`}
                    >
                      {roles[player.role].name}
                    </p>

                  </div>

                  <span className="text-gray-400 text-xs">
                    {player.isAlive
                      ? "Survived"
                      : "Eliminated"}
                  </span>

                </div>
              );
            })}

          </div>
        )}

        {/* Continue next game */}
        <button
          onClick={handleContinue}
          className="w-full mt-8 bg-purple-600 hover:bg-purple-700 rounded-xl p-4 font-bold flex items-center justify-center gap-2 cursor-pointer"
        >

          <Play size={22} />

          Continue — Game {gameNumber + 1}

        </button>

        <p className="text-center text-gray-500 text-xs mt-3">
          Same friends. New words. New roles.
        </p>

        {/* End session */}
        <button
          onClick={() => setShowEndSession(true)}
          className="w-full mt-5 border border-red-500/30 text-red-400 rounded-xl p-4 flex items-center justify-center gap-2 cursor-pointer"
        >

          <LogOut size={20} />

          End Session

        </button>

      </div>

      {/* End session confirmation */}
      {showEndSession && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">

          <div className="w-full max-w-sm bg-[#1d1d30] rounded-2xl p-6 text-center">

            <LogOut
              size={40}
              className="mx-auto text-red-400 mb-4"
            />

            <h2 className="text-xl font-bold">
              End Gaming Session?
            </h2>

            <p className="text-gray-400 mt-3 text-sm">
              All current session scores will be reset.
              Are you sure you want to end the session?
            </p>

            <button
              onClick={handleEndSession}
              className="w-full mt-6 bg-red-600 rounded-xl p-3 font-bold cursor-pointer"
            >
              End Session
            </button>

            <button
              onClick={() => setShowEndSession(false)}
              className="w-full mt-3 bg-[#303047] rounded-xl p-3 cursor-pointer"
            >
              Keep Playing
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default Results;