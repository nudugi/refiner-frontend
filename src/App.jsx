import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppMain from "./AppMain";
import PaymentTest from "./PaymentTest";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppMain />} />
        <Route path="/payment/test" element={<PaymentTest />} />
      </Routes>
    </Router>
  );
}
