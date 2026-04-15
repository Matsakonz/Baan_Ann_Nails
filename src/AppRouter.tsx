import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Gallery from './Gallery';
import Admin from './Admin';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
