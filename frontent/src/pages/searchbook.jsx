import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";

export default function Show({ userId }) {
  const [book, setBook] = useState([]);

  useEffect(() => {
    if (!userId) {
      setBook([]);
      return;
    }

    const q = query(collection(db, "booking"), where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setBook(items);
    });

    return () => unsubscribe();
  }, [userId]);

  const deleteCaddie = async (id) => {
    await deleteDoc(doc(db, "booking", id));
  };


  if (book.length === 0) return <div className="not-booked">You have not booked for a Caddie</div>;

  return (
    <div className="booking-caddie">
      {book.map((book) => (
        <div key={book.id} className="booking-info">
          {book.title}
           {book.email}
          {book.location}
               Your booking is at{book.date}
          <button onClick={() => deleteCaddie(book.id)}>Delete</button>
        </div>
      ))}
      </div>
  );
}         