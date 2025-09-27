# Women Safety App - MERN Stack

A full-stack web application designed to provide real-time safety features, including live location tracking and emergency alerts to registered guardians. This project demonstrates a complete MERN stack architecture with a secure, token-based authentication system and real-time communication via WebSockets.

**Live Demo:** [https://women-safety-frontend-bice.vercel.app/](https://women-safety-frontend-bice.vercel.app/)

## Key Features

* **Real-time Location Tracking:** Users can activate an SOS mode that broadcasts their live GPS coordinates to their guardians in real-time.
* **Guardian Management:** Users can add, view, and delete up to three trusted guardians who will receive alerts.
* **Secure User Authentication:** A complete JWT-based authentication system with hashed passwords (`bcrypt`) for secure login and signup.
* **Role-Based Access Control:** A secure admin dashboard, accessible only to users with an admin role, for viewing all system alerts and users.
* **Emergency SMS Alerts:** Integration with the Twilio API to send instant SMS notifications to guardians when an alert is triggered.

## Tech Stack

### Frontend (React.js)
* **Framework:** React.js (with Vite)
* **Routing:** `react-router-dom` for client-side routing and protected routes.
* **State Management:** React Hooks (`useState`, `useEffect`) and a global `AuthContext` for managing user and tracking state.
* **Real-time:** `socket.io-client` for live communication with the backend.
* **Mapping:** `react-leaflet` to display interactive maps with live location markers.
* **Styling:** Tailwind CSS for a responsive, modern, and utility-first design.

### Backend (Node.js & Express.js)
* **Framework:** Express.js
* **Database:** PostgreSQL (hosted on Neon) with the Drizzle ORM for type-safe queries.
* **Authentication:** JWT (JSON Web Tokens) for stateless authentication.
* **Real-time:** `socket.io` for managing WebSocket connections and private alert rooms.
* **Validation:** Zod for robust, schema-based validation of API requests.

## Setup & Installation

To run this project locally:

1.  Clone the repository:
    `git clone https://github.com/rishabh794/women-safety-frontend.git`
2.  Install dependencies:
    `pnpm install`
3.  Create a `.env` file and add the `VITE_API_BASE_URL` for your local backend server.
4.  Start the development server:
    `pnpm run dev`
