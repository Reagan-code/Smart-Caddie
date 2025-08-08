import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import NavBar from "./NavBar";
import { auth } from "./firebase";  
import { onAuthStateChanged } from "firebase/auth";
import "../pagescss/home.css";

const Home = () => {
  const [book, setBook] = useState([]);
    const [user, setUser] = useState(null); 
      useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user.uid); 
        } else {
          setUser(null);  
        }
      });
      return () => unsubscribe();  
    }, []);

  useEffect(() => {
    if (!user) {
      setBook([]);
      return;
    }

    const q = query(collection(db, "booking"), where("userId", "==", user));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setBook(items);
      
    });

    return () => unsubscribe();
  }, [user]);
  console.log(book)
    console.log("Querying ratings for userId:", user);



  const confirmedCount = book.filter(item => item.status === "confirmed").length;
  const pendingCount = book.filter(item => item.status === "pending").length;
  const completedCount = book.filter(item => item.status === "completed").length;

  const deleteCaddie = async (id) => {
    await deleteDoc(doc(db, "booking", id));
  };

  return (
    <>
      <NavBar />
      <div className="dashboard">
        <h1 className="dashboard-title">Smart Caddie Dashboard</h1>

        <div className="booking-summary">
          <div className="summary-card confirmed">
            <h2>Confirmed Bookings</h2>
            <p>{confirmedCount}</p>
          </div>

          <div className="summary-card pending">
            <h2>Pending Bookings</h2>
            <p>{pendingCount}</p>
          </div>

          <div className="summary-card completed">
            <h2>Completed Bookings</h2>
            <p>{completedCount}</p>
          </div>
        </div>
        
        </div>
    </>
  );
};

export default Home;