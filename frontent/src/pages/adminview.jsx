import React, { useEffect, useState } from 'react';
import { auth, db } from "./firebase";
import { Link } from 'react-router-dom';
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import "../pagescss/adminview.css";

function ViewAdmin() {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [caddieCollection, setCaddieCollection] = useState(null);

  useEffect(() => {
    let unsubscribeBookings = null;

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
      console.log(user.email)

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

  const deleteBooking = async (id) => {
    if (!caddieCollection) return;

    const confirm = window.confirm("Are you sure you want to delete this booking?");
    if (confirm) {
      try {
        await deleteDoc(doc(db, caddieCollection, id));
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
          <li><Link to="/admin">Home</Link></li>
          <li><Link to="/view">View Complete</Link></li>
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
          <div className="not-booked">No Caddie has Booked you.</div>
        ) : (
          <div className="booking-caddie">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-info-admin">
                <p className='booking-name'><strong>Title:</strong> {booking.title}</p>
                <p className='booking-email'><strong>Email:</strong> {booking.email}</p>
                <p className='booking-location'><strong>Location:</strong> {booking.location}</p>
                <p className='booking-date'><strong>Date:</strong> {booking.date}</p>
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
