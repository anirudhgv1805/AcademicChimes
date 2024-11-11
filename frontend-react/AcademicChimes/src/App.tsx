import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "./auth/AuthContext";
import Registration from "./Registration";
import Login from "./Login";
import Home from "./Home";

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/register" element={<Registration />} />
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
                    
                    <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />

                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
