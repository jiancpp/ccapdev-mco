import { useNavigate } from "react-router-dom";
import "./Register.css"

function register() {
    const navigate = useNavigate();
    
    return (
        <div id="register">
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
            <div className="register-background">
                <div className="logo-container">
                    <img src="https://eepy-elo.github.io/font-hosting/unsynth-logo.png" alt="unsynth" className="logo"></img>
                </div>
                <div className="register">
                    <div className="register-title">
                        Register
                    </div>

                    <div className="register-forms">
                        <input type="text" id="user" className="register-details" placeholder="Username"></input>
                        <input type="text" id="user" className="register-details" placeholder="Email"></input>
                    </div>
                    <div className="avatar">
                        <div className="picture-container">
                            <div className="picture"></div>
                        </div>
                        <div className="upload">
                          Upload <i className="bi bi-cloud-upload"></i>
                        </div>
                    </div>
                    <div className="register-forms">
                        <textarea name="short-description" className="register-details description" id="user">Short Description</textarea>
                        <input type="password" id="password" className="register-details" placeholder="Password"></input>
                        <input type="password" id="password" className="register-details" placeholder="Confirm Password"></input>
                    </div>
                    <a onClick={() => navigate("/login")} className="register-button">REGISTER</a>
                    <div className="create-account">
                        <p className="no-account">Already have an account? <a onClick={() => navigate("/login")} className="sign-up-link">Log in.</a></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default register;