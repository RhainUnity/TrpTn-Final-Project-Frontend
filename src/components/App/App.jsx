// src/components/App/App.jsx
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import { signup, signin, checkToken } from "../../utils/auth";
import { readJSON, writeJSON, remove } from "../../utils/storage";

import Header from "../Header/Header";
import Main from "../Main/Main";
import Profile from "../Profile/Profile";
import Footer from "../Footer/Footer";
import FullList from "../FullList/FullList";
import About from "../About/About";

import LoginModal from "../Modals/LoginModal/LoginModal";
import RegisterModal from "../Modals/RegisterModal/RegisterModal";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState("");

  const STORE_TABS = ["WinCo", "Safeway", "Albertson’s"];
  const [activeStore, setActiveStore] = useState("Safeway");

  const [userItems, setUserItems] = useState(() => {
    const stored = readJSON("userItems", {});
    const userKey = readJSON("currentUser", null)?._id || "guest";

    const existing = stored[userKey];
    if (Array.isArray(existing)) {
      return {
        ...stored,
        [userKey]: { Safeway: existing },
      };
    }

    return stored;
  });

  const isLoggedIn = Boolean(currentUser);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const userKey = currentUser?._id || "guest";
  const storeLists = userItems[userKey] || {};
  const items = storeLists[activeStore] || [];

  const setItemsForUserStore = (store, updater) => {
    setUserItems((prev) => {
      const userData = prev[userKey] || {};
      const currentStoreItems = userData[store] || [];
      const nextStoreItems =
        typeof updater === "function" ? updater(currentStoreItems) : updater;

      return {
        ...prev,
        [userKey]: {
          ...userData,
          [store]: nextStoreItems,
        },
      };
    });
  };

  const setItemsForActiveStore = (updater) =>
    setItemsForUserStore(activeStore, updater);

  useEffect(() => {
    if (currentUser) {
      writeJSON("currentUser", currentUser);
    } else {
      remove("currentUser");
    }
  }, [currentUser]);

  useEffect(() => {
    writeJSON("userItems", userItems);
  }, [userItems]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    checkToken(token)
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch(() => {
        localStorage.removeItem("jwt");
        setCurrentUser(null);
      });
  }, []);

  const handleSignIn = ({ email, password }) => {
    setAuthError("");

    return signin({ email, password })
      .then((data) => {
        localStorage.setItem("jwt", data.token);
        return checkToken(data.token);
      })
      .then((userData) => {
        setCurrentUser(userData);
        closeAllModals();
      })
      .catch((err) => {
        setAuthError(err.message || "Sign in failed");
      });
  };

  const handleRegister = ({ name, email, password }) => {
    setAuthError("");

    return signup({ name, email, password })
      .then(() => signin({ email, password }))
      .then((data) => {
        localStorage.setItem("jwt", data.token);
        return checkToken(data.token);
      })
      .then((userData) => {
        setCurrentUser(userData);
        closeAllModals();
      })
      .catch((err) => {
        setAuthError(err.message || "Registration failed");
      });
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    setActiveStore("Safeway");
  };

  const closeAllModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setAuthError("");
  };

  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
    setAuthError("");
  };

  const openRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
    setAuthError("");
  };

  return (
    <div className="page">
      <Header
        isLoggedIn={isLoggedIn}
        email={currentUser?.email || ""}
        avatarUrl={currentUser?.avatarUrl || null}
        onOpenLogin={openLogin}
        onSignOut={handleSignOut}
      />

      <main className="page__content">
        <Routes>
          <Route path="/about" element={<About />} />

          <Route
            path="/profile"
            element={
              <Profile
                isLoggedIn={isLoggedIn}
                user={currentUser}
                itemCount={items.length}
                onUpdateAvatar={(avatarPatch) =>
                  setCurrentUser((prev) =>
                    prev ? { ...prev, ...avatarPatch } : prev,
                  )
                }
              />
            }
          />

          <Route
            path="/"
            element={
              <Main
                items={items}
                setItems={setItemsForActiveStore}
                activeStore={activeStore}
                setActiveStore={setActiveStore}
                stores={STORE_TABS}
              />
            }
          />

          <Route
            path="/full-list"
            element={
              <FullList
                items={items}
                setItems={setItemsForActiveStore}
                activeStore={activeStore}
                setActiveStore={setActiveStore}
                stores={STORE_TABS}
              />
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={closeAllModals}
        onLogin={handleSignIn}
        onOpenRegister={openRegister}
        authError={authError}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={closeAllModals}
        onOpenLogin={openLogin}
        onRegister={handleRegister}
        authError={authError}
      />
    </div>
  );
}

export default App;
