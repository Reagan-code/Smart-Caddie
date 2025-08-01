import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import Show from "../pages/searchbook.jsx";
import "../pagescss/book.css";

export default function Book() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

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
    location,
    completed: false,
    userId: user.uid,
  };

  const caddie = ["regan.oc@sirschool.org"];

  await addDoc(collection(db, "booking"), caddieinfo);

  if (caddie.includes(email)) {
    await addDoc(collection(db, "Reagan"), caddieinfo);
  }

  setTitle("");
  setEmail("");
  setDate("");
  setLocation("");
};


  return (
    <div>
      <div className="booking-container">
        {user ? <Show userId={user.uid} /> : <p>Please log in to see your bookings.</p>}
      </div>
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
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="date-input"
        />
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="location-input"
        />
        <button type="submit" className="book-btn">Add Booking</button>
      </form>
    </div>
  );
}