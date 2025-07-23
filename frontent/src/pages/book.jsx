import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import Show from "../pages/searchbook.jsx";

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
    if (title && email && date && location) {
      await addDoc(collection(db, "todos"), {
        title,
        email,
        date,
        location,
        completed: false,
        userId: user.uid,
      });
      setTitle("");
      setEmail("");
      setDate("");
      setLocation("");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit">Add Booking</button>
      </form>

      {user ? <Show userId={user.uid} /> : <p>Please log in to see your bookings.</p>}
    </div>
  );
}
