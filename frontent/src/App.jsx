import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; 
import Home from "./pages/home.jsx";
import Search from "./pages/search.jsx";
import Book from "./pages/book.jsx";
import Register from "./pages/register.jsx";
import Login from "./pages/login.jsx";
import Admin from "./pages/admin.jsx";
import NavBar from "./pages/navbar.jsx"
import ViewAdmin from "./pages/adminview.jsx";
import { auth } from "./pages/firebase.js";


function App({children}) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" /> : <Navigate to="/home" />}
        />
        <Route path="/login" element={<Login />} />
      <Route path="/navbar" element={<NavBar/>}/>
        <Route path="/view" element={<ViewAdmin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book" element={<Book />} />
        <Route path="/search" element={<Search />} />
          <Route path="/admin" element={<Admin />} />
        
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