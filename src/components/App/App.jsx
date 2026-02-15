// src/components/App/App.jsx
import { useState, useEffect } from "react";
import { readJSON, writeJSON, remove } from "../../utils/storage";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Header from "../Header/Header";
import Main from "../Main/Main";
import Profile from "../Profile/Profile";
import Footer from "../Footer/Footer";
import FullList from "../FullList/FullList";
import About from "../About/About";

import LoginModal from "../Modals/LoginModal/LoginModal";
import RegisterModal from "../Modals/RegisterModal/RegisterModal";

function App() {

  const [currentUser, setCurrentUser] = useState(() =>
    readJSON("currentUser", null),
  );

  const [userItems, setUserItems] = useState(() => readJSON("userItems", {}));

  const isLoggedIn = Boolean(currentUser);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const userKey = currentUser?.id || "guest";
  const items = userItems[userKey] || [];

  const setItemsForUser = (updater) => {
    setUserItems((prev) => {
      const current = prev[userKey] || [];
      const nextItems =
        typeof updater === "function" ? updater(current) : updater;

      return {
        ...prev,
        [userKey]: nextItems,
      };
    });
  };

  // //////////// temporoary persistence of current user ////////////
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

  const handleSignOut = () => {
    setCurrentUser(null);
  };
  // //////////////////////////////////

  const closeAllModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const openRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
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
          {/* Stage 1: allow navigation using localstorage for user state */}
          <Route
            path="/profile"
            element={
              <Profile
                isLoggedIn={isLoggedIn}
                user={currentUser}
                itemCount={items.length}
                onUpdateAvatar={(avatarPatch) =>
                  setCurrentUser((prev) => (prev ? { ...prev, ...avatarPatch } : prev))
                }
              />
            }
          />

          <Route
            path="/"
            element={<Main items={items} setItems={setItemsForUser} />}
          />
          <Route
            path="/full-list"
            element={<FullList items={items} setItems={setItemsForUser} />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={closeAllModals}
        onFakeLogin={(email) => {
          const simplified = email.trim().toLowerCase();
          setCurrentUser({
            id: simplified,
            email: simplified,
            avatarUrl: currentUser?.avatarUrl || null,
          });
        }}
        onOpenRegister={openRegister}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={closeAllModals}
        onOpenLogin={openLogin}
        onRegister={({ avatarUrl }) => {
          const existing = currentUser?.id;
          const id = existing || `guest-${Date.now()}`;
          const email = currentUser?.email || "guest@example.com";

          setCurrentUser({ id, email, avatarUrl: avatarUrl || null });
          closeAllModals();
        }}
      />
    </div>
  );
}

export default App;
