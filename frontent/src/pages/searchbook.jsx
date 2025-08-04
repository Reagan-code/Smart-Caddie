import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
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

import '../pagescss/searchbook.css';

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


  return (
    <Box sx={{ padding: 2 }}>
      {book.length === 0 ? (
        <Typography variant="h6" align="center" color="textSecondary">
          No bookings found.
        </Typography>
      ) : (
        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {book.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.title}</TableCell>
                  <TableCell>{booking.email}</TableCell>
                  <TableCell>{booking.location}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => deleteCaddie(booking.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
  }

      