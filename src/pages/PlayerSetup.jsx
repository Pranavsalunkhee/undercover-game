import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Users,
  ArrowRight,
} from "lucide-react";

import useGameStore from "../store/gameStore";

function PlayerSetup() {
  const navigate = useNavigate();

  const savedPlayers = useGameStore(
    (state) => state.players
  );

  const setPlayers = useGameStore(
    (state) => state.setPlayers
  );

  const [players, updatePlayers] = useState(
    savedPlayers.length >= 3
      ? savedPlayers
      : ["", "", ""]
  );

  const [error, setError] = useState("");

  // Add a new player
  const addPlayer = () => {
    if (players.length >= 20) return;

    updatePlayers([...players, ""]);
    setError("");
  };

  // Update player name
  const updatePlayerName = (index, name) => {
    const updated = [...players];

    updated[index] = name;

    updatePlayers(updated);
    setError("");
  };

  // Remove a player
  const removePlayer = (index) => {
    if (players.length <= 3) return;

    updatePlayers(
      players.filter((_, i) => i !== index)
    );

    setError("");
  };

  // Validate and continue
  const handleContinue = () => {
    const cleanedPlayers = players.map(
      (player) => player.trim()
    );

    if (cleanedPlayers.some((name) => !name)) {
      setError("Please enter all player names.");
      return;
    }

    const uniqueNames = new Set(
      cleanedPlayers.map((name) =>
        name.toLowerCase()
      )
    );

    if (uniqueNames.size !== cleanedPlayers.length) {
      setError("Player names must be unique.");
      return;
    }

    setPlayers(cleanedPlayers);

    navigate("/setup");
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white px-5 py-8">

      <div className="max-w-md mx-auto">

        {/* Header */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-400 mb-8 cursor-pointer"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="flex items-center gap-3">
          <Users
            size={30}
            className="text-purple-400"
          />

          <h1 className="text-3xl font-bold">
            Add Players
          </h1>
        </div>

        <p className="text-gray-400 mt-2">
          Add the friends joining this game.
        </p>

        {/* Player count */}
        <div className="mt-6 mb-4 flex justify-between text-sm">
          <span className="text-gray-400">
            Players
          </span>

          <span className="text-purple-400 font-semibold">
            {players.length}/20
          </span>
        </div>

        {/* Player inputs */}
        <div className="space-y-3">

          {players.map((player, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-[#1d1d30] border border-white/5 rounded-xl p-3"
            >

              <div className="w-10 h-10 shrink-0 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 font-bold">
                {index + 1}
              </div>

              <input
                type="text"
                value={player}
                onChange={(e) =>
                  updatePlayerName(
                    index,
                    e.target.value
                  )
                }
                placeholder={`Player ${index + 1}`}
                aria-label={`Player ${index + 1} name`}
                maxLength={20}
                className="bg-transparent outline-none flex-1 w-full min-w-0 text-white placeholder:text-gray-500"
              />

              <button
                onClick={() => removePlayer(index)}
                disabled={players.length <= 3}
                aria-label={`Remove player ${index + 1}`}
                className="text-red-400 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
              >
                <Trash2 size={18} />
              </button>

            </motion.div>
          ))}

        </div>

        {/* Add player */}
        <button
          onClick={addPlayer}
          disabled={players.length >= 20}
          className="w-full mt-4 border border-dashed border-purple-500/50 text-purple-400 rounded-xl p-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
          Add Player
        </button>

        {/* Error message */}
        {error && (
          <p className="text-red-400 text-sm mt-4">
            {error}
          </p>
        )}

        {/* Continue */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleContinue}
          className="w-full mt-8 bg-purple-600 hover:bg-purple-700 rounded-xl p-4 font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          Continue
          <ArrowRight size={20} />
        </motion.button>

        <p className="text-center text-gray-500 text-xs mt-4">
          Minimum 3 players required
        </p>

      </div>
    </div>
  );
}

export default PlayerSetup;