import "./sidebar.scss";
import { Link } from "react-router-dom";
import { useState } from "react";
import BkgrImg from "../../assets/photo-1541661538396-53ba2d051eed.avif";

const Sidebar = () => {
  const [isActive, setIsActive] = useState(true);
  return (
    <nav
      className={`sidebar ${isActive ? "active" : ""}`}
      style={{
        backgroundImage: `url(${BkgrImg})`,
      }}
    >
      <ul>
        <li>
          <Link to="/dashboard">
            <i className="bx bx-grid-alt" />
            <span>Dashboard</span>
          </Link>
          <span className="flag_text">Dashboard</span>
        </li>
        <li>
          <Link to="/profile">
            <i className="bx bx-user" />
            <span>Profile</span>
          </Link>
          <span className="flag_text">Profile</span>
        </li>
        <li>
          <Link to="/project">
            <i className="bx bx-folder" />
            <span>My projects</span>
          </Link>
          <span className="flag_text">My projects</span>
        </li>
        <li>
          <Link to="/task">
            <i className="bx bx-task" />
            <span>My tasks</span>
          </Link>
          <span className="flag_text">My tasks</span>
        </li>
        <li>
          <Link to="/project/bookmarks/saved">
            <i className="bx bx-bookmark-heart" />
            <span>Saved</span>
          </Link>
          <span className="flag_text">Saved</span>
        </li>
        <li>
          <Link to="/chart/home">
            <i className="bx bx-pie-chart-alt-2" />
            <span>Charts</span>
          </Link>
          <span className="flag_text">Charts</span>
        </li>
        <li>
          <Link to="#">
            <i className="bx bx-cog" />
            <span>Settings</span>
          </Link>
          <span className="flag_text">Settings</span>
        </li>
      </ul>
      <div className="profile_content" onClick={() => setIsActive(!isActive)}>
        <div className="profile">
          <i className="bx bx-chevron-left-circle" />
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
