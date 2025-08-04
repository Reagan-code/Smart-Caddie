import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./firebase";
import { Link, useNavigate } from "react-router-dom";
import "../pagescss/auth.css";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
    const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log(email)
      if(email == "martin@gmail.com"|| email== "mickey@gmail.com"  ){
       navigate("/admin"); 
      }else{
      console.log("User logged in successfully");
      // window.location.href = "/home";
         navigate("/home");
      }
    } catch (error) {
      setError(error.message);
    }
  };
  const  invalid = "Invalid email or password";

  return (
    <div className="auth-body">
    <form onSubmit={handleSubmit} className="caddie-login-form">
      <h3 className="auth-head">Login</h3>

      {error && <div className="error-login">{invalid}</div>}

      <div className="input-email">
        <label>Email address</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          className="email-caddie"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="input-password">
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          className="password-caddie"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <button type="submit" className="btn-caddie-submit">Submit</button>
      </div>
      <p>
        New user? <Link to="/register">Register Here</Link>
      </p>
    </form>
    </div>
  );
}

export default Login;