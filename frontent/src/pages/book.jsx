import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";
import Show from "../pages/searchbook.jsx";
import "../pagescss/book.css";

export default function Book({ selectCaddie, userId }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");
  const [time, setTime] = useState("");
  const [user, setUser] = useState(null);
  const [show, setShow] = useState(false);

  const [logUser, setLogUser] = useState(null);
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);

  // fetch logged-in user info
  useEffect(() => {
    console.log('User effect triggered, user:', user?.uid);
    
    if (!user?.uid) {
      console.log('No user UID, setting loading to false');
      setLogUser(null);
      setIsUserDataLoaded(true); // Set to true so button isn't stuck loading
      return;
    }

    console.log('Fetching user data for UID:', user.uid);
    const l = query(collection(db, "users"), where("uid", "==", user.uid));
    const unsubscribeUser = onSnapshot(l, (snapshot) => {
      console.log('Firestore snapshot received, docs:', snapshot.docs.length);
      let userData = null;
      snapshot.forEach((docSnap) => {
        userData = { id: docSnap.id, ...docSnap.data() };
        console.log('Found user document:', userData);
      });
      
      if (userData) {
        setLogUser(userData);
        setIsUserDataLoaded(true);
        console.log('User data loaded successfully:', userData);
      } else {
        // If no user data found, set loading to true but user to null
        setLogUser(null);
        setIsUserDataLoaded(true);
        console.log('No user data found in Firestore for UID:', user.uid);
      }
    }, (error) => {
      console.error('Error fetching user data:', error);
      setLogUser(null);
      setIsUserDataLoaded(true);
    });

    return () => unsubscribeUser();

  }, [user]);

  // check auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('Auth state changed:', user ? user.uid : 'No user');
      setUser(user);
    });
    return unsubscribe;
  }, []);

  // prefill booking form if caddie selected
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

    if (!isUserDataLoaded) {
      alert("Please wait for user data to load before booking");
      return;
    }

    if (!logUser) {
      alert("User profile not found. Please complete your registration.");
      return;
    }

    // save booking for current user
    const userBookingRef = await addDoc(collection(db, "booking"), {
      title,
      email,
      date,
      time,
      status: "pending",
      completed: false,
      userId: user.uid,
      logUserFirstName: logUser.firstName,
      logUserLastName: logUser.lastName,
    });

    const caddieMap = {
      "martin@gmail.com": "Reagan",
      "mickey@gmail.com": "Mickey",
      "regan22@gmail.com": "Reagan22",
      "hello@gmail.com": "hello",
      "admin@gmail.com": "admin",
    };

    const caddieCollection = caddieMap[email];
    if (caddieCollection) {
      await addDoc(collection(db, caddieCollection), {
        title,
        email,
        date,
        time,
        status: "pending",
        completed: false,
        userId: user.uid,
        userBookingId: userBookingRef.id,
        logUserFirstName: logUser.firstName,
        logUserLastName: logUser.lastName,
      });
    }

    // clear form
    setTitle("");
    setEmail("");
    setDate("");
    setTime("");
  };

  return (
    <div>
      <div className="booking-container">
        {user ? (
          <Show userId={user.uid} />
        ) : (
          <p>Please log in to see your bookings.</p>
        )}
      </div>

      <button className="hide-btn" onClick={() => setShow(!show)}>
        {show ? "hide" : "book"}
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
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="location-input"
            required
          />
          <button 
            type="submit" 
            className="book-btn"
            disabled={!isUserDataLoaded}
          >
            {!isUserDataLoaded ? 'Loading...' : (!logUser ? 'Complete Registration' : 'Add Booking')}
          </button>
          {/* Debug info */}
          <div style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
            Auth User: {user ? 'Yes' : 'No'} | 
            Data Loaded: {isUserDataLoaded ? 'Yes' : 'No'} | 
            Profile: {logUser ? 'Found' : 'Missing'}
          </div>
        </form>
      )}
    </div>
  );
}
