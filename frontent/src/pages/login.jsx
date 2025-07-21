import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./firebase";
import { Link, useNavigate } from "react-router-dom";

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
      console.log("User logged in successfully");
      // window.location.href = "/home";
         navigate("/home");
    } catch (error) {
      setError(error.message);
    }
  };
  const  invalid = "Invalid email or password";

  return (
    <form onSubmit={handleSubmit}>
      <h3>Login</h3>

      {error && <div>{invalid}</div>}

      <div>
        <label>Email address</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
      <p>
        New user? <Link to="/register">Register Here</Link>
      </p>
    </form>
  );
}

export default Login;