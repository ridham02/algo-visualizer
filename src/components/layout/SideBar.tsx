import { NavLink } from "react-router-dom";
import './layout.css'

export default function Sidebar() {

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-white"
      style={{ width: "260px", height: "100vh" , backgroundColor: "#434E78"}}>
      <a
        href="/"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span className="fs-4">Algo Visualizer</span>
      </a>

      <hr/>

      <ul className="nav nav-pills flex-column mb-auto">

        <li className="nav-item">
          <NavLink
            to="/sorting"
            className={({ isActive }) =>
              "nav-link text-white " + (isActive ? "activeColor" : "")} end={false}>
            Sorting Algorithms
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/pathfinder"
            className={({ isActive }) =>
              "nav-link text-white " + (isActive ? "activeColor" : "")} end={false}>
            Pathfinder Algorithms
          </NavLink>
        </li>

      </ul>

      <hr />

      <div className="text-center small text-secondary">
        © {new Date().getFullYear()} Ridham Arora
      </div>
    </div>
  );
}
