// src/components/Modals/RegisterModal/RegisterModal.jsx
import { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./RegisterModal.css";
import { fileToDataUrl } from "../../../utils/dataURL";

function RegisterModal({ isOpen, onClose, onOpenLogin, onRegister }) {
  const [avatarDataUrl, setAvatarDataUrl] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    onRegister?.({
      avatarUrl: avatarDataUrl || null,
      email: email.trim() || null,
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setAvatarDataUrl("");
      return;
    }

    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) return;

    const dataUrl = await fileToDataUrl(file);
    setAvatarDataUrl(dataUrl);
  };

  return (
    <ModalWithForm title="Sign Up" isOpen={isOpen} onClose={onClose}>
      <label className="auth__label">
        Email
        <input
          className="auth__input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
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
          required
          minLength={6}
        />
      </label>

      {/* Avatar upload */}
      <label className="auth__label">
        Avatar (optional)
        <input
          className="auth__input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>

      {avatarDataUrl && (
        <div className="auth__avatar-preview">
          <img
            className="auth__avatar-img"
            src={avatarDataUrl}
            alt="Avatar preview"
          />
        </div>
      )}

      <button
        className="auth__submit btn btn--primary"
        type="button"
        onClick={handleSubmit}
        disabled={!email.trim() || !password.trim()}
      >
        Create Account (later)
      </button>

      <button
        className="auth__link btn btn--outline btn--sm"
        type="button"
        onClick={onOpenLogin}
      >
        or Sign In
      </button>
    </ModalWithForm>
  );
}

export default RegisterModal;
