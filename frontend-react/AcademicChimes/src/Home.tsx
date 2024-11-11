// src/Home.tsx

import React, { useContext } from "react";
import { AuthContext } from "./auth/AuthContext";

const Home: React.FC = () => {
    const { logout } = useContext(AuthContext);

    return (
        <div>
            <h1>Welcome to AcademicChimes</h1>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Home;
