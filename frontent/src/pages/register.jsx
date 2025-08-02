import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./firebase";
import { Link } from "react-router-dom";
import "../pagescss/auth.css";


function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [error, setError] = useState("");


  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("User registered successfully");
       navigate("/home");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleRegister} className="caddie-login-form">
      <h3>Sign Up</h3>

      {error && <div>{error}</div>}

      <div>
        <label>First name</label>
        <input
          type="text"
          placeholder="First name"
          value={fname}
          className="fname-caddie"
          onChange={(e) => setFname(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Last name</label>
        <input
          type="text"
          placeholder="Last name"
          value={lname}
          className="lname-caddie"
          onChange={(e) => setLname(e.target.value)}
        />
      </div>

      <div>
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

      <div>
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
        <button type="submit" className="btn-caddie-submit">Sign Up</button>
      </div>
      <p>
        Already registered? <Link to="/login">Login</Link>
      </p>
    </form>
  );
}

export default Register;