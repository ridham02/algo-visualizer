import './App.css';
import Sidebar from './components/layout/SideBar';
import { SidebarInfoProvider } from './components/layout/SidebarInfoContext';
import { useEffect, useMemo, useState } from 'react';
import SortingPage from './components/pages/SortingPage';
import PathfinderPage from './components/pages/PathfinderPage';

function AppContent() {
  const normalizePath = (pathname: string) => {
    if (pathname.startsWith('/pathfinder')) {
      return '/pathfinder';
    }

    return '/sorting';
  };

  const [currentPath, setCurrentPath] = useState(() =>
    normalizePath(window.location.pathname)
  );

  useEffect(() => {
    const normalizedPath = normalizePath(window.location.pathname);

    if (window.location.pathname !== normalizedPath) {
      window.history.replaceState({}, '', normalizedPath);
    }

    setCurrentPath(normalizedPath);

    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (nextPath: string) => {
    const normalizedPath = normalizePath(nextPath);

    if (normalizedPath === currentPath) {
      return;
    }

    window.history.pushState({}, '', normalizedPath);
    setCurrentPath(normalizedPath);
  };

  const page = useMemo(() => {
    if (currentPath === '/pathfinder') {
      return <PathfinderPage />;
    }

    return <SortingPage />;
  }, [currentPath]);

  return (
    <div className="d-flex app-shell">
      <Sidebar currentPath={currentPath} onNavigate={handleNavigate} />

      <div className="app-content">
        {page}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SidebarInfoProvider>
      <AppContent />
    </SidebarInfoProvider>
  );
}
