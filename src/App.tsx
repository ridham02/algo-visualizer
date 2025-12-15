import './App.css';
import Sidebar from './components/layout/SideBar';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SortingPage from './components/pages/SortingPage';
import PathfinderPage from './components/pages/PathfinderPage';

function AppContent() {

  return (
    <div className="d-flex">
      <Sidebar />

      <div style={{ width: "100%" }}>
        <Routes>  
          <Route path="/" element={<Navigate to="/sorting" replace />} />
          <Route path="/sorting/*" element={<SortingPage/>} />
          <Route path="/pathfinder/*" element={<PathfinderPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
