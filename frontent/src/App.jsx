
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
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
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <div>
      {user ? (
        <p>Logged in as: {user.email}</p>
      ) : (
        <p>Not logged in</p>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/book" element={<Book />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
