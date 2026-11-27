import { create } from "zustand";
import { persist } from "zustand/middleware";
import {calculateScores, updateLeaderboard,} from "../engine/scoring";

import { assignRoles } from "../engine/roleAssignment";
import { selectRandomWords } from "../engine/wordSelection";
import { detectWinner } from "../engine/winnerDetection";

const initialGameState = {
  assignedPlayers: [],
  words: null,
  currentPlayerIndex: 0,
  currentRound: 1,
  startingPlayerId: null,
  speakingOrder: [],
  gameStatus: "setup",
  winner: null,
  winningPlayerId: null,
  lastEliminated: null,
  pendingMrWhiteId: null,
  eliminationHistory: [],
};

// Generate speaking order
const generateSpeakingOrder = (players) => {
  const activePlayers = players.filter(
    (player) => player.isAlive
  );

  if (activePlayers.length === 0) return [];

  const randomIndex = Math.floor(
    Math.random() * activePlayers.length
  );

  return [
    ...activePlayers.slice(randomIndex),
    ...activePlayers.slice(0, randomIndex),
  ].map((player) => player.id);
};

// Complete an elimination
const completeElimination = (state, playerId) => {
  const player = state.assignedPlayers.find(
    (player) => player.id === playerId
  );

  if (!player || !player.isAlive) return state;

  const updatedPlayers = state.assignedPlayers.map(
    (player) =>
      player.id === playerId
        ? { ...player, isAlive: false }
        : player
  );

  const winner = detectWinner(updatedPlayers);

  return {
    assignedPlayers: updatedPlayers,
    lastEliminated: {
      ...player,
      isAlive: false,
    },
    pendingMrWhiteId: null,
    eliminationHistory: [
      ...state.eliminationHistory,
      {
        id: player.id,
        name: player.name,
        role: player.role,
        round: state.currentRound,
      },
    ],
    winner,
    gameStatus: "eliminationResult",
  };
};

const finishGame = (state) => {
  if (state.scoreAwarded || !state.winner) {
    return {
      gameStatus: "finished",
    };
  }

  const gameScores = calculateScores(
    state.assignedPlayers,
    state.winner,
    state.winningPlayerId
  );

  const scores = updateLeaderboard(
    state.scores,
    gameScores
  );

  return {
    gameStatus: "finished",
    scores,
    lastGameScores: gameScores,
    completedGames: state.completedGames + 1,
    scoreAwarded: true,
  };
};

const useGameStore = create(
  persist(
    (set, get) => ({
      // Player configuration
      players: [],
      undercoverCount: 1,
      mrWhiteCount: 0,
      selectedLibrary: "general",

setSelectedLibrary: (library) =>
  set({ selectedLibrary: library }),

      // Session management
      scores: {},
      gameNumber: 1,
      completedGames: 0,
      lastGameScores: [],
      scoreAwarded: false,

      // Initial game state
      ...initialGameState,

      // Player management
      setPlayers: (players) => set({ players }),

      setUndercoverCount: (count) =>
        set({ undercoverCount: count }),

      setMrWhiteCount: (count) =>
        set({ mrWhiteCount: count }),

      // Start game
      startGame: () => {
        const {
  players,
  undercoverCount,
  mrWhiteCount,
  completedGames,
  selectedLibrary,
} = get();

const words = selectRandomWords(selectedLibrary);

        const assignedPlayers = assignRoles(
          players,
          undercoverCount,
          mrWhiteCount,
          words
        );

        set({
          ...initialGameState,
          assignedPlayers,
          words,
          gameNumber: completedGames + 1,
          scoreAwarded: false,
          lastGameScores: [],
          gameStatus: "reveal",
        });
      },

      // Secret word distribution
      nextPlayer: () => {
        const {
          currentPlayerIndex,
          assignedPlayers,
          gameStatus,
        } = get();

        if (gameStatus !== "reveal") return;

        if (
          currentPlayerIndex <
          assignedPlayers.length - 1
        ) {
          set({
            currentPlayerIndex: currentPlayerIndex + 1,
          });
        } else {
          const speakingOrder =
            generateSpeakingOrder(assignedPlayers);

          set({
            speakingOrder,
            startingPlayerId: speakingOrder[0],
            gameStatus: "discussion",
          });
        }
      },

      // Start elimination phase
      startElimination: () => {
        if (get().gameStatus !== "discussion") return;

        set({
          gameStatus: "elimination",
        });
      },

      // Eliminate selected player
      eliminatePlayer: (playerId) => {
        const state = get();

        if (state.gameStatus !== "elimination") return;

        const player = state.assignedPlayers.find(
          (player) => player.id === playerId
        );

        if (!player || !player.isAlive) return;

        // Give Mr. White a guessing opportunity
        if (player.role === "mrWhite") {
          set({
            pendingMrWhiteId: player.id,
            gameStatus: "mrWhiteGuess",
          });

          return;
        }

        set(completeElimination(state, playerId));
      },

      // Mr. White guess
      submitMrWhiteGuess: (guess) => {
        const state = get();

        if (
          state.gameStatus !== "mrWhiteGuess" ||
          state.pendingMrWhiteId === null ||
          !state.words
        ) {
          return;
        }

        const normalizedGuess = guess
          .trim()
          .toLowerCase()
          .replace(/\s+/g, " ");

        if (!normalizedGuess) return;

        const correctWord = state.words.civilian
          .trim()
          .toLowerCase()
          .replace(/\s+/g, " ");

        // Correct guess
        if (normalizedGuess === correctWord) {
          const winningState = {
            ...state,
            winner: "mrWhite",
            winningPlayerId: state.pendingMrWhiteId,
            pendingMrWhiteId: null,
          };

          set({
            winner: "mrWhite",
            winningPlayerId: state.pendingMrWhiteId,
            pendingMrWhiteId: null,
            ...finishGame(winningState),

          });

          return true;
        }

        // Incorrect guess
        set(
          completeElimination(
            state,
            state.pendingMrWhiteId
          )
        );

        return false;
      },

      // Continue after elimination
      continueAfterElimination: () => {
        const state = get();

        if (
          state.gameStatus !== "eliminationResult"
        ) {
          return;
        }

        // Finish game and award points
        if (state.winner) {
          set(finishGame(state));
          return;
        }

        // Start next discussion round
        const speakingOrder = generateSpeakingOrder(
          state.assignedPlayers
        );

        set({
          currentRound: state.currentRound + 1,
          speakingOrder,
          startingPlayerId: speakingOrder[0],
          gameStatus: "discussion",
          lastEliminated: null,
        });
      },

      // Discuss again if voting is tied
      discussAgain: () => {
        if (get().gameStatus !== "elimination") return;

        set({
          gameStatus: "discussion",
        });
      },

      // Continue playing with the same friends
      nextGame: () => {
        if (get().gameStatus !== "finished") return;

        get().startGame();
      },

      // Reset the current session
      resetGame: () =>
        set({
          ...initialGameState,
          scores: {},
          gameNumber: 1,
          completedGames: 0,
          lastGameScores: [],
          scoreAwarded: false,
        }),
    }),

    // LocalStorage configuration
    {
      name: "undercover-game-storage",
    }
  )
);

export default useGameStore;
