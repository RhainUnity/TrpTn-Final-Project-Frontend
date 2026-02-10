// src/components/Modals/RegisterModal/RegisterModal.jsx
import { useEffect, useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./RegisterModal.css";

function RegisterModal({ isOpen, onClose, onOpenLogin, onRegister }) {
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview("");
      return;
    }

    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const handleSubmit = () => {
    // no real auth yet — just pass avatar up
    onRegister?.({
      avatarUrl: avatarPreview || null,
    });
  };

  return (
    <ModalWithForm title="Sign Up" isOpen={isOpen} onClose={onClose}>
      <label className="auth__label">
        Email
        <input className="auth__input" type="email" placeholder="Email" />
      </label>

      <label className="auth__label">
        Password
        <input className="auth__input" type="password" placeholder="Password" />
      </label>

      {/* Avatar upload */}
      <label className="auth__label">
        Avatar (optional)
        <input
          className="auth__input"
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
        />
      </label>

      {avatarPreview && (
        <div className="auth__avatar-preview">
          <img
            className="auth__avatar-img"
            src={avatarPreview}
            alt="Avatar preview"
          />
        </div>
      )}

      <button className="auth__submit" type="button" onClick={handleSubmit}>
        Create Account (later)
      </button>

      <button className="auth__link" type="button" onClick={onOpenLogin}>
        or Sign In
      </button>
    </ModalWithForm>
  );
}

export default RegisterModal;
