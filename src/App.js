import "./App.css";
import VerticalNav from "./components/VerticalNav";
import Home from "./components/Home";
import Animal from "./components/Animal";
import CO2 from "./components/CO2";

export default function App() {
  return (
    <div className="App">
      <VerticalNav />
      <Home />
      <Animal />
      <CO2 />
    </div>
  );
}
