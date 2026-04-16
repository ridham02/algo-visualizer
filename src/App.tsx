import './App.css';
import Sidebar from './components/layout/SideBar';
import { SidebarInfoProvider } from './components/layout/SidebarInfoContext';
import { useEffect, useMemo, useState } from 'react';
import SortingPage from './components/pages/SortingPage';
import PathfinderPage from './components/pages/PathfinderPage';

function AppContent() {
  const normalizePath = (rawPath: string) => {
    if (rawPath.includes('pathfinder')) {
      return '/pathfinder';
    }

    return '/sorting';
  };

  const getPathFromLocation = () => {
    const hashPath = window.location.hash.replace(/^#/, '');

    if (hashPath) {
      return normalizePath(hashPath);
    }

    return normalizePath(window.location.pathname);
  };

  const [currentPath, setCurrentPath] = useState(() => getPathFromLocation());

  useEffect(() => {
    const normalizedPath = getPathFromLocation();

    if (window.location.hash !== `#${normalizedPath}`) {
      window.history.replaceState(
        {},
        '',
        `${window.location.pathname}#${normalizedPath}`
      );
    }

    setCurrentPath(normalizedPath);

    const syncPath = () => {
      setCurrentPath(getPathFromLocation());
    };

    window.addEventListener('popstate', syncPath);
    window.addEventListener('hashchange', syncPath);

    return () => {
      window.removeEventListener('popstate', syncPath);
      window.removeEventListener('hashchange', syncPath);
    };
  }, []);

  const handleNavigate = (nextPath: string) => {
    const normalizedPath = normalizePath(nextPath);

    if (normalizedPath === currentPath) {
      return;
    }

    window.history.pushState(
      {},
      '',
      `${window.location.pathname}#${normalizedPath}`
    );
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
