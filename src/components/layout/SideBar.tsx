import { useSidebarInfo } from "./SidebarInfoContext";
import './layout.css'

type SidebarProps = {
  currentPath: string;
  onNavigate: (path: string) => void;
};

export default function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  const { title, items } = useSidebarInfo();

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-white sidebar-shell"
      style={{ width: "260px", backgroundColor: "#434E78" }}>
      <a
        href="/sorting"
        onClick={(event) => {
          event.preventDefault();
          onNavigate("/sorting");
        }}
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span className="fs-4">Algo Visualizer</span>
      </a>

      <hr/>

      <ul className="nav nav-pills flex-column mb-auto">

        <li className="nav-item">
          <button
            type="button"
            onClick={() => onNavigate("/sorting")}
            className={
              "nav-link text-white sidebar-nav-button " +
              (currentPath === "/sorting" ? "activeColor" : "")
            }>
            Sorting Algorithms
          </button>
        </li>

        <li className="nav-item">
          <button
            type="button"
            onClick={() => onNavigate("/pathfinder")}
            className={
              "nav-link text-white sidebar-nav-button " +
              (currentPath === "/pathfinder" ? "activeColor" : "")
            }>
            Pathfinder Algorithms
          </button>
        </li>

      </ul>

      {items.length > 0 && (
        <>
          <hr />

          <div className="sidebar-info-panel">
            <div className="sidebar-info-title">{title}</div>
            {items.map((item) => (
              <div key={item.label} className="sidebar-info-row">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </>
      )}

      <hr />

      <div className="text-center small text-secondary">
        © {new Date().getFullYear()} Ridham Arora
      </div>
    </div>
  );
}
