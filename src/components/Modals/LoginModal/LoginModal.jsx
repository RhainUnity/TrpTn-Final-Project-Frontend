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
        <input className="auth__input" type="email" placeholder="Email" />
      </label>

      <label className="auth__label">
        Password
        <input className="auth__input" type="password" placeholder="Password" />
      </label>

      {/* Stage 1: no real submit, just fake-login */}
      <button
        className="auth__submit"
        type="button"
        onClick={() => {
          onFakeLogin();
          onClose();
        }}
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
