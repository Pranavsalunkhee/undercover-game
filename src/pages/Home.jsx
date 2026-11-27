import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Fingerprint,
  Play,
  BookOpen,
  Settings,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

import useGameStore from "../store/gameStore";

function Home() {
  const navigate = useNavigate();

  const gameStatus = useGameStore(
    (state) => state.gameStatus
  );

  const gameNumber = useGameStore(
    (state) => state.gameNumber
  );

  const completedGames = useGameStore(
    (state) => state.completedGames
  );

  const resetGame = useGameStore(
    (state) => state.resetGame
  );

  // Routes for resuming an existing game
  const sessionRoutes = {
    reveal: "/reveal",
    discussion: "/discussion",
    elimination: "/elimination",
    eliminationResult: "/elimination",
    mrWhiteGuess: "/guess",
    finished: "/results",
  };

  const hasActiveSession = Boolean(
    sessionRoutes[gameStatus]
  );

  // Resume existing session
  const handleResume = () => {
    if (hasActiveSession) {
      navigate(sessionRoutes[gameStatus]);
    }
  };

  // Start a new gaming session
  const handleNewGame = () => {
    if (hasActiveSession) {
      const confirmed = window.confirm(
        "Starting a new session will reset your current scores. Do you want to continue?"
      );

      if (!confirmed) return;
    }

    resetGame();
    navigate("/players");
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-10"
      >

        {/* Game logo */}
        <div className="flex flex-col items-center mb-12">

          <div className="w-24 h-24 rounded-3xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center mb-6">

            <Fingerprint
              size={55}
              className="text-purple-400"
            />

          </div>

          <h1 className="text-4xl font-black tracking-wider">
            UNDER
            <span className="text-purple-400">
              COVER
            </span>
          </h1>

          <p className="text-gray-400 mt-3 text-sm">
            Everyone has a secret.
          </p>

        </div>

        {/* Resume existing session */}
        {hasActiveSession && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleResume}
            className="w-full mb-4 bg-green-600 hover:bg-green-700 rounded-2xl p-5 flex items-center justify-between transition cursor-pointer"
          >

            <div className="flex items-center gap-3">

              <RotateCcw size={24} />

              <div className="text-left">

                <p className="font-bold text-lg">
                  Resume Session
                </p>

                <p className="text-green-100 text-xs mt-1">
                  Game {gameNumber || 1} •{" "}
                  {completedGames || 0} games completed
                </p>

              </div>

            </div>

            <ChevronRight size={20} />

          </motion.button>
        )}

        {/* Start new game */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleNewGame}
          className="w-full bg-purple-600 hover:bg-purple-700 rounded-2xl p-5 flex items-center justify-between transition cursor-pointer"
        >

          <div className="flex items-center gap-3">

            <Play size={24} />

            <span className="font-bold text-lg">
              {hasActiveSession
                ? "New Session"
                : "Start Game"}
            </span>

          </div>

          <ChevronRight size={20} />

        </motion.button>

        {/* How to play */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/how-to-play")}
          className="w-full mt-4 bg-[#1d1d30] hover:bg-[#25253a] border border-white/5 rounded-2xl p-5 flex items-center gap-3 transition cursor-pointer"
        >

          <BookOpen
            size={22}
            className="text-purple-400"
          />

          <span>How to Play</span>

          <ChevronRight
            size={18}
            className="ml-auto text-gray-500"
          />

        </motion.button>

        {/* Settings */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/settings")}
          className="w-full mt-4 bg-[#1d1d30] hover:bg-[#25253a] border border-white/5 rounded-2xl p-5 flex items-center gap-3 transition cursor-pointer"
        >

          <Settings
            size={22}
            className="text-purple-400"
          />

          <span>Settings</span>

          <ChevronRight
            size={18}
            className="ml-auto text-gray-500"
          />

        </motion.button>

        {/* Footer */}
        <div className="text-center mt-12">

          <p className="text-gray-500 text-xs">
            Offline Party Game
          </p>

          <p className="text-gray-600 text-xs mt-2">
            One Device • Multiple Friends • Unlimited Fun
          </p>

        </div>

      </motion.div>

    </div>
  );
}

export default Home;