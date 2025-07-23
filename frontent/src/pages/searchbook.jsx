import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";

export default function Show({ userId }) {
  const [book, setBook] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setBook([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "booking"), where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setBook(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "booking", id));
  };

  const toggleComplete = async (book) => {
    await updateDoc(doc(db, "booking", book.id), {
      completed: !book.completed,
    });
  };

  if (loading) return <div>Loading your bookings...</div>;

  if (book.length === 0) return <div>No bookings found.</div>;

  return (
    <ul>
      {book.map((book) => (
        <li key={book.id}>
          <input
            type="checkbox"
            checked={book.completed}
            onChange={() => toggleComplete(book)}
          />
          {book.title} - {book.email} - {book.location} - {book.date}
          <button onClick={() => handleDelete(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
