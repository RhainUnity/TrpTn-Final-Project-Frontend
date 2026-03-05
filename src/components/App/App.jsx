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

  const STORE_TABS = ["WinCo", "Safeway", "Albertson’s"];
  const [activeStore, setActiveStore] = useState("Safeway");

  /* ------------------------------ */
  // One-time migration: convert old array format to store-based format
  const [userItems, setUserItems] = useState(() => {
    const stored = readJSON("userItems", {});
    const userKey = readJSON("currentUser", null)?.id || "guest";

    const existing = stored[userKey];
    if (Array.isArray(existing)) {
      return {
        ...stored,
        [userKey]: { Safeway: existing },
      };
    }

    return stored;
  });
  /* ------------------------------ */

  const isLoggedIn = Boolean(currentUser);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const userKey = currentUser?.id || "guest";

  // Ensure we always have an object for this user
  const storeLists = userItems[userKey] || {};

  // Items for the currently selected store
  const items = storeLists[activeStore] || [];

  // Store-specific setter
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

  // Wrapper so components can just call setItems(updater)
  const setItemsForActiveStore = (updater) =>
    setItemsForUserStore(activeStore, updater);

  // ------//////////// temporoary persistence of current user ////////////
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
    setActiveStore("Safeway"); // reset to default store on sign out
  };
  // -----//////////////////////////////////

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
