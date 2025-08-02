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

        {book.length === 0 ? (
          <div className="not-booked">No bookings found.</div>
        ) : (
          <div className="booking-caddie">
            {book.map((booking) => (
              <div key={booking.id} className="booking-info">
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
  );
}         