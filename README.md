# Easy Budget Shopping App

## Project Description

Easy Budget Shopping App is a full-stack web application that helps users plan and manage grocery shopping while staying within budget. Users can create accounts, manage personalized shopping lists, and use real-world pricing data to estimate costs.

The app integrates with the U.S. Bureau of Labor Statistics (BLS) API to provide average prices for common grocery items, giving users a practical reference for budgeting.

---

## Live Demo

🔗 https://trp-tn-final-project-frontend.vercel.app

---

## Features

### User Features

- User registration and login (JWT authentication)
- Persistent user data with MongoDB
- Personalized shopping lists by store
- Add, edit, and delete items
- Assign item details:
  - Name
  - Category
  - Priority
  - Quantity
  - Price
- Store selection (e.g., Safeway, WinCo, Albertsons)

### Pricing Features

- Lookup average grocery prices using the BLS API
- Auto-fill item price based on search
- Displays:
  - Item label
  - Average price
  - Unit (e.g., per dozen, per gallon)
  - Month and year of data

### UI / UX

- Modal-based interactions
- Responsive design
- Clean, structured component layout
- Optimized rendering for smoother performance

---

## Tech Stack

### Frontend

- React
- React Router
- JavaScript (ES6+)
- HTML5
- CSS3

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

### APIs

- BLS (Bureau of Labor Statistics) Average Price API

### Deployment

- Frontend: Vercel
- Backend: Render

### Tools

- Vite
- ESLint
- Git & GitHub

---

## Installation and Setup

Clone the repository:

```bash
git clone https://github.com/RhainUnity/TrpTn-Final-Project-Frontend.git
cd TrpTn-Final-Project-Frontend
```
