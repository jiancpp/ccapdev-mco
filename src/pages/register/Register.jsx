import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import AlertBlock from '../../components/AlertBlock';
import "./Register.css"

function Register() {
    const navigate = useNavigate();
    // const { showAlert } = useOutletContext();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [shortDesc, setShortDesc] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [alert, setAlert] = useState({ show: false, message: '', icon: '', type: 'error' });

    const showAlert = (messageText, iconName, type = 'error') => {
        const bgColor = type === 'success' ? '#d4edda' : '#f8d7da'; // Light green / Light red
        const textColor = type === 'success' ? '#155724' : '#721c24'; // Dark green / Dark red
        setAlert({
            show: true,
            message: messageText,
            icon: iconName,
            type,
            bgColor,
            textColor
        });

        setTimeout(() => {
            setAlert((prev) => ({ ...prev, show: false }));
        }, 3000);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setAlert({ show: false });

        // console.log(username);
        // console.log(email);
        // console.log(password);
        // console.log(confirmPassword);
        // console.log(shortDesc);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
        return showAlert('Please enter a valid email address', 'bi-envelope-exclamation');
        }

        if (password.length < 8) {
            showAlert('Passwords needs to be atleast 8 characters', 'bi-shield-lock', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showAlert('Passwords do not match', 'bi-exclamation-triangle-fill', 'error');
            return;
        }

        const userData = {
            username: username,
            password: password,
            email: email,
            bio: shortDesc,
            role: 'user',
            avatar: 'default.jpg',
            followers: [],
            following: []
        };

        try {
            const response = await fetch('http://localhost:5001/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userData, confirmPassword }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                showAlert('Account Successfully Registered', 'bi-check-circle-fill', 'success');
                setTimeout(() => navigate('/login'), 1500);
            } else {
                showAlert(data.message || 'Registration failed', 'bi-exclamation-circle-fill', 'error');
            }
        } catch (err) {
            console.error("fucked");
        }
    };

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
                <div className="alert">
                    {alert.show && (
                        <AlertBlock
                            message={alert.message}
                            icon={alert.icon}
                            bgColor={alert.bgColor}   
                            textColor={alert.textColor} 
                        />
                    )}
                </div>
                <div className="register">
                    <div className="register-title">
                        Register
                    </div>
                    <form onSubmit={handleRegister} className="register-forms">
                        <input type="text" className="register-details" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />

                        <div className="avatar span-v">
                            <div className="picture-container">
                                <div className="picture"></div>
                            </div>
                            <div className="upload">
                                Upload <i className="bi bi-cloud-upload"></i>
                            </div>
                        </div>

                        <input type="text" className="register-details" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                        <div className="password">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="register-details"
                                placeholder="Password"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <i
                                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} password-toggle-icon`}
                                onClick={togglePasswordVisibility}
                            ></i>
                        </div>

                        <textarea name="short-description" className="register-details description span-v" placeholder="Short Description" value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} />

                        <div className="password">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="register-details"
                                placeholder="Confirm Password"
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <i
                                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} password-toggle-icon`}
                                onClick={togglePasswordVisibility}
                            ></i>
                        </div>
                        <div className="register-button-wrapper">
                            <button type="submit" className="register-button">REGISTER</button>
                            <div className="create-account">
                                <p className="no-account">Already have an account? <a onClick={() => navigate("/login")} className="sign-up-link">Log in.</a></p>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default Register;