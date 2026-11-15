import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Objects from './pages/Objects';
import About from './pages/About';
import Tools from './pages/Tools';
import RefinerTool from './pages/RefinerTool';
import NotFound from './pages/NotFound';
import ExhibitionsIndex from './archive/pages/ExhibitionsIndex';
import ExhibitionPage from './archive/pages/ExhibitionPage';
import ArtistsIndex from './archive/pages/ArtistsIndex';
import ArtistPage from './archive/pages/ArtistPage';
import WorksIndex from './archive/pages/WorksIndex';
import WorkPage from './archive/pages/WorkPage';
import SpacePage from './archive/pages/SpacePage';
import { redirectMap } from './archive/data';

export default function App() {
  // slug가 바뀐 예전 주소 → 새 주소 (content/redirects.yaml)
  const { pathname } = useLocation();
  const redirectTo = redirectMap[pathname.replace(/\/$/, '')];
  if (redirectTo) return <Navigate to={redirectTo} replace />;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* 스튜디오 오리지널 오브제(판매 영역). 아카이브와 분리된 곳 */}
      <Route path="/objects" element={<Objects />} />
      <Route path="/about" element={<About />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/refiner" element={<RefinerTool />} />

      {/* SUNYA 아카이브: 영구 주소. 가격·구매·광고 금지 */}
      <Route path="/exhibitions" element={<ExhibitionsIndex />} />
      <Route path="/exhibitions/:slug" element={<ExhibitionPage />} />
      <Route path="/artists" element={<ArtistsIndex />} />
      <Route path="/artists/:slug" element={<ArtistPage />} />
      <Route path="/works" element={<WorksIndex />} />
      <Route path="/works/:slug" element={<WorkPage />} />
      <Route path="/spaces/:slug" element={<SpacePage />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
