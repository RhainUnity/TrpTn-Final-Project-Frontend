// src/components/Profile/Profile.jsx
import { useEffect, useState} from "react";
import "./Profile.css";

function Profile({ isLoggedIn, user, itemCount, onUpdateAvatar }) {
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    setAvatarUrl(user?.avatarUrl || "");
  }, [user]);

  if (!isLoggedIn) {
    return (
      <section className="profile">
        <h2>Profile</h2>
        <p>Please sign in to view your profile and saved lists.</p>
      </section>
    );
  }

const handleSave = () => {
    const trimmed = avatarUrl.trim();
    onUpdateAvatar?.({ avatarUrl: trimmed || null });
  };

  const handleReset = () => {
    setAvatarUrl(user?.avatarUrl || null);
  };

  return (
    <section className="profile">
      <h2>Profile</h2>

      <div className="profile__card">
        <img
          className="profile__avatar"
          src={user?.avatarUrl || "https://via.placeholder.com/96?text=User"}
          alt="Avatar"
        />

        <div className="profile__info">
          <p>
            <strong>Email:</strong> {user?.email || "Unknown"}
          </p>
          <p>
            <strong>Saved items:</strong> {itemCount}
          </p>
        </div>
      </div>
       <div className="profile__editor">
        <label className="profile__label">
          Avatar URL
          <input
            className="profile__input"
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/avatar.png"
          />
        </label>

        <div className="profile__actions">
          <button className="profile__btn" type="button" onClick={handleSave}>
            Save Avatar
          </button>
          <button
            className="profile__btn profile__btn--secondary"
            type="button"
            onClick={handleReset}
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
}

export default Profile;
