import React from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import Show from "../pages/searchbook.jsx";
import { auth } from "./firebase";

export default function Book() {
  const [title, setTitle] = React.useState("");
  const [date, setDate] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [location, setLocation] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser; 
    if (!user) {
      alert("You must be logged in to make a booking");
      return;
    }
    if (title !== "" && email !== "" && date !== "" && location !== "") {
      await addDoc(collection(db, "todos"), {
        title,
        completed: false,
        date,
        email,
        location,
        userId: user.uid,
      });
      setTitle("");
      setEmail("");
      setDate("");  
      setLocation("");
      
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input_container">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="input_container">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input_container">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="input_container">
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className="btn_container">
        <button type="submit">Add Todo</button>
      </div>
      <Show />
    </form>
  );
}
