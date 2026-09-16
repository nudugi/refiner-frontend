import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Works from './pages/Works';
import About from './pages/About';
import Tools from './pages/Tools';
import RefinerTool from './pages/RefinerTool';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/works" element={<Works />} />
      <Route path="/about" element={<About />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/refiner" element={<RefinerTool />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
