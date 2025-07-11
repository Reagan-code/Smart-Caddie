import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Added Navigate import
import Home from "./pages/home.jsx";
import Search from "./pages/search.jsx";
import Book from "./pages/book.jsx";
import Register from "./pages/register.jsx";
import Login from "./pages/login.jsx";
import { auth } from "./pages/firebase.js";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <p>Logged in as: {user.email}</p>
      ) : (
        <p>Not logged in</p>
      )}
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" /> : <Navigate to="/home" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/home" 
          element={user ? <Home /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/search" 
          element={user ? <Search /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/book" 
          element={user ? <Book /> : <Navigate to="/login" />} 
        />
      </Routes>
    </div>
  );
}

export default App;