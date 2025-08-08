import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc, addDoc } from "firebase/firestore";
import NavBar from "./NavBar";
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
  TextField,
} from "@mui/material";
import '../pagescss/searchbook.css';

export default function Show({ userId }) {
  const [book, setBook] = useState([]);
  const [rate, setRate] = useState("");
  const [ratingBookingId, setRatingBookingId] = useState(null); 

  useEffect(() => {
    if (!userId) {
      setBook([]);
      return;
    }

    const q = query(collection(db, "booking"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setBook(items);
    });

    return () => unsubscribe();
  }, [userId]);

  const deleteCaddie = async (id) => {
    await deleteDoc(doc(db, "booking", id));
  };

  const rateMap = {
    "martin@gmail.com": "Reagan",
    "mickey@gmail.com": "Mickey",
    "seabstian@gmail.com": "Reagan22",
    "hello@gmail.com": "hello",
    "admin@gmail.com": "admin",
  };

  const rateCaddie = async (bookingId) => {
    const booking = book.find(b => b.id === bookingId);
    if (!booking) return;

    const rateCollect = rateMap[booking.email];
    if (!rateCollect) {
      alert("No matching caddie found for this booking");
      return;
    }

    try {
      if (!rate || isNaN(rate)) {
        alert("Please enter a valid rating between 1-5");
        return;
      }

      const ratingValue = Number(rate);
      if (ratingValue < 1 || ratingValue > 5) {
        alert("Rating must be between 1 and 5");
        return;
      }

      await addDoc(collection(db, "ratings"), {
        rating: ratingValue,
        email: booking.email,
        caddieCollection: rateCollect,
        userId: booking.userId,
        bookingId: booking.id
      });

      alert("Rating submitted successfully!");
      setRate("");
      setRatingBookingId(null);
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Error submitting rating. Please try again.");
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <NavBar />
      <Box sx={{ flex: 1, padding: 3, width: '100%' }}>
        {book.length === 0 ? (
          <Typography variant="h6" align="center" color="red">
            No bookings found.
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Title</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Time</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {book.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.title}</TableCell>
                    <TableCell>{booking.email}</TableCell>
                    <TableCell>{booking.time}</TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell>
                      {booking.status} ({book.filter(b => b.status === booking.status).length})
                    </TableCell>
                    <TableCell sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => deleteCaddie(booking.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setRatingBookingId(booking.id)}
                      >
                        Rate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {ratingBookingId && (
          <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}>
            <Box sx={{
              backgroundColor: 'white',
              padding: 3,
              borderRadius: 2,
              minWidth: 300,
            }}>
              <Typography variant="h6" gutterBottom>
                Rate This Booking
              </Typography>
              <TextField
                type="number"
                label="Rating (1-5)"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                inputProps={{ min: 1, max: 5 }}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setRatingBookingId(null);
                    setRate("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => rateCaddie(ratingBookingId)}
                >
                  Submit Rating
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
