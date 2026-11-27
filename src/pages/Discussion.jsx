import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "motion/react";

import {
  Users,
  MessageCircle,
  ArrowRight,
  Crown,
} from "lucide-react";

import useGameStore from "../store/gameStore";

function Discussion() {
  const navigate = useNavigate();
  const gameNumber = useGameStore(
  (state) => state.gameNumber
);

  const assignedPlayers = useGameStore(
    (state) => state.assignedPlayers
  );

  const currentRound = useGameStore(
    (state) => state.currentRound
  );

  const speakingOrder = useGameStore(
    (state) => state.speakingOrder
  );

  const gameStatus = useGameStore(
    (state) => state.gameStatus
  );

  const activePlayers = assignedPlayers.filter(
    (player) => player.isAlive
  );

  const orderedPlayers = speakingOrder
    .map((id) =>
      activePlayers.find((player) => player.id === id)
    )
    .filter(Boolean);

  const startingPlayer = orderedPlayers[0];

 if (gameStatus === "elimination") {
  return <Navigate to="/elimination" replace />;
}

if (gameStatus !== "discussion") {
  return <Navigate to="/" replace />;
}   

 const handleElimination = () => {
  useGameStore.setState({
    gameStatus: "elimination",
  });


  navigate("/elimination", { replace: true });
};

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white px-5 py-8">

      <div className="max-w-md mx-auto">

        {/* Round number */}
        <div className="text-center">

         <p className="text-purple-400 font-bold tracking-widest text-sm">
  GAME {gameNumber} • ROUND {currentRound}
</p>

          <MessageCircle
            size={48}
            className="mx-auto text-purple-400 mt-6 mb-4"
          />

          <h1 className="text-3xl font-bold">
            Discussion Time
          </h1>

          <p className="text-gray-400 mt-3">
            Describe your secret word without saying it.
            Find the suspicious players.
          </p>

        </div>

        {/* Starting player */}
        {startingPlayer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-6 bg-purple-600/15 border border-purple-500/30 rounded-2xl text-center"
          >
            <Crown
              size={32}
              className="mx-auto text-yellow-400 mb-3"
            />

            <p className="text-gray-400 text-sm">
              First to speak
            </p>

            <h2 className="text-2xl font-bold mt-2">
              {startingPlayer.name}
            </h2>
          </motion.div>
        )}

        {/* Speaking order */}
        <div className="mt-8">

          <div className="flex items-center gap-2 mb-4">
            <Users
              size={20}
              className="text-purple-400"
            />

            <h2 className="font-semibold">
              Speaking Order
            </h2>
          </div>

          <div className="space-y-3">

            {orderedPlayers.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center gap-4 bg-[#1d1d30] p-4 rounded-xl"
              >

                <div className="w-10 h-10 bg-purple-600/20 text-purple-400 rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>

                <span className="flex-1 font-medium">
                  {player.name}
                </span>

                {index === 0 && (
                  <span className="text-yellow-400 text-xs">
                    Starts
                  </span>
                )}

              </div>
            ))}

          </div>
        </div>

        <div className="mt-6 bg-[#1d1d30] rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">
            Active Players
          </p>

          <p className="text-xl font-bold mt-1">
            {activePlayers.length} / {assignedPlayers.length}
          </p>
        </div>

        {/* Proceed to elimination */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleElimination}
          className="w-full mt-8 bg-purple-600 hover:bg-purple-700 p-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          Proceed to Elimination

          <ArrowRight size={20} />
        </motion.button>

      </div>
    </div>
  );
}

export default Discussion;