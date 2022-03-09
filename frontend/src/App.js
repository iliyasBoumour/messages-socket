import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./utils/store";
import IsAuth from "./components/IsAuth";
import Login from "./Login";
import Chat from "./Chat";
function App() {
  window.id = 1;
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route exact element={<IsAuth needAuth={true} />}>
            {/* pages qui necessite un auth user */}
            <Route path="/" element={<Chat />} />
          </Route>
          <Route exact element={<IsAuth needAuth={false} path="/login" />}>
            {/* on peut ajouter les pages dont les users authentifie ne l'ont pas acces */}
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </Router>
    </StoreProvider>
  );
}

export default App;
