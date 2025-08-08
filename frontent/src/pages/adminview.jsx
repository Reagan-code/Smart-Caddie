import React, { useEffect, useState } from 'react';
import { auth, db } from "./firebase";
import { Link } from 'react-router-dom';
import { collection, onSnapshot, doc, deleteDoc,updateDoc  } from "firebase/firestore";
import "../pagescss/adminview.css";
import AdminNav from "./navadmin.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
} from "@mui/material";

function ViewAdmin() {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [caddieCollection, setCaddieCollection] = useState(null);

  useEffect(() => {
    let unsubscribeBookings = null;

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
      console.log(user.email);

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
  const updateBookingStatus = async (id) => {
  if (!caddieCollection) return;

  try {
    const bookingRef = doc(db, caddieCollection, id);
    await updateDoc(bookingRef, { status: "confirmed" });
    console.log("Booking status updated to confirmed:", id);
  } catch (error) {
    console.error("Error updating booking status:", error);
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
      <AdminNav />

      <div className="caddie-admin-header">
        <h1 className="caddie-admin-welcome">Welcome, Admin</h1>
        <p className="caddie-admin-info">Manage users, bookings, and caddie operations from one place.</p>
      </div>

      <div className="admin-booking-section">
        <h2 className="admin-booking-title">All Bookings</h2>

        <Box sx={{ padding: 2, width: "100%" }}>
          {bookings.length === 0 ? (
            <Typography variant="h6" align="center" color="red">
              No bookings found.
            </Typography>
          ) : (
            <TableContainer component={Paper} className="table-container">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Title</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Time</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Action</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.title}</TableCell>
                      <TableCell>{booking.email}</TableCell>
                      <TableCell>{booking.time}</TableCell>
                      <TableCell>{booking.date}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => deleteBooking(booking.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                            <TableCell>
        <Button
          variant="contained"
          color="primary"
          onClick={() => updateBookingStatus(booking.id)}
          disabled={booking.status === "confirmed"}
        >
          Confirm
        </Button>
      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </div>
    </>
  );
}

export default ViewAdmin;
