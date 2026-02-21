// src/components/Modals/RegisterModal/RegisterModal.jsx
import { useEffect, useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./RegisterModal.css";
import { fileToDataUrl } from "../../../utils/dataURL";

function RegisterModal({ isOpen, onClose, onOpenLogin, onRegister }) {
  const [avatarDataUrl, setAvatarDataUrl] = useState("");

  // ----------------------------------------------------------------------
  /* ------------  Option to use Url for preview instead of dataUrl  ------------ */
  // const [avatarPreview, setAvatarPreview] = useState("");

  // useEffect(() => {
  //   if (!avatarFile) {
  //     setAvatarPreview("");
  //     return;
  //   }

  //   const url = URL.createObjectURL(avatarFile);
  //   setAvatarPreview(url);

  //   return () => URL.revokeObjectURL(url);
  // }, [avatarFile]);
  /* ------------  Option to use Url for preview instead of dataUrl  ------------ */
  // ------------------------------------------------------------------------

  const handleSubmit = () => {
    // no real auth yet — just pass avatar up
    onRegister?.({
      avatarUrl: avatarDataUrl || null,
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setAvatarDataUrl("");
      return;
    }

    // image guardrails
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) return; // 2MB

    const dataUrl = await fileToDataUrl(file);
    setAvatarDataUrl(dataUrl);
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
