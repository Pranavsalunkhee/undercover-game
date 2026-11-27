import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Ghost,
  Smartphone,
} from "lucide-react";

import useGameStore from "../store/gameStore";

function WordReveal() {
  const navigate = useNavigate();

  const assignedPlayers = useGameStore(
    (state) => state.assignedPlayers
  );

  const currentPlayerIndex = useGameStore(
    (state) => state.currentPlayerIndex
  );

  const gameStatus = useGameStore(
    (state) => state.gameStatus
  );

  const nextPlayer = useGameStore(
    (state) => state.nextPlayer
  );

  const [stage, setStage] = useState("pass");
  const [hasSeenWord, setHasSeenWord] = useState(false);

  const currentPlayer = assignedPlayers[currentPlayerIndex];

  // Hide the secret word when switching browser tabs
  useEffect(() => {
    const hideWord = () => {
      if (document.hidden) {
        setStage((previous) =>
          previous === "revealed" ? "hidden" : previous
        );
      }
    };

    document.addEventListener("visibilitychange", hideWord);

    return () => {
      document.removeEventListener("visibilitychange", hideWord);
    };
  }, []);

  if (gameStatus === "discussion") {
    return <Navigate to="/discussion" replace />;
  }

  if (!currentPlayer || gameStatus !== "reveal") {
    return <Navigate to="/" replace />;
  }

  const revealWord = () => {
    setStage("revealed");
    setHasSeenWord(true);
  };

  const handleNextPlayer = () => {
    if (!hasSeenWord || stage !== "hidden") return;

    const isLastPlayer =
      currentPlayerIndex === assignedPlayers.length - 1;

    setStage("pass");
    setHasSeenWord(false);

    nextPlayer();

    if (isLastPlayer) {
      navigate("/discussion", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-md">

        {/* Progress */}
        <div className="text-center mb-8">

          <p className="text-purple-400 text-sm font-semibold">
            SECRET WORD DISTRIBUTION
          </p>

          <p className="text-gray-400 mt-2">
            Player {currentPlayerIndex + 1} of{" "}
            {assignedPlayers.length}
          </p>

          <div className="w-full h-2 bg-[#25253a] rounded-full mt-4 overflow-hidden">
            <motion.div
              animate={{
                width: `${
                  ((currentPlayerIndex + 1) /
                    assignedPlayers.length) * 100
                }%`,
              }}
              className="h-full bg-purple-500 rounded-full"
            />
          </div>

        </div>

        {/* Player name */}
        <h1 className="text-3xl font-bold text-center mb-8">
          {currentPlayer.name}
        </h1>

        {/* Pass device */}
        {stage === "pass" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1d1d30] rounded-3xl p-8 text-center"
          >
            <Smartphone
              size={64}
              className="mx-auto text-purple-400 mb-6"
            />

            <h2 className="text-2xl font-bold">
              Pass the phone
            </h2>

            <p className="text-gray-400 mt-3">
              Give the device to {currentPlayer.name}.
              Make sure nobody else is looking.
            </p>

            <button
              onClick={() => setStage("hidden")}
              className="w-full mt-8 bg-purple-600 rounded-xl p-4 font-bold cursor-pointer"
            >
              I am {currentPlayer.name}
            </button>
          </motion.div>
        )}

        {/* Hidden word */}
        {stage === "hidden" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1d1d30] rounded-3xl p-8 text-center"
          >
            <Lock
              size={60}
              className="mx-auto text-purple-400 mb-6"
            />

            <h2 className="text-xl font-bold">
              Your word is hidden
            </h2>

            <p className="text-gray-400 mt-2">
              Don't let anyone see your secret word.
            </p>

            <button
              onClick={revealWord}
              className="w-full mt-8 bg-purple-600 p-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye size={20} />
              Reveal Word
            </button>

            {hasSeenWord && (
              <button
                onClick={handleNextPlayer}
                className="w-full mt-4 bg-[#303047] p-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                {currentPlayerIndex === assignedPlayers.length - 1
                  ? "Start Discussion"
                  : "Next Player"}

                <ArrowRight size={20} />
              </button>
            )}
          </motion.div>
        )}

        {/* Revealed word */}
        {stage === "revealed" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1d1d30] border border-purple-500/30 rounded-3xl p-8 text-center"
          >

            {currentPlayer.role === "mrWhite" ? (
              <>
                <Ghost
                  size={64}
                  className="mx-auto text-gray-300 mb-6"
                />

                <h2 className="text-3xl font-bold">
                  You are Mr. White
                </h2>

                <p className="text-gray-400 mt-4">
                  You have no secret word. Listen carefully
                  and pretend you know the word.
                </p>
              </>
            ) : (
              <>
                <p className="text-gray-400">
                  Your Secret Word
                </p>

                <h2 className="text-5xl font-black text-purple-400 mt-8 mb-8 break-words">
                  {currentPlayer.word}
                </h2>

                <p className="text-gray-400 text-sm">
                  Remember your word and keep it secret.
                </p>
              </>
            )}

            <button
              onClick={() => setStage("hidden")}
              className="w-full mt-8 bg-purple-600 p-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <EyeOff size={20} />
              Hide Word
            </button>

          </motion.div>
        )}

      </div>
    </div>
  );
}

export default WordReveal;