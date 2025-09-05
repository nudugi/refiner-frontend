import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppMain from "./AppMain";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppMain />} />
      </Routes>
    </Router>
  );
}
