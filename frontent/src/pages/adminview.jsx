import React, { useEffect, useState } from 'react';
import { auth, db } from "./firebase";
import { Link } from 'react-router-dom';
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import "../pagescss/admin.css";

function ViewAdmin() {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] =  useState([]);
  
  
  useEffect(() => {
  let unsubscribeBookings = () => {};
  const unsubscribeAuth = auth.onAuthStateChanged((user) => {
    setUser(user);

    if (user) {
      let caddieCollection;

      console.log(user.email);

      if (user.email === "martin@gmail.com") {
        caddieCollection = "Reagan";
      } else if (user.email === "regan@gmail.com") {
        caddieCollection = "Martin";
      } else {
        caddieCollection = "GeneralCollection"; // fallback
      }

      const caddieRef = collection(db, caddieCollection);


      unsubscribeBookings();

      unsubscribeBookings = onSnapshot(caddieRef, (snapshot) => {
        const items = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setBookings(items);
      });
    } else {
      setBookings([]);
      unsubscribeBookings();
    }
  });

  return () => {
    unsubscribeAuth();
    unsubscribeBookings();
  };
}, []);

  const deleteBooking = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this booking?");
    if (confirm) {
      try {
        await deleteDoc(doc(db, "Reagan", id));
        console.log("Booking deleted:", id);
      } catch (error) {
        console.error("Error deleting booking:", error);
      }
    }
  };

  const caddieLogout = async () => {
    try {
      await auth.signOut();
      console.log("User logged out successfully!");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <div className="nav">
        <ul>
          <li><Link to="#">View Bookings</Link></li>
          <li><Link to="#">View Complete</Link></li>
          <li><Link to="#">Booking</Link></li>
          <li><Link to="#">Profile</Link></li>
        </ul>
        <button className="sign-out-btn" onClick={caddieLogout}>Sign Out</button>
      </div>

      <div className="caddie-admin-header">
        <h1 className="caddie-admin-welcome">Welcome, Admin</h1>
        <p className="caddie-admin-info">Manage users, bookings, and caddie operations from one place.</p>
      </div>

      <div className="admin-booking-section">
        <h2 className="admin-booking-title">All Bookings</h2>

        {bookings.length === 0 ? (
          <div className="not-booked">No bookings found.</div>
        ) : (
          <div className="booking-caddie">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-info">
                <p><strong>Title:</strong> {booking.title}</p>
                <p><strong>Email:</strong> {booking.email}</p>
                <p><strong>Location:</strong> {booking.location}</p>
                <p><strong>Date:</strong> {booking.date}</p>
                <button onClick={() => deleteBooking(booking.id)}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ViewAdmin;
