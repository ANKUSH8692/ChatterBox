import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { signupUser } from "./../../ApiCall/auth.js"
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../redux/loaderSlice.js";


function Signup() {
  const dispatch = useDispatch();
  const [user, setUser] = React.useState({
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  })
  async function onFormSubmit(event) {
    event.preventDefault();

    try {
      dispatch(showLoader());
      const response = await signupUser(user);
      dispatch(hideLoader());
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.success(response.message);
      }
    } catch (e) {
      dispatch(hideLoader());
      console.error("Singup Error:", e);
      toast.error(e.message || "Something went wrong");
      
    }
  }
  return (
    <div className="signup-container">
      <div className="floating-messages">
        <span className="chat-bubble">Hello!</span>
        <span className="chat-bubble">Welcome 😊</span>
        <span className="chat-bubble">Sign up now!</span>
        <span className="chat-bubble">Let’s get started!</span>
        <span className="chat-bubble">Join the chat!</span>
      </div>
      <div className="signup-card">
        <h1>Create Account</h1>
        <form className="signup-form" onSubmit={onFormSubmit}>
          <div className="form-row">
            <input type="text" placeholder="First Name"
              value={user.firstname}
              onChange={(e) => {
                setUser({ ...user, firstname: e.target.value })
              }}
            />
            <input type="text" placeholder="Last Name"
              value={user.lastname}
              onChange={(e) => {
                setUser({ ...user, lastname: e.target.value })
              }}
            />
          </div>
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
            <button type="submit">Sign Up</button>
          </div>
          
        </form>
        <p className="login-text">
          Already have an account? <Link to="/login">Login Here</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
