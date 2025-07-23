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


  if (book.length === 0) return <div>You have not booked for a Caddie</div>;

  return (
    <ul>
      {book.map((book) => (
        <li key={book.id}>
          <div>{book.title}</div>
           <div>{book.email}</div>
             <div>{book.location}</div>
               <div> Your booking is at{book.date}</div>
          <button onClick={() => deleteCaddie(book.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}         