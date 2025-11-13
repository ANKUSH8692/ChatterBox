import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import { loginUser } from "../../ApiCall/auth.js";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../redux/loaderSlice.js";

import "../../login.css"

const Login=()=> {
    const dispatch = useDispatch();
    const [user, setUser] = React.useState({
        email: '',
        password: ''
    })
    async function onFormSubmit(event) {
        event.preventDefault();
        try {
            dispatch(showLoader());
            const response = await loginUser(user);
            dispatch(hideLoader())


            if (response?.success) {  // FIX: check success not status
                toast.success(response.message || "Login successful");

                const token = response?.token;
                if (token) {
                    localStorage.setItem('token', token); // FIX: use lowercase 'token'
                    window.location.href = "/";
                } else {
                    toast.error("Token not found in response");
                }
            } else {
                toast.error(response?.message || "Login failed");
            }
        } catch (e) {
            dispatch(hideLoader());
            console.error("Login Error:", e);
            alert(e.message || "Something went wrong");
            
        }
    }
    return (
        <div className="signup-container">
            <div className="floating-messages">
                <span className="chat-bubble">Hello!</span>
                <span className="chat-bubble">Welcome 😊</span>
                <span className="chat-bubble">LOGIN now!</span>
                <span className="chat-bubble">Let’s get started!</span>
                <span className="chat-bubble">Join the chat!</span>
                <span className="chat-bubble">Some ONE Message U💕</span>
            </div>
            <div className="signup-card">
                <h1>Login Account</h1>
                <form className="signup-form" onSubmit={onFormSubmit}>
                    <div className="form-pass">
                    <input type="email" placeholder="Email"
                        value={user.email}
                        onChange={(e) => {
                            setUser({ ...user, email: e.target.value })
                        }}
                    />
                    <input type="password" placeholder="Password"
                        value={user.password}
                        onChange={(e) => {
                            setUser({ ...user, password: e.target.value })
                        }}
                    />
                    </div>
                    <div className="button-container">
                        <button type="submit">Login</button>
                    </div>
                    
                </form>
                <p className="login-text">
                    Create  account? <Link to="/Signup">Signup Here</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
