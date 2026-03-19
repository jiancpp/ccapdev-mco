import { useNavigate } from "react-router-dom";
import "./Login.css"
import { useState } from 'react';

function Login({ setActiveUser }) {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5001/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setActiveUser(data.user);
                navigate('/home');
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (err) {
            setError("Cannot connect to server.");
        }
    };

    return (
        <div id="login">
            <div className="background">
                <div className="circle-element circle-l1">
                </div>
                <div className="circle-element circle-l2">
                </div>
                <div className="circle-element circle-r1">
                </div>
                <div className="circle-element circle-r2">
                </div>
            </div>
            <div className="login-background">
                <div className="logo-container">
                    <img src="https://eepy-elo.github.io/font-hosting/unsynth-logo.png" alt="unsynth" className="logo"></img>
                </div>
                <div className="login">
                    <div className="login-title">
                        Login
                    </div>
                    <div className="login-forms">
                        <form onSubmit={handleLogin} className="login-forms">
                            <input type="text" id="user" className="login-details" placeholder="Username/Email" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required></input>
                            <input type="password" id="password" className="login-details" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required></input>
                            <div className="login-options">
                                <input type="checkbox" id="remember" className="checkbox"></input>
                                <div className="remember-me">
                                    Remember Me
                                </div>
                                <div className="forgot-password">
                                    <a href="/" className="forgot-password-link">Forgot Password?</a>
                                </div>
                            </div>
                            <button type="submit" className="login-button">LOGIN</button>
                        </form>
                    </div>
                    <div className="create-account">
                        <p className="no-account">Don't have an account? <a onClick={() => navigate("/register")} className="sign-up-link">Sign-up.</a></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;