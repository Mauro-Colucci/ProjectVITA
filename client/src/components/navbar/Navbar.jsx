import "./navbar.scss";
import Avatar from "../../assets/portrait2.jpg";
import { Link } from "react-router-dom";
/* import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext"; */

const Navbar = () => {
  /*   const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser, logout } = useContext(AuthContext); */

  const handleLogout = async () => {
    await logout();
  };

  const darkMode = false;

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>VITA</span>
        </Link>
        <i className="bx bx-home-alt-2" />
        {darkMode ? (
          <i
            className="bx bx-sun"
            style={{ cursor: "pointer" }}
            onClick={() => {}}
          />
        ) : (
          <i
            className="bx bx-moon"
            style={{ cursor: "pointer" }}
            onClick={() => {}}
          />
        )}
        <i className="bx bx-grid-alt" />
      </div>
      <div className="search">
        <i className="bx bx-search-alt-2" />
        <input type="text" placeholder="Search..." />
      </div>
      <div className="right">
        <i className="bx bx-user-circle" />
        <i className="bx bx-envelope" />
        <i className="bx bx-bell" />
        <div className="user" onClick={handleLogout}>
          <img src={Avatar} alt="" />
          <span>Test Name</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
