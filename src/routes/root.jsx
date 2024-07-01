import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "../styles/root.css";

export default function Root() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <div id="sidebar">
        <h1>Leong Lee API</h1>
        <div>
          <button onClick={handleLogin}>Login</button>
        </div>
        <div>
          <form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search company"
              placeholder="Search"
              type="search"
              name="q"
            />
            <div id="search-spinner" aria-hidden hidden={true} />
            <div className="sr-only" aria-live="polite"></div>
          </form>
          <form method="post">
            <button type="submit">New</button>
          </form>
        </div>
        <nav>
          <ul>
            <li>
              <a href={`/co2`}>CO2 Emissions</a>
            </li>
            <li>
              <a href={`/elec`}>Electricity Emissions</a>
            </li>
          </ul>
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
