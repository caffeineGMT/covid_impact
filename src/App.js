import "./App.css";
import VerticalNav from "./components/VerticalNav";
import Home from "./components/Home";
import Animal from "./components/Animal";
import CO2 from "./components/CO2";
import Introduction from "./components/Introduction";
import Stock from "./components/Stock";
import ToiletPaper from "./components/ToiletPaper";
import Test from "./components/Test";

export default function App() {
  return (
    <div className="App">
      <VerticalNav />
      <Home />
      <Introduction />
      <ToiletPaper />
      <Stock />
      <Animal />
      <CO2 />
      <Test />
    </div>
  );
}
