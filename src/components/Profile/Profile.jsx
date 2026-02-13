// src/components/Profile/Profile.jsx

import "./Profile.css";

function Profile({ isLoggedIn, user, itemCount }) {
  if (!isLoggedIn) {
    return (
      <section className="profile">
        <h2>Profile</h2>
        <p>Please sign in to view your profile and saved lists.</p>
      </section>
    );
  }

  return (
    <section className="profile">
      <h2>Profile</h2>

      <div className="profile__card">
        {user?.avatarUrl ? (
          <img className="profile__avatar" src={user.avatarUrl} alt="Avatar" />
        ) : (
          <div className="profile__avatar profile__avatar--placeholder" />
        )}

        <div className="profile__info">
          <p>
            <strong>Email:</strong> {user?.email || "Unknown"}
          </p>
          <p>
            <strong>Saved items:</strong> {itemCount}
          </p>
        </div>
      </div>
    </section>
  );
}

export default Profile;
