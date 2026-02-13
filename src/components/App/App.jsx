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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState(null);

  // temporary hardcoded items
  const [items, setItems] = useState([
    {
      id: 1,
      item: "Nissin Chow Mein",
      priority: "Essential",
      category: "Pantry",
      price: 2.75,
      qty: 10,
      hidden: false,
    },
  ]);

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
        avatarUrl={avatarUrl}
        onOpenLogin={openLogin}
        onSignOut={() => {
          setIsLoggedIn(false);
          setAvatarUrl(null);
        }}
      />

      <main className="page__content">
        <Routes>
          <Route path="/about" element={<About />} />
          {/* Stage 1: allow navigation even if "logged out" */}
          <Route path="/profile" element={<Profile />} />

          <Route
            path="/"
            element={<Main items={items} setItems={setItems} />}
          />
          <Route
            path="/full-list"
            element={<FullList items={items} setItems={setItems} />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={closeAllModals}
        onFakeLogin={() => setIsLoggedIn(true)}
        onOpenRegister={openRegister}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={closeAllModals}
        onOpenLogin={openLogin}
        onRegister={({ avatarUrl }) => {
          setIsLoggedIn(true);
          setAvatarUrl(avatarUrl || null);
          closeAllModals();
        }}
      />
    </div>
  );
}

export default App;
