import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import Show from "../pages/searchbook.jsx";
import "../pagescss/book.css";

export default function Book({ selectCaddie }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");
  const [time, setTime] = useState("");
  const [user, setUser] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (selectCaddie) {
      setEmail(selectCaddie.email);
      setTitle(`${selectCaddie.firstName} ${selectCaddie.lastName}`);
    }
  }, [selectCaddie]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to make a booking");
      return;
    }

    const caddieinfo = {
      title,
      email,
      date,
      time,
      completed: false,
      userId: user.uid,
    };

    const caddieMap = {
      "martin@gmail.com": "Reagan",
      "mickey@gmail.com": "Mickey",
      "regan22@gmail.com": "Reagan22",
      "hello@gmail.com": "hello",
      "admin@gmail.com": "admin",
    };

    await addDoc(collection(db, "booking"), caddieinfo);

    const caddieCollection = caddieMap[email];
    if (caddieCollection) {
      await addDoc(collection(db, caddieCollection), caddieinfo);
    }

    setTitle("");
    setEmail("");
    setDate("");
    setTime("");
  };

  return (
    <div>
      <div className="booking-container">
        {user ? <Show userId={user.uid} /> : <p>Please log in to see your bookings.</p>}
      </div>
      <button className="hide-btn" onClick={() => setShow(!show)}>
        {show ? 'hide' : 'book'}
      </button>
      {show && (
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="name-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="email-input"
            readOnly={!!selectCaddie} 
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="date-input"
            required
          />
          <input
            type="time"
            placeholder="Location"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="location-input"
            required
          />
          <button type="submit" className="book-btn">
            Add Booking
          </button>
        </form>
      )}
    </div>
  );
}