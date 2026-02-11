import { useNavigate } from "react-router-dom";
import "./Login.css"

function Login() {
    const navigate = useNavigate();
    
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
                        <input type="text" id="user" className="login-details" placeholder="Username/Email"></input>
                        <input type="password" id="password" className="login-details" placeholder="Password"></input>
                    </div>
                    <div className="login-options">
                        <input type="checkbox" id="remember" className="checkbox"></input>
                        <div className="remember-me">
                            Remember Me
                        </div>
                        <div className="forgot-password">
                            <a href="/" className="forgot-password-link">Forgot Password?</a>
                        </div>
                    </div>
                    <a href="/" className="login-button">LOGIN</a>
                    <div className="create-account">
                        <p className="no-account">Don't have an account? <a href="/" className="sign-up-link">Sign-up.</a></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;