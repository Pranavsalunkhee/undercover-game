import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Ghost, Lightbulb } from "lucide-react";

import useGameStore from "../store/gameStore";

function MrWhiteGuess() {
  const {
    assignedPlayers,
    pendingMrWhiteId,
    gameStatus,
    submitMrWhiteGuess,
  } = useGameStore();

  const [guess, setGuess] = useState("");

  const player = assignedPlayers.find(
    (player) => player.id === pendingMrWhiteId
  );

  if (gameStatus === "finished") {
    return <Navigate to="/results" replace />;
  }

  if (gameStatus === "eliminationResult") {
    return <Navigate to="/elimination" replace />;
  }

  if (gameStatus !== "mrWhiteGuess" || !player) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!guess.trim()) return;

    submitMrWhiteGuess(guess);
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white flex items-center justify-center px-6">

      <div className="w-full max-w-md text-center">

        <Ghost
          size={80}
          className="mx-auto text-gray-200 mb-6"
        />

        <h1 className="text-3xl font-bold">
          Mr. White Discovered!
        </h1>

        <h2 className="text-xl text-purple-400 mt-4">
          {player.name}
        </h2>

        <div className="bg-[#1d1d30] rounded-2xl p-6 mt-8">

          <Lightbulb
            size={35}
            className="mx-auto text-yellow-400 mb-4"
          />

          <h3 className="text-xl font-bold">
            One Last Chance
          </h3>

          <p className="text-gray-400 mt-3">
            Guess the civilians' secret word correctly
            and you win the game!
          </p>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter your guess"
              aria-label="Secret word guess"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="w-full mt-6 bg-[#0f0f1a] border border-gray-700 rounded-xl p-4 text-center text-lg outline-none focus:border-purple-500"
            />

            <button
              type="submit"
              disabled={!guess.trim()}
              className="w-full mt-5 bg-purple-600 rounded-xl p-4 font-bold cursor-pointer disabled:opacity-40"
            >
              Submit Guess
            </button>

          </form>

        </div>

        <p className="text-gray-500 text-sm mt-5">
          You only have one attempt.
        </p>

      </div>
    </div>
  );
}

export default MrWhiteGuess;