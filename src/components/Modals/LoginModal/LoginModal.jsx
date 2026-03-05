// src/components/Modals/LoginModal/LoginModal.jsx
import { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./LoginModal.css";

function LoginModal({ isOpen, onClose, onFakeLogin, onOpenRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ModalWithForm title="Sign In" isOpen={isOpen} onClose={onClose}>
      <label className="auth__label">
        Email
        <input
          className="auth__input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label className="auth__label">
        Password
        <input
          className="auth__input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      {/* Stage 1: local submitted fake login*/}
      <button
        className="auth__submit"
        type="button"
        onClick={() => {
          onFakeLogin(email, password);
          onClose();
        }}
        disabled={!email.trim() || !password.trim()}
      >
        Sign In
      </button>

      <button className="auth__link" type="button" onClick={onOpenRegister}>
        or Sign Up
      </button>
    </ModalWithForm>
  );
}

export default LoginModal;
