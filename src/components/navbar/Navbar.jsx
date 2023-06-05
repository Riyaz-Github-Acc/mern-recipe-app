import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import logo from "../../assets/navbar/logo.png";
import menu from "../../assets/navbar/menu.png";
import "./Navbar.css";

const Navbar = () => {
  const [cookies, setCookies, remove] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const [toggle, setToggle] = useState(false);

  const handleLogout = () => {
    remove("access_token", { path: "/" });
    window.localStorage.removeItem("userID");
    navigate("/auth");
  };

  return (
    <div className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="logo link" onClick={() => setToggle(false)}>
          <img src={logo} alt="logo" />
          <span>MERN Recipe App</span>
        </Link>

        <div className="nav-links">
          <div className="menu">
            <img src={menu} alt="menu" onClick={() => setToggle(!toggle)} />
          </div>

          <nav className={`${!toggle ? "hide" : ""}`}>
            <Link
              to="/"
              className="link nav-link"
              onClick={() => setToggle(false)}
            >
              Home
            </Link>

            <Link
              to="/create-recipe"
              className="link nav-link"
              onClick={() => setToggle(false)}
            >
              Create Recipe
            </Link>

            {cookies.access_token ? (
              <Link
                to="/my-recipes"
                className="link nav-link"
                onClick={() => setToggle(false)}
              >
                My Recipes
              </Link>
            ) : (
              ""
            )}

            {cookies.access_token ? (
              <Link
                to="/saved-recipes"
                className="link nav-link"
                onClick={() => setToggle(false)}
              >
                Saved Recipes
              </Link>
            ) : (
              ""
            )}

            {!cookies.access_token ? (
              <Link
                to="/auth"
                className="link nav-link"
                onClick={() => setToggle(false)}
              >
                <button className="btn nav-btn">Login/Register</button>
              </Link>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setToggle(false);
                }}
                className="btn nav-btn"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
