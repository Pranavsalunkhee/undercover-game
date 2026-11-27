import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import PlayerSetup from "./pages/PlayerSetup";
import GameConfig from "./pages/GameConfig";
import WordReveal from "./pages/WordReveal";
import Discussion from "./pages/Discussion";
import Elimination from "./pages/Elimination";
import MrWhiteGuess from "./pages/MrWhiteGuess";
import Results from "./pages/Results";
import HowToPlay from "./pages/HowToPlay";
import Settings from "./pages/Settings";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/players"
          element={<PlayerSetup />}
        />

        <Route
          path="/setup"
          element={<GameConfig />}
        />

        <Route
          path="/reveal"
          element={<WordReveal />}
        />

        <Route
          path="/discussion"
          element={<Discussion />}
        />

        <Route path="/elimination" 
        element={<Elimination />} />

        <Route
          path="/guess"
          element={<MrWhiteGuess />}
        />

        <Route
          path="/results"
          element={<Results />}
        />

        <Route
          path="/how-to-play"
          element={<HowToPlay />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;