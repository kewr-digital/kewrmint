import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Mint from "./pages/Mint";
import Docs from "./pages/Docs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Mint />} />
        <Route path="/docs" element={<Docs />} />
      </Routes>
    </Router>
  );
}

export default App;
