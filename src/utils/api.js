// src/utils/api.js

const BASE_URL = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("jwt");
}

// function checkResponse(res) {
//   if (!res.ok) {
//     return res.json().then((err) => Promise.reject(err));
//   }

//   return res.json();
// }

// function getToken() {
//   return localStorage.getItem("jwt");
// }

function checkResponse(res) {
  if (!res.ok) {
    return res.json().then((err) => {
      console.log("API ERROR:", err);
      return Promise.reject(err);
    });
  }

  return res.json();
}

export function getItems() {
  return fetch(`${BASE_URL}/items`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  }).then(checkResponse);
}

export function createItem(itemData) {
  return fetch(`${BASE_URL}/items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  }).then(checkResponse);
}

export function deleteItem(itemId) {
  return fetch(`${BASE_URL}/items/${itemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  }).then(checkResponse);
}
