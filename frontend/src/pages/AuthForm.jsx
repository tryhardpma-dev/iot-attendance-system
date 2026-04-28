import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { findByUserByLogin } from "../api.js";

const AuthForm = ({setIsAuthenticated}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
           
            const data = await findByUserByLogin(username, password);

            if (!data.user || !data.user.role) {
                throw new Error("Wrong credentials or missing user role.");
            }
            console.log('setIsAuthenticated:', typeof setIsAuthenticated);

            console.log("Successful login:", data);

            localStorage.setItem("authToken", "dummy-token"); 
            console.log("Token saved:", localStorage.getItem("authToken"));

            // Set the authentication flag
            setIsAuthenticated(true);

            
            if (data.user.role === "teacher") {
                console.log('Navigating to IoT');
                window.location.href = '/iot';

                console.log("Navigating to IoT page");
            } else {
                navigate("/");
                console.log("Navigating to main page");
            }
        } catch (error) {
            console.error("Login error:", error.message);
            alert("Login error: " + error.message);
        }
    };

    return (
        <div
            style={{
                maxWidth: "400px",
                margin: "50px auto",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
            }}
        >
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Prihlasenie</h2>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: "15px" }}>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "5px",
                            fontWeight: "bold",
                        }}
                    >
                        Login:
                    </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                        }}
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "5px",
                            fontWeight: "bold",
                        }}
                    >
                        Heslo:
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                        }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#202d4a",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    Prihlaste sa
                </button>
            </form>
        </div>
    );
};

export default AuthForm;
