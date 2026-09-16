import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RefinerTool from './pages/RefinerTool';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/refiner" element={<RefinerTool />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
