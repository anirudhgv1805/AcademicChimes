# AcademicChimes

**AcademicChimes** is an announcement-sharing platform designed for educational institutions. It allows users to post information, set access/view levels, and distribute it to a large user base. This platform supports both students and staff members and is hosted within the institution's network.

## Features

- **User Roles**: Different roles for students, staff, and admins.
- **Post Information**: Users can create announcements and control the visibility (e.g., student-only, staff-only, or public).
- **Real-Time Notifications**: Users receive notifications when new announcements are posted or updated.
- **WebSocket Support**: Enables real-time updates for announcements.
- **Responsive UI**: Built with React and Tailwind CSS, the platform is fully responsive across devices.

## Tech Stack

### Frontend:
- **React**: For building the user interface.
- **Tailwind CSS**: For styling and ensuring responsive design.
- **WebSockets**: For real-time updates on announcements.

### Backend:
- **Spring Boot**: Java-based backend providing REST APIs and handling business logic.
  - **Spring WebSocket**: Handles real-time communication for notifications.
  - **Spring Security**: Manages user authentication and role-based access control.
- **PostgreSQL**: Relational database for storing user data, announcements, and logs.
- **Redis**: Caching and message broker for real-time WebSocket messaging and notifications.
- **Docker**: Containerization for easy deployment and scalability.

### Other Tools:
- **Nginx**: Web server to serve the frontend and reverse-proxy requests to the backend.
- **Kubernetes**: (Optional) For container orchestration and scaling.

## Installation

### Prerequisites
- **Java 11 or higher**
- **Node.js 18.x.x or higher**
- **PostgreSQL 13.x or higher**
- **Redis**
- **Docker** (optional, if using containerization)

### Backend Setup (Spring Boot)

1. Clone the repository:
   ```bash
   git clone https://github.com/anirudhgv1805/AcademicChimes.git
