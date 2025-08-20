import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { WalletProvider } from "./contexts/WalletContext";
import Mint from "./pages/Mint";
import About from "./pages/About";
import Home from "./pages/Home";
import Explorer from "./pages/Explorer";
import DetailTx from "./pages/DetailTx";

function App() {
  return (
    <WalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorer" element={<Explorer />} />
          <Route path="/tx/:hash" element={<DetailTx />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </WalletProvider>
  );
}

export default App;
