import React, { useState, useEffect } from 'react';
import { auth } from "./firebase";
import { Link } from 'react-router-dom';
import "../pagescss/admin.css";
import AdminNav from "./navadmin.jsx";
import { db } from "./firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

function Admin() {
  const [book, setBook] = useState([]);
  const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [caddieCollection, setCaddieCollection] = useState(null);
 useEffect(() => {
    let unsubscribeBookings = null;

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
      console.log(user.email);

      if (user) {
        const collectionMap = {
          "martin@gmail.com": "Reagan",
          "mickey@gmail.com": "Mickey",
          "hello@gmail.com": "hello",
        };

        const collectionName = collectionMap[user.email];
        setCaddieCollection(collectionName);

        if (unsubscribeBookings) unsubscribeBookings();

        if (collectionName) {
          const caddieRef = collection(db, collectionName);
          unsubscribeBookings = onSnapshot(caddieRef, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setBookings(items);
            console.log(items);
          });
        }
      } else {
        setBookings([]);
        setCaddieCollection(null);
        if (unsubscribeBookings) unsubscribeBookings();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeBookings) unsubscribeBookings();
    };
  }, []);


  const confirmedCount = bookings.filter(item => item.status === "confirmed").length;
  const pendingCount = bookings.filter(item => item.status === "pending").length;
  const completedCount = bookings.filter(item => item.status === "completed").length;

  return (
    <>
      <AdminNav />
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

        <div className="notification-box">
          <h2>Notifications</h2>
          <ul>
            <li>You have {confirmedCount} confirmed booking(s)</li>
            <li>You have {pendingCount} pending request(s)</li>
            <li>Completed {completedCount} booking(s) this period</li>
          </ul>
        </div>

        <div className="actions">
          <button className="btn-primary">View Bookings</button>
          <button className="btn-secondary">Update Availability</button>
        </div>

        <div className="calendar-section">
          <h2>Calendar</h2>
          <div className="calendar-placeholder">
            <p>[Calendar Component Placeholder]</p>
          </div>
        </div>

        <div className="rating-section">
          <h2>Your Rating</h2>
          <div className="rating-box">
            <p className="rating-score">⭐ 4.7 / 5.0</p>
            <p className="rating-reviews">Based on 36 reviews</p>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-info">
          <span>2025 SmartCaddie Admin</span>
        </div>
      </footer>
    </>
  );
}

export default Admin;