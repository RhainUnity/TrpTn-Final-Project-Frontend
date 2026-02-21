// src/components/Header/Header.jsx
import { Link, NavLink } from "react-router-dom";
import "./Header.css";
import defaultAvatar from "../../assets/default-avatar.svg";

function Header({ isLoggedIn, email, avatarUrl, onOpenLogin, onSignOut }) {
  return (
    <header className="header">
      <Link to="/" className="header__logo">
        Easy Budget Shopping App
      </Link>

      <nav className="header__nav">
        <NavLink to="/about" className="header__link header__link--about">
          About
        </NavLink>

        {/* Avatar area */}
        {isLoggedIn ? (
          <NavLink
            to="/profile"
            className="header__avatar-link"
            aria-label="Profile"
          >
            <span className="header__email">{email}</span>
            <span className="header__avatar">
              {avatarUrl ? (
                <img
                  className="header__avatar-img"
                  src={avatarUrl}
                  alt="Profile avatar"
                />
              ) : (
                <img
                  className="header__avatar-img"
                  src={defaultAvatar}
                  alt="Default avatar"
                />
              )}
            </span>
          </NavLink>
        ) : (
          <button
            type="button"
            className="header__avatar-link header__avatar-btn"
            onClick={onOpenLogin}
            aria-label="Sign in"
            title="Sign in"
          >
            <span className="header__avatar header__avatar--empty" />
          </button>
        )}

        {/* Sign In / Out Button */}
        {isLoggedIn ? (
          <button className="header__btn" type="button" onClick={onSignOut}>
            Sign Out
          </button>
        ) : (
          <button className="header__btn" type="button" onClick={onOpenLogin}>
            Sign In
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
